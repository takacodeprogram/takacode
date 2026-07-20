import { normalizeText, normalizeArray, normalizeNextSteps, isMissingSchemaError, NextStep } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

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

export interface Track {
  id: string;
  slug: string;
  goalKey: string;
  title: string;
  summary: string;
  description: string;
  levelLabel: string;
  durationWeeks: number;
  accentColor: string;
  icon: string;
  objective: string;
  resources: string[];
  nextSession: string;
  nextSteps: NextStep[];
  isPublished: boolean;
  isActive: boolean;
  sortOrder: number;
}

interface TrackRow {
  id: string;
  slug: string;
  goal_key: string;
  title: string;
  summary: string;
  description: string;
  level_label: string;
  duration_weeks: number;
  accent_color: string;
  icon: string;
  objective: string;
  resources: string[];
  next_session: string;
  next_steps: NextStep[];
  is_published: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  trackId: string;
  status: string;
  progress: number;
  startedAt: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  track: Track;
}

interface EnrollmentRow {
  id: string;
  user_id: string;
  track_id: string;
  status: string;
  progress: number;
  started_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  track: TrackRow[];
}

export interface Recommendation {
  parcoursTitle: string;
  parcoursMeta: string;
  resources: string[];
  objective: string;
  nextSession: string;
  nextSteps: NextStep[];
}

interface TracksResult {
  tracks: Track[];
  error: Error | null;
  schemaReady: boolean;
}

interface EnrollmentResult {
  enrollments: Enrollment[];
  error: Error | null;
  schemaReady: boolean;
}

interface InsertResult {
  inserted: boolean;
  error: Error | null;
  schemaReady: boolean;
}

export function formatTrackMeta(track: Track | null | undefined): string {
  if (!track) {
    return "Parcours";
  }

  const duration = Number.isFinite(Number(track.durationWeeks)) ? Number(track.durationWeeks) : 0;
  const durationLabel = duration > 0 ? String(duration) + " semaines" : "Progressif";
  const levelLabel = normalizeText(track.levelLabel, "Tous niveaux");

  return durationLabel + " - " + levelLabel;
}

export function mapTrackToRecommendation(track: Track | null | undefined, fallbackTitle = "Parcours personnalise"): Recommendation {
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

  const resources = normalizeArray<unknown>(track.resources)
    .map((item) => normalizeText(item))
    .filter(Boolean);

  const nextSteps = normalizeNextSteps(track.nextSteps);

  return {
    parcoursTitle: normalizeText(track.title, fallbackTitle),
    parcoursMeta: formatTrackMeta(track),
    resources: resources.length ? resources : ["Ressources en préparation"],
    objective: normalizeText(track.objective, "Construire un projet concret."),
    nextSession: normalizeText(track.nextSession, "Session annoncée bientôt"),
    nextSteps: nextSteps.length
      ? nextSteps
      : [
          { label: "Demarrer le parcours", state: "current" },
          { label: "Valider la premiere etape", state: "locked" }
        ]
  };
}

export function normalizeTrackRow(row: unknown): Track | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const r = row as Record<string, unknown>;

  const id = normalizeText(r.id);
  if (!id) {
    return null;
  }

  const resources = normalizeArray<unknown>(r.resources)
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 6);

  const nextSteps = normalizeNextSteps(r.next_steps).slice(0, 6);

  return {
    id,
    slug: normalizeText(r.slug),
    goalKey: normalizeText(r.goal_key),
    title: normalizeText(r.title, "Parcours"),
    summary: normalizeText(r.summary, "Parcours en préparation."),
    description: normalizeText(r.description, ""),
    levelLabel: normalizeText(r.level_label, "Tous niveaux"),
    durationWeeks: Number.isFinite(Number(r.duration_weeks)) ? Number(r.duration_weeks) : 0,
    accentColor: normalizeText(r.accent_color, DEFAULT_TRACK_COLOR),
    icon: normalizeText(r.icon, DEFAULT_TRACK_ICON),
    objective: normalizeText(r.objective, "Construire un projet concret."),
    resources,
    nextSession: normalizeText(r.next_session, "Session annoncée bientôt"),
    nextSteps,
    isPublished: r.is_published === true,
    isActive: r.is_active !== false,
    sortOrder: Number.isFinite(Number(r.sort_order)) ? Number(r.sort_order) : 100
  };
}

interface ListTracksOptions {
  limit?: number | null;
}

export async function listPublishedTracks(supabase: SupabaseClient, options: ListTracksOptions = {}): Promise<TracksResult> {
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

  const tracks = ((data as unknown as TrackRow[]) || [])
    .map((row) => normalizeTrackRow(row))
    .filter(Boolean) as Track[];

  return { tracks, error: null, schemaReady: true };
}

interface RecommendedTracksOptions {
  limit?: number;
  excludedTrackIds?: string[];
}

export async function listRecommendedTracksForGoal(supabase: SupabaseClient, goalKey: string, options: RecommendedTracksOptions = {}): Promise<TracksResult> {
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
    // Securise : on valide que chaque id est un UUID avant de l'utiliser
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validIds = excludedTrackIds.filter((id) => UUID_REGEX.test(id));
    if (validIds.length) {
      for (const id of validIds) {
        query = query.not("id", "eq", id);
      }
    }
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    if (isMissingSchemaError(error, TRACK_TABLES)) {
      return { tracks: [], error: null, schemaReady: false };
    }

    return { tracks: [], error, schemaReady: true };
  }

  const tracks = ((data as unknown as TrackRow[]) || [])
    .map((row) => normalizeTrackRow(row))
    .filter(Boolean) as Track[];

  return { tracks, error: null, schemaReady: true };
}

interface ListEnrollmentsOptions {
  limit?: number;
  offset?: number;
}

export async function listUserTrackEnrollments(supabase: SupabaseClient, userId: string | null, options: ListEnrollmentsOptions = {}): Promise<EnrollmentResult> {
  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 6;
  const offset = Number.isFinite(Number(options.offset)) ? Number(options.offset) : 0;

  if (!userId) {
    return { enrollments: [], error: null, schemaReady: true };
  }

  let query = supabase
    .from("user_track_enrollments")
    .select(ENROLLMENT_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (limit > 0) {
    if (offset > 0) {
      query = query.range(offset, offset + limit - 1);
    } else {
      query = query.limit(limit);
    }
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingSchemaError(error, TRACK_TABLES)) {
      return { enrollments: [], error: null, schemaReady: false };
    }

    return { enrollments: [], error, schemaReady: true };
  }

  const enrollments = ((data as unknown as EnrollmentRow[]) || [])
    .map((row: EnrollmentRow): Enrollment | null => {
      const trackRow = Array.isArray(row.track) ? row.track[0] : row.track;
      const track = normalizeTrackRow(trackRow);
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
    .filter(Boolean) as Enrollment[];

  return { enrollments, error: null, schemaReady: true };
}

export async function ensureUserTrackEnrollment(supabase: SupabaseClient, userId: string, trackId: string): Promise<InsertResult> {
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

export async function ensureUserPrimaryEnrollment(supabase: SupabaseClient, userId: string, goalKey: string): Promise<InsertResult> {
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
    if (isMissingSchemaError(insertError, TRACK_TABLES)) {
      return { inserted: false, error: null, schemaReady: false };
    }

    return { inserted: false, error: insertError, schemaReady: true };
  }

  return { inserted: true, error: null, schemaReady: true };
}
