import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { reviewProject, getAIReviewConfig, isAIReviewAvailable } from "../../../../lib/aiReview";
import { createClient } from "../../../../utils/supabase/server";
import { createAdminClient } from "../../../../utils/supabase/admin";

const ERROR_STATUS = {
  not_authenticated: 401,
  lesson_not_found: 404,
  module_locked: 403,
  submission_too_short: 400,
  submission_too_long: 400,
  link_required: 400
};

export async function POST(request: NextRequest) {
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

  console.log(`[PROJECT] Soumission lecon=${lessonId} user=${user.id.substring(0, 8)}...`);

  const { data, error } = await supabase.rpc("submit_lesson_project", {
    p_lesson_id: lessonId,
    p_submission: submission
  });

  if (error) {
    console.error("[PROJECT] RPC error:", error.message);
    return NextResponse.json({ error: error.message || "rpc_error" }, { status: 500 });
  }

  const rpcError = typeof data?.error === "string" ? data.error : "";

  if (rpcError) {
    console.error("[PROJECT] RPC business error:", rpcError);
    return NextResponse.json({ error: rpcError }, { status: ERROR_STATUS[rpcError as keyof typeof ERROR_STATUS] || 400 });
  }

  console.log(`[PROJECT] RPC ok: validation=${data?.validation} reviewStatus=${data?.reviewStatus} status=${data?.status}`);

  // Si le mode de validation est 'ai', declencher automatiquement la review IA.
  let aiReviewResult = null;
  if (data?.validation === "ai" && data?.reviewStatus === "pending") {
    const aiConfig = getAIReviewConfig();
    const aiAvailable = isAIReviewAvailable(aiConfig);
    console.log(`[PROJECT] AI review: available=${aiAvailable} provider=${aiConfig?.provider || "none"}`);

    if (aiAvailable) {
      aiReviewResult = await triggerAIReview(supabase, user, lessonId);
      console.log(`[PROJECT] AI review result:`, aiReviewResult ? `verdict=${aiReviewResult.verdict}` : "null (echec)");
    } else {
      console.log("[PROJECT] AI review: non disponible, en attente de revue manuelle");
    }
  } else if (data?.validation === "auto") {
    console.log("[PROJECT] Mode auto: validation immediate sans review");
  } else if (data?.validation === "ai" && data?.reviewStatus !== "pending") {
    console.log(`[PROJECT] Mode ai mais reviewStatus=${data?.reviewStatus} (deja traite)`);
  }

  // Injecter le resultat de la reponse IA dans la reponse au client.
  const response = { ...data };
  if (aiReviewResult) {
    response.aiReview = {
      verdict: aiReviewResult.verdict,
      feedback: aiReviewResult.feedback,
      available: true
    };
    if (aiReviewResult.verdict === "approved") {
      response.reviewStatus = "approved";
      response.status = "completed";
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
async function triggerAIReview(supabase: Awaited<ReturnType<typeof createClient>>, currentUser: { id: string }, lessonId: string) {
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
    console.error("[AI-REVIEW] Lecon non trouvee:", lessonError?.message);
    return null;
  }

  const lessonArr = Array.isArray(lessonData.lesson) ? lessonData.lesson : [lessonData.lesson];
  const lesson = (lessonArr[0] || {}) as Record<string, unknown>;
  const microProject = (lesson.micro_project || {}) as Record<string, unknown>;
  const steps = Array.isArray(microProject.steps) ? microProject.steps as string[] : [];

  console.log(`[AI-REVIEW] Lecon: "${String(lesson.title || "")}" submission=${(lessonData.project_submission || "").substring(0, 50)}...`);

  try {
    const result = await reviewProject({
      lessonTitle: String(lesson.title || ""),
      projectTitle: String((microProject as Record<string, unknown>).title || ""),
      brief: String((microProject as Record<string, unknown>).brief || ""),
      deliverable: String((microProject as Record<string, unknown>).deliverable || ""),
      steps,
      submission: lessonData.project_submission || ""
    });

    console.log(`[AI-REVIEW] IA verdict: ${result.verdict} feedback=${(result.feedback || "").substring(0, 80)}...`);

    // Un verdict IA ne peut etre enregistre qu'avec la cle serveur.
    const adminSupabase = createAdminClient();
    const { data: reviewData, error: reviewError } = await adminSupabase.rpc("submit_ai_review", {
      p_author: lessonData!.user_id,
      p_lesson: lessonId,
      p_verdict: result.verdict,
      p_comment: result.feedback
    });

    if (!reviewError && reviewData?.ok) {
      console.log("[AI-REVIEW] Enregistre via submit_ai_review");
      // Creer une notification pour l'auteur
      try {
        const verdictLabel = result.verdict === "approved" ? "approuve par l'IA" : "demande des ameliorations";
        await adminSupabase.rpc("create_notification", {
          p_user_id: lessonData.user_id,
          p_type: "review_received",
          p_title: `Review IA : ${verdictLabel}`,
          p_body: result.verdict === "approved"
          ? `L'IA a validé ton travail sur "${String(lesson.title || "")}".`
          : `L'IA a demandé des améliorations sur "${String(lesson.title || "")}". Retraite ton projet.`,
        p_link: `/parcours/lecon/${lessonId}`
      });
    } catch (e) { /* non bloquant */ }
    return { verdict: result.verdict, feedback: result.feedback };
  }

  // Echec d'enregistrement : la soumission reste "pending" et part
    // dans la file de revue manuelle (mentor/admin) — jamais de blocage.
    console.error("[AI-REVIEW] Echec d'enregistrement securise:", reviewError?.message || reviewData?.error);
    return null;
  } catch (err) {
    console.error("[AI-REVIEW] Exception:", err instanceof Error ? err.message : String(err));
    return null;
  }
}
