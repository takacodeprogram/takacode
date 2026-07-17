"use client";

import Link from "next/link";

interface PreviewData {
  title: string;
  summary: string;
  objective: string;
  level_label: string;
  duration_weeks: string;
  accent_color: string;
  icon: string;
  slug: string;
}

function getLevelChipClass(level: string): string {
  const map: Record<string, string> = {
    foundations: "level-foundations",
    debutant: "level-beginner",
    intermediaire: "level-intermediate",
    avance: "level-advanced",
    expert: "level-advanced",
  };
  return map[level.toLowerCase().trim()] || "level-intermediate";
}

function formatMeta(level: string, weeks: string): string {
  const w = Number.parseInt(weeks, 10);
  return `${w > 0 ? w + " semaines" : ""} ${level ? "- " + level : ""}`.trim();
}

function getCompetencies(goalKey: string): string[] {
  const map: Record<string, string[]> = {
    web: ["HTML/CSS", "JavaScript", "Responsive", "UI/UX"],
    javascript: ["JavaScript", "ES6+", "DOM", "API"],
    python: ["Python", "Logique", "Algorithmes", "Donnees"],
    ai: ["IA", "Prompts", "Ethique", "Automatisation"],
    data: ["Donnees", "SQL", "Analyse", "Visualisation"],
    devops: ["DevOps", "CI/CD", "Cloud", "Docker"],
    mobile: ["Mobile", "React Native", "UI", "API"],
    design: ["Design", "UI/UX", "Figma", "Prototypage"],
  };
  return map[goalKey.toLowerCase().trim()] || ["Pratique", "Projet", "Autonomie", "Methodo"];
}

export default function TrackLivePreview({ data }: { data: PreviewData }) {
  const competencies = getCompetencies(data.objective || "");
  const levelChip = getLevelChipClass(data.level_label);
  const meta = formatMeta(data.level_label, data.duration_weeks);

  return (
    <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 card-hover project-card">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[10px] px-2 py-1 rounded-full border border-blue-400/25 bg-blue-500/10 text-blue-200 font-semibold">
          {data.slug ? `/${data.slug}` : "Apercu"}
        </span>
        <div className="flex items-center gap-2">
          <span className={`${levelChip} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
            {data.level_label || "Non defini"}
          </span>
        </div>
      </div>

      <div
        className="w-10 h-10 rounded-xl border flex items-center justify-center mb-3"
        style={{
          borderColor: `${data.accent_color}55`,
          background: `${data.accent_color}22`
        }}
      >
        <iconify-icon icon={data.icon || "lucide:route"} style={{ color: data.accent_color, fontSize: "18px" }} />
      </div>

      <h3 className="font-venite-italic text-[14px] text-white leading-tight mb-1.5">
        {data.title || "Titre du parcours"}
      </h3>

      <p className="font-body-readable text-[11px] text-[#6f6f6f] mb-3">{meta}</p>

      <p className="font-body-readable text-[11px] text-[#555] leading-relaxed mb-4">
        {(data.summary || data.objective || "Resume du parcours...").slice(0, 120)}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {competencies.map((c, i) => (
          <span
            key={`comp-${i}`}
            className="text-[10px] px-2 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#9f9f9f]"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="inline-flex items-center gap-2 text-[11px] text-[#4F8EF7] font-semibold">
        Voir les details
        <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
      </div>
    </article>
  );
}
