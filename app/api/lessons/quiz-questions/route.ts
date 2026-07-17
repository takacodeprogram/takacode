import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function shuffleArray<T>(array: T[], seedKey: string): T[] {
  const result = [...array];
  const random = seededRandom(hashSeed(seedKey));
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export async function GET(request: NextRequest) {
  const lessonId = request.nextUrl.searchParams.get("lessonId")?.trim();
  if (!lessonId) {
    return NextResponse.json({ error: "missing_lesson_id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  // Fetch all approved questions for this lesson from the bank
  const { data: allQuestions, error: qError } = await supabase
    .from("lesson_quiz_questions")
    .select("id, prompt, choices, difficulty, objective, resource_url")
    .eq("lesson_id", lessonId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (qError) {
    return NextResponse.json({ error: "questions_fetch_failed" }, { status: 500 });
  }

  if (!allQuestions || allQuestions.length === 0) {
    return NextResponse.json({ questions: [], totalAvailable: 0 });
  }

  // Get questions the user has already seen
  const { data: seenQuestions } = await supabase
    .from("user_seen_questions")
    .select("question_id, seen_count")
    .eq("user_id", user.id);

  const seenSet = new Set((seenQuestions || []).map((sq) => sq.question_id));

  // Split into unseen and seen
  const unseen = allQuestions.filter((q) => !seenSet.has(q.id));
  const seen = allQuestions.filter((q) => seenSet.has(q.id));

  // Pick max 10 questions: prefer unseen, then least-seen seen
  const MAX_QUESTIONS = 10;
  let selected: typeof allQuestions;

  if (unseen.length >= MAX_QUESTIONS) {
    selected = shuffleArray(unseen, `${user.id}:${lessonId}:unseen`).slice(0, MAX_QUESTIONS);
  } else {
    const seenSorted = shuffleArray(seen, `${user.id}:${lessonId}:seen`).sort((a, b) => {
      const aCount = (seenQuestions || []).find((sq) => sq.question_id === a.id)?.seen_count || 0;
      const bCount = (seenQuestions || []).find((sq) => sq.question_id === b.id)?.seen_count || 0;
      return aCount - bCount;
    });
    selected = [...shuffleArray(unseen, `${user.id}:${lessonId}:unseen`), ...seenSorted].slice(0, MAX_QUESTIONS);
  }

  // Shuffle choices within each question per user+lesson
  const seedKey = `${user.id}:${lessonId}`;
  const questions = selected.map((q) => {
    const choices = shuffleArray(q.choices as string[], `${seedKey}:${q.id}`);
    return {
      id: q.id,
      prompt: q.prompt,
      choices
    };
  });

  return NextResponse.json({
    questions,
    totalAvailable: allQuestions.length
  });
}
