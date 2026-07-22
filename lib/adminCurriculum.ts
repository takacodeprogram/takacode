import { normalizeText, isMissingSchemaError } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

export const ADMIN_TRACK_COLUMNS =
  "id, slug, goal_key, title, summary, description, level_label, duration_weeks, accent_color, icon, objective, resources, next_session, next_steps, is_published, is_active, sort_order, locale, created_at, updated_at";

export const ADMIN_LESSON_COLUMNS =
  "id, module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order, is_published, created_at";

const ADMIN_TABLES = ["learning_tracks", "track_modules", "track_lessons"];

interface AdminTrack {
  id: string;
  slug: string;
  title: string;
  level_label: string;
  is_published: boolean;
  is_active: boolean;
  sort_order: number;
  updated_at: string;
}

interface AdminTrackResult {
  tracks: AdminTrack[];
  error: Error | null;
  schemaReady: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface AdminTrackDetailResult {
  track: Record<string, unknown> | null;
  error: Error | null;
  schemaReady: boolean;
}

interface AdminModuleRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

interface AdminLessonRow {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  xp_reward: number;
  duration_minutes: number;
  sort_order: number;
  is_published: boolean;
}

interface AdminCurriculumResult {
  modules: (AdminModuleRow & { lessons: AdminLessonRow[] })[];
  error: Error | null;
  schemaReady: boolean;
}

interface AdminLessonResult {
  lesson: Record<string, unknown> | null;
  error: Error | null;
  schemaReady: boolean;
}

export async function listAdminTracks(supabase: SupabaseClient): Promise<AdminTrackResult> {
  const { data, error } = await supabase
    .from("learning_tracks")
    .select("id, slug, title, level_label, is_published, is_active, sort_order, locale, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(300);

  if (error) {
    if (isMissingSchemaError(error, ADMIN_TABLES)) {
      return { tracks: [], error: null, schemaReady: false };
    }
    return { tracks: [], error, schemaReady: true };
  }

  return { tracks: (data as AdminTrack[]) || [], error: null, schemaReady: true };
}

export async function getAdminTrack(supabase: SupabaseClient, trackId: string | null): Promise<AdminTrackDetailResult> {
  if (!trackId) {
    return { track: null, error: null, schemaReady: true };
  }

  const { data, error } = await supabase.from("learning_tracks").select(ADMIN_TRACK_COLUMNS).eq("id", trackId).maybeSingle();

  if (error) {
    if (isMissingSchemaError(error, ADMIN_TABLES)) {
      return { track: null, error: null, schemaReady: false };
    }
    return { track: null, error, schemaReady: true };
  }

  return { track: (data as Record<string, unknown>) || null, error: null, schemaReady: true };
}

export async function getAdminTrackCurriculum(supabase: SupabaseClient, trackId: string | null): Promise<AdminCurriculumResult> {
  if (!trackId) {
    return { modules: [], error: null, schemaReady: true };
  }

  const { data: modules, error: modulesError } = await supabase
    .from("track_modules")
    .select("id, slug, title, summary, sort_order, is_published, created_at")
    .eq("track_id", trackId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (modulesError) {
    if (isMissingSchemaError(modulesError)) {
      return { modules: [], error: null, schemaReady: false };
    }
    return { modules: [], error: modulesError, schemaReady: true };
  }

  const moduleIds = ((modules as AdminModuleRow[]) || []).map((mod) => mod.id);
  let lessonsByModule: Record<string, AdminLessonRow[]> = {};

  if (moduleIds.length) {
    const { data: lessons, error: lessonsError } = await supabase
      .from("track_lessons")
      .select("id, module_id, slug, title, xp_reward, duration_minutes, sort_order, is_published")
      .in("module_id", moduleIds)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (lessonsError) {
      if (isMissingSchemaError(lessonsError)) {
        return { modules: [], error: null, schemaReady: false };
      }
      return { modules: [], error: lessonsError, schemaReady: true };
    }

    for (const lesson of (lessons as AdminLessonRow[]) || []) {
      if (!lessonsByModule[lesson.module_id]) {
        lessonsByModule[lesson.module_id] = [];
      }
      lessonsByModule[lesson.module_id].push(lesson);
    }
  }

  const enriched = ((modules as AdminModuleRow[]) || []).map((mod) => ({
    ...mod,
    lessons: lessonsByModule[mod.id] || []
  }));

  return { modules: enriched, error: null, schemaReady: true };
}

export async function getAdminLesson(supabase: SupabaseClient, lessonId: string | null): Promise<AdminLessonResult> {
  if (!lessonId) {
    return { lesson: null, error: null, schemaReady: true };
  }

  const { data, error } = await supabase.from("track_lessons").select(ADMIN_LESSON_COLUMNS).eq("id", lessonId).maybeSingle();

  if (error) {
    if (isMissingSchemaError(error, ADMIN_TABLES)) {
      return { lesson: null, error: null, schemaReady: false };
    }
    return { lesson: null, error, schemaReady: true };
  }

  return { lesson: (data as Record<string, unknown>) || null, error: null, schemaReady: true };
}
