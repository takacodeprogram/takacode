import { normalizeText, normalizeArray, normalizeNextSteps, isMissingSchemaError } from "./utils";

const TRACK_SELECT = [
  "id",
  "slug",
  "goal_key",
  "title",
  "summary",
  "description",
  "level_label",
  "duration_weeks",
  "accent_color",
  "icon",
  "objective",
  "resources",
  "next_session",
  "next_steps",
  "is_published",
  "is_active",
  "sort_order"
].join(", ");

const ENROLLMENT_SELECT = [
  "id",
  "user_id",
  "track_id",
  "status",
  "progress",
  "started_at",
  "completed_at",
  "created_at",
  "updated_at",
  "track:learning_tracks(" + TRACK_SELECT + ")"
].join(", ");

const DEFAULT_TRACK_COLOR = "#4F8EF7";
const DEFAULT_TRACK_ICON = "lucide:route";

const TRACK_TABLES = ["learning_tracks", "user_track_enrollments"];

export function formatTrackMeta(track) {
  if (!track) {
    return "Parcours";
  }

  const duration = Number.isFinite(Number(track.durationWeeks)) ? Number(track.durationWeeks) : 0;
  const durationLabel = duration > 0 ? String(duration) + " semaines" : "Progressif";
  const levelLabel = normalizeText(track.levelLabel || track.level_label, "Tous niveaux");

  return durationLabel + " - " + levelLabel;
}

export function mapTrackToRecommendation(track, fallbackTitle = "Parcours personnalise") {
  if (!track) {
    return {
      parcoursTitle: fallbackTitle,
      parcoursMeta: "Progressif",
      resources: ["Ressources en préparation"],
      objective: "Construire un projet concret.",
      nextSession: "Session annoncée bientôt",
      nextSteps: [
        { label: "Demarrer le parcours", state: "current" },
        { label: "Valider la premiere etape", state: "locked" }
      ]
    };
  }

  const resources = normalizeArray(track.resources)
    .map((item) => normalizeText(item))
    .filter(Boolean);

  const nextSteps = normalizeNextSteps(track.nextSteps || track.next_steps);

  return {
    parcoursTitle: normalizeText(track.title, fallbackTitle),
    parcoursMeta: formatTrackMeta(track),
    resources: resources.length ? resources : ["Ressources en préparation"],
    objective: normalizeText(track.objective, "Construire un projet concret."),
    nextSession: normalizeText(track.nextSession || track.next_session, "Session annoncée bientôt"),
    nextSteps: nextSteps.length
      ? nextSteps
      : [
          { label: "Demarrer le parcours", state: "current" },
          { label: "Valider la premiere etape", state: "locked" }
        ]
  };
}

export function normalizeTrackRow(row) {
  if (!row || typeof row !== "object") {
    return null;
  }

  const id = normalizeText(row.id);
  if (!id) {
    return null;
  }

  const resources = normalizeArray(row.resources)
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 6);

  const nextSteps = normalizeNextSteps(row.next_steps).slice(0, 6);

  return {
    id,
    slug: normalizeText(row.slug),
    goalKey: normalizeText(row.goal_key),
    title: normalizeText(row.title, "Parcours"),
    summary: normalizeText(row.summary, "Parcours en préparation."),
    description: normalizeText(row.description, ""),
    levelLabel: normalizeText(row.level_label, "Tous niveaux"),
    durationWeeks: Number.isFinite(Number(row.duration_weeks)) ? Number(row.duration_weeks) : 0,
    accentColor: normalizeText(row.accent_color, DEFAULT_TRACK_COLOR),
    icon: normalizeText(row.icon, DEFAULT_TRACK_ICON),
    objective: normalizeText(row.objective, "Construire un projet concret."),
    resources,
    nextSession: normalizeText(row.next_session, "Session annoncée bientôt"),
    nextSteps,
    isPublished: row.is_published === true,
    isActive: row.is_active !== false,
    sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 100
  };
}

export async function listPublishedTracks(supabase, options = {}) {
  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : null;

  let query = supabase
    .from("learning_tracks")
    .select(TRACK_SELECT)
    .eq("is_published", true)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingSchemaError(error, TRACK_TABLES)) {
      return { tracks: [], error: null, schemaReady: false };
    }

    return { tracks: [], error, schemaReady: true };
  }

  const tracks = (data || [])
    .map((row) => normalizeTrackRow(row))
    .filter(Boolean);

  return { tracks, error: null, schemaReady: true };
}

