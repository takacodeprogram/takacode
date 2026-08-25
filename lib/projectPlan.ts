import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Le plan d'un projet — cf. ROADMAP_REPOSITIONNEMENT.md §11 (migration M2).
 *
 * C'est ici que vit la progression, plus dans `user_lesson_progress`.
 * Une etape se termine parce qu'un livrable a ete produit, pas parce qu'une
 * ressource a ete consultee.
 */

export type StepStatus = "todo" | "doing" | "blocked" | "done" | "skipped";

export const STEP_STATUSES: StepStatus[] = ["todo", "doing", "blocked", "done", "skipped"];

export interface PlanStep {
  id: string;
  projectId: string;
  stepTemplateId: string | null;
  phaseSlug: string;
  phaseTitle: string;
  title: string;
  why: string;
  deliverableType: string;
  acceptanceCriteria: string[];
  status: StepStatus;
  position: number;
  startedAt: string | null;
  completedAt: string | null;
}

export interface PlanProgress {
  total: number;
  done: number;
  skipped: number;
  blocked: number;
  /** Pourcentage entier 0-100. Les etapes ignorees sortent du denominateur. */
  percent: number;
}

const STEP_SELECT =
  "id, project_id, step_template_id, phase_slug, phase_title, title, why, deliverable_type, acceptance_criteria, status, position, started_at, completed_at";

function asStatus(value: unknown): StepStatus {
  return STEP_STATUSES.includes(value as StepStatus) ? (value as StepStatus) : "todo";
}

function asCriteria(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function mapStep(row: Record<string, unknown>): PlanStep {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    stepTemplateId: typeof row.step_template_id === "string" ? row.step_template_id : null,
    phaseSlug: typeof row.phase_slug === "string" ? row.phase_slug : "",
    phaseTitle: typeof row.phase_title === "string" ? row.phase_title : "",
    title: typeof row.title === "string" ? row.title : "",
    why: typeof row.why === "string" ? row.why : "",
    deliverableType: typeof row.deliverable_type === "string" ? row.deliverable_type : "other",
    acceptanceCriteria: asCriteria(row.acceptance_criteria),
    status: asStatus(row.status),
    position: typeof row.position === "number" ? row.position : 100,
    startedAt: typeof row.started_at === "string" ? row.started_at : null,
    completedAt: typeof row.completed_at === "string" ? row.completed_at : null
  };
}

/**
 * Ordonne le plan : par position, puis par titre pour rester deterministe
 * lorsque deux etapes partagent la meme position (cas courant apres un ajout
 * manuel du Builder).
 */
export function orderPlanSteps(steps: PlanStep[]): PlanStep[] {
  return [...steps].sort((a, b) => {
    if (a.position !== b.position) {
      return a.position - b.position;
    }
    return a.title.localeCompare(b.title);
  });
}

/**
 * Progression du projet.
 *
 * Une etape ignoree n'est ni un succes ni un echec : elle sort du denominateur.
 * Un plan entierement ignore vaut donc 0 % et non 100 %.
 */
export function computePlanProgress(steps: PlanStep[]): PlanProgress {
  const total = steps.length;
  const done = steps.filter((s) => s.status === "done").length;
  const skipped = steps.filter((s) => s.status === "skipped").length;
  const blocked = steps.filter((s) => s.status === "blocked").length;
  const countable = total - skipped;
  const percent = countable > 0 ? Math.round((done / countable) * 100) : 0;
  return { total, done, skipped, blocked, percent };
}

/**
 * La prochaine action : la premiere etape en cours, sinon la premiere a faire.
 * C'est la question a laquelle le dashboard doit repondre en une seconde.
 */
export function nextStep(steps: PlanStep[]): PlanStep | null {
  const ordered = orderPlanSteps(steps);
  return ordered.find((s) => s.status === "doing") || ordered.find((s) => s.status === "todo") || null;
}

