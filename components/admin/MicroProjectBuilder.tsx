"use client";

import { useState } from "react";

interface MicroProjectData {
  title: string;
  brief: string;
  steps: string[];
  deliverable: string;
  validation: "auto" | "ai" | "peer" | "mentor";
  requiresLink: boolean;
}

interface MicroProjectBuilderProps {
  value: string;
  onChange: (value: string) => void;
}

const INPUT = "auth-input text-[12px] w-full";
const AREA = "auth-input text-[12px] w-full min-h-[64px]";

function parseProject(json: string): MicroProjectData | null {
  try {
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== "object") return null;
    return {
      title: typeof obj.title === "string" ? obj.title : "",
      brief: typeof obj.brief === "string" ? obj.brief : "",
      steps: Array.isArray(obj.steps) ? obj.steps.filter((s: unknown) => typeof s === "string") : [],
      deliverable: typeof obj.deliverable === "string" ? obj.deliverable : "",
      validation: ["auto", "ai", "peer", "mentor"].includes(obj.validation) ? obj.validation : "auto",
      requiresLink: obj.requires_link === true || obj.requires_link === "true"
    };
  } catch {
    return null;
  }
}

function serializeProject(data: MicroProjectData): string {
  return JSON.stringify({
    title: data.title,
    brief: data.brief,
    steps: data.steps.filter(Boolean),
    deliverable: data.deliverable,
    validation: data.validation,
    requires_link: data.requiresLink
  }, null, 2);
}

export default function MicroProjectBuilder({ value, onChange }: MicroProjectBuilderProps) {
  const [data, setData] = useState<MicroProjectData>(() => {
    return parseProject(value) || {
      title: "",
      brief: "",
      steps: [""],
      deliverable: "",
      validation: "auto" as const,
      requiresLink: false
    };
  });

  function update(changes: Partial<MicroProjectData>) {
    const next = { ...data, ...changes };
    setData(next);
    onChange(serializeProject(next));
  }

  function setStep(index: number, val: string) {
    const steps = [...data.steps];
    steps[index] = val;
    update({ steps });
  }

  function addStep() {
    update({ steps: [...data.steps, ""] });
  }

  function removeStep(index: number) {
    const steps = data.steps.filter((_, i) => i !== index);
    update({ steps: steps.length ? steps : [""] });
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold mb-2">MICRO-PROJET</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-[#6d6d6d] block mb-1">Titre *</label>
          <input className={INPUT} value={data.title} onChange={(e) => update({ title: e.target.value })} placeholder="Titre du micro-projet" />
        </div>
        <div>
          <label className="text-[10px] text-[#6d6d6d] block mb-1">Mode de validation</label>
          <select className={INPUT} value={data.validation} onChange={(e) => update({ validation: e.target.value as MicroProjectData["validation"] })}>
            <option value="auto">Automatique</option>
            <option value="ai">IA</option>
            <option value="peer">Pair</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] text-[#6d6d6d] block mb-1">Description / consigne</label>
        <textarea className={AREA} value={data.brief} onChange={(e) => update({ brief: e.target.value })} placeholder="Explique le travail attendu..." />
      </div>

      <div>
        <label className="text-[10px] text-[#6d6d6d] block mb-1">Étapes</label>
        <div className="space-y-1.5">
          {data.steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-[9px] text-blue-200 shrink-0">
                {index + 1}
              </span>
              <input
                className={INPUT}
                value={step}
                onChange={(e) => setStep(index, e.target.value)}
                placeholder={`Etape ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="text-red-400/70 hover:text-red-400 p-1 shrink-0"
                title="Supprimer l'etape"
                disabled={data.steps.length <= 1}
              >
                <iconify-icon icon="lucide:x" style={{ fontSize: "14px" }} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addStep} className="text-[11px] text-[#4F8EF7] hover:underline inline-flex items-center gap-1 mt-1">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "12px" }} />
            Ajouter une étape
          </button>
        </div>
      </div>

      <div>
        <label className="text-[10px] text-[#6d6d6d] block mb-1">Livrable attendu</label>
        <textarea className={AREA} value={data.deliverable} onChange={(e) => update({ deliverable: e.target.value })} placeholder="Ce qui doit être rendu (lien, fichier, description...)" />
      </div>

      <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
        <input type="checkbox" checked={data.requiresLink} onChange={(e) => update({ requiresLink: e.target.checked })} />
        L'apprenant doit fournir un lien (URL)
      </label>
    </div>
  );
}
