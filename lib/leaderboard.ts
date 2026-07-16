import type { SupabaseClient } from "@supabase/supabase-js";

interface LeaderboardEntry {
  rank: number;
  publicName: string;
  points: number;
  grade: string;
  avatarUrl: string;
}

interface LeaderboardResult {
  entries: LeaderboardEntry[];
  error: Error | null;
  schemaReady: boolean;
}

function normalizeEntry(row: unknown): LeaderboardEntry | null {
  if (!row || typeof row !== "object") {
    return null;
  }
  const r = row as Record<string, unknown>;
  return {
    rank: Number.isFinite(Number(r.rank)) ? Number(r.rank) : 0,
    publicName: typeof r.public_name === "string" && r.public_name.trim() ? r.public_name.trim() : "Membre anonyme",
    points: Number.isFinite(Number(r.points)) ? Number(r.points) : 0,
    grade: typeof r.grade === "string" && r.grade.trim() ? r.grade : "Starter",
    avatarUrl: typeof r.avatar_url === "string" ? r.avatar_url : ""
  };
}

export async function getPublicLeaderboard(supabase: SupabaseClient, limit = 50): Promise<LeaderboardResult> {
  const { data, error } = await supabase.rpc("public_leaderboard", { p_limit: limit });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    const schemaReady = !(message.includes("function") || message.includes("does not exist"));
    return { entries: [], error, schemaReady };
  }

  const list = Array.isArray(data) ? data : [];
  return { entries: list.map(normalizeEntry).filter(Boolean) as LeaderboardEntry[], error: null, schemaReady: true };
}
