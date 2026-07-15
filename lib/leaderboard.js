// Leaderboard public via la RPC public_leaderboard (aucune donnee sensible).
// La RPC filtre deja les admins (role <> 'admin').

function normalizeEntry(row) {
  if (!row || typeof row !== "object") {
    return null;
  }
  return {
    rank: Number.isFinite(Number(row.rank)) ? Number(row.rank) : 0,
    publicName: typeof row.public_name === "string" && row.public_name.trim() ? row.public_name.trim() : "Membre anonyme",
    points: Number.isFinite(Number(row.points)) ? Number(row.points) : 0,
    grade: typeof row.grade === "string" && row.grade.trim() ? row.grade : "Starter",
    avatarUrl: typeof row.avatar_url === "string" ? row.avatar_url : ""
  };
}

export async function getPublicLeaderboard(supabase, limit = 50) {
  const { data, error } = await supabase.rpc("public_leaderboard", { p_limit: limit });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    const schemaReady = !(message.includes("function") || message.includes("does not exist"));
    return { entries: [], error, schemaReady };
  }

  const list = Array.isArray(data) ? data : [];
  return { entries: list.map(normalizeEntry).filter(Boolean), error: null, schemaReady: true };
}
