import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";
import { getUserAiConfig } from "../../../../lib/userAiConfig";
import { getServerKeyForProvider } from "../../../../lib/aiChat";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const text = String(body.text || "").trim().slice(0, 2000);
  if (!text) return NextResponse.json({ error: "missing_text" }, { status: 400 });
  const config = await getUserAiConfig(supabase, user.id);
  const apiKey = config.keys.openai || getServerKeyForProvider("openai");
  if (!apiKey) return NextResponse.json({ error: "openai_key_required" }, { status: 503 });

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.AI_TTS_MODEL || "gpt-4o-mini-tts",
      voice: process.env.AI_TTS_VOICE || "coral",
      input: text,
      instructions: "Parle naturellement en français, avec un ton chaleureux et pédagogique.",
      response_format: "mp3"
    })
  });
  if (!response.ok) return NextResponse.json({ error: "speech_failed" }, { status: response.status });
  return new NextResponse(await response.arrayBuffer(), {
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" }
  });
}
