"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { PROJECT_STATUS } from "../lib/userProjects";
import type { ProjectStatus } from "../lib/userProjects";

interface Track {
  id: string;
  title: string;
}

interface ProjectData {
  id: string;
  title?: string;
  objective?: string;
  description?: string;
  status?: string;
  deadline?: string;
  trackId?: string;
  repoUrl?: string;
  liveUrl?: string;
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

export default function ProjectForm({ userId, tracks = [], project = null }: ProjectFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const isEdit = Boolean(project);

  const [form, setForm] = useState<Record<string, string>>(() => ({
    title: project?.title || "",
    objective: project?.objective || "",
    description: project?.description || "",
    status: project?.status || "in_progress",
    deadline: project?.deadline || "",
    track_id: project?.trackId || "",
    repo_url: project?.repoUrl || "",
    live_url: project?.liveUrl || ""
  }));
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  function setField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
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
      live_url: cleanUrl(form.live_url)
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Le titre du projet est obligatoire.");
      return;
    }

    setSaving(true);

    if (isEdit) {
      const { error: updateError } = await supabase.from("user_projects").update(buildPayload()).eq("id", project!.id);
      setSaving(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setMessage("Projet enregistré.");
      router.refresh();
      return;
    }

    const { error: insertError } = await supabase.from("user_projects").insert({ user_id: userId, ...buildPayload() });
    setSaving(false);
    if (insertError) {
      setError(insertError.message.includes("user_projects") ? "Table projets absente. Lance supabase/sql/008_user_projects.sql." : insertError.message);
      return;
    }
    router.push("/dashboard/projets");
  }

  async function handleDelete() {
    if (!window.confirm("Supprimer ce projet ? Cette action est irréversible.")) {
      return;
    }
    setDeleting(true);
    const { error: deleteError } = await supabase.from("user_projects").delete().eq("id", project!.id);
    setDeleting(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.push("/dashboard/projets");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      <Field label="Titre du projet"><input className={INPUT} value={form.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("title", e.target.value)} placeholder="Ex: Ma boutique en ligne" /></Field>
      <Field label="Objectif"><input className={INPUT} value={form.objective} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("objective", e.target.value)} placeholder="Ce que tu veux accomplir" /></Field>
      <Field label="Description"><textarea className={`${INPUT} min-h-[90px]`} value={form.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("description", e.target.value)} placeholder="Décris ton projet, ses fonctionnalités, son public..." /></Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field label="Statut">
          <select className={INPUT} value={form.status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("status", e.target.value)}>
            {PROJECT_STATUS.map((s: ProjectStatus) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Deadline"><input type="date" className={INPUT} value={form.deadline || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("deadline", e.target.value)} /></Field>
        <Field label="Parcours lie">
          <select className={INPUT} value={form.track_id} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("track_id", e.target.value)}>
            <option value="">Aucun</option>
            {tracks.map((track: Track) => (
              <option key={track.id} value={track.id}>{track.title}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Lien du code (GitHub)"><input className={INPUT} value={form.repo_url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("repo_url", e.target.value)} placeholder="https://github.com/..." /></Field>
        <Field label="Lien en ligne"><input className={INPUT} value={form.live_url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("live_url", e.target.value)} placeholder="https://mon-projet.com" /></Field>
      </div>

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}
      {message ? <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">{message}</div> : null}

      <div className="flex items-center gap-3 flex-wrap">
        <button type="submit" disabled={saving} className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`} style={{ padding: "10px 18px" }}>
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer le projet"}
          <iconify-icon icon="lucide:save" style={{ fontSize: "13px" }} />
        </button>
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
