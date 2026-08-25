import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Les livrables — cf. ROADMAP_REPOSITIONNEMENT.md §11 (M3).
 *
 * C'est ce qui remplace repo_url et live_url. Un livrable n'est pas forcement
 * une URL de code : une chaine, une video, un document ou un tableau de bord
 * comptent autant. Sans cette generalisation, le moteur reste un moteur pour
 * projets informatiques.
 *
 * Ne pas confondre avec `listProjectDeliverables` de userProjects.ts, qui liste
 * les micro-projets de lecons de l'ancien moteur.
 */

export const DELIVERABLE_KINDS = [
  "repo",
  "app",
  "document",
  "video",
  "channel",
  "playlist",
  "dashboard",
  "dataset",
  "automation",
  "landing",
  "portfolio",
  "proposal",
  "product",
  "other"
] as const;

export type DeliverableKind = (typeof DELIVERABLE_KINDS)[number];

export type ValidationLevel = "auto" | "ai" | "peer" | "contributor" | "mentor" | "client";

export interface Deliverable {
  id: string;
  projectId: string;
  stepId: string | null;
  kind: DeliverableKind;
  title: string;
  url: string;
  body: string;
  validationLevel: ValidationLevel;
  validatedAt: string | null;
  createdAt: string;
}

const DELIVERABLE_SELECT =
  "id, project_id, step_id, kind, title, url, body, validation_level, validated_at, created_at";

function asKind(value: unknown): DeliverableKind {
  return DELIVERABLE_KINDS.includes(value as DeliverableKind) ? (value as DeliverableKind) : "other";
}

function mapDeliverable(row: Record<string, unknown>): Deliverable {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    stepId: typeof row.step_id === "string" ? row.step_id : null,
    kind: asKind(row.kind),
    title: typeof row.title === "string" ? row.title : "",
    url: typeof row.url === "string" ? row.url : "",
    body: typeof row.body === "string" ? row.body : "",
    validationLevel: (typeof row.validation_level === "string"
      ? row.validation_level
      : "auto") as ValidationLevel,
    validatedAt: typeof row.validated_at === "string" ? row.validated_at : null,
    createdAt: typeof row.created_at === "string" ? row.created_at : ""
  };
}

export async function listDeliverables(
  supabase: SupabaseClient,
  projectId: string
): Promise<Deliverable[]> {
  const { data, error } = await supabase
    .from("project_deliverables")
    .select(DELIVERABLE_SELECT)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error || !Array.isArray(data)) {
    return [];
  }
  return data.map((row) => mapDeliverable(row as Record<string, unknown>));
}

export async function addDeliverable(
  supabase: SupabaseClient,
  input: {
    projectId: string;
    stepId?: string | null;
    kind: DeliverableKind;
    title: string;
    url?: string;
    body?: string;
  }
): Promise<{ ok: boolean; id?: string }> {
  const { data, error } = await supabase
    .from("project_deliverables")
    .insert({
      project_id: input.projectId,
      step_id: input.stepId || null,
      kind: input.kind,
      title: input.title,
      url: input.url || "",
      body: input.body || "",
      validation_level: "auto"
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false };
  }
  return { ok: true, id: String(data.id) };
}

/**
 * Combien d'etapes du plan ont produit un livrable.
 *
 * C'est la mesure qui compte vraiment : une etape cochee sans livrable est une
 * declaration, une etape avec livrable est une preuve.
 */
export function countStepsWithDeliverable(deliverables: Deliverable[]): number {
  const steps = new Set<string>();
  for (const d of deliverables) {
    if (d.stepId) {
      steps.add(d.stepId);
    }
  }
  return steps.size;
}
