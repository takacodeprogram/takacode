"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { useToast } from "../Toast";
import { useI18n } from "../I18nProvider";

interface Track {
  id: string;
  title: string;
}

interface SessionData {
  id: string;
  title?: string;
  description?: string;
  trackId?: string;
  scheduledAt?: string | null;
  durationMinutes?: number;
  joinUrl?: string;
  replayUrl?: string;
  isPublished?: boolean;
}

interface SessionFormProps {
  tracks?: Track[];
  session?: SessionData | null;
}

const INPUT = "auth-input text-[12px] w-full";

function toLocalInput(value: string | null | undefined): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const off = parsed.getTimezoneOffset();
  const local = new Date(parsed.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function SessionForm({ tracks = [], session = null }: SessionFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const isEdit = Boolean(session);

  const [form, setForm] = useState<Record<string, string | boolean>>(() => ({
    title: session?.title || "",
    description: session?.description || "",
    track_id: session?.trackId || "",
    scheduled_at: toLocalInput(session?.scheduledAt),
    duration_minutes: String(session?.durationMinutes ?? 60),
    join_url: session?.joinUrl || "",
    replay_url: session?.replayUrl || "",
    is_published: session ? session.isPublished === true : true
  }));
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  function setField(key: string, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function buildPayload() {
    return {
      title: String(form.title).trim(),
      description: String(form.description).trim(),
      track_id: String(form.track_id) || null,
      scheduled_at: String(form.scheduled_at) ? new Date(String(form.scheduled_at)).toISOString() : null,
      duration_minutes: Math.max(1, Number.parseInt(String(form.duration_minutes), 10) || 60),
      join_url: String(form.join_url).trim(),
      replay_url: String(form.replay_url).trim(),
      is_published: form.is_published === true
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!String(form.title).trim()) {
      toast(t("adminSessions.titleRequired"), "error");
      return;
    }

    setSaving(true);

    if (isEdit) {
      const { error: updateError } = await supabase.from("live_sessions").update(buildPayload()).eq("id", session!.id);
      setSaving(false);
      if (updateError) {
        toast(updateError.message, "error");
        return;
      }
      toast(t("adminSessions.sessionSaved"), "success");
      router.refresh();
      return;
    }

    const { error: insertError } = await supabase.from("live_sessions").insert(buildPayload());
    setSaving(false);
    if (insertError) {
      toast(insertError.message.includes("live_sessions") ? t("adminSessions.tableMissing") : insertError.message, "error");
      return;
    }
    router.push("/admin/sessions");
  }

  async function handleDelete() {
    if (!window.confirm(t("adminSessions.confirmDelete"))) {
      return;
    }
    setDeleting(true);
    const { error: deleteError } = await supabase.from("live_sessions").delete().eq("id", session!.id);
    setDeleting(false);
    if (deleteError) {
      toast(deleteError.message, "error");
      return;
    }
    router.push("/admin/sessions");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      <Field label={t("adminSessions.fieldTitle")}><input className={INPUT} value={String(form.title)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("title", e.target.value)} placeholder={t("adminSessions.titlePlaceholder")} /></Field>
      <Field label={t("adminSessions.fieldDescription")}><textarea className={`${INPUT} min-h-[70px]`} value={String(form.description)} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("description", e.target.value)} /></Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field label={t("adminSessions.fieldDatetime")}><input type="datetime-local" className={INPUT} value={String(form.scheduled_at)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("scheduled_at", e.target.value)} /></Field>
        <Field label={t("adminSessions.fieldDuration")}><input type="number" min="1" className={INPUT} value={String(form.duration_minutes)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("duration_minutes", e.target.value)} /></Field>
        <Field label={t("adminSessions.fieldTrack")}>
          <select className={INPUT} value={String(form.track_id)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("track_id", e.target.value)}>
            <option value="">{t("adminSessions.noTrack")}</option>
            {tracks.map((track: Track) => (
              <option key={track.id} value={track.id}>{track.title}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label={t("adminSessions.fieldJoinUrl")}><input className={INPUT} value={String(form.join_url)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("join_url", e.target.value)} placeholder={t("adminSessions.joinUrlPlaceholder")} /></Field>
        <Field label={t("adminSessions.fieldReplayUrl")}><input className={INPUT} value={String(form.replay_url)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("replay_url", e.target.value)} placeholder={t("adminSessions.replayUrlPlaceholder")} /></Field>
      </div>

      <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
        <input type="checkbox" checked={form.is_published === true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("is_published", e.target.checked)} /> {t("adminSessions.publishedLabel")}
      </label>

      <div className="flex items-center gap-3 flex-wrap">
        <button type="submit" disabled={saving} className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`} style={{ padding: "10px 18px" }}>
          {saving ? t("adminSessions.saving") : isEdit ? t("adminSessions.save") : t("adminSessions.create")}
          <iconify-icon icon="lucide:save" style={{ fontSize: "13px" }} />
        </button>
        {isEdit ? (
          <button type="button" onClick={handleDelete} disabled={deleting} className="text-[12px] text-red-400/80 hover:text-red-400 inline-flex items-center gap-1.5">
            <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px" }} />
            {deleting ? t("adminSessions.deleting") : t("adminSessions.delete")}
          </button>
        ) : null}
      </div>
    </form>
  );
}
