// File de revue des micro-projets (RPC list_review_queue).

function normalize(row) {
  if (!row || typeof row !== "object") return null;
  return {
    authorId: row.author_id,
    author: typeof row.author === "string" && row.author.trim() ? row.author.trim() : "Membre anonyme",
    avatarUrl: typeof row.avatar_url === "string" ? row.avatar_url : "",
    lessonId: row.lesson_id,
    lessonTitle: typeof row.lesson_title === "string" ? row.lesson_title : "Lecon",
    trackTitle: typeof row.track_title === "string" ? row.track_title : "",
    submission: typeof row.submission === "string" ? row.submission : "",
    brief: typeof row.brief === "string" ? row.brief : "",
    validation: typeof row.validation === "string" ? row.validation : "peer",
    submittedAt: row.submitted_at || null
  };
}

export async function getReviewQueue(supabase, limit = 30) {
  const { data, error } = await supabase.rpc("list_review_queue", { p_limit: limit });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    const schemaReady = !(message.includes("function") || message.includes("does not exist"));
    return { items: [], error, schemaReady };
  }

  const list = Array.isArray(data) ? data : [];
  return { items: list.map(normalize).filter(Boolean), error: null, schemaReady: true };
}
