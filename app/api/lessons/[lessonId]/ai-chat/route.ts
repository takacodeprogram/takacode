import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { askAI, hasAnyChatProvider, AiError, type ChatMessage } from "../../../../../lib/aiChat";
import { createClient } from "../../../../../utils/supabase/server";
import { apiRateLimit, buildRateLimitKey } from "../../../../../lib/rateLimit";
import { getUserAiConfig, resolveAskOverride } from "../../../../../lib/userAiConfig";

// POST /api/lessons/[lessonId]/ai-chat
// Body: { messages: [{ role: "user"|"assistant", content: string }] }
// Returns: { reply: string, provider: string, model: string }
//
// Contextual assistant : the system prompt is enriched with the current
// lesson's title / intro / why_important / how_to_use / resources so the
// model answers in the frame of the lesson, not generically.

const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 4000;

interface ChatBody {
  messages?: ChatMessage[];
  provider?: string;
}

function safeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatMessage[] = [];
  for (const item of raw.slice(-MAX_MESSAGES)) {
    if (!item || typeof item !== "object") continue;
    const role = (item as ChatMessage).role;
    const content = (item as ChatMessage).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const trimmed = content.trim();
    if (!trimmed) continue;
    out.push({ role, content: trimmed.slice(0, MAX_CONTENT_CHARS) });
  }
  return out;
}

function buildLessonSystemPrompt(lesson: {
  title: string;
  intro?: string | null;
  why_important?: string | null;
  how_to_use?: string | null;
  objectives?: string[] | null;
  resources?: Array<{ label?: string; url?: string; kind?: string; why?: string; how?: string }> | null;
}): string {
  const parts: string[] = [];
  parts.push(
    "Tu es le tuteur IA de TakaCode pour la leçon en cours. Réponds de façon claire, encourageante et pédagogique, en français, en 2 à 5 phrases sauf si l'étudiant demande explicitement plus de détail."
  );
  parts.push(
    "Tu peux expliquer autrement un concept, reformuler, donner un exemple concret, ou proposer un mini-exercice. Ne réponds pas à la place de l'étudiant à son micro-projet — encourage-le à le faire lui-même."
  );
  parts.push(
    "Si l'étudiant sort du sujet de la leçon, reconnecte poliment au sujet. Si tu ne sais pas, dis-le et suggère une ressource officielle."
  );
  parts.push("---");
  parts.push(`Leçon en cours : ${lesson.title}`);
  if (lesson.intro) parts.push(`Intro : ${lesson.intro}`);
  if (lesson.why_important) parts.push(`Pourquoi c'est important : ${lesson.why_important}`);
  if (lesson.how_to_use) parts.push(`Comment procéder : ${lesson.how_to_use}`);
  if (Array.isArray(lesson.objectives) && lesson.objectives.length) {
    parts.push(`Objectifs : ${lesson.objectives.join(" · ")}`);
  }
  if (Array.isArray(lesson.resources) && lesson.resources.length) {
    const compact = lesson.resources
      .slice(0, 6)
      .map((r) => `${r.label || "Ressource"}${r.url ? ` (${r.url})` : ""}`)
      .join(" · ");
    parts.push(`Ressources : ${compact}`);
  }
  return parts.join("\n\n");
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ lessonId: string }> }) {
  if (!hasAnyChatProvider()) {
    return NextResponse.json(
      { error: "ai_not_configured", message: "AI non configurée. Ajoute AI_MISTRAL_API_KEY dans .env.local." },
      { status: 503 }
    );
  }

  const { lessonId } = await ctx.params;
  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "invalid_lesson_id" }, { status: 400 });
  }

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const messages = safeMessages(body?.messages);
  if (!messages.length) {
    return NextResponse.json({ error: "empty_messages" }, { status: 400 });
  }
  if (messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "last_message_must_be_user" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  // Rate limit : réutilise le bucket aiReview (10 req/min/user).
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const rateKey = buildRateLimitKey(user.id, ip);
  const rateResult = apiRateLimit.aiReview.check(rateKey);
  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Trop de messages. Attends une minute puis réessaie." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateResult.resetAt - Date.now()) / 1000)) } }
    );
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("track_lessons")
    .select("id, title, intro, why_important, how_to_use, objectives, resources")
    .eq("id", lessonId)
    .single();

  if (lessonError || !lesson) {
    return NextResponse.json({ error: "lesson_not_found" }, { status: 404 });
  }

  const system = buildLessonSystemPrompt(lesson as Parameters<typeof buildLessonSystemPrompt>[0]);

  const userConfig = await getUserAiConfig(supabase, user.id);
  const override = resolveAskOverride(userConfig, body.provider);

  try {
    const result = await askAI({ system, messages, maxTokens: 800, task: "chat", ...override });
    return NextResponse.json({ reply: result.text, provider: result.provider, model: result.model });
  } catch (e) {
    const err = e as AiError;
    const code = err.code || "UNKNOWN";
    const cta = code === "NO_PROVIDER" || code === "INVALID_KEY" ? "/dashboard/profile" : null;
    const status = code === "NO_PROVIDER" ? 503 : code === "INVALID_KEY" ? 401 : code === "RATE_LIMITED" ? 429 : 502;
    return NextResponse.json(
      { error: "ai_failed", code, message: err.message?.slice(0, 400) || "Erreur IA", cta },
      { status }
    );
  }
}
