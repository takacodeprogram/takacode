"use client";

import { useState } from "react";

interface PriorityAction {
  impact: "high" | "medium" | "low" | string;
  action: string;
}

interface MissingLesson {
  module_slug: string;
  proposed_lesson_title: string;
  why: string;
}

interface Suggestions {
  summary_verdict?: string;
  title_and_pitch?: string[];
  structure?: string[];
  missing_lessons?: MissingLesson[];
  quiz_and_projects?: string[];
  resources?: string[];
  priority_actions?: PriorityAction[];
  raw?: string;
}

interface Props {
  trackId: string;
}

function Section({ title, items }: { title: string; items?: string[] }) {
  if (!items || !items.length) return null;
  return (
    <div className="mt-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-3)] mb-2">{title}</div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-[13px] text-[var(--text-primary)] flex items-start gap-2">
            <span className="text-[#4F8EF7] mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImpactChip({ impact }: { impact: string }) {
  const color =
    impact === "high"
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : impact === "medium"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-blue-500/10 text-blue-400 border-blue-500/20";
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${color}`}>{impact}</span>;
}

export default function TrackAiSuggestions({ trackId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [meta, setMeta] = useState<{ provider?: string; model?: string }>({});

  async function run() {
    setLoading(true);
    setError("");
    setSuggestions(null);
    try {
      const res = await fetch(`/api/admin/tracks/${trackId}/ai-suggest`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || json?.error || "Échec de l'analyse.");
        return;
      }
      setSuggestions(json.suggestions);
      setMeta({ provider: json.provider, model: json.model });
    } catch {
      setError("Problème réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-6">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <iconify-icon icon="lucide:sparkles" style={{ color: "#4F8EF7", fontSize: "18px" }} />
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">Suggestions IA</h2>
          </div>
          <p className="text-[12px] text-[var(--muted-3)] mt-1">
            L'IA analyse le parcours (titre, description, modules, leçons) et propose des améliorations concrètes et priorisées.
          </p>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <iconify-icon icon={loading ? "lucide:loader" : "lucide:play"} style={{ fontSize: "14px", animation: loading ? "spin 1s linear infinite" : undefined }} />
          {loading ? "Analyse en cours…" : "Lancer l'analyse"}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
          {error}
        </div>
      ) : null}

      {suggestions ? (
        <div>
          {suggestions.summary_verdict ? (
            <div className="rounded-xl border border-[var(--border-3)] bg-[var(--overlay-3)] px-4 py-3 mb-2">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-3)] mb-1">Diagnostic</div>
              <div className="text-[14px] text-[var(--text-primary)]">{suggestions.summary_verdict}</div>
            </div>
          ) : null}

          {suggestions.priority_actions && suggestions.priority_actions.length ? (
            <div className="mt-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-3)] mb-2">Actions prioritaires</div>
              <ul className="space-y-2">
                {suggestions.priority_actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg border border-[var(--border-2)] bg-[var(--overlay-2)] px-3 py-2">
                    <ImpactChip impact={a.impact} />
                    <span className="text-[13px] text-[var(--text-primary)] flex-1">{a.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Section title="Titre et pitch" items={suggestions.title_and_pitch} />
          <Section title="Structure" items={suggestions.structure} />

          {suggestions.missing_lessons && suggestions.missing_lessons.length ? (
            <div className="mt-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-3)] mb-2">Leçons manquantes</div>
              <ul className="space-y-2">
                {suggestions.missing_lessons.map((m, i) => (
                  <li key={i} className="rounded-lg border border-[var(--border-2)] bg-[var(--overlay-2)] px-3 py-2">
                    <div className="text-[13px] text-[var(--text-primary)] font-medium">{m.proposed_lesson_title}</div>
                    <div className="text-[11px] text-[var(--muted-3)] mt-0.5">Module <span className="font-mono">{m.module_slug}</span> — {m.why}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Section title="Quiz et micro-projets" items={suggestions.quiz_and_projects} />
          <Section title="Ressources" items={suggestions.resources} />

          {suggestions.raw ? (
            <pre className="mt-4 whitespace-pre-wrap text-[12px] text-[var(--muted-2)] bg-[var(--overlay-2)] p-3 rounded-lg overflow-x-auto">{suggestions.raw}</pre>
          ) : null}

          {meta.provider ? (
            <div className="mt-4 text-[11px] text-[var(--muted-4)]">
              Généré par <span className="font-mono">{meta.provider}</span> ({meta.model})
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
