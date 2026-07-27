import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { askAI, hasAnyChatProvider, AiError, type ChatMessage } from "../../../../lib/aiChat";
import { createClient } from "../../../../utils/supabase/server";
import { apiRateLimit, buildRateLimitKey } from "../../../../lib/rateLimit";
import { listOwnProjects } from "../../../../lib/userProjects";
import { listUserTrackEnrollments } from "../../../../lib/tracks";
import { getUserAiConfig, resolveAskOverride } from "../../../../lib/userAiConfig";

// POST /api/dashboard/ai-chat
// Assistant IA du dashboard : sait qui tu es, ton projet, tes parcours en
// cours, et te conseille personnellement (prochaine étape, blocage, idée
// monétisation, feedback rapide). Distinct du LessonAssistant qui reste
// scoped à une leçon.

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

export async function POST(request: NextRequest) {
  if (!hasAnyChatProvider()) {
    return NextResponse.json(
      { error: "ai_not_configured", message: "AI non configurée." },
      { status: 503 }
    );
  }

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const messages = safeMessages(body?.messages);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "invalid_messages" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const rate = apiRateLimit.aiReview.check(buildRateLimitKey(user.id, ip));
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Trop de messages. Attends une minute." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } }
    );
  }

  // Contexte utilisateur : projet principal + tracks en cours.
  const [projectsResult, enrollmentsResult] = await Promise.all([
    listOwnProjects(supabase, user.id, { limit: 1 }),
    listUserTrackEnrollments(supabase, user.id, { limit: 5 })
  ]);
  const project = projectsResult.projects?.[0] || null;
  const enrolled = enrollmentsResult.enrollments || [];

  const contextLines: string[] = [
    "Tu es le coach IA personnel du membre TakaCode sur son dashboard.",
    "Réponds en français, court (2-5 phrases), actionnable, sans jargon inutile. Encourage la mise en action.",
    "Tu peux : suggérer la prochaine étape sur son projet, débloquer une hésitation, proposer une piste de monétisation, résumer un choix, ou l'orienter vers un parcours utile.",
    "Ne réponds pas aux questions hors sujet ; recentre poliment sur son projet ou son apprentissage."
  ];
  contextLines.push("---");
  if (project) {
    contextLines.push(`Projet en cours : ${project.title || "(sans titre)"}`);
    if (project.objective) contextLines.push(`Objectif : ${project.objective}`);
    if (project.description) contextLines.push(`Description : ${project.description.slice(0, 400)}`);
    if (project.revenueModel) contextLines.push(`Modèle de revenu : ${project.revenueModel}`);
    if (project.status) contextLines.push(`Statut : ${project.status}`);
    if (project.trackTitle) contextLines.push(`Parcours lié au projet : ${project.trackTitle}`);
  } else {
    contextLines.push("Aucun projet actif enregistré — invite-le poliment à en démarrer un.");
  }
  if (enrolled.length) {
    contextLines.push(`Parcours en cours : ${enrolled.map((e) => `${e.track?.title || e.trackId}${e.status === "completed" ? " (terminé)" : ""}`).join(", ")}`);
  }

  const system = contextLines.join("\n");

  const userConfig = await getUserAiConfig(supabase, user.id);
  const override = resolveAskOverride(userConfig, body.provider);

  try {
    const result = await askAI({ system, messages, maxTokens: 700, task: "chat", ...override });
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
