import { normalizeText, isMissingSchemaError, parseCount } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

const PROJECT_SELECT =
  "id, track_id, title, description, objective, status, deadline, repo_url, live_url, revenue_model, created_at, updated_at, track:learning_tracks(title, slug)";

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
  const trackArr = r.track as { title?: string; slug?: string }[] | undefined;
  const track = Array.isArray(trackArr) ? trackArr[0] : undefined;

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
    revenueModel: (r.revenue_model as string) || ""
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

const PUBLIC_PROJECT_SELECT =
  "id, track_id, title, description, objective, status, deadline, repo_url, live_url, revenue_model, created_at, updated_at, track:learning_tracks(title, slug)";

export async function listPublishedProjects(supabase: SupabaseClient, limit = 50): Promise<ProjectListResult> {
  const { data, error } = await supabase
    .from("user_projects")
    .select(PUBLIC_PROJECT_SELECT)
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(Math.min(limit, 100));

  if (error) {
    if (isMissingSchemaError(error, PROJECT_TABLES)) {
      return { projects: [], error: null, schemaReady: false };
    }
    return { projects: [], error, schemaReady: true };
  }

  return { projects: ((data as unknown as ProjectRow[]) || []).map(normalizeProject).filter(Boolean) as UserProject[], error: null, schemaReady: true };
}
