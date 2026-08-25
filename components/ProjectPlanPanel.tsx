import { computePlanProgress, nextStep, orderPlanSteps, type PlanStep, type StepStatus } from "../lib/projectPlan";

/**
 * Le plan d'un projet — cf. ROADMAP_REPOSITIONNEMENT.md §11 (M2).
 *
 * Composant presentiel : il ne lit pas la base, il recoit les etapes. Tant que
 * les migrations M1/M2 ne sont pas appliquees, `listProjectPlan` renvoie un
 * tableau vide et ce panneau affiche son etat vide sans casser la page.
 */

export interface PlanLabels {
  title: string;
  empty: string;
  emptyHint: string;
  nextAction: string;
  status: Record<StepStatus, string>;
}

const STATUS_STYLE: Record<StepStatus, { color: string; border: string; bg: string }> = {
  todo: { color: "var(--muted-3)", border: "var(--border-2)", bg: "var(--overlay-1)" },
  doing: { color: "#7dd3fc", border: "rgba(79,142,247,0.30)", bg: "rgba(79,142,247,0.10)" },
  blocked: { color: "#fcd34d", border: "rgba(245,158,11,0.30)", bg: "rgba(245,158,11,0.10)" },
  done: { color: "#6ee7b7", border: "rgba(16,185,129,0.30)", bg: "rgba(16,185,129,0.10)" },
  skipped: { color: "var(--muted-5)", border: "var(--border-2)", bg: "transparent" }
};

function StatusChip({ status, label }: { status: StepStatus; label: string }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border font-body-readable"
      style={{ color: s.color, borderColor: s.border, background: s.bg }}
    >
      {label}
    </span>
  );
}

export default function ProjectPlanPanel({ steps, labels }: { steps: PlanStep[]; labels: PlanLabels }) {
  const progress = computePlanProgress(steps);
  const upcoming = nextStep(steps);
  const ordered = orderPlanSteps(steps);

  // Regroupement par phase, en conservant l'ordre du plan.
  const phases: Array<{ key: string; title: string; steps: PlanStep[] }> = [];
  for (const step of ordered) {
    const key = step.phaseSlug || "_";
    const last = phases[phases.length - 1];
    if (last && last.key === key) {
      last.steps.push(step);
    } else {
      phases.push({ key, title: step.phaseTitle, steps: [step] });
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl border border-blue-500/30 bg-blue-500/10 inline-flex items-center justify-center">
          <iconify-icon icon="lucide:route" style={{ color: "#7dd3fc", fontSize: "17px" }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-venite text-[10px] tracking-widest text-[var(--muted-3)] uppercase">{labels.title}</div>
          <h3 className="font-venite-italic text-[13px] text-[var(--text-primary)] leading-tight">
            {progress.done} / {progress.total} — {progress.percent} %
          </h3>
        </div>
      </div>

      {steps.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-2)] bg-[var(--overlay-1)] px-4 py-5 text-center">
          <div className="font-body-readable text-[12px] text-[var(--text-primary)] mb-1">{labels.empty}</div>
          <div className="font-body-readable text-[11px] text-[var(--muted-5)]">{labels.emptyHint}</div>
        </div>
      ) : (
        <>
          <div className="h-1 bg-[var(--overlay-5)] rounded-full overflow-hidden mb-5">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress.percent}%`, background: "linear-gradient(90deg,#4F8EF7,#22D3EE)" }}
            />
          </div>

          {upcoming ? (
            <div className="rounded-xl border border-blue-500/25 bg-blue-500/[0.06] px-4 py-3 mb-5">
              <div className="font-venite text-[9px] tracking-widest text-[#7dd3fc] uppercase mb-1">{labels.nextAction}</div>
              <div className="font-body-readable text-[12px] text-[var(--text-primary)] font-semibold leading-snug">{upcoming.title}</div>
              {upcoming.why ? (
                <div className="font-body-readable text-[11px] text-[var(--muted-4)] mt-1 leading-relaxed">{upcoming.why}</div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.key}>
                {phase.title ? (
                  <div className="font-venite text-[9px] tracking-widest text-[var(--muted-5)] uppercase mb-2">{phase.title}</div>
                ) : null}
                <div className="space-y-2">
                  {phase.steps.map((step) => (
                    <div
                      key={step.id}
                      className="rounded-xl border border-[var(--border-2)] bg-[var(--overlay-1)] px-3.5 py-2.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="min-w-0 flex-1">
                          <div
                            className="text-[12px] font-semibold leading-tight"
                            style={{
                              color: step.status === "skipped" ? "var(--muted-5)" : "var(--text-primary)",
                              textDecoration: step.status === "skipped" ? "line-through" : "none"
                            }}
                          >
                            {step.title}
                          </div>
                          {step.acceptanceCriteria.length > 0 ? (
                            <ul className="mt-1.5 space-y-0.5">
                              {step.acceptanceCriteria.map((criterion, i) => (
                                <li key={i} className="font-body-readable text-[10px] text-[var(--muted-4)] flex gap-1.5">
                                  <span style={{ color: step.status === "done" ? "#6ee7b7" : "var(--muted-5)" }}>✓</span>
                                  <span>{criterion}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                        <StatusChip status={step.status} label={labels.status[step.status]} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
