import Link from "next/link";
import { computePlanProgress, nextStep, type PlanStep } from "../lib/projectPlan";

/**
 * Le plan, en version dashboard — cf. ROADMAP_REPOSITIONNEMENT.md §11.7.
 *
 * Le dashboard doit repondre en une seconde a « quelle est ta prochaine
 * action ». Ce bloc ne montre donc que ca : l'avancement, l'etape suivante et
 * le chemin pour y aller. Le plan complet reste sur la page du projet.
 */

export interface PlanSummaryLabels {
  title: string;
  nextAction: string;
  open: string;
  empty: string;
  emptyCta: string;
  done: string;
}

export default function ProjectPlanSummary({
  steps,
  projectHref,
  labels
}: {
  steps: PlanStep[];
  projectHref: string;
  labels: PlanSummaryLabels;
}) {
  const progress = computePlanProgress(steps);
  const upcoming = nextStep(steps);

  return (
    <section className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-5 animate-fade-up-d2">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <h3 className="font-venite text-[12px] tracking-widest text-[var(--muted-3)] inline-flex items-center gap-2">
          <iconify-icon icon="lucide:route" style={{ color: "#4F8EF7", fontSize: "14px" }} />
          {labels.title}
        </h3>
        <Link href={projectHref} className="text-[11px] text-[#4F8EF7] hover:underline">
          {labels.open}
        </Link>
      </div>

      {steps.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-2)] bg-[var(--overlay-1)] px-4 py-4">
          <div className="font-body-readable text-[12px] text-[var(--text-primary)] mb-1">{labels.empty}</div>
          <Link href={projectHref} className="font-body-readable text-[11px] text-[#4F8EF7] hover:underline">
            {labels.emptyCta}
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="stat-value text-[20px] text-[var(--text-primary)]">{progress.percent} %</span>
            <span className="font-body-readable text-[11px] text-[var(--muted-4)]">
              {progress.done} / {progress.total}
            </span>
          </div>

          <div className="h-1 bg-[var(--overlay-5)] rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress.percent}%`, background: "linear-gradient(90deg,#4F8EF7,#22D3EE)" }}
            />
          </div>

          {upcoming ? (
            <Link
              href={projectHref}
              className="block rounded-xl border border-blue-500/25 bg-blue-500/[0.06] px-4 py-3 hover:border-blue-400/40 transition-colors"
            >
              <div className="font-venite text-[9px] tracking-widest text-[#7dd3fc] uppercase mb-1">
                {labels.nextAction}
              </div>
              <div className="font-body-readable text-[12px] text-[var(--text-primary)] font-semibold leading-snug">
                {upcoming.title}
              </div>
              {upcoming.phaseTitle ? (
                <div className="font-body-readable text-[10px] text-[var(--muted-5)] mt-1">{upcoming.phaseTitle}</div>
              ) : null}
            </Link>
          ) : (
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3">
              <div className="font-body-readable text-[12px] text-emerald-200 font-semibold">{labels.done}</div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
