import type { SupabaseClient } from "@supabase/supabase-js";

interface CommunityProject {
  title: string;
  description: string;
  objective: string;
  liveUrl: string;
  repoUrl: string;
  author: string;
  avatarUrl: string;
  track: string;
}

interface CommunityResult {
  projects: CommunityProject[];
  error: Error | null;
  schemaReady: boolean;
}

function normalizeProject(row: unknown): CommunityProject | null {
  if (!row || typeof row !== "object") {
    return null;
  }
  const r = row as Record<string, unknown>;
  return {
    title: typeof r.title === "string" ? r.title : "Projet",
    description: typeof r.description === "string" ? r.description : "",
    objective: typeof r.objective === "string" ? r.objective : "",
    liveUrl: typeof r.live_url === "string" ? r.live_url : "",
    repoUrl: typeof r.repo_url === "string" ? r.repo_url : "",
    author: typeof r.author === "string" && r.author.trim() ? r.author.trim() : "Membre anonyme",
    avatarUrl: typeof r.avatar_url === "string" ? r.avatar_url : "",
    track: typeof r.track === "string" ? r.track : ""
  };
}

export async function getCommunityProjects(supabase: SupabaseClient, limit = 24): Promise<CommunityResult> {
  const { data, error } = await supabase.rpc("community_projects", { p_limit: limit });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    const schemaReady = !(message.includes("function") || message.includes("does not exist"));
    return { projects: [], error, schemaReady };
  }

  const list = Array.isArray(data) ? data : [];
  return { projects: list.map(normalizeProject).filter(Boolean) as CommunityProject[], error: null, schemaReady: true };
}
