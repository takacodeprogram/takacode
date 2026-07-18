import { isMissingSchemaError } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface PublicProject {
  id: string;
  title: string;
  description: string;
  objective: string;
  status: string;
  deadline: string | null;
  repoUrl: string;
  liveUrl: string;
  revenueModel: string;
  templateId: string;
  firstEuroAt: string | null;
  hasDeclaredFirstEuro: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: string;
  avatarUrl: string;
  authorGrade: string;
  track: string;
  trackSlug: string;
  likeCount: number;
  descriptionFormat: string;
}

export async function getPublicProject(supabase: SupabaseClient, projectId: string): Promise<PublicProject | null> {
  const { data, error } = await supabase.rpc("get_public_project", { p_project_id: projectId });

  if (error || !data) return null;

  const r = data as Record<string, unknown>;

  const avatarUrl = String(r.avatar_url || "").startsWith("https://")
    ? String(r.avatar_url)
    : `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(String(r.author || projectId))}`;

  return {
    id: String(r.id || ""),
    title: String(r.title || ""),
    description: String(r.description || ""),
    objective: String(r.objective || ""),
    status: String(r.status || "published"),
    deadline: r.deadline ? String(r.deadline) : null,
    repoUrl: String(r.repo_url || ""),
    liveUrl: String(r.live_url || ""),
    revenueModel: String(r.revenue_model || ""),
    templateId: String(r.template_id || ""),
    firstEuroAt: r.first_euro_at ? String(r.first_euro_at) : null,
    hasDeclaredFirstEuro: Boolean(r.has_declared_first_euro),
    createdAt: String(r.created_at || ""),
    updatedAt: String(r.updated_at || ""),
    authorId: String(r.author_id || ""),
    author: String(r.author || "Membre anonyme"),
    avatarUrl,
    authorGrade: String(r.author_grade || "Starter"),
    track: String(r.track || ""),
    trackSlug: String(r.track_slug || ""),
    likeCount: typeof r.like_count === "number" ? r.like_count : 0,
    descriptionFormat: String(r.description_format || "text")
  };
}
