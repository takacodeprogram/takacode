// Donnees reelles de l'espace membre: micro-projets soumis et ressources agregees.
import { listUserTrackEnrollments } from "./tracks";

function isMissingSchemaError(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";

  return (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("user_lesson_progress") ||
    message.includes("track_lessons") ||
    message.includes("track_modules") ||
    message.includes("schema cache")
  );
}

function normalizeText(value, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed || fallback;
}

const PROJECT_SELECT = [
  "lesson_id",
  "project_submission",
  "project_submitted_at",
  "status",
  "quiz_passed",
  "updated_at",
  "lesson:track_lessons(title, slug, module:track_modules(title, track:learning_tracks(title, slug)))"
].join(", ");

// Micro-projets soumis par le membre (avec parcours/lecon d'origine).
export async function listUserProjects(supabase, userId, options = {}) {
  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 50;

  if (!userId) {
    return { projects: [], error: null, schemaReady: true };
  }

  const { data, error } = await supabase
    .from("user_lesson_progress")
    .select(PROJECT_SELECT)
    .eq("user_id", userId)
    .not("project_submitted_at", "is", null)
    .order("project_submitted_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (isMissingSchemaError(error)) {
      return { projects: [], error: null, schemaReady: false };
    }
    return { projects: [], error, schemaReady: true };
  }

  const projects = (data || [])
    .map((row) => {
      const lesson = row.lesson || null;
      const module = lesson?.module || null;
      const track = module?.track || null;

      return {
        lessonId: row.lesson_id,
        lessonTitle: normalizeText(lesson?.title, "Lecon"),
        lessonSlug: normalizeText(lesson?.slug),
        trackTitle: normalizeText(track?.title, "Parcours"),
        trackSlug: normalizeText(track?.slug),
        submission: normalizeText(row.project_submission),
        submittedAt: row.project_submitted_at,
        status: normalizeText(row.status, "in_progress"),
        quizPassed: row.quiz_passed === true
      };
    })
    .filter((entry) => entry.lessonSlug);

  return { projects, error: null, schemaReady: true };
}

// Ressources agregees depuis les lecons des parcours ou le membre est inscrit.
export async function listUserResources(supabase, userId, options = {}) {
  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 60;

  if (!userId) {
    return { resources: [], tracks: [], error: null, schemaReady: true };
  }

  const enrollmentResult = await listUserTrackEnrollments(supabase, userId, { limit: 12 });
  if (!enrollmentResult.schemaReady) {
    return { resources: [], tracks: [], error: null, schemaReady: false };
  }

  const trackById = new Map();
  const trackIds = [];
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

  const moduleToTrack = new Map();
  const moduleIds = [];
  for (const module of modules || []) {
    moduleToTrack.set(module.id, module.track_id);
    moduleIds.push(module.id);
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

  const seen = new Set();
  const resources = [];

  for (const lesson of lessons || []) {
    const trackId = moduleToTrack.get(lesson.module_id);
    const track = trackById.get(trackId) || null;
    const list = Array.isArray(lesson.resources) ? lesson.resources : [];

    for (const item of list) {
      if (!item || typeof item !== "object") {
        continue;
      }

      const url = normalizeText(item.url);
      const label = normalizeText(item.label);
      if (!label || !/^https:\/\//.test(url) || seen.has(url)) {
        continue;
      }

      seen.add(url);
      resources.push({
        label,
        url,
        kind: normalizeText(item.kind, "doc"),
        why: normalizeText(item.why),
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

  const tracks = trackIds.map((id) => trackById.get(id)).filter(Boolean);

  return { resources, tracks, error: null, schemaReady: true };
}
