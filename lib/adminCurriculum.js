// Chargement des donnees curriculum cote admin (inclut le non-publie).
export const ADMIN_TRACK_COLUMNS =
  "id, slug, goal_key, title, summary, description, level_label, duration_weeks, accent_color, icon, objective, resources, next_session, next_steps, is_published, is_active, sort_order, created_at, updated_at";

export const ADMIN_LESSON_COLUMNS =
  "id, module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order, is_published, created_at";

function isMissingSchemaError(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";
  return (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("learning_tracks") ||
    message.includes("track_modules") ||
    message.includes("track_lessons") ||
    message.includes("schema cache")
  );
}

export async function listAdminTracks(supabase) {
  const { data, error } = await supabase
    .from("learning_tracks")
    .select("id, slug, title, level_label, is_published, is_active, sort_order, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(300);

  if (error) {
    if (isMissingSchemaError(error)) {
      return { tracks: [], error: null, schemaReady: false };
    }
    return { tracks: [], error, schemaReady: true };
  }

  return { tracks: data || [], error: null, schemaReady: true };
}

export async function getAdminTrack(supabase, trackId) {
  if (!trackId) {
    return { track: null, error: null, schemaReady: true };
  }

  const { data, error } = await supabase.from("learning_tracks").select(ADMIN_TRACK_COLUMNS).eq("id", trackId).maybeSingle();

  if (error) {
    if (isMissingSchemaError(error)) {
      return { track: null, error: null, schemaReady: false };
    }
    return { track: null, error, schemaReady: true };
  }

  return { track: data || null, error: null, schemaReady: true };
}

// Modules (tous) + leurs lecons (toutes) d'un parcours, ordonnes.
export async function getAdminTrackCurriculum(supabase, trackId) {
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

  const moduleIds = (modules || []).map((module) => module.id);
  let lessonsByModule = {};

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

    for (const lesson of lessons || []) {
      if (!lessonsByModule[lesson.module_id]) {
        lessonsByModule[lesson.module_id] = [];
      }
      lessonsByModule[lesson.module_id].push(lesson);
    }
  }

  const enriched = (modules || []).map((module) => ({
    ...module,
    lessons: lessonsByModule[module.id] || []
  }));

  return { modules: enriched, error: null, schemaReady: true };
}

export async function getAdminLesson(supabase, lessonId) {
  if (!lessonId) {
    return { lesson: null, error: null, schemaReady: true };
  }

  const { data, error } = await supabase.from("track_lessons").select(ADMIN_LESSON_COLUMNS).eq("id", lessonId).maybeSingle();

  if (error) {
    if (isMissingSchemaError(error)) {
      return { lesson: null, error: null, schemaReady: false };
    }
    return { lesson: null, error, schemaReady: true };
  }

  return { lesson: data || null, error: null, schemaReady: true };
}
