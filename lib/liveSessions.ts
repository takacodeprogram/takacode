import { normalizeText, isMissingSchemaError } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

const SESSION_SELECT =
  "id, track_id, title, description, scheduled_at, duration_minutes, join_url, replay_url, is_published, created_at, updated_at, track:learning_tracks(title, slug)";

const SESSION_TABLES = ["live_sessions"];

export interface LiveSession {
  id: string;
  trackId: string;
  title: string;
  description: string;
  scheduledAt: string | null;
  durationMinutes: number;
  joinUrl: string;
  replayUrl: string;
  isPublished: boolean;
  trackTitle: string;
  trackSlug: string;
}

interface SessionRow {
  id: string;
  track_id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  join_url: string;
  replay_url: string;
  is_published: boolean;
  track: { title: string; slug: string }[];
}

interface SessionsResult {
  sessions: LiveSession[];
  schemaReady: boolean;
  error: Error | null;
}

interface MemberSessionsResult {
  upcoming: LiveSession[];
  replays: LiveSession[];
  schemaReady: boolean;
  error: Error | null;
}

interface SessionResult {
  session: LiveSession | null;
  schemaReady: boolean;
  error: Error | null;
}

function normalizeSession(row: unknown): LiveSession | null {
  if (!row || typeof row !== "object") {
    return null;
  }
  const r = row as Record<string, unknown>;
  const trackArr = r.track as { title?: string; slug?: string }[] | undefined;
  const track = Array.isArray(trackArr) ? trackArr[0] : undefined;
  return {
    id: r.id as string,
    trackId: (r.track_id as string) || "",
    title: typeof r.title === "string" ? r.title : "Session",
    description: typeof r.description === "string" ? r.description : "",
    scheduledAt: (r.scheduled_at as string) || null,
    durationMinutes: Number.isFinite(Number(r.duration_minutes)) ? Number(r.duration_minutes) : 60,
    joinUrl: typeof r.join_url === "string" ? r.join_url : "",
    replayUrl: typeof r.replay_url === "string" ? r.replay_url : "",
    isPublished: r.is_published === true,
    trackTitle: typeof track?.title === "string" ? track.title : "",
    trackSlug: typeof track?.slug === "string" ? track.slug : ""
  };
}

export async function getMemberSessions(supabase: SupabaseClient): Promise<MemberSessionsResult> {
  const { data, error } = await supabase
    .from("live_sessions")
    .select(SESSION_SELECT)
    .eq("is_published", true)
    .order("scheduled_at", { ascending: true })
    .limit(100);

  if (error) {
    if (isMissingSchemaError(error, SESSION_TABLES)) {
      return { upcoming: [], replays: [], schemaReady: false, error: null };
    }
    return { upcoming: [], replays: [], schemaReady: true, error };
  }

  const now = Date.now();
  const sessions = ((data as unknown as SessionRow[]) || []).map(normalizeSession).filter(Boolean) as LiveSession[];

  const upcoming = sessions
    .filter((s) => !s.scheduledAt || new Date(s.scheduledAt).getTime() >= now - 2 * 60 * 60 * 1000)
    .sort((a, b) => new Date(a.scheduledAt || 0).getTime() - new Date(b.scheduledAt || 0).getTime());

  const replays = sessions
    .filter((s) => s.replayUrl && (!s.scheduledAt || new Date(s.scheduledAt).getTime() < now))
    .sort((a, b) => new Date(b.scheduledAt || 0).getTime() - new Date(a.scheduledAt || 0).getTime());

  return { upcoming, replays, schemaReady: true, error: null };
}

export async function listAllSessions(supabase: SupabaseClient): Promise<SessionsResult> {
  const { data, error } = await supabase
    .from("live_sessions")
    .select(SESSION_SELECT)
    .order("scheduled_at", { ascending: false, nullsFirst: false })
    .limit(200);

  if (error) {
    if (isMissingSchemaError(error, SESSION_TABLES)) {
      return { sessions: [], schemaReady: false, error: null };
    }
    return { sessions: [], schemaReady: true, error };
  }

  return { sessions: ((data as unknown as SessionRow[]) || []).map(normalizeSession).filter(Boolean) as LiveSession[], schemaReady: true, error: null };
}

export async function getSession(supabase: SupabaseClient, sessionId: string | null): Promise<SessionResult> {
  if (!sessionId) {
    return { session: null, schemaReady: true, error: null };
  }
  const { data, error } = await supabase.from("live_sessions").select(SESSION_SELECT).eq("id", sessionId).maybeSingle();

  if (error) {
    if (isMissingSchemaError(error, SESSION_TABLES)) {
      return { session: null, schemaReady: false, error: null };
    }
    return { session: null, schemaReady: true, error };
  }

  return { session: normalizeSession(data), schemaReady: true, error: null };
}
