"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { StepStatus } from "../lib/projectPlan";

export interface StepActionLabels {
  start: string;
  complete: string;
  block: string;
  resume: string;
  reopen: string;
  skip: string;
  error: string;
}

/**
 * Faire avancer une etape — cf. ROADMAP_REPOSITIONNEMENT.md §11 (M2).
 *
 * Les actions proposees dependent de l'etat courant plutot que d'exposer les
 * cinq statuts a chaque ligne : on ne demande pas au membre de choisir dans une
 * liste, on lui propose le geste suivant.
 */
function actionsFor(status: StepStatus): Array<{ next: StepStatus; key: keyof StepActionLabels; primary: boolean }> {
  switch (status) {
    case "todo":
      return [
        { next: "doing", key: "start", primary: true },
        { next: "skipped", key: "skip", primary: false }
      ];
    case "doing":
      return [
        { next: "done", key: "complete", primary: true },
        { next: "blocked", key: "block", primary: false }
      ];
    case "blocked":
      return [{ next: "doing", key: "resume", primary: true }];
    case "done":
      return [{ next: "doing", key: "reopen", primary: false }];
    case "skipped":
      return [{ next: "todo", key: "resume", primary: false }];
    default:
      return [];
  }
}

export default function PlanStepActions({
  stepId,
  status,
  labels
}: {
  stepId: string;
  status: StepStatus;
  labels: StepActionLabels;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function move(next: StepStatus) {
    if (pending) return;
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/projects/plan/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, status: next })
      });
      if (!response.ok) {
        setFailed(true);
        return;
      }
      // La progression est calculee cote serveur : on rafraichit plutot que de
      // maintenir un second etat qui pourrait diverger.
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  const actions = actionsFor(status);
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-2">
      {actions.map((action) => (
        <button
          key={action.next}
          type="button"
          onClick={() => move(action.next)}
          disabled={pending}
          className="rounded-lg border px-2.5 py-1 text-[10px] font-semibold font-body-readable transition-colors"
          style={{
            opacity: pending ? 0.5 : 1,
            color: action.primary ? "#7dd3fc" : "var(--muted-3)",
            borderColor: action.primary ? "rgba(79,142,247,0.30)" : "var(--border-3)",
            background: action.primary ? "rgba(79,142,247,0.10)" : "transparent"
          }}
        >
          {labels[action.key]}
        </button>
      ))}
      {failed ? <span className="text-[10px] text-red-400/90 font-body-readable">{labels.error}</span> : null}
    </div>
  );
}
