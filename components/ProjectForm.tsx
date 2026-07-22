"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { PROJECT_STATUS } from "../lib/userProjects";
import { ensureUserTrackEnrollment } from "../lib/tracks";
import { STARTER_TEMPLATES, getTemplateById } from "../lib/starterTemplates";
import FormatPicker from "../components/FormatPicker";
import RichTextRenderer from "../components/RichTextRenderer";
import { playSuccess, playPop } from "../components/effects/sound";
import { useToast } from "./Toast";
import type { ProjectStatus } from "../lib/userProjects";
import type { StarterTemplate } from "../lib/starterTemplates";

interface Track {
  id: string;
  title: string;
}

interface ProjectData {
  id: string;
  title?: string;
  objective?: string;
  description?: string;
  descriptionFormat?: string;
  status?: string;
  deadline?: string;
  trackId?: string;
  repoUrl?: string;
  liveUrl?: string;
  revenueModel?: string;
  templateId?: string;
  repoIsPublic?: boolean;
}

interface ProjectFormProps {
  userId: string;
  tracks?: Track[];
  project?: ProjectData | null;
}

const INPUT = "auth-input text-[12px] w-full";

function cleanUrl(value: string): string {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function iconify(icon: string) {
  return <iconify-icon icon={icon} style={{ fontSize: "16px" }} />;
}

export default function ProjectForm({ userId, tracks = [], project = null }: ProjectFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const isEdit = Boolean(project);

  const [showTemplates, setShowTemplates] = useState<boolean>(!isEdit);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(project?.templateId || "");
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState<Record<string, string>>(() => ({
    title: project?.title || "",
    objective: project?.objective || "",
    description: project?.description || "",
    status: project?.status || "in_progress",
    deadline: project?.deadline || "",
    track_id: project?.trackId || "",
    repo_url: project?.repoUrl || "",
    live_url: project?.liveUrl || "",
    revenue_model: project?.revenueModel || "",
    description_format: ((project as unknown as Record<string, unknown>)?.descriptionFormat as string) || "text",
    repo_is_public: project?.repoIsPublic !== false ? "true" : "false"
  }));
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showPublishConfirm, setShowPublishConfirm] = useState<boolean>(false);

  function setField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const EMOJIS = ["😀","🎉","🔥","💡","🚀","✅","⭐","💪","🎯","❤️","👏","🙌","📱","💻","🌐","📊","🎨","📝","🔧","⚡","💎","🏆","🛠️","📈"];

  function insertEmoji(emoji: string) {
    const el = descRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = form.description.substring(0, start);
    const after = form.description.substring(end);
    const next = before + emoji + after;
    setField("description", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }

  function applyTemplate(template: StarterTemplate) {
    setForm((current) => ({
      ...current,
      title: template.title,
      objective: template.objective,
      description: template.features.map((f) => `- ${f}`).join("\n"),
      repo_url: template.starterRepoUrl
    }));
    setSelectedTemplateId(template.id);
    setShowTemplates(false);
    playPop();
  }

  function startFromScratch() {
    setSelectedTemplateId("_scratch");
    setShowTemplates(false);
    playPop();
  }

  function buildPayload() {
    return {
      title: form.title.trim(),
      objective: form.objective.trim(),
      description: form.description.trim(),
      status: PROJECT_STATUS.some((s: ProjectStatus) => s.value === form.status) ? form.status : "in_progress",
      deadline: form.deadline || null,
      track_id: form.track_id || null,
      repo_url: cleanUrl(form.repo_url),
      live_url: cleanUrl(form.live_url),
      revenue_model: form.revenue_model,
      template_id: selectedTemplateId,
      description_format: form.description_format || "text",
      repo_is_public: form.repo_is_public === "true"
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Le titre du projet est obligatoire.");
      toast("Le titre du projet est obligatoire.", "error");
      return;
    }

    if (form.status === "published" && project?.status !== "published" && !showPublishConfirm) {
      setShowPublishConfirm(true);
      return;
    }

    setSaving(true);

    const payload = buildPayload();
    // Lier un parcours = s'y inscrire (idempotent : ne touche pas une
    // inscription existante). C'est ce qui rend le lien projet-parcours reel.
    const previousTrackId = project?.trackId || "";
    const enrollNeeded = Boolean(payload.track_id) && payload.track_id !== previousTrackId;

    if (isEdit) {
      const { error: updateError } = await supabase.from("user_projects").update(payload).eq("id", project!.id);
      if (updateError) {
        setSaving(false);
        setError(updateError.message);
        toast(updateError.message, "error");
        return;
      }
      if (enrollNeeded) {
        await ensureUserTrackEnrollment(supabase, userId, payload.track_id as string);
        toast("Parcours accelerateur lie : tu y es inscrit.", "success");
      }
      setSaving(false);
      setMessage("Projet enregistre.");
      toast("Projet enregistre.", "success");
      playSuccess();
      router.refresh();
      return;
    }

    const { error: insertError } = await supabase.from("user_projects").insert({ user_id: userId, ...payload });
    if (insertError) {
      setSaving(false);
      const msg = insertError.message.includes("user_projects") ? "Table projets absente. Lance supabase/sql/008_user_projects.sql." : insertError.message;
      setError(msg);
      toast(msg, "error");
      return;
    }
    if (enrollNeeded) {
      await ensureUserTrackEnrollment(supabase, userId, payload.track_id as string);
    }
    setSaving(false);
    playSuccess();
    router.push("/dashboard/projects");
  }

  async function handleDelete() {
    if (!window.confirm("Supprimer ce projet ? Cette action est irreversible.")) {
      return;
    }
    setDeleting(true);
    const { error: deleteError } = await supabase.from("user_projects").delete().eq("id", project!.id);
    setDeleting(false);
    if (deleteError) {
      setError(deleteError.message);
      toast(deleteError.message, "error");
      return;
    }
    toast("Projet supprime.", "success");
    router.push("/dashboard/projects");
  }

  if (showTemplates) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl border border-[#4F8EF7]/40 bg-[#4F8EF7]/15 inline-flex items-center justify-center">
              <iconify-icon icon="lucide:layout-template" style={{ color: "#4F8EF7", fontSize: "17px" }} />
            </div>
            <div>
              <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">Template</div>
              <h3 className="font-venite-italic text-[14px] text-white">Choisis un starter kit</h3>
            </div>
          </div>
          <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">
            Un starter kit te donne une base de code prête à déployer. Tu peux aussi partir d'une page blanche.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {STARTER_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 text-left hover:border-white/[0.2] transition-all card-hover"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg border inline-flex items-center justify-center"
                    style={{ borderColor: `${template.accent}55`, background: `${template.accent}1f` }}
                  >
                    {iconify(template.icon)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] text-white font-semibold leading-tight">{template.title}</div>
                    <div className="text-[10px] text-[#888]">{template.domain} — {template.level}</div>
                  </div>
                </div>
                <p className="font-body-readable text-[11px] text-[#a5a5a5] leading-snug">{template.summary}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.stack.map((tech) => (
                    <span key={tech} className="text-[9px] px-1.5 py-0.5 rounded-full border border-white/[0.08] text-[#999]">{tech}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={startFromScratch}
            className="w-full rounded-xl border border-dashed border-white/[0.12] bg-white/[0.01] px-4 py-3 text-[12px] text-[#888] hover:text-white hover:border-white/[0.25] transition-all text-center"
          >
            Partir d'une page blanche
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      {selectedTemplateId && selectedTemplateId !== "_scratch" ? (
        <div className="rounded-xl border border-[#4F8EF7]/25 bg-[#4F8EF7]/10 px-4 py-3 text-[12px] text-[#c1d1ff] font-body-readable flex items-center gap-2">
          <iconify-icon icon="lucide:layout-template" style={{ fontSize: "14px", color: "#4F8EF7" }} />
          Template <strong>{getTemplateById(selectedTemplateId)?.title}</strong> applique. Modifie les champs ci-dessous si necessaire.
        </div>
      ) : selectedTemplateId === "_scratch" ? (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-[12px] text-[#aaa] font-body-readable flex items-center gap-2">
          <iconify-icon icon="lucide:file-plus" style={{ fontSize: "14px", color: "#888" }} />
          Projet vierge. Remplis les champs ci-dessous.
        </div>
      ) : null}

      <Field label="Titre du projet"><input className={INPUT} value={form.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("title", e.target.value)} placeholder="Ex: Ma boutique en ligne" /></Field>
      <Field label="Objectif"><input className={INPUT} value={form.objective} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("objective", e.target.value)} placeholder="Ce que tu veux accomplir" /></Field>
      <Field label="Description">
        <textarea ref={descRef} className={`${INPUT} min-h-[90px]`} value={form.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("description", e.target.value)} placeholder="Decris ton projet, ses fonctionnalites, son public..." />
        <div className="mt-1.5">
          <FormatPicker value={(form.description_format || "text") as "text" | "markdown" | "html"} onChange={(fmt) => setField("description_format", fmt)} />
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {EMOJIS.map((emoji) => (
            <button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className="text-[16px] px-1 py-0.5 rounded hover:bg-white/[0.06] transition-colors leading-none">
              {emoji}
            </button>
          ))}
        </div>
        {form.description.trim() ? (
          <div className="mt-2">
            <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-1">Apercu</div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-3 min-h-[60px]">
              <RichTextRenderer content={form.description} format={(form.description_format || "text") as "text" | "markdown" | "html"} className="text-[13px]" />
            </div>
          </div>
        ) : null}
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Statut">
          <select className={INPUT} value={form.status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("status", e.target.value)}>
            {PROJECT_STATUS.map((s: ProjectStatus) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Deadline"><input type="date" className={INPUT} value={form.deadline || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("deadline", e.target.value)} /></Field>
      </div>

      {/* Le parcours n'est pas un simple champ : c'est l'accelerateur du projet.
          Le choisir inscrit automatiquement le membre au parcours. */}
      <div className="rounded-xl border border-[#4F8EF7]/20 bg-[#4F8EF7]/[0.06] p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <iconify-icon icon="lucide:zap" style={{ color: "#4F8EF7", fontSize: "15px" }} />
          <span className="text-[10px] text-[#89c7ff] uppercase tracking-widest font-semibold">Parcours accélérateur</span>
        </div>
        <p className="font-body-readable text-[11px] text-[#a5b8d8] leading-relaxed">
          Le parcours qui guide la construction de ce projet, sprint par sprint. En le choisissant,
          tu y es inscrit automatiquement : ses leçons deviennent tes sprints et leurs micro-projets
          tes livrables, visibles sur cette page.
        </p>
        <select className={INPUT} value={form.track_id} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("track_id", e.target.value)}>
          <option value="">Aucun — je construis sans parcours</option>
          {tracks.map((track: Track) => (
            <option key={track.id} value={track.id}>{track.title}</option>
          ))}
        </select>
      </div>

      <Field label="Modèle de revenu vise">
        <select className={INPUT} value={form.revenue_model} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("revenue_model", e.target.value)}>
          <option value="">Pas de monetisation pour l'instant</option>
          <option value="vente">Vente directe (produits, services)</option>
          <option value="abonnement">Abonnement (SaaS, newsletter payante)</option>
          <option value="publicite">Publicite (audience, trafic)</option>
          <option value="affiliation">Affiliation (commissions)</option>
          <option value="freelance">Freelance (prestations)</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Lien du code (GitHub)">
          <div className="flex gap-2">
            <input className={`${INPUT} flex-1`} value={form.repo_url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("repo_url", e.target.value)} placeholder="https://github.com/..." />
            <label className="flex items-center gap-1.5 shrink-0 cursor-pointer px-2 py-1 rounded-lg border border-white/[0.08] text-[11px] text-[#888] hover:text-white hover:border-white/[0.2] transition-all">
              <input type="checkbox" className="sr-only" checked={form.repo_is_public === "true"} onChange={(e) => setField("repo_is_public", e.target.checked ? "true" : "false")} />
              <iconify-icon icon={form.repo_is_public === "true" ? "lucide:globe" : "lucide:lock"} style={{ fontSize: "13px", color: form.repo_is_public === "true" ? "#4F8EF7" : "#f59e0b" }} />
              {form.repo_is_public === "true" ? "Public" : "Prive"}
            </label>
          </div>
        </Field>
        <Field label="Lien en ligne"><input className={INPUT} value={form.live_url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("live_url", e.target.value)} placeholder="https://mon-projet.com" /></Field>
      </div>

      {showPublishConfirm ? (
        <div className="rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-4">
          <div className="flex items-center gap-2.5 mb-2">
            <iconify-icon icon="lucide:globe" style={{ fontSize: "16px", color: "#F59E0B" }} />
            <span className="font-semibold text-[12px] text-amber-200">Publier ce projet ?</span>
          </div>
          <p className="font-body-readable text-[11px] text-[#d4c5a0] leading-relaxed mb-3">
            Une fois publie, ton projet sera visible par toute la communauté TakaCode,
            affiche sur la page d'accueil et dans la galerie. Tu pourras le modifier
            ou le retirer a tout moment depuis ton dashboard.
          </p>
          <div className="flex items-center gap-2">
            <button onClick={handleSubmit} className="btn-primary inline-flex items-center gap-2 text-[12px]" style={{ padding: "8px 16px" }}>
              <iconify-icon icon="lucide:globe" style={{ fontSize: "13px" }} />
              Oui, publier
            </button>
            <button onClick={() => { setShowPublishConfirm(false); }} className="text-[12px] text-[#999] hover:text-white inline-flex items-center gap-1.5">
              Annuler
            </button>
          </div>
        </div>
      ) : null}

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}
      {message ? <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">{message}</div> : null}

      <div className="flex items-center gap-3 flex-wrap">
        <button type="submit" disabled={saving} className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`} style={{ padding: "10px 18px" }}>
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer le projet"}
          <iconify-icon icon="lucide:save" style={{ fontSize: "13px" }} />
        </button>
        {!isEdit ? (
          <button type="button" onClick={() => setShowTemplates(true)} className="text-[12px] text-[#888] hover:text-white inline-flex items-center gap-1.5">
            <iconify-icon icon="lucide:undo-2" style={{ fontSize: "13px" }} />
            Changer de template
          </button>
        ) : null}
        {isEdit ? (
          <button type="button" onClick={handleDelete} disabled={deleting} className="text-[12px] text-red-400/80 hover:text-red-400 inline-flex items-center gap-1.5">
            <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px" }} />
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        ) : null}
      </div>
    </form>
  );
}