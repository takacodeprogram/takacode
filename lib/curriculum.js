const MODULE_SELECT = [
  "id",
  "slug",
  "title",
  "summary",
  "sort_order",
  "is_published",
  "created_at",
  "track_lessons(id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order, is_published, created_at)"
].join(", ");

function isMissingCurriculumSchemaError(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";

  return (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("track_modules") ||
    message.includes("track_lessons") ||
    message.includes("user_lesson_progress") ||
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

function normalizeStringArray(value, limit = 8) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, limit);
}

function normalizeResources(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const label = normalizeText(item.label);
      const url = normalizeText(item.url);

      if (!label || !/^https:\/\//.test(url)) {
        return null;
      }

      return {
        label,
        url,
        kind: normalizeText(item.kind, "doc"),
        why: normalizeText(item.why),
        how: normalizeText(item.how)
      };
    })
    .filter(Boolean)
    .slice(0, 6);
}

function normalizeQuizForClient(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const question = normalizeText(item.q || item.question);
      const choices = normalizeStringArray(item.choices, 6);

      if (!question || choices.length < 2) {
        return null;
      }

      // Les champs answer/explanation ne sont volontairement pas exposes:
      // la correction se fait cote serveur via la RPC submit_lesson_quiz.
      return { question, choices };
    })
    .filter(Boolean)
    .slice(0, 10);
}

function normalizeMicroProject(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const title = normalizeText(value.title);
  if (!title) {
    return null;
  }

  const validation = normalizeText(value.validation, "auto");

  return {
    title,
    brief: normalizeText(value.brief),
    steps: normalizeStringArray(value.steps, 6),
    deliverable: normalizeText(value.deliverable),
    validation: ["auto", "ai", "peer", "mentor"].includes(validation) ? validation : "auto",
    requiresLink: value.requires_link === true || value.requires_link === "true"
  };
}

function normalizeLessonRow(row) {
  if (!row || typeof row !== "object") {
    return null;
  }

  const id = normalizeText(row.id);
  if (!id || row.is_published === false) {
    return null;
  }

  return {
    id,
    slug: normalizeText(row.slug),
    title: normalizeText(row.title, "Leçon"),
    intro: normalizeText(row.intro),
    whyImportant: normalizeText(row.why_important),
    howToUse: normalizeText(row.how_to_use),
    objectives: normalizeStringArray(row.objectives, 5),
    resources: normalizeResources(row.resources),
    quiz: normalizeQuizForClient(row.quiz),
    microProject: normalizeMicroProject(row.micro_project),
    xpReward: Number.isFinite(Number(row.xp_reward)) ? Number(row.xp_reward) : 50,
    durationMinutes: Number.isFinite(Number(row.duration_minutes)) ? Number(row.duration_minutes) : 45,
    sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 100,
    createdAt: row.created_at || null
  };
}

function bySortOrder(a, b) {
  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder;
  }

  return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
}

async function listLessonProgress(supabase, userId) {
  if (!userId) {
    return { progressByLessonId: {}, error: null, schemaReady: true };
  }

  const BASE_COLS = "lesson_id, quiz_score, quiz_total, quiz_passed, project_submission, project_submitted_at, status, completed_at, xp_awarded";

  let { data, error } = await supabase
    .from("user_lesson_progress")
    .select(`${BASE_COLS}, review_status, review_feedback`)
    .eq("user_id", userId);

  // Repli si les colonnes de revue n'existent pas encore (migration 016 non appliquee).
  if (error && (error.code === "42703" || (typeof error.message === "string" && error.message.toLowerCase().includes("review_status")))) {
    ({ data, error } = await supabase.from("user_lesson_progress").select(BASE_COLS).eq("user_id", userId));
  }

  if (error) {
    if (isMissingCurriculumSchemaError(error)) {
      return { progressByLessonId: {}, error: null, schemaReady: false };
    }

    return { progressByLessonId: {}, error, schemaReady: true };
  }

  const progressByLessonId = {};

  for (const row of data || []) {
    const lessonId = normalizeText(row.lesson_id);
    if (!lessonId) {
      continue;
    }

    progressByLessonId[lessonId] = {
      quizScore: Number.isFinite(Number(row.quiz_score)) ? Number(row.quiz_score) : 0,
      quizTotal: Number.isFinite(Number(row.quiz_total)) ? Number(row.quiz_total) : 0,
      quizPassed: row.quiz_passed === true,
      projectSubmission: normalizeText(row.project_submission),
      projectSubmittedAt: row.project_submitted_at || null,
      status: normalizeText(row.status, "in_progress"),
      completedAt: row.completed_at || null,
      xpAwarded: Number.isFinite(Number(row.xp_awarded)) ? Number(row.xp_awarded) : 0,
      reviewStatus: normalizeText(row.review_status, "none"),
      reviewFeedback: normalizeText(row.review_feedback)
    };
  }

  return { progressByLessonId, error: null, schemaReady: true };
}

