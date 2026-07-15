import { NextResponse } from "next/server";
import { getAIReviewConfig, isAIReviewAvailable } from "../../../../../lib/aiReview";
import { createClient } from "../../../../../utils/supabase/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  // 1. Config IA
  const aiConfig = getAIReviewConfig();
  const aiAvailable = isAIReviewAvailable(aiConfig);

  // 2. Verifier si submit_ai_review existe
  let submitAiReviewExists = false;
  try {
    const { error } = await supabase.rpc("submit_ai_review", {
      p_author: "00000000-0000-0000-0000-000000000000",
      p_lesson: "00000000-0000-0000-0000-000000000000",
      p_verdict: "approved",
      p_comment: "test"
    });
    // Si pas d'erreur ou erreur "not_pending" ou "not_reviewable", la fonction existe
    submitAiReviewExists = !error || error.message?.includes("not_pending") || error.message?.includes("not_reviewable") || error.message?.includes("invalid");
  } catch (e) {
    submitAiReviewExists = false;
  }

  // 3. Verifier si list_review_history existe
  let listReviewHistoryExists = false;
  try {
    const { error } = await supabase.rpc("list_review_history", { p_limit: 1 });
    listReviewHistoryExists = !error || !error.message?.includes("does not exist");
  } catch (e) {
    listReviewHistoryExists = false;
  }

  // 4. Compter les micro-projets avec validation ai vs auto
  let aiCount = 0;
  let autoCount = 0;
  try {
    const { data: lessons } = await supabase
      .from("track_lessons")
      .select("micro_project")
      .not("micro_project", "eq", "{}");

    if (Array.isArray(lessons)) {
      for (const lesson of lessons) {
        const mp = lesson.micro_project || {};
        const validation = mp.validation || "auto";
        if (validation === "ai") aiCount++;
        else autoCount++;
      }
    }
  } catch (e) {
    // ignore
  }

  // 5. Compter les reviews dans project_reviews
  let reviewCount = 0;
  try {
    const { count } = await supabase
      .from("project_reviews")
      .select("*", { count: "exact", head: true });
    reviewCount = count || 0;
  } catch (e) {
    // ignore
  }

  // 6. Compter les projets soumis en attente
  let pendingCount = 0;
  try {
    const { count } = await supabase
      .from("user_lesson_progress")
      .select("*", { count: "exact", head: true })
      .not("project_submitted_at", "is", null)
      .eq("review_status", "pending");
    pendingCount = count || 0;
  } catch (e) {
    // ignore
  }

  return NextResponse.json({
    authenticated: Boolean(user),
    aiConfig: {
      provider: aiConfig?.provider || "none",
      available: aiAvailable,
      hasApiKey: Boolean(aiConfig?.apiKey),
      model: aiConfig?.model || "default"
    },
    database: {
      submitAiReviewExists,
      listReviewHistoryExists,
      microProjectsAi: aiCount,
      microProjectsAuto: autoCount,
      totalReviews: reviewCount,
      pendingSubmissions: pendingCount
    },
    env: {
      AI_REVIEW_PROVIDER: process.env.AI_REVIEW_PROVIDER || "(not set)",
      AI_REVIEW_API_KEY: process.env.AI_REVIEW_API_KEY ? "(set)" : "(not set)",
      AI_REVIEW_OPENROUTER_API_KEY: process.env.AI_REVIEW_OPENROUTER_API_KEY ? "(set)" : "(not set)"
    }
  });
}
