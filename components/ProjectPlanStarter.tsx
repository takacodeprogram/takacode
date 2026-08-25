"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FrameworkSummary } from "../lib/projectFrameworks";

export interface StarterLabels {
  choose: string;
  generate: string;
  generating: string;
  noFramework: string;
  error: string;
}

/**
 * Transforme un objectif en plan : le membre choisit un framework, TakaCode en
 * derive les etapes. cf. ROADMAP_REPOSITIONNEMENT.md §11 (M2).
 */
export default function ProjectPlanStarter({
  projectId,
  frameworks,
  labels
}: {
  projectId: string;
  frameworks: FrameworkSummary[];
  labels: StarterLabels;
}) {
  const router = useRouter();
  const [frameworkId, setFrameworkId] = useState<string>(frameworks[0]?.id || "");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function generate() {
    if (!frameworkId || pending) return;
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/projects/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, frameworkId })
      });
      if (!response.ok) {
        setFailed(true);
        return;
      }
      // Le plan est rendu cote serveur : on rafraichit plutot que de dupliquer
      // l'etat ici.
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  if (frameworks.length === 0) {
    return <div className="font-body-readable text-[11px] text-[var(--muted-5)]">{labels.noFramework}</div>;
  }

  const selected = frameworks.find((f) => f.id === frameworkId) || null;

  return (
    <div className="mt-4 text-left">
      <label className="font-venite text-[9px] tracking-widest text-[var(--muted-5)] uppercase block mb-2">
        {labels.choose}
      </label>
      <select
        value={frameworkId}
        onChange={(event) => setFrameworkId(event.target.value)}
        disabled={pending}
        className="w-full rounded-xl border border-[var(--border-2)] bg-[var(--overlay-2)] px-3 py-2 text-[12px] text-[var(--text-primary)] font-body-readable mb-2"
      >
        {frameworks.map((framework) => (
          <option key={framework.id} value={framework.id}>
            {framework.projectTypeLabel} — {framework.title}
          </option>
        ))}
      </select>

      {selected ? (
        <div className="font-body-readable text-[11px] text-[var(--muted-4)] leading-relaxed mb-3">
          {selected.summary}
          {selected.durationWeeks > 0 ? ` · ${selected.durationWeeks} semaines · ${selected.levelLabel}` : ""}
        </div>
      ) : null}

      <button
        type="button"
        onClick={generate}
        disabled={pending}
        className="btn-primary w-full inline-flex items-center justify-center gap-2"
        style={{ fontSize: "12px", padding: "10px 18px", opacity: pending ? 0.6 : 1 }}
      >
        <iconify-icon icon="lucide:route" style={{ fontSize: "14px" }} />
        {pending ? labels.generating : labels.generate}
      </button>

      {failed ? (
        <div className="font-body-readable text-[11px] text-red-400/90 mt-2">{labels.error}</div>
      ) : null}
    </div>
  );
}
