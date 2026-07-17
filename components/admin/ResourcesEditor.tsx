"use client";

import { useState } from "react";

interface ResourceData {
  label: string;
  url: string;
  kind: string;
  why: string;
  how: string;
}

interface ResourcesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const INPUT = "auth-input text-[12px] w-full";
const KIND_OPTIONS = [
  { value: "doc", label: "Documentation" },
  { value: "video", label: "Video" },
  { value: "article", label: "Article" },
  { value: "tool", label: "Outil" },
  { value: "repo", label: "Depot" },
  { value: "course", label: "Cours" }
];

function parseResources(json: string): ResourceData[] {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr.map((item: unknown) => {
      const obj = (item || {}) as Record<string, unknown>;
      return {
        label: typeof obj.label === "string" ? obj.label : "",
        url: typeof obj.url === "string" ? obj.url : "",
        kind: typeof obj.kind === "string" ? obj.kind : "doc",
        why: typeof obj.why === "string" ? obj.why : "",
        how: typeof obj.how === "string" ? obj.how : ""
      };
    });
  } catch {
    return [];
  }
}

function serializeResources(data: ResourceData[]): string {
  return JSON.stringify(data.filter((r) => r.label && r.url), null, 2);
}

const EMPTY_RESOURCE = { label: "", url: "", kind: "doc", why: "", how: "" };

export default function ResourcesEditor({ value, onChange }: ResourcesEditorProps) {
  const [resources, setResources] = useState<ResourceData[]>(() => {
    const parsed = parseResources(value);
    return parsed.length ? parsed : [EMPTY_RESOURCE];
  });

  function update(index: number, changes: Partial<ResourceData>) {
    const next = resources.map((r, i) => (i === index ? { ...r, ...changes } : r));
    setResources(next);
    onChange(serializeResources(next));
  }

  function add() {
    const next = [...resources, { ...EMPTY_RESOURCE }];
    setResources(next);
  }

  function remove(index: number) {
    const next = resources.filter((_, i) => i !== index);
    setResources(next.length ? next : [EMPTY_RESOURCE]);
    onChange(serializeResources(next.length ? next : [EMPTY_RESOURCE]));
  }

  return (
    <div className="space-y-3">
      <div className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold">RESSOURCES</div>
      {resources.map((res, index) => (
        <div key={index} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6d6d6d]">Ressource #{index + 1}</span>
            <button type="button" onClick={() => remove(index)} className="text-red-400/70 hover:text-red-400 p-0.5" title="Supprimer la ressource" disabled={resources.length <= 1}>
              <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px" }} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className={INPUT} value={res.label} onChange={(e) => update(index, { label: e.target.value })} placeholder="Titre de la ressource" />
            <input className={INPUT} value={res.url} onChange={(e) => update(index, { url: e.target.value })} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select className={INPUT} value={res.kind} onChange={(e) => update(index, { kind: e.target.value })}>
              {KIND_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <input className={INPUT} value={res.why} onChange={(e) => update(index, { why: e.target.value })} placeholder="Pourquoi cette ressource est utile" />
          <input className={INPUT} value={res.how} onChange={(e) => update(index, { how: e.target.value })} placeholder="Comment l'utiliser" />
        </div>
      ))}
      <button type="button" onClick={add} className="text-[11px] text-[#4F8EF7] hover:underline inline-flex items-center gap-1">
        <iconify-icon icon="lucide:plus" style={{ fontSize: "12px" }} />
        Ajouter une ressource
      </button>
    </div>
  );
}
