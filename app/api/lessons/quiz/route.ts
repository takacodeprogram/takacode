import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

const ERROR_STATUS = {
  not_authenticated: 401,
  lesson_not_found: 404,
  module_locked: 403,
  invalid_answers: 400
};

export async function POST(request: NextRequest) {
  let payload = null;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const lessonId = typeof payload?.lessonId === "string" ? payload.lessonId.trim() : "";
  const answerTexts = Array.isArray(payload?.answers) ? payload.answers : null;

  if (!lessonId || !answerTexts || !answerTexts.every((answer: unknown) => typeof answer === "string")) {
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

  const { data: lesson, error: lessonError } = await supabase
    .from("track_lessons")
    .select("quiz")
    .eq("id", lessonId)
    .maybeSingle();

  const quiz = Array.isArray(lesson?.quiz) ? lesson.quiz : [];
  if (lessonError || !lesson || quiz.length !== answerTexts.length) {
    return NextResponse.json({ error: lessonError ? "lesson_not_found" : "invalid_answers" }, { status: lessonError ? 404 : 400 });
  }

  const answers = quiz.map((question: unknown, questionIndex: number) => {
    if (!question || typeof question !== "object") return -1;
    const choices = Array.isArray((question as Record<string, unknown>).choices)
      ? (question as Record<string, unknown>).choices as unknown[]
      : [];
    return choices.findIndex((choice) => choice === answerTexts[questionIndex]);
  });

  if (answers.some((answer) => answer < 0)) {
    return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("submit_lesson_quiz", {
    p_lesson_id: lessonId,
    p_answers: answers
  });

  if (error) {
    return NextResponse.json({ error: error.message || "rpc_error" }, { status: 500 });
  }

  const rpcError = typeof data?.error === "string" ? data.error : "";

  if (rpcError) {
    return NextResponse.json({ error: rpcError }, { status: ERROR_STATUS[rpcError as keyof typeof ERROR_STATUS] || 400 });
  }

  const feedback = Array.isArray(data?.feedback)
    ? data.feedback.map((item: unknown, questionIndex: number) => {
        const source = item && typeof item === "object" ? item as Record<string, unknown> : {};
        const question = quiz[questionIndex] && typeof quiz[questionIndex] === "object"
          ? quiz[questionIndex] as Record<string, unknown>
          : {};
        const choices = Array.isArray(question.choices) ? question.choices : [];
        const correctIndex = Number(source.answer);

        return {
          correct: source.correct === true,
          explanation: typeof source.explanation === "string" ? source.explanation : "",
          correctChoice: typeof choices[correctIndex] === "string" ? choices[correctIndex] : ""
        };
      })
    : [];

  return NextResponse.json({ ...data, feedback }, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
