import Link from "next/link";
import type { UserProject } from "../lib/userProjects";
import DeclareFirstEuro from "./DeclareFirstEuro";

// Cockpit projet : l'element central du dashboard.
// Repond a une seule question : ou en est mon projet sur la route
// Idee -> Construction -> En ligne -> Cash, et quelle est la prochaine action.

interface ProjectCockpitProps {
  project: UserProject | null;
  firstName: string;
  goalLabel: string;
}

interface PipelineStage {
  key: string;
  label: string;
  icon: string;
  hint: string;
}

const STAGES: PipelineStage[] = [
  { key: "idea", label: "Idée", icon: "lucide:lightbulb", hint: "Cadre ton idée" },
  { key: "build", label: "Construction", icon: "lucide:hammer", hint: "Construis brique par brique" },
  { key: "live", label: "En ligne", icon: "lucide:rocket", hint: "Publie ton projet" },
  { key: "cash", label: "Cash", icon: "lucide:banknote", hint: "Génère ton premier euro" }
];

// Indice du stade courant sur la route vers le cash.
function currentStageIndex(project: UserProject): number {
  if (project.liveUrl || project.status === "published") {
    return 3; // en ligne -> prochain combat : le cash
  }
  if (project.status === "in_progress" || project.repoUrl) {
    return 1;
  }
  return 0;
}

// Progression vers la mise en ligne : 4 jalons concrets.
function launchProgress(project: UserProject): number {
  const checkpoints = [
    Boolean(project.description || project.objective),
    Boolean(project.repoUrl),
    Boolean(project.liveUrl),
    project.status === "published"
  ];
  const done = checkpoints.filter(Boolean).length;
  return Math.round((done / checkpoints.length) * 100);
}

function formatDeadline(deadline: string): string {
  if (!deadline) return "";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const formatted = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  if (days < 0) return `${formatted} (depassee)`;
  if (days === 0) return `${formatted} (aujourd'hui !)`;
  return `${formatted} (J-${days})`;
}

export default function ProjectCockpit({ project, firstName, goalLabel }: ProjectCockpitProps) {
  if (!project) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 animate-fade-up-d1">
        <div className="section-label mb-2">Mon projet</div>
        <h2 className="font-valorax text-[clamp(24px,3.4vw,38px)] leading-[0.95] mb-2">BONJOUR {firstName.toUpperCase()}</h2>
        <p className="font-body-readable text-[14px] text-[#a5a5a5] leading-relaxed mb-5">
          Tout commence par un projet. Definis ce que tu veux construire : il devient ton fil rouge,
          et les parcours t'accompagnent jusqu'a la mise en ligne et tes premiers revenus.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/projets/nouveau" className="btn-primary inline-flex items-center gap-2">
            Créer mon projet
            <iconify-icon icon="lucide:rocket" style={{ fontSize: "14px" }} />
          </Link>
          <Link href="/dashboard/projets" className="btn-secondary">Voir des exemples</Link>
        </div>
      </section>
    );
  }

  const stageIndex = currentStageIndex(project);
  const progress = launchProgress(project);
  const deadlineLabel = formatDeadline(project.deadline);
  const isLive = stageIndex >= 3;
  const revenueLabels: Record<string, string> = {
    vente: "Vente directe",
    abonnement: "Abonnement",
    publicite: "Publicite",
    affiliation: "Affiliation",
    freelance: "Freelance"
  };

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 animate-fade-up-d1">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <div className="section-label">Mon projet</div>
        <div className="flex items-center gap-2 flex-wrap">
          {project.revenueModel ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
              <iconify-icon icon="lucide:banknote" style={{ fontSize: "11px" }} />
              {revenueLabels[project.revenueModel] || project.revenueModel}
            </span>
          ) : null}
          {deadlineLabel ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-100">
              <iconify-icon icon="lucide:calendar-clock" style={{ fontSize: "11px" }} />
              {deadlineLabel}
            </span>
          ) : null}
        </div>
      </div>

      <h2 className="font-valorax text-[clamp(22px,3vw,34px)] leading-[0.95] mb-1.5">{project.title.toUpperCase()}</h2>
      <p className="font-body-readable text-[13px] text-[#a5a5a5] leading-relaxed mb-5">
        {project.objective || project.description || goalLabel}
      </p>

      {/* Pipeline Idee -> Construction -> En ligne -> Cash */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {STAGES.map((stage, index) => {
          const done = index < stageIndex;
          const current = index === stageIndex;
          return (
            <div
              key={stage.key}
              className={`rounded-xl border px-2.5 py-2.5 text-center transition-colors ${
                done
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : current
                    ? "border-blue-500/35 bg-blue-500/10 step-active"
                    : "border-white/[0.08] bg-white/[0.02] opacity-60"
              }`}
            >
              <iconify-icon
                icon={done ? "lucide:check-circle" : stage.icon}
                style={{ fontSize: "16px", color: done ? "#6ee7b7" : current ? "#89c7ff" : "#666" }}
              />
              <div className={`text-[10px] font-semibold mt-1 ${done ? "text-emerald-200" : current ? "text-blue-100" : "text-[#777]"}`}>
                {stage.label}
              </div>
              {current ? (
                <div className="font-body-readable text-[9px] text-[#8d8d8d] leading-tight mt-0.5 hidden sm:block">{stage.hint}</div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Progression vers la mise en ligne / objectif cash */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 mb-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[11px] text-[#9b9b9b] font-body-readable">
            {isLive ? "Projet en ligne — objectif : ton premier euro" : "Progression vers la mise en ligne"}
          </span>
          <span className="text-[11px] text-[#89c7ff] font-semibold">{progress}%</span>
        </div>
        <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden mb-2.5">
          <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-[#9b9b9b] hover:text-white transition-colors">
              <iconify-icon icon="lucide:github" style={{ fontSize: "12px" }} />
              Depot
            </a>
          ) : null}
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 hover:text-emerald-200 transition-colors">
              <iconify-icon icon="lucide:globe" style={{ fontSize: "12px" }} />
              Voir en ligne
            </a>
          ) : null}
          {project.trackTitle ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#777]">
              <iconify-icon icon="lucide:map" style={{ fontSize: "12px" }} />
              Accelere par : {project.trackTitle}
            </span>
          ) : null}
          {isLive ? (
            <DeclareFirstEuro projectId={project.id} alreadyDeclared={project.hasDeclaredFirstEuro} />
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/dashboard/projets/${project.id}`} className="btn-primary inline-flex items-center gap-2">
          Ouvrir mon projet
          <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
        </Link>
        <Link href="/dashboard/projets" className="btn-secondary">Tous mes projets</Link>
      </div>
    </section>
  );
}
