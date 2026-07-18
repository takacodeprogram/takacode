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
