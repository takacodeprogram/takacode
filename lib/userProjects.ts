import { normalizeText, isMissingSchemaError, parseCount } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

const PROJECT_SELECT =
  "id, track_id, title, description, objective, status, deadline, repo_url, live_url, revenue_model, template_id, first_euro_at, has_declared_first_euro, description_format, created_at, updated_at, track:learning_tracks(title, slug)";

export interface ProjectStatus {
  value: string;
  label: string;
}

export const PROJECT_STATUS: ProjectStatus[] = [
  { value: "idea", label: "Idee" },
  { value: "in_progress", label: "En cours" },
  { value: "published", label: "Publie" },
  { value: "archived", label: "Archive" }
];

const PROJECT_TABLES = ["user_projects"];

export interface UserProject {
  id: string;
  trackId: string;
  title: string;
  description: string;
  objective: string;
  status: string;
  deadline: string;
  repoUrl: string;
  liveUrl: string;
  trackTitle: string;
  trackSlug: string;
  revenueModel: string;
  templateId: string;
  firstEuroAt: string | null;
  hasDeclaredFirstEuro: boolean;
  descriptionFormat: string;
  updatedAt: string | null;
  publishedAt: string | null;
}

interface ProjectRow {
  id: string;
  track_id: string;
  title: string;
  description: string;
  objective: string;
  status: string;
  deadline: string;
  repo_url: string;
  live_url: string;
  revenue_model: string;
  template_id: string;
  first_euro_at: string;
  has_declared_first_euro: boolean;
  description_format: string;
  track: { title: string; slug: string }[];
  updated_at: string;
}

interface ProjectListResult {
  projects: UserProject[];
  error: Error | null;
  schemaReady: boolean;
}

interface ProjectResult {
  project: UserProject | null;
  error: Error | null;
  schemaReady: boolean;
}

function normalizeProject(row: unknown): UserProject | null {
  if (!row || typeof row !== "object") {
    return null;
  }

  const r = row as Record<string, unknown>;
  const trackRaw = r.track;
  const track = Array.isArray(trackRaw)
    ? (trackRaw as { title?: string; slug?: string }[])[0]
    : (trackRaw as { title?: string; slug?: string } | undefined);

  return {
    id: r.id as string,
    trackId: (r.track_id as string) || "",
    title: typeof r.title === "string" ? r.title : "",
    description: typeof r.description === "string" ? r.description : "",
    objective: typeof r.objective === "string" ? r.objective : "",
    status: typeof r.status === "string" ? r.status : "in_progress",
    deadline: (r.deadline as string) || "",
    repoUrl: typeof r.repo_url === "string" ? r.repo_url : "",
    liveUrl: typeof r.live_url === "string" ? r.live_url : "",
    trackTitle: typeof track?.title === "string" ? track.title : "",
    trackSlug: typeof track?.slug === "string" ? track.slug : "",
    updatedAt: (r.updated_at as string) || null,
    publishedAt: (r.created_at as string) || null,
    revenueModel: (r.revenue_model as string) || "",
    templateId: (r.template_id as string) || "",
    firstEuroAt: (r.first_euro_at as string) || null,
    hasDeclaredFirstEuro: Boolean(r.has_declared_first_euro),
    descriptionFormat: (r.description_format as string) || "text"
  };
}

export function statusLabel(value: string): string {
  const found = PROJECT_STATUS.find((entry) => entry.value === value);
  return found ? found.label : "En cours";
}

export async function listOwnProjects(supabase: SupabaseClient, userId: string | null, options: { limit?: number; offset?: number } = {}): Promise<ProjectListResult> {
  if (!userId) {
    return { projects: [], error: null, schemaReady: true };
  }

  const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 50;
  const offset = Number.isFinite(Number(options.offset)) ? Number(options.offset) : 0;

  let query = supabase
    .from("user_projects")
    .select(PROJECT_SELECT)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (offset > 0) {
    query = query.range(offset, offset + limit - 1);
  } else {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingSchemaError(error, PROJECT_TABLES)) {
      return { projects: [], error: null, schemaReady: false };
    }
    return { projects: [], error, schemaReady: true };
  }

  return { projects: ((data as unknown as ProjectRow[]) || []).map(normalizeProject).filter(Boolean) as UserProject[], error: null, schemaReady: true };
}

export async function getOwnProject(supabase: SupabaseClient, userId: string | null, projectId: string | null): Promise<ProjectResult> {
  if (!userId || !projectId) {
    return { project: null, error: null, schemaReady: true };
  }

  const { data, error } = await supabase
    .from("user_projects")
    .select(PROJECT_SELECT)
    .eq("user_id", userId)
    .eq("id", projectId)
    .maybeSingle();

  if (error) {
    if (isMissingSchemaError(error, PROJECT_TABLES)) {
      return { project: null, error: null, schemaReady: false };
    }
    return { project: null, error, schemaReady: true };
  }

  return { project: normalizeProject(data), error: null, schemaReady: true };
}

export async function listPublishedProjects(supabase: SupabaseClient, limit = 50): Promise<ProjectListResult> {
  const { data, error } = await supabase.rpc("get_published_projects", { p_limit: Math.min(limit, 100) });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    if (message.includes("function") || message.includes("does not exist")) {
      return { projects: [], error: null, schemaReady: false };
    }
    return { projects: [], error, schemaReady: true };
  }

  const list = Array.isArray(data) ? data : [];
  return { projects: list.map(normalizeProject).filter(Boolean) as UserProject[], error: null, schemaReady: true };
}

interface ProjectDeliverable {
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  trackTitle: string;
  trackSlug: string;
  status: string;
  submittedAt: string;
  reviewStatus: string;
}

export async function listProjectDeliverables(supabase: SupabaseClient, userId: string, projectId: string): Promise<ProjectDeliverable[]> {
  const { data, error } = await supabase
    .from("user_lesson_progress")
    .select(`
      lesson_id,
      status,
      project_submitted_at,
      review_status,
      lesson:track_lessons!inner(
        id, title, slug,
        module:track_modules!inner(
          id, title,
          track:learning_tracks!inner(
            id, title, slug
          )
        )
      )
    `)
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .order("project_submitted_at", { ascending: false });

  if (error) {
    console.error("[listProjectDeliverables]", error.message);
    return [];
  }

  return ((data as unknown as Record<string, unknown>[]) || []).map((row) => {
    const lessonArr = Array.isArray(row.lesson) ? row.lesson as Record<string, unknown>[] : [row.lesson as Record<string, unknown>];
    const lesson = lessonArr[0] || {};
    const moduleArr = Array.isArray(lesson.module) ? lesson.module as Record<string, unknown>[] : [lesson.module as Record<string, unknown>];
    const module = moduleArr[0] || {};
    const trackArr = Array.isArray(module.track) ? module.track as Record<string, unknown>[] : [module.track as Record<string, unknown>];
    const track = trackArr[0] || {};
    return {
      lessonId: String(row.lesson_id || ""),
      lessonTitle: String(lesson.title || ""),
      lessonSlug: String(lesson.slug || ""),
      trackTitle: String(track.title || ""),
      trackSlug: String(track.slug || ""),
      status: String(row.status || "in_progress"),
      submittedAt: String(row.project_submitted_at || ""),
      reviewStatus: String(row.review_status || "none")
    };
  });
}
