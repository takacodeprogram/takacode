import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

const ERROR_STATUS = {
  not_authenticated: 401,
  lesson_not_found: 404,
  module_locked: 403,
  invalid_answers: 400
};

export async function POST(request) {
  let payload = null;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const lessonId = typeof payload?.lessonId === "string" ? payload.lessonId.trim() : "";
  const answers = Array.isArray(payload?.answers) ? payload.answers : null;

  if (!lessonId || !answers) {
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

  const { data, error } = await supabase.rpc("submit_lesson_quiz", {
    p_lesson_id: lessonId,
    p_answers: answers
  });

  if (error) {
    return NextResponse.json({ error: error.message || "rpc_error" }, { status: 500 });
  }

  const rpcError = typeof data?.error === "string" ? data.error : "";

  if (rpcError) {
    return NextResponse.json({ error: rpcError }, { status: ERROR_STATUS[rpcError] || 400 });
  }

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
