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
  if (data?.validation === "ai" && data?.reviewStatus === "pending") {
    const aiConfig = getAIReviewConfig();
    if (isAIReviewAvailable(aiConfig)) {
      await triggerAIReview(supabase, user, lessonId);
    }
  }

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}

// Declenche une review IA et enregistre le verdict.
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
    return;
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

    // Enregistrer le verdict via la RPC existante
    const { error: reviewError } = await supabase.rpc("submit_project_review", {
      p_author: lessonData.user_id,
      p_lesson: lessonId,
      p_verdict: result.verdict,
      p_comment: result.feedback
    });

    if (reviewError) {
      console.error("AI review save error:", reviewError);
    }
  } catch (err) {
    console.error("AI review error:", err);
    // Fallback : si l'IA echoue, la soumission reste 'pending'
    // et est automatiquement visible dans la file d'attente de revue manuelle.
    // Pas besoin de transition explicite : le RPC list_review_queue inclut
    // les submissions 'pending' avec validation 'ai' ou 'mentor'.
  }
}
