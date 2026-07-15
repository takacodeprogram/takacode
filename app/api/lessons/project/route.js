import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { reviewProject, getAIReviewConfig, isAIReviewAvailable } from "../../../../lib/aiReview";
import { createClient } from "../../../../utils/supabase/server";

const ERROR_STATUS = {
  not_authenticated: 401,
  lesson_not_found: 404,
  module_locked: 403,
  submission_too_short: 400,
  submission_too_long: 400,
  link_required: 400
};

export async function POST(request) {
  let payload = null;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const lessonId = typeof payload?.lessonId === "string" ? payload.lessonId.trim() : "";
  const submission = typeof payload?.submission === "string" ? payload.submission.trim() : "";

  if (!lessonId || !submission) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("submit_lesson_project", {
    p_lesson_id: lessonId,
    p_submission: submission
  });

  if (error) {
    return NextResponse.json({ error: error.message || "rpc_error" }, { status: 500 });
  }

  const rpcError = typeof data?.error === "string" ? data.error : "";

  if (rpcError) {
    return NextResponse.json({ error: rpcError }, { status: ERROR_STATUS[rpcError] || 400 });
  }

  // Si le mode de validation est 'ai', declencher automatiquement la review IA.
  // On attend la reponse (quelques secondes) pour garantir la fiabilite sur Vercel.
  let aiReviewResult = null;
  if (data?.validation === "ai" && data?.reviewStatus === "pending") {
    const aiConfig = getAIReviewConfig();
    if (isAIReviewAvailable(aiConfig)) {
      aiReviewResult = await triggerAIReview(supabase, user, lessonId);
    }
  }

  // Injecter le resultat de la reponse IA dans la reponse au client.
  const response = { ...data };
  if (aiReviewResult) {
    response.aiReview = {
      verdict: aiReviewResult.verdict,
      feedback: aiReviewResult.feedback,
      available: true
    };
    // Mettre a jour le reviewStatus si l'IA a statue.
    if (aiReviewResult.verdict === "approved") {
      response.reviewStatus = "approved";
      response.status = "completed";
      // Re-fetcher les XP mis a jour par le RPC.
      const { data: updated } = await supabase
        .from("user_lesson_progress")
        .select("xp_awarded, status, review_status")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .single();
      if (updated) {
        response.xpAwarded = updated.xp_awarded || 0;
        response.status = updated.status || response.status;
        response.reviewStatus = updated.review_status || response.reviewStatus;
      }
    } else if (aiReviewResult.verdict === "changes") {
      response.reviewStatus = "changes_requested";
      response.reviewFeedback = aiReviewResult.feedback;
    }
  } else if (data?.validation === "ai" && data?.reviewStatus === "pending") {
    // IA non disponible : informer le client.
    response.aiReview = { available: false };
  }

  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

// Declenche une review IA et enregistre le verdict.
// Essaie d'abord submit_ai_review, sinon fallback sur submit_project_review.
// Retourne le result { verdict, feedback } ou null en cas d'echec total.
async function triggerAIReview(supabase, currentUser, lessonId) {
  // Recuperer les infos de la lecon et de la soumission
  const { data: lessonData, error: lessonError } = await supabase
    .from("user_lesson_progress")
    .select(`
      user_id,
      project_submission,
      lesson:track_lessons!inner(
        id, title, micro_project
      )
    `)
    .eq("lesson_id", lessonId)
    .eq("user_id", currentUser.id)
    .single();

  if (lessonError || !lessonData) {
    console.error("AI review: lecon non trouvee", lessonError);
    return null;
  }

  const lesson = lessonData.lesson;
  const microProject = lesson.micro_project || {};
  const steps = Array.isArray(microProject.steps) ? microProject.steps : [];

  try {
    const result = await reviewProject({
      lessonTitle: lesson.title || "",
      projectTitle: microProject.title || "",
      brief: microProject.brief || "",
      deliverable: microProject.deliverable || "",
      steps,
      submission: lessonData.project_submission || ""
    });

    // Essayer submit_ai_review d'abord (review_method = 'ai')
    const { data: reviewData, error: reviewError } = await supabase.rpc("submit_ai_review", {
      p_author: lessonData.user_id,
      p_lesson: lessonId,
      p_verdict: result.verdict,
      p_comment: result.feedback
    });

    if (!reviewError && reviewData?.ok) {
      return { verdict: result.verdict, feedback: result.feedback };
    }

    // Fallback : si submit_ai_review n'existe pas ou echoue,
    // utiliser submit_project_review avec un commentaire prefixe
    // pour identifier que c'est une review IA.
    const aiPrefix = "[IA automatique] ";
    const prefixedComment = aiPrefix + (result.feedback || "");

    const { error: fallbackError } = await supabase.rpc("submit_project_review", {
      p_author: lessonData.user_id,
      p_lesson: lessonId,
      p_verdict: result.verdict,
      p_comment: prefixedComment
    });

    if (fallbackError) {
      console.error("AI review fallback error:", fallbackError);
      return null;
    }

    return { verdict: result.verdict, feedback: result.feedback };
  } catch (err) {
    console.error("AI review error:", err);
    // Fallback : si l'IA echoue, la soumission reste 'pending'
    // et est automatiquement visible dans la file d'attente de revue manuelle.
    return null;
  }
}
