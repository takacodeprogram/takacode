import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { reviewProject, getAIReviewConfig, isAIReviewAvailable } from "../../../../lib/aiReview";
import { createClient } from "../../../../utils/supabase/server";

// Declenche une revue IA sur un micro-projet soumis.
// Post-condition : le verdict est enregistre via submit_project_review RPC.
export async function POST(request) {
  let payload = null;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const lessonId = typeof payload?.lessonId === "string" ? payload.lessonId.trim() : "";
  const userId = typeof payload?.userId === "string" ? payload.userId.trim() : "";

  if (!lessonId || !userId) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  // Verifier la config IA
  const config = getAIReviewConfig();
  if (!isAIReviewAvailable(config)) {
    return NextResponse.json(
      { error: "ai_not_configured", message: "AI review non configuree. Ajoute AI_REVIEW_API_KEY dans .env.local" },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  // Verifier le role (admin/mentor seulement pour declencher une review IA)
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "mentor"].includes(profile.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    // Recuperer les infos de la lecon et la soumission
    const { data: lessonData, error: lessonError } = await supabase
      .from("user_lesson_progress")
      .select(`
        project_submission,
        lesson:track_lessons!inner(
          id, title, micro_project
        )
      `)
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .single();

    if (lessonError || !lessonData) {
      return NextResponse.json({ error: "submission_not_found" }, { status: 404 });
    }

    const lesson = lessonData.lesson;
    const submission = lessonData.project_submission || "";
    const microProject = lesson.micro_project || {};
    const steps = Array.isArray(microProject.steps) ? microProject.steps : [];

    if (!submission) {
      return NextResponse.json({ error: "no_submission" }, { status: 400 });
    }

    // Lancer la review IA
    const result = await reviewProject({
      lessonTitle: lesson.title || "",
      projectTitle: microProject.title || "",
      brief: microProject.brief || "",
      deliverable: microProject.deliverable || "",
      steps,
      submission
    });

    // Enregistrer le verdict via la RPC existante
    const { data: reviewResult, error: reviewError } = await supabase.rpc("submit_project_review", {
      p_author: userId,
      p_lesson: lessonId,
      p_verdict: result.verdict,
      p_comment: result.feedback
    });

    if (reviewError || reviewResult?.error) {
      console.error("Erreur enregistrement review IA:", reviewResult?.error || reviewError);
      return NextResponse.json(
        { error: "review_save_failed", message: reviewResult?.error || reviewError?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reviewed: true,
      verdict: result.verdict,
      feedback: result.feedback
    });
  } catch (err) {
    console.error("AI review error:", err);
    return NextResponse.json(
      { error: "ai_review_failed", message: err.message || "Erreur lors de la revue IA" },
      { status: 500 }
    );
  }
}
