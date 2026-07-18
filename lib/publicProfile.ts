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
  bioFormat: string;
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

export async function getPublicProfile(supabase: SupabaseClient, userId: string): Promise<PublicProfileData | null> {
  const { data, error } = await supabase.rpc("get_public_profile", { p_user_id: userId });

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
    memberSince: String(row.created_at || ""),
    bioFormat: String(row.bio_format || "text")
  };
}

export async function getUserPublishedProjects(supabase: SupabaseClient, userId: string): Promise<ProfileProject[]> {
  const { data, error } = await supabase.rpc("get_published_projects", { p_limit: 50 });

  if (error || !data) return [];

  const allProjects = Array.isArray(data) ? data : [];
  const userProjects = allProjects.filter((p: unknown) => (p as Record<string, unknown>)?.author_id === userId);

  const likeCounts = await Promise.all(
    userProjects.map(async (row: unknown) => {
      try {
        const { data: count } = await supabase.rpc("get_project_likes_count", { p_project_id: (row as Record<string, unknown>).id as string });
        return typeof count === "number" ? count : 0;
      } catch {
        return 0;
      }
    })
  );

  return userProjects.map((row: unknown, i: number) => {
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
