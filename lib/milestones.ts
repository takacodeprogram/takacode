import type { Module } from "./curriculum";
import type { UserProject } from "./userProjects";

export interface SprintMilestone {
  moduleIndex: number;
  sprintNumber: number;
  title: string;
  deliverable: string;
  totalLessons: number;
  completedLessons: number;
  cleared: boolean;
  state: "locked" | "current" | "completed";
  projectId?: string;
}

export function buildSprintMilestones(modules: Module[], project: UserProject | null): SprintMilestone[] {
  const deliverables: Record<string, string> = {
    "html-css": "Maquette statique du projet (HTML/CSS)",
    "automatisation-ia": "Script d'automatisation fonctionnel",
    "internet-basics": "Page web de base mise en ligne",
    "javascript": "Interface interactive fonctionnelle",
    "api-integration": "Projet connecte a une API externe",
    "database": "Projet avec persistance de donnees",
    "deployment": "Projet deploye en production",
    "fullstack": "Application fullstack complete",
    default: "Livrable fonctionnel du module"
  };

  return modules.map((mod, index) => {
    const slug = mod.slug?.toLowerCase() || "";
    const deliverable = Object.entries(deliverables).find(([key]) => slug.includes(key))?.[1]
      || deliverables.default;

    return {
      moduleIndex: index,
      sprintNumber: index + 1,
      title: mod.title,
      deliverable,
      totalLessons: mod.totalLessons || mod.lessons.length,
      completedLessons: mod.completedLessons || 0,
      cleared: mod.state === "completed",
      state: mod.state as "locked" | "current" | "completed",
      projectId: project?.id
    };
  });
}

export function computeProjectProgress(sprints: SprintMilestone[]): number {
  if (sprints.length === 0) return 0;
  const done = sprints.filter((s) => s.cleared).length;
  return Math.floor((done / sprints.length) * 100);
}

export function getSprintStatusLabel(state: string): string {
  switch (state) {
    case "completed": return "Sprint livre";
    case "current": return "Sprint en cours";
    default: return "Sprint verrouille";
  }
}

export function getSprintStatusChip(state: string): string {
  switch (state) {
    case "completed":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "current":
      return "border-blue-500/30 bg-blue-500/10 text-blue-200";
    default:
      return "border-white/[0.12] bg-white/[0.03] text-[#7a7a7a]";
  }
}
