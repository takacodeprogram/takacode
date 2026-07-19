import type { SupabaseClient } from "@supabase/supabase-js";

export interface CommunityProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  objective: string;
  liveUrl: string;
  repoUrl: string;
  author: string;
  avatarUrl: string;
  authorId: string;
  track: string;
  firstEuroAt: string | null;
  hasDeclaredFirstEuro: boolean;
  likeCount: number;
  repoIsPublic: boolean;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  parentId: string | null;
  isFlagged: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  authorAvatar: string;
  authorGrade: string;
}

interface CommunityResult {
  projects: CommunityProject[];
  error: Error | null;
  schemaReady: boolean;
}

interface CommentsResult {
  comments: ProjectComment[];
  error: Error | null;
  schemaReady: boolean;
}

interface CommentCreateResult {
  comment: ProjectComment | null;
  error: Error | null;
  schemaReady: boolean;
}

function normalizeProject(row: unknown): CommunityProject | null {
  if (!row || typeof row !== "object") {
    return null;
  }
  const r = row as Record<string, unknown>;
  return {
    id: typeof r.id === "string" ? r.id : "",
    userId: typeof r.user_id === "string" ? r.user_id : "",
    title: typeof r.title === "string" ? r.title : "Projet",
    description: typeof r.description === "string" ? r.description : "",
    objective: typeof r.objective === "string" ? r.objective : "",
    liveUrl: typeof r.live_url === "string" ? r.live_url : "",
    repoUrl: typeof r.repo_url === "string" ? r.repo_url : "",
    author: typeof r.author === "string" && r.author.trim() ? r.author.trim() : "Membre anonyme",
    avatarUrl: typeof r.avatar_url === "string" ? r.avatar_url : "",
    authorId: typeof r.author_id === "string" ? r.author_id : "",
    track: typeof r.track === "string" ? r.track : "",
    firstEuroAt: typeof r.first_euro_at === "string" ? r.first_euro_at : null,
    hasDeclaredFirstEuro: Boolean(r.has_declared_first_euro),
    likeCount: typeof r.like_count === "number" ? r.like_count : 0,
    repoIsPublic: r.repo_is_public !== false
  };
}

function normalizeComment(row: unknown): ProjectComment | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  return {
    id: typeof r.id === "string" ? r.id : "",
    projectId: typeof r.project_id === "string" ? r.project_id : "",
    userId: typeof r.user_id === "string" ? r.user_id : "",
    content: typeof r.content === "string" ? r.content : "",
    parentId: typeof r.parent_id === "string" ? r.parent_id : null,
    isFlagged: Boolean(r.is_flagged),
    isHidden: Boolean(r.is_hidden),
    createdAt: typeof r.created_at === "string" ? r.created_at : "",
    updatedAt: typeof r.updated_at === "string" ? r.updated_at : "",
    author: typeof r.author === "string" ? r.author : "",
    authorAvatar: typeof r.author_avatar === "string" ? r.author_avatar : "",
    authorGrade: typeof r.author_grade === "string" ? r.author_grade : ""
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

export async function getProjectComments(supabase: SupabaseClient, projectId: string, limit = 50): Promise<CommentsResult> {
  const { data, error } = await supabase.rpc("list_project_comments", { p_project_id: projectId, p_limit: limit });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    const schemaReady = !(message.includes("function") || message.includes("does not exist"));
    return { comments: [], error, schemaReady };
  }

  const list = Array.isArray(data) ? data : [];
  return { comments: list.map(normalizeComment).filter(Boolean) as ProjectComment[], error: null, schemaReady: true };
}

export async function createProjectComment(supabase: SupabaseClient, projectId: string, content: string, parentId?: string): Promise<CommentCreateResult> {
  const { data, error } = await supabase.rpc("create_project_comment", { p_project_id: projectId, p_content: content, p_parent_id: parentId ?? null });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    const schemaReady = !(message.includes("function") || message.includes("does not exist"));
    return { comment: null, error, schemaReady };
  }

  const d = data as Record<string, unknown> | null;
  if (!d || d.error) {
    return { comment: null, error: new Error(typeof d?.error === "string" ? d.error : "Erreur création"), schemaReady: true };
  }

  return { comment: normalizeComment(d) as ProjectComment, error: null, schemaReady: true };
}

export type { CommunityProject, ProjectComment };
