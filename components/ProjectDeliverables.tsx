"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DELIVERABLE_KINDS, type Deliverable, type DeliverableKind } from "../lib/projectDeliverables";
import type { PlanStep } from "../lib/projectPlan";

export interface DeliverableLabels {
  title: string;
  empty: string;
  emptyHint: string;
  add: string;
  cancel: string;
  save: string;
  saving: string;
  fieldTitle: string;
  fieldUrl: string;
  fieldKind: string;
  fieldStep: string;
  noStep: string;
  error: string;
  kinds: Record<string, string>;
}

/**
 * Les livrables d'un projet — cf. ROADMAP_REPOSITIONNEMENT.md §11 (M3).
 *
 * Une etape cochee est une declaration. Une etape avec un livrable est une
 * preuve. C'est ce qui alimentera le portfolio sans ressaisie.
 */
export default function ProjectDeliverables({
  projectId,
  deliverables,
  steps,
  labels
}: {
  projectId: string;
  deliverables: Deliverable[];
  steps: PlanStep[];
  labels: DeliverableLabels;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState("");
  const [kind, setKind] = useState<DeliverableKind>("document");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [stepId, setStepId] = useState("");

  async function save() {
    if (pending || title.trim().length < 2) return;
    setPending(true);
    setFailed("");
    try {
      const response = await fetch("/api/projects/deliverable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          stepId: stepId || null,
          kind,
          title: title.trim(),
          url: url.trim()
        })
      });
      if (!response.ok) {
        setFailed(labels.error);
        return;
      }
      setTitle("");
      setUrl("");
      setStepId("");
      setOpen(false);
      router.refresh();
    } catch {
      setFailed(labels.error);
    } finally {
      setPending(false);
    }
  }

  const stepTitleById = new Map(steps.map((s) => [s.id, s.title]));

  return (
    <div className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 inline-flex items-center justify-center">
            <iconify-icon icon="lucide:package-check" style={{ color: "#6ee7b7", fontSize: "17px" }} />
          </div>
          <div>
            <div className="font-venite text-[10px] tracking-widest text-[var(--muted-3)] uppercase">{labels.title}</div>
            <h3 className="font-venite-italic text-[13px] text-[var(--text-primary)] leading-tight">
              {deliverables.length}
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-[var(--border-3)] px-3 py-1.5 text-[11px] font-semibold text-[var(--muted-2)] font-body-readable hover:border-[var(--border-5)] transition-colors"
        >
          {open ? labels.cancel : labels.add}
        </button>
      </div>

      {open ? (
        <div className="rounded-xl border border-[var(--border-2)] bg-[var(--overlay-1)] p-4 mb-4 space-y-2.5">
          <div>
            <label className="font-venite text-[9px] tracking-widest text-[var(--muted-5)] uppercase block mb-1">
              {labels.fieldTitle}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={pending}
              className="w-full rounded-lg border border-[var(--border-2)] bg-[var(--overlay-2)] px-3 py-2 text-[12px] text-[var(--text-primary)] font-body-readable"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            <div>
              <label className="font-venite text-[9px] tracking-widest text-[var(--muted-5)] uppercase block mb-1">
                {labels.fieldKind}
              </label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as DeliverableKind)}
                disabled={pending}
                className="w-full rounded-lg border border-[var(--border-2)] bg-[var(--overlay-2)] px-3 py-2 text-[12px] text-[var(--text-primary)] font-body-readable"
              >
                {DELIVERABLE_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {labels.kinds[k] || k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-venite text-[9px] tracking-widest text-[var(--muted-5)] uppercase block mb-1">
                {labels.fieldStep}
              </label>
              <select
                value={stepId}
                onChange={(e) => setStepId(e.target.value)}
                disabled={pending}
                className="w-full rounded-lg border border-[var(--border-2)] bg-[var(--overlay-2)] px-3 py-2 text-[12px] text-[var(--text-primary)] font-body-readable"
              >
                <option value="">{labels.noStep}</option>
                {steps.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-venite text-[9px] tracking-widest text-[var(--muted-5)] uppercase block mb-1">
              {labels.fieldUrl}
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={pending}
              placeholder="https://"
              className="w-full rounded-lg border border-[var(--border-2)] bg-[var(--overlay-2)] px-3 py-2 text-[12px] text-[var(--text-primary)] font-body-readable"
            />
          </div>

          <button
            type="button"
            onClick={save}
            disabled={pending || title.trim().length < 2}
            className="btn-primary w-full"
            style={{ fontSize: "12px", padding: "9px 18px", opacity: pending || title.trim().length < 2 ? 0.5 : 1 }}
          >
            {pending ? labels.saving : labels.save}
          </button>

          {failed ? <div className="font-body-readable text-[11px] text-red-400/90">{failed}</div> : null}
        </div>
      ) : null}

      {deliverables.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-2)] bg-[var(--overlay-1)] px-4 py-5 text-center">
          <div className="font-body-readable text-[12px] text-[var(--text-primary)] mb-1">{labels.empty}</div>
          <div className="font-body-readable text-[11px] text-[var(--muted-5)]">{labels.emptyHint}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {deliverables.map((d) => (
            <div key={d.id} className="rounded-xl border border-[var(--border-2)] bg-[var(--overlay-1)] px-3.5 py-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-200 font-body-readable">
                  {labels.kinds[d.kind] || d.kind}
                </span>
                <span className="text-[12px] text-[var(--text-primary)] font-semibold leading-tight">{d.title}</span>
              </div>
              {d.stepId && stepTitleById.get(d.stepId) ? (
                <div className="font-body-readable text-[10px] text-[var(--muted-5)] mt-1">
                  {stepTitleById.get(d.stepId)}
                </div>
              ) : null}
              {d.url ? (
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body-readable text-[10px] text-[#4F8EF7] hover:underline break-all"
                >
                  {d.url}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
