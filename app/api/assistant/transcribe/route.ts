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

  const config = await getUserAiConfig(supabase, user.id);
  const apiKey = config.keys.openai || getServerKeyForProvider("openai");
  if (!apiKey) return NextResponse.json({ error: "openai_key_required", message: "Ajoute une clé OpenAI pour la transcription vocale." }, { status: 503 });

  const incoming = await request.formData().catch(() => null);
  const audio = incoming?.get("audio");
  if (!(audio instanceof File) || audio.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "invalid_audio" }, { status: 400 });
  }

  const form = new FormData();
  form.append("file", audio, audio.name || "voice.webm");
  form.append("model", process.env.AI_TRANSCRIBE_MODEL || "gpt-4o-transcribe");
  form.append("language", "fr");
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return NextResponse.json({ error: "transcription_failed", message: detail.slice(0, 300) }, { status: response.status });
  }
  const result = await response.json();
  return NextResponse.json({ text: String(result.text || "") });
}