export async function listRecommendedTracksForGoal(supabase, goalKey, options = {}) {
  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 3;
  const excludedTrackIds = Array.isArray(options.excludedTrackIds)
    ? options.excludedTrackIds.filter((value) => typeof value === "string" && value.trim())
    : [];

  let query = supabase
    .from("learning_tracks")
    .select(TRACK_SELECT)
    .eq("is_published", true)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const normalizedGoalKey = normalizeText(goalKey);
  if (normalizedGoalKey) {
    query = query.eq("goal_key", normalizedGoalKey);
  }

  if (excludedTrackIds.length) {
    query = query.not("id", "in", "(" + excludedTrackIds.join(",") + ")");
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    if (isMissingSchemaError(error, TRACK_TABLES)) {
      return { tracks: [], error: null, schemaReady: false };
    }

    return { tracks: [], error, schemaReady: true };
  }

  const tracks = (data || [])
    .map((row) => normalizeTrackRow(row))
    .filter(Boolean);

  return { tracks, error: null, schemaReady: true };
}

export async function listUserTrackEnrollments(supabase, userId, options = {}) {
  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 6;

  if (!userId) {
    return { enrollments: [], error: null, schemaReady: true };
  }

  let query = supabase
    .from("user_track_enrollments")
    .select(ENROLLMENT_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingSchemaError(error, TRACK_TABLES)) {
      return { enrollments: [], error: null, schemaReady: false };
    }

    return { enrollments: [], error, schemaReady: true };
  }

  const enrollments = (data || [])
    .map((row) => {
      const track = normalizeTrackRow(row.track);
      if (!track) {
        return null;
      }

      return {
        id: row.id,
        userId: row.user_id,
        trackId: row.track_id,
        status: normalizeText(row.status, "in_progress"),
        progress: Number.isFinite(Number(row.progress)) ? Number(row.progress) : 0,
        startedAt: row.started_at,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        track
      };
    })
    .filter(Boolean);

  return { enrollments, error: null, schemaReady: true };
}

// Inscrit le membre à un parcours précis s'il ne l'est pas déjà (idempotent).
// Utilisé quand l'utilisateur ouvre une leçon ou démarre un parcours, pour que
// le parcours apparaisse immédiatement dans son dashboard.
export async function ensureUserTrackEnrollment(supabase, userId, trackId) {
  const normalizedUserId = normalizeText(userId);
  const normalizedTrackId = normalizeText(trackId);

  if (!normalizedUserId || !normalizedTrackId) {
    return { inserted: false, error: null, schemaReady: true };
  }

  const { error } = await supabase.from("user_track_enrollments").upsert(
    {
      user_id: normalizedUserId,
      track_id: normalizedTrackId,
      status: "in_progress",
      progress: 0
    },
    {
      onConflict: "user_id,track_id",
      ignoreDuplicates: true
    }
  );

  if (error) {
    if (isMissingSchemaError(error, TRACK_TABLES)) {
      return { inserted: false, error: null, schemaReady: false };
    }
    return { inserted: false, error, schemaReady: true };
  }

  return { inserted: true, error: null, schemaReady: true };
}

export async function ensureUserPrimaryEnrollment(supabase, userId, goalKey) {
  const normalizedUserId = normalizeText(userId);
  const normalizedGoalKey = normalizeText(goalKey);

  if (!normalizedUserId || !normalizedGoalKey) {
    return { inserted: false, error: null, schemaReady: true };
  }

  const { tracks, error, schemaReady } = await listRecommendedTracksForGoal(supabase, normalizedGoalKey, { limit: 1 });

  if (error || !schemaReady || !tracks.length) {
    return { inserted: false, error, schemaReady };
  }

  const targetTrack = tracks[0];

  const { error: insertError } = await supabase
    .from("user_track_enrollments")
    .upsert(
      {
        user_id: normalizedUserId,
        track_id: targetTrack.id,
        status: "in_progress",
        progress: 8
      },
      {
        onConflict: "user_id,track_id",
        ignoreDuplicates: true
      }
    );

  if (insertError) {
    if (isMissingTrackSchemaError(insertError)) {
      return { inserted: false, error: null, schemaReady: false };
    }

    return { inserted: false, error: insertError, schemaReady: true };
  }

  return { inserted: true, error: null, schemaReady: true };
}
