// Projets construits par le membre (table user_projects, RLS self).

import { normalizeText, isMissingSchemaError, parseCount } from "./utils";

const PROJECT_SELECT =
  "id, track_id, title, description, objective, status, deadline, repo_url, live_url, created_at, updated_at, track:learning_tracks(title, slug)";

export const PROJECT_STATUS = [
  { value: "idea", label: "Idee" },
  { value: "in_progress", label: "En cours" },
  { value: "published", label: "Publie" },
  { value: "archived", label: "Archive" }
];

const PROJECT_TABLES = ["user_projects"];

function normalizeProject(row) {
  if (!row || typeof row !== "object") {
    return null;
  }

  return {
    id: row.id,
    trackId: row.track_id || "",
    title: typeof row.title === "string" ? row.title : "",
    description: typeof row.description === "string" ? row.description : "",
    objective: typeof row.objective === "string" ? row.objective : "",
    status: typeof row.status === "string" ? row.status : "in_progress",
    deadline: row.deadline || "",
    repoUrl: typeof row.repo_url === "string" ? row.repo_url : "",
    liveUrl: typeof row.live_url === "string" ? row.live_url : "",
    trackTitle: typeof row.track?.title === "string" ? row.track.title : "",
    trackSlug: typeof row.track?.slug === "string" ? row.track.slug : "",
    updatedAt: row.updated_at || null
  };
}

export function statusLabel(value) {
  const found = PROJECT_STATUS.find((entry) => entry.value === value);
  return found ? found.label : "En cours";
}

export async function listOwnProjects(supabase, userId) {
  if (!userId) {
    return { projects: [], error: null, schemaReady: true };
  }

  const { data, error } = await supabase
    .from("user_projects")
    .select(PROJECT_SELECT)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    if (isMissingSchemaError(error, PROJECT_TABLES)) {
      return { projects: [], error: null, schemaReady: false };
    }
    return { projects: [], error, schemaReady: true };
  }

  return { projects: (data || []).map(normalizeProject).filter(Boolean), error: null, schemaReady: true };
}

export async function getOwnProject(supabase, userId, projectId) {
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
