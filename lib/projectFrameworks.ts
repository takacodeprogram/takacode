import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "./i18n";

/**
 * Les frameworks — cf. ROADMAP_REPOSITIONNEMENT.md §11 (M1).
 *
 * Un framework est le squelette reutilisable d'une categorie de projet : les
 * grandes phases et, sous chaque phase, ce qu'il faut produire. Ce n'est pas un
 * cours, et on ne s'y « inscrit » pas : on s'en sert pour generer un plan.
 */

export interface FrameworkSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  levelLabel: string;
  durationWeeks: number;
  projectTypeSlug: string;
  projectTypeLabel: string;
  icon: string;
  accentColor: string;
}

const FRAMEWORK_SELECT =
  "id, slug, title, summary, level_label, duration_weeks, project_types(slug, label, icon, accent_color)";

function mapFramework(row: Record<string, unknown>): FrameworkSummary {
  // La jointure PostgREST renvoie un objet, ou un tableau selon la cardinalite.
  const rawType = row.project_types;
  const type = (Array.isArray(rawType) ? rawType[0] : rawType) as Record<string, unknown> | null;

  return {
    id: String(row.id),
    slug: typeof row.slug === "string" ? row.slug : "",
    title: typeof row.title === "string" ? row.title : "",
    summary: typeof row.summary === "string" ? row.summary : "",
    levelLabel: typeof row.level_label === "string" ? row.level_label : "",
    durationWeeks: typeof row.duration_weeks === "number" ? row.duration_weeks : 0,
    projectTypeSlug: type && typeof type.slug === "string" ? type.slug : "",
    projectTypeLabel: type && typeof type.label === "string" ? type.label : "",
    icon: type && typeof type.icon === "string" ? type.icon : "lucide:target",
    accentColor: type && typeof type.accent_color === "string" ? type.accent_color : "#4F8EF7"
  };
}

/**
 * Les frameworks publies, dans la langue demandee.
 *
 * Renvoie un tableau vide plutot qu'une erreur : tant que le catalogue
 * editorial n'est pas construit, l'interface doit afficher un etat vide, pas
 * planter.
 */
export async function listPublishedFrameworks(
  supabase: SupabaseClient,
  locale: Locale = "fr"
): Promise<FrameworkSummary[]> {
  const { data, error } = await supabase
    .from("project_frameworks")
    .select(FRAMEWORK_SELECT)
    .eq("is_published", true)
    .eq("locale", locale)
    .order("sort_order", { ascending: true });

  if (error || !Array.isArray(data)) {
    return [];
  }
  return data.map((row) => mapFramework(row as Record<string, unknown>));
}
