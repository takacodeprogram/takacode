// Projets publiés dans la communauté via la RPC community_projects.

function normalizeProject(row) {
  if (!row || typeof row !== "object") {
    return null;
  }
  return {
    title: typeof row.title === "string" ? row.title : "Projet",
    description: typeof row.description === "string" ? row.description : "",
    objective: typeof row.objective === "string" ? row.objective : "",
    liveUrl: typeof row.live_url === "string" ? row.live_url : "",
    repoUrl: typeof row.repo_url === "string" ? row.repo_url : "",
    author: typeof row.author === "string" && row.author.trim() ? row.author.trim() : "Membre anonyme",
    avatarUrl: typeof row.avatar_url === "string" ? row.avatar_url : "",
    track: typeof row.track === "string" ? row.track : ""
  };
}

export async function getCommunityProjects(supabase, limit = 24) {
  const { data, error } = await supabase.rpc("community_projects", { p_limit: limit });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    const schemaReady = !(message.includes("function") || message.includes("does not exist"));
    return { projects: [], error, schemaReady };
  }

  const list = Array.isArray(data) ? data : [];
  return { projects: list.map(normalizeProject).filter(Boolean), error: null, schemaReady: true };
}
