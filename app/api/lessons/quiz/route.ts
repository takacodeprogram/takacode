import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

const ERROR_STATUS: Record<string, number> = {
  not_authenticated: 401,
  lesson_not_found: 404,
  module_locked: 403,
  invalid_answers: 400,
  questions_fetch_failed: 500
};

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown> | null = null;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const lessonId = typeof payload?.lessonId === "string" ? payload.lessonId.trim() : "";
  const answers = Array.isArray(payload?.answers) ? payload.answers : null;

  if (!lessonId || !answers || !answers.every((a: unknown) => a && typeof a === "object" && typeof (a as Record<string, unknown>).questionId === "string" && typeof (a as Record<string, unknown>).choice === "string")) {
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

  // Load questions from the bank to resolve correctness
  const questionIds = answers.map((a: { questionId: string }) => a.questionId);
  const { data: questions, error: qError } = await supabase
    .from("lesson_quiz_questions")
    .select("id, choices, correct_answer")
    .eq("lesson_id", lessonId)
    .in("id", questionIds);

  if (qError || !questions || questions.length === 0) {
    return NextResponse.json({ error: "questions_fetch_failed" }, { status: 500 });
  }

  const questionsMap = new Map(questions.map((q) => [q.id, q]));

  const bankAnswers = answers.map((a: { questionId: string; choice: string }) => {
    const question = questionsMap.get(a.questionId);
    if (!question) return { questionId: a.questionId, answer: -1 };
    const choiceIndex = (question.choices as string[]).findIndex((c) => c === a.choice);
    return { questionId: a.questionId, answer: choiceIndex };
  });

  if (bankAnswers.some((a: { answer: number }) => a.answer < 0)) {
    return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("submit_lesson_quiz_from_bank", {
    p_lesson_id: lessonId,
    p_answers: JSON.stringify(bankAnswers.map((a: { questionId: string; answer: number }) => ({
      question_id: a.questionId,
      answer: a.answer
    }))),
    p_question_ids: questionIds
  });

  if (error) {
    return NextResponse.json({ error: error.message || "rpc_error" }, { status: 500 });
  }

  const rpcError = typeof data?.error === "string" ? data.error : "";

  if (rpcError) {
    return NextResponse.json({ error: rpcError }, { status: ERROR_STATUS[rpcError] || 400 });
  }

  const feedback = Array.isArray(data?.feedback)
    ? (data.feedback as Record<string, unknown>[]).map((item, questionIndex) => {
        const question = questionsMap.get(answers[questionIndex].questionId);
        const choices = (question?.choices as string[]) || [];
        const correctIndex = Number(item.answer);

        return {
          correct: item.correct === true,
          explanation: typeof item.explanation === "string" ? item.explanation : "",
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
