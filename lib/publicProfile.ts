import type { SupabaseClient } from "@supabase/supabase-js";

interface PublicProfileData {
  id: string;
  publicName: string;
  avatarUrl: string;
  bio: string;
  grade: string;
  points: number;
  countryCode: string;
  socials: Record<string, string>;
  skills: string[];
  memberSince: string;
}

export interface ProfileProject {
  id: string;
  title: string;
  objective: string;
  liveUrl: string;
  repoUrl: string;
  revenueModel: string;
  hasDeclaredFirstEuro: boolean;
  likeCount: number;
  createdAt: string;
}

const PUBLIC_PROFILE_SELECT = "id, public_name, avatar_url, bio, grade, points, country_code, socials, skills, created_at";

export async function getPublicProfile(supabase: SupabaseClient, userId: string): Promise<PublicProfileData | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select(PUBLIC_PROFILE_SELECT)
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;

  const avatarUrl = String(row.avatar_url || "").startsWith("https://")
    ? String(row.avatar_url)
    : `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(String(row.public_name || userId))}`;

  return {
    id: String(row.id),
    publicName: String(row.public_name || "Membre"),
    avatarUrl,
    bio: String(row.bio || ""),
    grade: String(row.grade || "Starter"),
    points: Number(row.points) || 0,
    countryCode: String(row.country_code || ""),
    socials: (row.socials as Record<string, string>) || {},
    skills: Array.isArray(row.skills) ? row.skills as string[] : [],
    memberSince: String(row.created_at || "")
  };
}

export async function getUserPublishedProjects(supabase: SupabaseClient, userId: string): Promise<ProfileProject[]> {
  const { data, error } = await supabase
    .from("user_projects")
    .select("id, title, objective, live_url, repo_url, revenue_model, has_declared_first_euro, first_euro_at, created_at, updated_at")
    .eq("user_id", userId)
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error || !data) return [];

  const rows = Array.isArray(data) ? data : [];

  const likeCounts = await Promise.all(
    rows.map(async (row) => {
      try {
        const { data } = await supabase.rpc("get_project_likes_count", { p_project_id: (row as Record<string, unknown>).id as string });
        return typeof data === "number" ? data : 0;
      } catch {
        return 0;
      }
    })
  );

  return rows.map((row, i) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id || ""),
      title: String(r.title || ""),
      objective: String(r.objective || ""),
      liveUrl: String(r.live_url || ""),
      repoUrl: String(r.repo_url || ""),
      revenueModel: String(r.revenue_model || ""),
      hasDeclaredFirstEuro: Boolean(r.has_declared_first_euro),
      likeCount: likeCounts[i] || 0,
      createdAt: String(r.created_at || "")
    };
  });
}