export async function getTrackCurriculum(supabase, trackId, userId) {
  const emptyResult = {
    modules: [],
    totalLessons: 0,
    completedLessons: 0,
    progressPercent: 0,
    nextLesson: null,
    hasCurriculum: false,
    schemaReady: true,
    error: null
  };

  const normalizedTrackId = normalizeText(trackId);
  if (!normalizedTrackId) {
    return emptyResult;
  }

  const { data, error } = await supabase
    .from("track_modules")
    .select(MODULE_SELECT)
    .eq("track_id", normalizedTrackId)
    .eq("is_published", true);

  if (error) {
    if (isMissingCurriculumSchemaError(error)) {
      return { ...emptyResult, schemaReady: false };
    }

    return { ...emptyResult, error };
  }

  const progressResult = await listLessonProgress(supabase, userId);

  if (!progressResult.schemaReady) {
    return { ...emptyResult, schemaReady: false };
  }

  const progressByLessonId = progressResult.progressByLessonId;

  const modules = (data || [])
    .map((row) => {
      const id = normalizeText(row.id);
      if (!id) {
        return null;
      }

      const lessons = (row.track_lessons || [])
        .map((lessonRow) => normalizeLessonRow(lessonRow))
        .filter(Boolean)
        .sort(bySortOrder);

      return {
        id,
        slug: normalizeText(row.slug),
        title: normalizeText(row.title, "Module"),
        summary: normalizeText(row.summary),
        sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 100,
        createdAt: row.created_at || null,
        lessons
      };
    })
    .filter(Boolean)
    .sort(bySortOrder);

  let totalLessons = 0;
  let completedLessons = 0;
  // Le deblocage suit "franchie" (soumise) et non "completee" : un micro-projet en
  // revue laisse avancer, l'XP arrive apres approbation. Cf. migration 018.
  let previousModulesCleared = true;
  let nextLesson = null;

  for (const module of modules) {
    const moduleUnlocked = previousModulesCleared;
    let moduleCompletedCount = 0;
    let moduleClearedCount = 0;

    for (const lesson of module.lessons) {
      totalLessons += 1;

      const progress = progressByLessonId[lesson.id] || null;
      const isCompleted = progress?.status === "completed";

      const lessonHasQuiz = Array.isArray(lesson.quiz) && lesson.quiz.length > 0;
      const lessonHasProject = Boolean(lesson.microProject);
      const submitted = Boolean(progress?.projectSubmittedAt);
      const quizOk = !lessonHasQuiz || progress?.quizPassed === true;
      const projectOk = !lessonHasProject || submitted;
      const isReviewProject = lessonHasProject && lesson.microProject.validation !== "auto";
      const awaitingReview = isReviewProject && submitted && !isCompleted;
      // Franchie = de quoi passer a la suite (soumise), meme si la revue est en cours.
      const isCleared = isCompleted || Boolean(quizOk && projectOk);

      if (isCompleted) {
        completedLessons += 1;
        moduleCompletedCount += 1;
      }
      if (isCleared) {
        moduleClearedCount += 1;
      }

      lesson.progress = progress;
      lesson.awaitingReview = awaitingReview;
      lesson.state = isCompleted
        ? "completed"
        : awaitingReview
          ? "review"
          : moduleUnlocked
            ? "available"
            : "locked";

      if (!nextLesson && moduleUnlocked && !isCleared) {
        nextLesson = { moduleSlug: module.slug, lessonSlug: lesson.slug, title: lesson.title };
        lesson.state = "current";
      }
    }

    module.unlocked = moduleUnlocked;
    module.completedLessons = moduleCompletedCount;
    module.totalLessons = module.lessons.length;
    module.state = !moduleUnlocked
      ? "locked"
      : module.lessons.length > 0 && moduleCompletedCount >= module.lessons.length
        ? "completed"
        : "current";

    if (module.lessons.length > 0 && moduleClearedCount < module.lessons.length) {
      previousModulesCleared = false;
    }
  }

  const progressPercent = totalLessons > 0 ? Math.floor((completedLessons / totalLessons) * 100) : 0;

  return {
    modules,
    totalLessons,
    completedLessons,
    progressPercent,
    nextLesson,
    hasCurriculum: totalLessons > 0,
    schemaReady: true,
    error: null
  };
}

export function findLessonInCurriculum(curriculum, lessonSlug) {
  const normalizedSlug = normalizeText(lessonSlug).toLowerCase();
  if (!normalizedSlug || !curriculum?.modules?.length) {
    return null;
  }

  const flat = [];
  for (const module of curriculum.modules) {
    for (const lesson of module.lessons) {
      flat.push({ module, lesson });
    }
  }

  const index = flat.findIndex((entry) => entry.lesson.slug.toLowerCase() === normalizedSlug);
  if (index === -1) {
    return null;
  }

  return {
    module: flat[index].module,
    lesson: flat[index].lesson,
    previousLesson: index > 0 ? flat[index - 1].lesson : null,
    nextLesson: index < flat.length - 1 ? flat[index + 1].lesson : null,
    position: index + 1,
    total: flat.length
  };
}
