import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { askAI, hasAnyChatProvider, AiError, type ChatMessage } from "../../../../lib/aiChat";
import { createClient } from "../../../../utils/supabase/server";
import { apiRateLimit, buildRateLimitKey } from "../../../../lib/rateLimit";
import { listOwnProjects } from "../../../../lib/userProjects";
import { listUserTrackEnrollments } from "../../../../lib/tracks";
import { getUserAiConfig, resolveAskOverride } from "../../../../lib/userAiConfig";

// POST /api/assistant/chat
// Assistant IA global. Le prompt système s'adapte au contexte de la page
// (pathname envoyé par le client). Toujours : le user est authentifié +
// on ajoute son projet principal + parcours en cours au system prompt.
//
// Contextes détectés depuis pathname :
//   /dashboard*                          → coach projet global
//   /tracks/[slug]/lesson/[lessonSlug]   → tuteur leçon (charge la leçon)
//   /tracks/[slug]                       → coach track (charge la track)
//   /projects/[id]                       → coach projet public (charge projet)
//   autre (public)                       → coach projet global de l'user

const MAX_MESSAGES = 20;
const MAX_CONTENT_CHARS = 4000;

interface ChatBody {
  messages?: ChatMessage[];
  provider?: string;
  pathname?: string;
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

interface ContextKind {
  kind: "dashboard" | "lesson" | "track" | "project" | "generic";
  trackSlug?: string;
  lessonSlug?: string;
  projectId?: string;
}

function contextRefFromKind(ctx: ContextKind): string {
  if (ctx.kind === "lesson") return ctx.lessonSlug || "";
  if (ctx.kind === "track") return ctx.trackSlug || "";
  if (ctx.kind === "project") return ctx.projectId || "";
  return "";
}

function detectContext(pathname: string | undefined): ContextKind {
  const p = String(pathname || "").split("?")[0].split("#")[0];
  if (!p) return { kind: "generic" };
  // Strip locale prefix (/fr, /en)
  const stripped = p.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";

  const lessonMatch = stripped.match(/^\/tracks\/([^/]+)\/lesson\/([^/]+)/);
  if (lessonMatch) return { kind: "lesson", trackSlug: lessonMatch[1], lessonSlug: lessonMatch[2] };

  const trackMatch = stripped.match(/^\/tracks\/([^/]+)/);
  if (trackMatch) return { kind: "track", trackSlug: trackMatch[1] };

  const projectMatch = stripped.match(/^\/projects\/([^/]+)/);
  if (projectMatch) return { kind: "project", projectId: projectMatch[1] };

  if (stripped.startsWith("/dashboard") || stripped.startsWith("/admin")) {
    return { kind: "dashboard" };
  }

  return { kind: "generic" };
}

async function buildSystem(supabase: any, userId: string, ctx: ContextKind): Promise<string> {
  const [projectsResult, enrollmentsResult] = await Promise.all([
    listOwnProjects(supabase, userId, { limit: 1 }),
    listUserTrackEnrollments(supabase, userId, { limit: 5 })
  ]);
  const project = projectsResult.projects?.[0] || null;
  const enrolled = enrollmentsResult.enrollments || [];

  const parts: string[] = [
    "Tu es le coach IA personnel du membre TakaCode. Réponds en français, court (2-5 phrases), actionnable, sans jargon.",
    "Objectif : l'aider à avancer sur son projet et son apprentissage. Si la question sort du sujet, recentre-le poliment."
  ];

  // Contexte spécifique à la page
  if (ctx.kind === "lesson" && ctx.lessonSlug) {
    const { data: lesson } = await supabase
      .from("track_lessons")
      .select("title, intro, why_important, how_to_use, objectives, resources")
      .eq("slug", ctx.lessonSlug)
      .maybeSingle();
    if (lesson) {
      parts.push(`Page en cours : leçon "${lesson.title}".`);
      if (lesson.intro) parts.push(`Intro : ${lesson.intro}`);
      if (lesson.why_important) parts.push(`Pourquoi c'est important : ${lesson.why_important}`);
      if (lesson.how_to_use) parts.push(`Comment procéder : ${lesson.how_to_use}`);
      if (Array.isArray(lesson.objectives) && lesson.objectives.length) {
        parts.push(`Objectifs : ${lesson.objectives.join(" · ")}`);
      }
      parts.push("Aide-le à comprendre la leçon ; ne fais pas son micro-projet à sa place.");
    }
  } else if (ctx.kind === "track" && ctx.trackSlug) {
    const { data: track } = await supabase
      .from("learning_tracks")
      .select("title, summary, level_label, duration_weeks")
      .eq("slug", ctx.trackSlug)
      .maybeSingle();
    if (track) {
      parts.push(`Page en cours : parcours "${track.title}" (${track.level_label}, ${track.duration_weeks} semaines).`);
      if (track.summary) parts.push(`Résumé : ${track.summary}`);
      parts.push("Aide-le à décider si ce parcours colle à son projet, ou à démarrer.");
    }
  } else if (ctx.kind === "project" && ctx.projectId) {
    const { data: publicProject } = await supabase
      .from("user_projects")
      .select("title, description, objective, revenue_model")
      .eq("id", ctx.projectId)
      .maybeSingle();
    if (publicProject) {
      parts.push(`Page en cours : projet public "${publicProject.title}".`);
      if (publicProject.description) parts.push(`Description : ${publicProject.description.slice(0, 400)}`);
      parts.push("Discute autour de ce projet (inspiration pour le sien, questions techniques).");
    }
  } else if (ctx.kind === "dashboard") {
    parts.push("Page en cours : dashboard membre.");
  } else {
    parts.push("Page en cours : navigation publique.");
  }

  parts.push("---");

  // Contexte user permanent
  if (project) {
    parts.push(`Son projet : ${project.title || "(sans titre)"}`);
    if (project.objective) parts.push(`Objectif du projet : ${project.objective}`);
    if (project.description) parts.push(`Description projet : ${project.description.slice(0, 300)}`);
    if (project.revenueModel) parts.push(`Modèle de revenu : ${project.revenueModel}`);
  } else {
    parts.push("Il n'a pas encore de projet actif — invite-le à en démarrer un si pertinent.");
  }
  if (enrolled.length) {
    parts.push(
      `Ses parcours en cours : ${enrolled
        .map((e: any) => `${e.track?.title || e.trackId}${e.status === "completed" ? " (terminé)" : ""}`)
        .join(", ")}`
    );
  }

  return parts.join("\n");
}

export async function POST(request: NextRequest) {
  if (!hasAnyChatProvider()) {
    return NextResponse.json(
      { error: "ai_not_configured", code: "NO_PROVIDER", message: "AI non configurée.", cta: "/dashboard/profile" },
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
  if (!user) return NextResponse.json({ error: "not_authenticated", code: "NOT_AUTH" }, { status: 401 });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rate = apiRateLimit.aiReview.check(buildRateLimitKey(user.id, ip));
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "rate_limited", code: "RATE_LIMITED", message: "Trop de messages. Attends une minute." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } }
    );
  }

  const ctx = detectContext(body.pathname);
  const system = await buildSystem(supabase, user.id, ctx);

  const userConfig = await getUserAiConfig(supabase, user.id);
  const override = resolveAskOverride(userConfig, body.provider);

  try {
    const result = await askAI({ system, messages, maxTokens: 700, task: "chat", ...override });

    // Persister le dernier message user + la réponse assistant (fire-and-forget
    // pour ne pas ralentir la réponse). RLS garantit self-only.
    const contextRef = contextRefFromKind(ctx);
    const lastUserMsg = messages[messages.length - 1];
    void supabase
      .from("ai_chat_messages")
      .insert([
        {
          user_id: user.id,
          context_kind: ctx.kind,
          context_ref: contextRef,
          role: "user",
          content: lastUserMsg.content
        },
        {
          user_id: user.id,
          context_kind: ctx.kind,
          context_ref: contextRef,
          role: "assistant",
          content: result.text,
          provider: result.provider,
          model: result.model
        }
      ]);

    return NextResponse.json({
      reply: result.text,
      provider: result.provider,
      model: result.model,
      context: ctx.kind
    });
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
