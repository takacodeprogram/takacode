"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

const INPUT = "auth-input text-[12px] w-full";

function toLocalInput(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const off = parsed.getTimezoneOffset();
  const local = new Date(parsed.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function SessionForm({ tracks = [], session = null }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const isEdit = Boolean(session);

  const [form, setForm] = useState(() => ({
    title: session?.title || "",
    description: session?.description || "",
    track_id: session?.trackId || "",
    scheduled_at: toLocalInput(session?.scheduledAt),
    duration_minutes: String(session?.durationMinutes ?? 60),
    join_url: session?.joinUrl || "",
    replay_url: session?.replayUrl || "",
    is_published: session ? session.isPublished === true : true
  }));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function buildPayload() {
    return {
      title: form.title.trim(),
      description: form.description.trim(),
      track_id: form.track_id || null,
      scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
      duration_minutes: Math.max(1, Number.parseInt(form.duration_minutes, 10) || 60),
      join_url: form.join_url.trim(),
      replay_url: form.replay_url.trim(),
      is_published: form.is_published === true
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    setSaving(true);

    if (isEdit) {
      const { error: updateError } = await supabase.from("live_sessions").update(buildPayload()).eq("id", session.id);
      setSaving(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setMessage("Session enregistrée.");
      router.refresh();
      return;
    }

    const { error: insertError } = await supabase.from("live_sessions").insert(buildPayload());
    setSaving(false);
    if (insertError) {
      setError(insertError.message.includes("live_sessions") ? "Table sessions absente. Lance supabase/sql/010_live_sessions.sql." : insertError.message);
      return;
    }
    router.push("/admin/sessions");
  }

  async function handleDelete() {
    if (!window.confirm("Supprimer cette session ? Cette action est irréversible.")) {
      return;
    }
    setDeleting(true);
    const { error: deleteError } = await supabase.from("live_sessions").delete().eq("id", session.id);
    setDeleting(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.push("/admin/sessions");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      <Field label="Titre"><input className={INPUT} value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Ex: Atelier live - deployer sur Vercel" /></Field>
      <Field label="Description"><textarea className={`${INPUT} min-h-[70px]`} value={form.description} onChange={(e) => setField("description", e.target.value)} /></Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field label="Date et heure"><input type="datetime-local" className={INPUT} value={form.scheduled_at} onChange={(e) => setField("scheduled_at", e.target.value)} /></Field>
        <Field label="Duree (min)"><input type="number" min="1" className={INPUT} value={form.duration_minutes} onChange={(e) => setField("duration_minutes", e.target.value)} /></Field>
        <Field label="Parcours lie">
          <select className={INPUT} value={form.track_id} onChange={(e) => setField("track_id", e.target.value)}>
            <option value="">Aucun</option>
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>{track.title}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Lien pour rejoindre"><input className={INPUT} value={form.join_url} onChange={(e) => setField("join_url", e.target.value)} placeholder="https://meet..." /></Field>
        <Field label="Lien du replay"><input className={INPUT} value={form.replay_url} onChange={(e) => setField("replay_url", e.target.value)} placeholder="https://youtube..." /></Field>
      </div>

      <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
        <input type="checkbox" checked={form.is_published} onChange={(e) => setField("is_published", e.target.checked)} /> Publiée (visible par les membres)
      </label>

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}
      {message ? <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">{message}</div> : null}

      <div className="flex items-center gap-3 flex-wrap">
        <button type="submit" disabled={saving} className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`} style={{ padding: "10px 18px" }}>
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer la session"}
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
