import { listUserTrackEnrollments, Track } from "./tracks";
import { normalizeText, isMissingSchemaError } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

const MEMBER_TABLES = ["user_lesson_progress", "track_lessons", "track_modules"];

const PROJECT_SELECT = [
  "lesson_id",
  "project_submission",
  "project_submitted_at",
  "status",
  "quiz_passed",
  "updated_at",
  "lesson:track_lessons(title, slug, module:track_modules(title, track:learning_tracks(title, slug)))"
].join(", ");

interface MemberProject {
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  trackTitle: string;
  trackSlug: string;
  submission: string;
  submittedAt: string;
  status: string;
  quizPassed: boolean;
}

interface MemberProjectRow {
  lesson_id: string;
  project_submission: string;
  project_submitted_at: string;
  status: string;
  quiz_passed: boolean;
  lesson: {
    title: string;
    slug: string;
    module: {
      title: string;
      track: {
        title: string;
        slug: string;
      };
    };
  } | null;
}

interface MemberProjectsResult {
  projects: MemberProject[];
  error: Error | null;
  schemaReady: boolean;
}

interface MemberResource {
  label: string;
  url: string;
  kind: string;
  why: string;
  lessonTitle: string;
  trackTitle: string;
  trackSlug: string;
}

interface MemberResourcesResult {
  resources: MemberResource[];
  tracks: Track[];
  error: Error | null;
  schemaReady: boolean;
}

interface ListOptions {
  limit?: number;
  offset?: number;
}

export async function listUserProjects(supabase: SupabaseClient, userId: string | null, options: ListOptions = {}): Promise<MemberProjectsResult> {
  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 50;
  const offset = Number.isFinite(Number(options.offset)) ? Number(options.offset) : 0;

  if (!userId) {
    return { projects: [], error: null, schemaReady: true };
  }

  let query = supabase
    .from("user_lesson_progress")
    .select(PROJECT_SELECT)
    .eq("user_id", userId)
    .not("project_submitted_at", "is", null)
    .order("project_submitted_at", { ascending: false });

  if (offset > 0) {
    query = query.range(offset, offset + limit - 1);
  } else {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingSchemaError(error, MEMBER_TABLES)) {
      return { projects: [], error: null, schemaReady: false };
    }
    return { projects: [], error, schemaReady: true };
  }

  const projects: MemberProject[] = ((data as unknown as MemberProjectRow[]) || [])
    .map((row: MemberProjectRow): MemberProject | null => {
      const lesson = row.lesson || null;
      const mod = lesson?.module || null;
      const track = mod?.track || null;

      const lessonSlug = normalizeText(lesson?.slug);
      if (!lessonSlug) return null;

      return {
        lessonId: row.lesson_id,
        lessonTitle: normalizeText(lesson?.title, "Lecon"),
        lessonSlug,
        trackTitle: normalizeText(track?.title, "Parcours"),
        trackSlug: normalizeText(track?.slug),
        submission: normalizeText(row.project_submission),
        submittedAt: row.project_submitted_at,
        status: normalizeText(row.status, "in_progress"),
        quizPassed: row.quiz_passed === true
      };
    })
    .filter(Boolean) as MemberProject[];

  return { projects, error: null, schemaReady: true };
}

export async function listUserResources(supabase: SupabaseClient, userId: string | null, options: ListOptions = {}): Promise<MemberResourcesResult> {
  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 60;

  if (!userId) {
    return { resources: [], tracks: [], error: null, schemaReady: true };
  }

  const enrollmentResult = await listUserTrackEnrollments(supabase, userId, { limit: 12 });
  if (!enrollmentResult.schemaReady) {
    return { resources: [], tracks: [], error: null, schemaReady: false };
  }

  const trackById = new Map<string, Track>();
  const trackIds: string[] = [];
  for (const entry of enrollmentResult.enrollments) {
    if (entry.trackId && !trackById.has(entry.trackId)) {
      trackById.set(entry.trackId, entry.track);
      trackIds.push(entry.trackId);
    }
  }

  if (!trackIds.length) {
    return { resources: [], tracks: [], error: null, schemaReady: true };
  }

  const { data: modules, error: modulesError } = await supabase
    .from("track_modules")
    .select("id, track_id")
    .in("track_id", trackIds)
    .eq("is_published", true);

  if (modulesError) {
    if (isMissingSchemaError(modulesError)) {
      return { resources: [], tracks: [], error: null, schemaReady: false };
    }
    return { resources: [], tracks: [], error: modulesError, schemaReady: true };
  }

  const moduleToTrack = new Map<string, string>();
  const moduleIds: string[] = [];
  for (const mod of (modules as { id: string; track_id: string }[]) || []) {
    moduleToTrack.set(mod.id, mod.track_id);
    moduleIds.push(mod.id);
  }

  if (!moduleIds.length) {
    return { resources: [], tracks: [], error: null, schemaReady: true };
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("track_lessons")
    .select("title, resources, module_id")
    .in("module_id", moduleIds)
    .eq("is_published", true);

  if (lessonsError) {
    if (isMissingSchemaError(lessonsError)) {
      return { resources: [], tracks: [], error: null, schemaReady: false };
    }
    return { resources: [], tracks: [], error: lessonsError, schemaReady: true };
  }

  const seen = new Set<string>();
  const resources: MemberResource[] = [];

  for (const lesson of (lessons as { title: string; resources: unknown[]; module_id: string }[]) || []) {
    const trackId = moduleToTrack.get(lesson.module_id);
    const track = trackById.get(trackId!) || null;
    const list = Array.isArray(lesson.resources) ? lesson.resources : [];

    for (const item of list) {
      if (!item || typeof item !== "object") {
        continue;
      }

      const obj = item as Record<string, unknown>;
      const url = normalizeText(obj.url);
      const label = normalizeText(obj.label);
      if (!label || !/^https:\/\//.test(url) || seen.has(url)) {
        continue;
      }

      seen.add(url);
      resources.push({
        label,
        url,
        kind: normalizeText(obj.kind, "doc"),
        why: normalizeText(obj.why),
        lessonTitle: normalizeText(lesson.title, "Lecon"),
        trackTitle: normalizeText(track?.title, "Parcours"),
        trackSlug: normalizeText(track?.slug)
      });

      if (resources.length >= limit) {
        break;
      }
    }

    if (resources.length >= limit) {
      break;
    }
  }

  const tracks = trackIds.map((id) => trackById.get(id)).filter(Boolean) as Track[];

  return { resources, tracks, error: null, schemaReady: true };
}
