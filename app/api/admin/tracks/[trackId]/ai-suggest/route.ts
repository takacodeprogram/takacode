import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { askAI, hasAnyChatProvider, type ChatMessage } from "../../../../../../lib/aiChat";
import { createClient } from "../../../../../../utils/supabase/server";
import { getUserAccessContext } from "../../../../../../lib/auth";
import { apiRateLimit, buildRateLimitKey } from "../../../../../../lib/rateLimit";
import { getUserAiConfig, resolveAskOverride } from "../../../../../../lib/userAiConfig";

// POST /api/admin/tracks/[trackId]/ai-suggest
// Return : { suggestions: TrackSuggestions, provider, model }
// Admin-only. Rassemble le track + ses modules + leçons puis demande à l'IA
// des suggestions d'amélioration structurées (JSON strict).

interface LessonBrief {
  slug: string;
  title: string;
  intro?: string;
  objectives?: string[];
  resources_count?: number;
  quiz_count?: number;
  has_micro_project?: boolean;
}

interface ModuleBrief {
  slug: string;
  title: string;
  summary?: string;
  lessons: LessonBrief[];
}

interface TrackBrief {
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  level_label?: string;
  duration_weeks?: number;
  locale?: string;
  modules: ModuleBrief[];
}

const SUGGEST_SYSTEM = `Tu es un directeur pédagogique senior. Un admin de TakaCode te partage la structure d'un parcours (titre, description, modules, leçons) et te demande des améliorations concrètes et actionnables.

Réponds UNIQUEMENT en JSON strict, sans markdown, dans cette forme :
{
  "summary_verdict": "one_line_overall_diagnosis",
  "title_and_pitch": [ "suggestion 1", "..." ],
  "structure": [ "suggestion 1", "..." ],
  "missing_lessons": [ { "module_slug": "...", "proposed_lesson_title": "...", "why": "..." } ],
  "quiz_and_projects": [ "..." ],
  "resources": [ "..." ],
  "priority_actions": [ { "impact": "high|medium|low", "action": "..." } ]
}

Règles :
- Sois concret : un admin doit pouvoir agir sur chaque suggestion en 10 minutes.
- Reste bienveillant mais franc : si un module est faible, dis-le et propose une refonte.
- Max 5 items par tableau. Priorité aux gains les plus visibles pour l'apprenant.
- Ne réécris pas le contenu ; propose la direction.
- N'invente pas de fait chiffré.`;

function buildTrackBrief(track: any, modules: any[], lessons: any[]): TrackBrief {
  const byModule = new Map<string, LessonBrief[]>();
  for (const l of lessons) {
    const arr = byModule.get(l.module_id) || [];
    arr.push({
      slug: l.slug,
      title: l.title,
      intro: typeof l.intro === "string" ? l.intro.slice(0, 240) : undefined,
      objectives: Array.isArray(l.objectives) ? l.objectives.slice(0, 4) : undefined,
      resources_count: Array.isArray(l.resources) ? l.resources.length : 0,
      quiz_count: Array.isArray(l.quiz) ? l.quiz.length : 0,
      has_micro_project: Boolean(l.micro_project && typeof l.micro_project === "object")
    });
    byModule.set(l.module_id, arr);
  }
  const briefModules: ModuleBrief[] = modules.map((m) => ({
    slug: m.slug,
    title: m.title,
    summary: typeof m.summary === "string" ? m.summary.slice(0, 240) : undefined,
    lessons: byModule.get(m.id) || []
  }));
  return {
    slug: track.slug,
    title: track.title,
    summary: typeof track.summary === "string" ? track.summary.slice(0, 320) : undefined,
    description: typeof track.description === "string" ? track.description.slice(0, 800) : undefined,
    level_label: track.level_label,
    duration_weeks: track.duration_weeks,
    locale: track.locale,
    modules: briefModules
  };
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ trackId: string }> }) {
  if (!hasAnyChatProvider()) {
    return NextResponse.json(
      { error: "ai_not_configured", message: "AI non configurée. Ajoute AI_MISTRAL_API_KEY dans .env.local." },
      { status: 503 }
    );
  }

  const { trackId } = await ctx.params;
  if (!trackId) return NextResponse.json({ error: "invalid_track_id" }, { status: 400 });

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const access = await getUserAccessContext(supabase, user);
  if (!access.hasRole(["admin"])) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const rate = apiRateLimit.aiReview.check(buildRateLimitKey(user.id, ip));
  if (!rate.allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const [{ data: track, error: trackError }, { data: modules }, { data: lessons }] = await Promise.all([
    supabase.from("learning_tracks").select("*").eq("id", trackId).single(),
    supabase.from("track_modules").select("id, slug, title, summary, sort_order").eq("track_id", trackId).order("sort_order"),
    // fetch lessons for all modules in one query
    supabase.from("track_lessons").select("id, module_id, slug, title, intro, objectives, resources, quiz, micro_project, sort_order")
      .in("module_id", (await supabase.from("track_modules").select("id").eq("track_id", trackId)).data?.map((m) => m.id) || [])
      .order("sort_order")
  ]);

  if (trackError || !track) return NextResponse.json({ error: "track_not_found" }, { status: 404 });

  const brief = buildTrackBrief(track, modules || [], lessons || []);

  const userMessage: ChatMessage = {
    role: "user",
    content: `Voici le parcours à analyser (JSON) :\n\n\`\`\`json\n${JSON.stringify(brief, null, 2)}\n\`\`\`\n\nProduis les suggestions au format exigé.`
  };

  const userConfig = await getUserAiConfig(supabase, user.id);
  const override = resolveAskOverride(userConfig);

  try {
    const result = await askAI({ system: SUGGEST_SYSTEM, messages: [userMessage], maxTokens: 1600, ...override });
    let suggestions: unknown = null;
    try {
      const match = result.text.match(/\{[\s\S]*\}/);
      suggestions = JSON.parse(match ? match[0] : result.text);
    } catch {
      // Return raw text if parsing failed — admin can still read it.
      suggestions = { raw: result.text };
    }
    return NextResponse.json({ suggestions, provider: result.provider, model: result.model });
  } catch (e) {
    return NextResponse.json(
      { error: "ai_failed", message: (e as Error).message.slice(0, 300) },
      { status: 502 }
    );
  }
}
