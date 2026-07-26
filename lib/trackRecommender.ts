// Recommande les tracks les plus pertinents pour aider un user à mener son
// projet en cours. Utilise Mistral (via lib/aiChat) pour scorer les tracks
// selon le projet, avec fallback rule-based (guidance order) si l'IA échoue.

import { askAI } from "./aiChat";
import { getTrackGuidance } from "./trackGuidance";
import type { AskOverride } from "./userAiConfig";

export interface RecommenderTrack {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  level?: string;
}

export interface RecommenderProject {
  title?: string;
  description?: string;
  objective?: string;
  revenueModel?: string;
  currentTrackSlug?: string;
}

export interface RecommendedTrack extends RecommenderTrack {
  priority: number;   // 1 = highest
  reason: string;     // short human-readable why
}

// Slugs foundational — toujours inclus même si l'IA ne les propose pas.
const FOUNDATIONAL_SLUGS_FR = ["ia-fondamentaux", "bases-internet"];
const FOUNDATIONAL_SLUGS_EN = ["ai-foundations-en"];

function foundationalFor(locale: string): string[] {
  return locale === "en" ? FOUNDATIONAL_SLUGS_EN : FOUNDATIONAL_SLUGS_FR;
}

interface ScoredSlug {
  slug: string;
  priority: number;
  reason: string;
}

function parseAIResponse(text: string): ScoredSlug[] {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const arr = JSON.parse(match[0]);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => ({
        slug: typeof item?.slug === "string" ? item.slug.trim() : "",
        priority: Number.isFinite(Number(item?.priority)) ? Number(item.priority) : 99,
        reason: typeof item?.reason === "string" ? item.reason.slice(0, 240) : ""
      }))
      .filter((item) => item.slug);
  } catch {
    return [];
  }
}

function buildSystem(locale: string): string {
  if (locale === "en") {
    return [
      "You are a curriculum advisor for TakaCode, a project-first learning platform.",
      "The user has a project they are actively building. You will be given the project (title, description, objective, revenue model) AND a catalog of available tracks.",
      "Return a JSON array of the tracks most useful to help them complete AND monetize their project, sorted by priority (1 = highest, up to 5 max besides foundational tracks).",
      "Always favor tracks that unblock concrete competencies for their exact project. Ignore tracks that are irrelevant to what they are building.",
      "Answer format — JSON only, no markdown:",
      '[{"slug":"track-slug","priority":1,"reason":"one short sentence why this helps THIS project"}, ...]'
    ].join("\n");
  }
  return [
    "Tu es un conseiller pédagogique pour TakaCode, une plateforme d'apprentissage par projet.",
    "L'utilisateur a un projet en cours. Tu reçois le projet (titre, description, objectif, modèle de revenu) ET un catalogue de parcours disponibles.",
    "Renvoie un tableau JSON des parcours les plus utiles pour l'aider à FINIR et MONÉTISER son projet, triés par priorité (1 = plus haute, 5 max hors fondamentaux).",
    "Privilégie les parcours qui débloquent des compétences concrètes pour SON projet précis. Ignore les parcours sans lien direct.",
    "Format de réponse — JSON uniquement, pas de markdown :",
    '[{"slug":"slug-parcours","priority":1,"reason":"une phrase courte pourquoi cela aide CE projet"}, ...]'
  ].join("\n");
}

function buildUserPrompt(project: RecommenderProject, catalog: RecommenderTrack[]): string {
  const proj = [
    `Title: ${project.title || "(untitled)"}`,
    project.objective ? `Objective: ${project.objective}` : null,
    project.description ? `Description: ${project.description.slice(0, 400)}` : null,
    project.revenueModel ? `Revenue model: ${project.revenueModel}` : null,
    project.currentTrackSlug ? `Currently enrolled in track: ${project.currentTrackSlug}` : null
  ]
    .filter(Boolean)
    .join("\n");

  const cat = catalog
    .map((t) => `- ${t.slug}${t.level ? ` (${t.level})` : ""}: ${t.title}${t.tagline ? ` — ${t.tagline}` : ""}`)
    .join("\n");

  return `## Project\n${proj}\n\n## Available tracks\n${cat}\n\nReturn the ranked JSON array.`;
}

// Fallback : si l'IA échoue ou n'est pas configurée, on renvoie
// les tracks par ordre de guidance croissant, en excluant le track courant.
function fallbackRuleBased(project: RecommenderProject, catalog: RecommenderTrack[]): RecommendedTrack[] {
  const scored = catalog
    .filter((t) => t.slug !== project.currentTrackSlug)
    .map((t) => ({
      ...t,
      priority: getTrackGuidance(t.slug).order || 99,
      reason: t.tagline || ""
    }))
    .sort((a, b) => a.priority - b.priority);
  return scored.slice(0, 6);
}

export interface RecommendOptions {
  locale?: string;
  maxRecommendations?: number;
  useAI?: boolean;
  askOverride?: AskOverride;
}

export async function recommendTracksForProject(
  project: RecommenderProject,
  catalog: RecommenderTrack[],
  options: RecommendOptions = {}
): Promise<RecommendedTrack[]> {
  const locale = options.locale === "en" ? "en" : "fr";
  const maxRecs = Math.max(2, Math.min(Number(options.maxRecommendations) || 5, 8));
  const useAI = options.useAI !== false;

  const foundationalSlugs = foundationalFor(locale);
  const foundational = catalog.filter((t) => foundationalSlugs.includes(t.slug));
  const rest = catalog.filter(
    (t) => !foundationalSlugs.includes(t.slug) && t.slug !== project.currentTrackSlug
  );

  // Pas de projet exploitable ? on renvoie le fallback direct.
  const hasProjectSignal = Boolean(project.title || project.description || project.objective);
  if (!useAI || !hasProjectSignal) {
    return dedupeAndCap([...foundational.map((t) => toRec(t, 1, t.tagline || "")), ...fallbackRuleBased(project, rest)], maxRecs + foundational.length);
  }

  try {
    const result = await askAI({
      system: buildSystem(locale),
      messages: [{ role: "user", content: buildUserPrompt(project, rest) }],
      maxTokens: 700,
      ...(options.askOverride || {})
    });
    const scored = parseAIResponse(result.text);
    if (!scored.length) throw new Error("no valid AI output");

    const bySlug = new Map(rest.map((t) => [t.slug, t]));
    const aiRecs: RecommendedTrack[] = [];
    for (const s of scored) {
      const track = bySlug.get(s.slug);
      if (!track) continue;
      aiRecs.push(toRec(track, s.priority, s.reason || track.tagline || ""));
    }
    aiRecs.sort((a, b) => a.priority - b.priority);

    const foundationalRecs = foundational.map((t) => toRec(t, 0, t.tagline || ""));
    return dedupeAndCap([...foundationalRecs, ...aiRecs], maxRecs + foundational.length);
  } catch {
    return dedupeAndCap([...foundational.map((t) => toRec(t, 1, t.tagline || "")), ...fallbackRuleBased(project, rest)], maxRecs + foundational.length);
  }
}

function toRec(track: RecommenderTrack, priority: number, reason: string): RecommendedTrack {
  return { ...track, priority, reason };
}

function dedupeAndCap(list: RecommendedTrack[], cap: number): RecommendedTrack[] {
  const seen = new Set<string>();
  const out: RecommendedTrack[] = [];
  for (const item of list) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    out.push(item);
    if (out.length >= cap) break;
  }
  return out;
}
