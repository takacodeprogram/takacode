"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

const TRACK_SELECT = "id, slug, title, is_published, is_active";

function slugIsValid(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function parseResources(value) {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function toResourcesInput(resources) {
  if (!Array.isArray(resources)) {
    return "";
  }
  return resources.map((item) => String(item || "").trim()).filter(Boolean).join(", ");
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const INPUT_CLASS = "auth-input text-[12px] w-full";

export default function TrackForm({ mode = "create", track = null, proposal = false, userId = "", redirectBase = "/admin/parcours" }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const isEdit = mode === "edit";

  const [form, setForm] = useState(() => ({
    slug: track?.slug || "",
    goal_key: track?.goal_key || "other",
    title: track?.title || "",
    summary: track?.summary || "",
    level_label: track?.level_label || "Debutant",
    duration_weeks: String(track?.duration_weeks ?? 8),
    sort_order: String(track?.sort_order ?? 100),
    accent_color: track?.accent_color || "#4F8EF7",
    icon: track?.icon || "lucide:route",
    objective: track?.objective || "Construire un projet concret.",
    resources: toResourcesInput(track?.resources),
    next_session: track?.next_session || "Session annoncee bientot",
    is_published: track ? track.is_published === true : true,
    is_active: track ? track.is_active !== false : true
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function buildPayload() {
    const summary = form.summary.trim();
    return {
      goal_key: form.goal_key.trim().toLowerCase() || "other",
      title: form.title.trim() || "Parcours",
      summary: summary || "Parcours en preparation.",
      description: summary || "Parcours en preparation.",
      level_label: form.level_label.trim() || "Debutant",
      duration_weeks: Math.max(1, Number.parseInt(form.duration_weeks, 10) || 8),
      sort_order: Math.max(1, Number.parseInt(form.sort_order, 10) || 100),
      accent_color: form.accent_color.trim() || "#4F8EF7",
      icon: form.icon.trim() || "lucide:route",
      objective: form.objective.trim() || "Construire un projet concret.",
      resources: parseResources(form.resources),
      next_session: form.next_session.trim() || "Session annoncee bientot",
      is_published: proposal ? false : form.is_published === true,
      is_active: proposal ? false : form.is_active === true
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim() || !form.summary.trim()) {
      setError("Titre et resume sont obligatoires.");
      return;
    }

    setSaving(true);

    if (isEdit) {
      const { error: updateError } = await supabase.from("learning_tracks").update(buildPayload()).eq("id", track.id).select(TRACK_SELECT).single();
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      setMessage("Parcours mis a jour.");
      setSaving(false);
      router.refresh();
      return;
    }

    const slug = form.slug.trim().toLowerCase();
    if (!slugIsValid(slug)) {
      setError("Le slug doit utiliser uniquement des lettres minuscules, chiffres et tirets.");
      setSaving(false);
      return;
    }

    const insertPayload = { slug, ...buildPayload(), next_steps: [{ label: "Demarrer le parcours", state: "current" }] };
    if (proposal) {
      insertPayload.created_by = userId;
      insertPayload.is_pending = true;
    }

    const { data, error: insertError } = await supabase.from("learning_tracks").insert(insertPayload).select(TRACK_SELECT).single();

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push(`${redirectBase}/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      {!isEdit ? (
        <Field label="Slug (url)">
          <input className={INPUT_CLASS} placeholder="ex: automatisation-ia" value={form.slug} onChange={(e) => setField("slug", e.target.value)} />
        </Field>
      ) : (
        <div className="text-[11px] text-[#6d6d6d]">/{track?.slug}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Titre"><input className={INPUT_CLASS} value={form.title} onChange={(e) => setField("title", e.target.value)} /></Field>
        <Field label="goal_key"><input className={INPUT_CLASS} value={form.goal_key} onChange={(e) => setField("goal_key", e.target.value)} /></Field>
      </div>

      <Field label="Resume"><textarea className={`${INPUT_CLASS} min-h-[64px]`} value={form.summary} onChange={(e) => setField("summary", e.target.value)} /></Field>
      <Field label="Objectif"><textarea className={`${INPUT_CLASS} min-h-[64px]`} value={form.objective} onChange={(e) => setField("objective", e.target.value)} /></Field>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Niveau"><input className={INPUT_CLASS} value={form.level_label} onChange={(e) => setField("level_label", e.target.value)} /></Field>
        <Field label="Duree (sem.)"><input type="number" min="1" className={INPUT_CLASS} value={form.duration_weeks} onChange={(e) => setField("duration_weeks", e.target.value)} /></Field>
        <Field label="Ordre"><input type="number" min="1" className={INPUT_CLASS} value={form.sort_order} onChange={(e) => setField("sort_order", e.target.value)} /></Field>
        <Field label="Couleur"><input className={INPUT_CLASS} value={form.accent_color} onChange={(e) => setField("accent_color", e.target.value)} /></Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Icone"><input className={INPUT_CLASS} value={form.icon} onChange={(e) => setField("icon", e.target.value)} /></Field>
        <Field label="Session suivante"><input className={INPUT_CLASS} value={form.next_session} onChange={(e) => setField("next_session", e.target.value)} /></Field>
      </div>

      <Field label="Ressources (separees par virgule)"><input className={INPUT_CLASS} value={form.resources} onChange={(e) => setField("resources", e.target.value)} /></Field>

      {proposal ? (
        <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 px-3.5 py-2.5 text-[12px] text-blue-100 font-body-readable">
          Cette proposition sera <span className="font-semibold">validee par un admin</span> avant d'etre publiee.
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setField("is_published", e.target.checked)} /> Publie
          </label>
          <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} /> Actif
          </label>
        </div>
      )}

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}
      {message ? <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">{message}</div> : null}

      <button type="submit" disabled={saving} className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`} style={{ padding: "10px 18px" }}>
        {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Creer le parcours"}
        <iconify-icon icon="lucide:save" style={{ fontSize: "13px" }} />
      </button>
    </form>
  );
}