export async function listProjectPlan(
  supabase: SupabaseClient,
  projectId: string
): Promise<PlanStep[]> {
  const { data, error } = await supabase
    .from("project_plan_steps")
    .select(STEP_SELECT)
    .eq("project_id", projectId)
    .order("position", { ascending: true });

  if (error || !Array.isArray(data)) {
    return [];
  }
  return data.map((row) => mapStep(row as Record<string, unknown>));
}

export async function setStepStatus(
  supabase: SupabaseClient,
  stepId: string,
  status: StepStatus
): Promise<boolean> {
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { status };

  if (status === "doing") {
    patch.started_at = now;
  }
  if (status === "done") {
    patch.completed_at = now;
  }
  if (status === "todo") {
    patch.started_at = null;
    patch.completed_at = null;
  }

  const { error } = await supabase.from("project_plan_steps").update(patch).eq("id", stepId);
  return !error;
}

/**
 * Genere le plan initial d'un projet a partir d'un framework.
 *
 * Le framework n'est qu'un point de depart : les etapes creees sont ensuite la
 * propriete du Builder, qui peut les reordonner, les supprimer ou en ajouter.
 * `step_template_id` garde la trace de l'origine sans la rendre contraignante.
 *
 * Ne fait rien si le projet a deja un plan : regenerer ecraserait un travail
 * en cours.
 */
export async function generatePlanFromFramework(
  supabase: SupabaseClient,
  projectId: string,
  frameworkId: string
): Promise<{ created: number; reason?: string }> {
  const existing = await listProjectPlan(supabase, projectId);
  if (existing.length > 0) {
    return { created: 0, reason: "plan_exists" };
  }

  const { data: phases, error: phasesError } = await supabase
    .from("framework_phases")
    .select("id, slug, title, sort_order")
    .eq("framework_id", frameworkId)
    .order("sort_order", { ascending: true });

  if (phasesError || !Array.isArray(phases) || phases.length === 0) {
    return { created: 0, reason: "no_phases" };
  }

  const phaseIds = phases.map((p) => String((p as Record<string, unknown>).id));

  const { data: templates, error: templatesError } = await supabase
    .from("phase_step_templates")
    .select("id, phase_id, title, why, deliverable_type, acceptance_criteria, sort_order")
    .in("phase_id", phaseIds)
    .order("sort_order", { ascending: true });

  if (templatesError || !Array.isArray(templates) || templates.length === 0) {
    return { created: 0, reason: "no_steps" };
  }

  const phaseById = new Map(
    phases.map((p) => {
      const row = p as Record<string, unknown>;
      return [
        String(row.id),
        {
          slug: typeof row.slug === "string" ? row.slug : "",
          title: typeof row.title === "string" ? row.title : "",
          order: typeof row.sort_order === "number" ? row.sort_order : 100
        }
      ];
    })
  );

  // La position finale melange l'ordre de la phase et celui de l'etape, pour
  // que le plan se lise de bout en bout sans dependre du tri d'origine.
  const rows = templates.map((t, index) => {
    const row = t as Record<string, unknown>;
    const phase = phaseById.get(String(row.phase_id));
    const phaseOrder = phase ? phase.order : 100;
    const stepOrder = typeof row.sort_order === "number" ? row.sort_order : index;
    return {
      project_id: projectId,
      step_template_id: String(row.id),
      phase_slug: phase ? phase.slug : "",
      phase_title: phase ? phase.title : "",
      title: typeof row.title === "string" ? row.title : "",
      why: typeof row.why === "string" ? row.why : "",
      deliverable_type: typeof row.deliverable_type === "string" ? row.deliverable_type : "other",
      acceptance_criteria: asCriteria(row.acceptance_criteria),
      status: "todo",
      position: phaseOrder * 1000 + stepOrder
    };
  });

  const { error: insertError } = await supabase.from("project_plan_steps").insert(rows);
  if (insertError) {
    return { created: 0, reason: "insert_failed" };
  }

  return { created: rows.length };
}
