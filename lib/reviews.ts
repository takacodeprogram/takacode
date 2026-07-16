import type { SupabaseClient } from "@supabase/supabase-js";

interface ReviewItem {
  authorId: string;
  author: string;
  avatarUrl: string;
  lessonId: string;
  lessonTitle: string;
  trackTitle: string;
  submission: string;
  brief: string;
  validation: string;
  submittedAt: string | null;
}

interface ReviewQueueResult {
  items: ReviewItem[];
  error: Error | null;
  schemaReady: boolean;
}

function normalize(row: unknown): ReviewItem | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  return {
    authorId: r.author_id as string,
    author: typeof r.author === "string" && r.author.trim() ? r.author.trim() : "Membre anonyme",
    avatarUrl: typeof r.avatar_url === "string" ? r.avatar_url : "",
    lessonId: r.lesson_id as string,
    lessonTitle: typeof r.lesson_title === "string" ? r.lesson_title : "Lecon",
    trackTitle: typeof r.track_title === "string" ? r.track_title : "",
    submission: typeof r.submission === "string" ? r.submission : "",
    brief: typeof r.brief === "string" ? r.brief : "",
    validation: typeof r.validation === "string" ? r.validation : "peer",
    submittedAt: (r.submitted_at as string) || null
  };
}

export async function getReviewQueue(supabase: SupabaseClient, limit = 30): Promise<ReviewQueueResult> {
  const { data, error } = await supabase.rpc("list_review_queue", { p_limit: limit });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    const schemaReady = !(message.includes("function") || message.includes("does not exist"));
    return { items: [], error, schemaReady };
  }

  const list = Array.isArray(data) ? data : [];
  return { items: list.map(normalize).filter(Boolean) as ReviewItem[], error: null, schemaReady: true };
}
