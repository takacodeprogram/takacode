import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { reviewProject, getAIReviewConfig, isAIReviewAvailable } from "../../../../lib/aiReview";
import { createClient } from "../../../../utils/supabase/server";
import { createAdminClient } from "../../../../utils/supabase/admin";
import { apiRateLimit, buildRateLimitKey } from "../../../../lib/rateLimit";
import { projectSubmissionSchema, parseAndValidateBody } from "../../../../lib/validation";

const ERROR_STATUS = {
  not_authenticated: 401,
  lesson_not_found: 404,
  module_locked: 403,
  submission_too_short: 400,
  submission_too_long: 400,
  link_required: 400
};

export async function POST(request: NextRequest) {
  const parsed = await parseAndValidateBody(projectSubmissionSchema, request);
  if (!parsed.success) return parsed.response;

  const { lessonId, submission, projectId } = parsed.data;

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  // Rate limiting : 20 soumissions/min par utilisateur
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const rateKey = buildRateLimitKey(user.id, ip);
  const rateResult = apiRateLimit.projectSubmission.check(rateKey);

  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Trop de soumissions. Patiente une minute." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateResult.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0"
        }
      }
    );
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

  // Lier la soumission au projet membre.
  if (projectId) {
    const { error: linkError } = await supabase
      .from("user_lesson_progress")
      .update({ project_id: projectId })
      .eq("lesson_id", lessonId)
      .eq("user_id", user.id);
    if (linkError) {
      console.error("[PROJECT] link project error:", linkError.message);
    } else {
      console.log(`[PROJECT] Lie au projet ${projectId.substring(0, 8)}...`);
    }
  }

  // Si le mode de validation est 'ai', declencher automatiquement la review IA.
  let aiReviewResult = null;
  let aiAttempted = false;
  if (data?.validation === "ai" && data?.reviewStatus === "pending") {
    const aiConfig = getAIReviewConfig();
    const aiAvailable = isAIReviewAvailable(aiConfig);
    console.log(`[PROJECT] AI review: available=${aiAvailable} provider=${aiConfig?.provider || "none"}`);

    if (aiAvailable) {
      aiAttempted = true;
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
    // failed=true : l'IA a ete tentee mais a echoue (rate limit, enregistrement...).
    // available=false seul : aucune IA configuree. Dans les deux cas la soumission
    // reste en attente et part en revue manuelle.
    response.aiReview = { available: false, failed: aiAttempted };
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
        id, title, slug, micro_project,
        module:track_modules!inner(
          track:learning_tracks!inner(slug)
        )
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
  const lessonSlug = String(lesson.slug || "");
  const moduleArr = Array.isArray(lesson.module) ? lesson.module as Record<string, unknown>[] : [lesson.module as Record<string, unknown>];
  const module = moduleArr[0] || {};
  const trackArr = Array.isArray(module.track) ? module.track as Record<string, unknown>[] : [module.track as Record<string, unknown>];
  const track = trackArr[0] || {};
  const trackSlug = String(track.slug || "");
  const notificationLink = trackSlug && lessonSlug ? `/tracks/${trackSlug}/lesson/${lessonSlug}` : `/tracks`;
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
        p_link: notificationLink
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
