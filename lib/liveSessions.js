// Sessions live (table live_sessions, gerees par l'admin).

import { normalizeText, isMissingSchemaError } from "./utils";

const SESSION_SELECT =
  "id, track_id, title, description, scheduled_at, duration_minutes, join_url, replay_url, is_published, created_at, updated_at, track:learning_tracks(title, slug)";

const SESSION_TABLES = ["live_sessions"];

function normalizeSession(row) {
  if (!row || typeof row !== "object") {
    return null;
  }
  return {
    id: row.id,
    trackId: row.track_id || "",
    title: typeof row.title === "string" ? row.title : "Session",
    description: typeof row.description === "string" ? row.description : "",
    scheduledAt: row.scheduled_at || null,
    durationMinutes: Number.isFinite(Number(row.duration_minutes)) ? Number(row.duration_minutes) : 60,
    joinUrl: typeof row.join_url === "string" ? row.join_url : "",
    replayUrl: typeof row.replay_url === "string" ? row.replay_url : "",
    isPublished: row.is_published === true,
    trackTitle: typeof row.track?.title === "string" ? row.track.title : "",
    trackSlug: typeof row.track?.slug === "string" ? row.track.slug : ""
  };
}

// Vue membre: sessions publiées, séparées en à venir et replays.
export async function getMemberSessions(supabase) {
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
  const sessions = (data || []).map(normalizeSession).filter(Boolean);

  const upcoming = sessions
    .filter((s) => !s.scheduledAt || new Date(s.scheduledAt).getTime() >= now - 2 * 60 * 60 * 1000)
    .sort((a, b) => new Date(a.scheduledAt || 0).getTime() - new Date(b.scheduledAt || 0).getTime());

  const replays = sessions
    .filter((s) => s.replayUrl && (!s.scheduledAt || new Date(s.scheduledAt).getTime() < now))
    .sort((a, b) => new Date(b.scheduledAt || 0).getTime() - new Date(a.scheduledAt || 0).getTime());

  return { upcoming, replays, schemaReady: true, error: null };
}

// Vue admin: toutes les sessions.
export async function listAllSessions(supabase) {
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

  return { sessions: (data || []).map(normalizeSession).filter(Boolean), schemaReady: true, error: null };
}

export async function getSession(supabase, sessionId) {
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
