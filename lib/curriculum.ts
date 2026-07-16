import { normalizeText, normalizeStringArray, isMissingSchemaError } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

const CURRICULUM_TABLES = ["track_modules", "track_lessons", "user_lesson_progress"];

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

interface Resource {
  label: string;
  url: string;
  kind: string;
  why: string;
  how: string;
}

interface QuizItem {
  question: string;
  choices: string[];
}

interface MicroProject {
  title: string;
  brief: string;
  steps: string[];
  deliverable: string;
  validation: "auto" | "ai" | "peer" | "mentor";
  requiresLink: boolean;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  intro: string;
  whyImportant: string;
  howToUse: string;
  objectives: string[];
  resources: Resource[];
  quiz: QuizItem[];
  microProject: MicroProject | null;
  xpReward: number;
  durationMinutes: number;
  sortOrder: number;
  createdAt: string | null;
  progress?: LessonProgress | null;
  awaitingReview?: boolean;
  state?: string;
}

interface LessonRow {
  id: string;
  slug: string;
  title: string;
  intro: string;
  why_important: string;
  how_to_use: string;
  objectives: string[];
  resources: Resource[];
  quiz: any[];
  micro_project: any;
  xp_reward: number;
  duration_minutes: number;
  sort_order: number;
  created_at: string;
  is_published: boolean;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  summary: string;
  sortOrder: number;
  createdAt: string | null;
  lessons: Lesson[];
  unlocked?: boolean;
  completedLessons?: number;
  totalLessons?: number;
  state?: string;
}

interface ModuleRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  sort_order: number;
  created_at: string;
  is_published: boolean;
  track_lessons: LessonRow[];
}

interface LessonProgress {
  quizScore: number;
  quizTotal: number;
  quizPassed: boolean;
  projectSubmission: string;
  projectSubmittedAt: string | null;
  status: string;
  completedAt: string | null;
  xpAwarded: number;
  reviewStatus: string;
  reviewFeedback: string;
}

interface ProgressRow {
  lesson_id: string;
  quiz_score: number;
  quiz_total: number;
  quiz_passed: boolean;
  project_submission: string;
  project_submitted_at: string;
  status: string;
  completed_at: string;
  xp_awarded: number;
  review_status?: string;
  review_feedback?: string;
}

interface ProgressResult {
  progressByLessonId: Record<string, LessonProgress>;
  error: Error | null;
  schemaReady: boolean;
}

export interface CurriculumResult {
  modules: Module[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  nextLesson: { moduleSlug: string; lessonSlug: string; title: string } | null;
  hasCurriculum: boolean;
  schemaReady: boolean;
  error: Error | null;
}

interface FindResult {
  module: Module;
  lesson: Lesson;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
  position: number;
  total: number;
}

function normalizeResources(value: unknown): Resource[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const items = value
    .map((item: unknown) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const obj = item as Record<string, unknown>;
      const label = normalizeText(obj.label);
      const url = normalizeText(obj.url);

      if (!label || !/^https:\/\//.test(url)) {
        return null;
      }

      return {
        label,
        url,
        kind: normalizeText(obj.kind, "doc"),
        why: normalizeText(obj.why),
        how: normalizeText(obj.how)
      };
    })
    .filter(Boolean);

  return (items as Resource[]).slice(0, 6);
}

function normalizeQuizForClient(value: unknown): QuizItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const items = value
    .map((item: unknown) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const obj = item as Record<string, unknown>;
      const question = normalizeText(obj.q || obj.question);
      const choices = normalizeStringArray(obj.choices, 6);

      if (!question || choices.length < 2) {
        return null;
      }

      return { question, choices };
    })
    .filter(Boolean);

  return (items as QuizItem[]).slice(0, 10);
}

function normalizeMicroProject(value: unknown): MicroProject | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const obj = value as Record<string, unknown>;
  const title = normalizeText(obj.title);
  if (!title) {
    return null;
  }

  const validation = normalizeText(obj.validation, "auto");

  return {
    title,
    brief: normalizeText(obj.brief),
    steps: normalizeStringArray(obj.steps, 6),
    deliverable: normalizeText(obj.deliverable),
    validation: (["auto", "ai", "peer", "mentor"].includes(validation) ? validation : "auto") as MicroProject["validation"],
    requiresLink: obj.requires_link === true || obj.requires_link === "true"
  };
}

function normalizeLessonRow(row: unknown): Lesson | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const r = row as Record<string, unknown>;

  const id = normalizeText(r.id);
  if (!id || r.is_published === false) {
    return null;
  }

  return {
    id,
    slug: normalizeText(r.slug),
    title: normalizeText(r.title, "Lecon"),
    intro: normalizeText(r.intro),
    whyImportant: normalizeText(r.why_important),
    howToUse: normalizeText(r.how_to_use),
    objectives: normalizeStringArray(r.objectives, 5),
    resources: normalizeResources(r.resources),
    quiz: normalizeQuizForClient(r.quiz),
    microProject: normalizeMicroProject(r.micro_project),
    xpReward: Number.isFinite(Number(r.xp_reward)) ? Number(r.xp_reward) : 50,
    durationMinutes: Number.isFinite(Number(r.duration_minutes)) ? Number(r.duration_minutes) : 45,
    sortOrder: Number.isFinite(Number(r.sort_order)) ? Number(r.sort_order) : 100,
    createdAt: r.created_at as string | null || null
  };
}

