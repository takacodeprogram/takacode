import type { SupabaseClient } from "@supabase/supabase-js";
import { isMissingSchemaError } from "./utils";

interface LikeResult {
  likeCount: number;
  error: Error | null;
}

export async function getProjectLikeCount(supabase: SupabaseClient, projectId: string): Promise<number> {
  const { data, error } = await supabase.rpc("get_project_likes_count", { p_project_id: projectId });
  if (error) return 0;
  return typeof data === "number" ? data : 0;
}

export async function getUserLikedProjects(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const { data, error } = await supabase.rpc("get_user_liked_projects", { p_user_id: userId });
  if (error || !data) return [];
  return Array.isArray(data) ? data.map(String) : [];
}

export async function getVisitorLikedProjects(supabase: SupabaseClient, visitorId: string): Promise<string[]> {
  const { data, error } = await supabase.rpc("get_visitor_liked_projects", { p_visitor_id: visitorId });
  if (error || !data) return [];
  return Array.isArray(data) ? data.map(String) : [];
}

export async function toggleProjectLike(supabase: SupabaseClient, userId: string, projectId: string): Promise<LikeResult> {
  const { data: existing } = await supabase
    .from("project_likes")
    .select("user_id")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .maybeSingle();

  const isLiked = existing !== null;

  if (isLiked) {
    const { error } = await supabase
      .from("project_likes")
      .delete()
      .eq("user_id", userId)
      .eq("project_id", projectId);

    if (error) return { likeCount: 0, error };
  } else {
    const { error } = await supabase
      .from("project_likes")
      .insert({ user_id: userId, project_id: projectId });

    if (error) return { likeCount: 0, error };
  }

  const { data: count } = await supabase.rpc("get_project_likes_count", { p_project_id: projectId });
  return { likeCount: typeof count === "number" ? count : 0, error: null };
}