function bySortOrder(a: { sortOrder: number; createdAt: string | null }, b: { sortOrder: number; createdAt: string | null }): number {
  if (a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder;
  }

  return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
}

async function listLessonProgress(supabase: SupabaseClient, userId: string | null): Promise<ProgressResult> {
  if (!userId) {
    return { progressByLessonId: {}, error: null, schemaReady: true };
  }

  const BASE_COLS = "lesson_id, quiz_score, quiz_total, quiz_passed, project_submission, project_submitted_at, status, completed_at, xp_awarded";

  let { data, error } = await supabase
    .from("user_lesson_progress")
    .select(`${BASE_COLS}, review_status, review_feedback`)
    .eq("user_id", userId);

  if (error && (error.code === "42703" || (typeof error.message === "string" && error.message.toLowerCase().includes("review_status")))) {
    const fallback = await supabase.from("user_lesson_progress").select(BASE_COLS).eq("user_id", userId);
    data = fallback.data as unknown as typeof data;
    error = fallback.error;
  }

  if (error) {
    if (isMissingSchemaError(error, CURRICULUM_TABLES)) {
      return { progressByLessonId: {}, error: null, schemaReady: false };
    }

    return { progressByLessonId: {}, error, schemaReady: true };
  }

  const progressByLessonId: Record<string, LessonProgress> = {};

  for (const row of (data as ProgressRow[]) || []) {
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

export async function getTrackCurriculum(supabase: SupabaseClient, trackId: string, userId: string | null): Promise<CurriculumResult> {
  const emptyResult: CurriculumResult = {
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
    if (isMissingSchemaError(error, CURRICULUM_TABLES)) {
      return { ...emptyResult, schemaReady: false };
    }

    return { ...emptyResult, error };
  }

  const progressResult = await listLessonProgress(supabase, userId);

  if (!progressResult.schemaReady) {
    return { ...emptyResult, schemaReady: false };
  }

  const progressByLessonId = progressResult.progressByLessonId;

  const moduleItems = ((data as unknown as ModuleRow[]) || [])
    .map((row: ModuleRow): Module | null => {
      const id = normalizeText(row.id);
      if (!id) {
        return null;
      }

      const lessonItems = (row.track_lessons || [])
        .map((lessonRow) => normalizeLessonRow(lessonRow))
        .filter(Boolean) as Lesson[];
      const lessons = lessonItems.sort(bySortOrder);

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
    .filter(Boolean) as Module[];
  const modules = moduleItems.sort(bySortOrder);

  let totalLessons = 0;
  let completedLessons = 0;
  let previousModulesCleared = true;
  let nextLesson: { moduleSlug: string; lessonSlug: string; title: string } | null = null;

  for (const mod of modules) {
    const moduleUnlocked = previousModulesCleared;
    let moduleCompletedCount = 0;
    let moduleClearedCount = 0;

    for (const lesson of mod.lessons) {
      totalLessons += 1;

      const progress: LessonProgress | null = progressByLessonId[lesson.id] || null;
      const isCompleted = progress?.status === "completed";

      const lessonHasQuiz = Array.isArray(lesson.quiz) && lesson.quiz.length > 0;
      const lessonHasProject = Boolean(lesson.microProject);
      const submitted = Boolean(progress?.projectSubmittedAt);
      const quizOk = !lessonHasQuiz || progress?.quizPassed === true;
      const projectOk = !lessonHasProject || submitted;
      const isReviewProject = lessonHasProject && lesson.microProject!.validation !== "auto";
      const awaitingReview = isReviewProject && submitted && !isCompleted;
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
        nextLesson = { moduleSlug: mod.slug, lessonSlug: lesson.slug, title: lesson.title };
        lesson.state = "current";
      }
    }

    mod.unlocked = moduleUnlocked;
    mod.completedLessons = moduleCompletedCount;
    mod.totalLessons = mod.lessons.length;
    mod.state = !moduleUnlocked
      ? "locked"
      : mod.lessons.length > 0 && moduleCompletedCount >= mod.lessons.length
        ? "completed"
        : "current";

    if (mod.lessons.length > 0 && moduleClearedCount < mod.lessons.length) {
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

export function findLessonInCurriculum(curriculum: CurriculumResult, lessonSlug: string): FindResult | null {
  const normalizedSlug = normalizeText(lessonSlug).toLowerCase();
  if (!normalizedSlug || !curriculum?.modules?.length) {
    return null;
  }

  const flat: { module: Module; lesson: Lesson }[] = [];
  for (const mod of curriculum.modules) {
    for (const lesson of mod.lessons) {
      flat.push({ module: mod, lesson });
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
