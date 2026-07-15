// Ordre conseille des parcours TakaCode.
//
// Le but : guider le membre sur QUEL parcours suivre et DANS QUEL ORDRE, par ex.
// comprendre l'IA avant d'attaquer les parcours qui s'appuient dessus. Rien n'est
// bloquant (le deblocage reel reste au niveau des modules) : ce sont des conseils.
//
// order  : plus petit = a suivre en premier (tri du catalogue).
// level  : etiquette de niveau affichee.
// prereq : slugs de parcours conseilles avant celui-ci.
// tagline: une phrase d'accroche sur la place du parcours dans le parcours global.

const GUIDANCE = {
  "bases-internet": {
    order: 0,
    level: "Fondations",
    prereq: [],
    tagline: "Les fondations : comment marche Internet, les IP, le DNS, la securite et l'hebergement."
  },
  "ia-fondamentaux": {
    order: 1,
    level: "Debutant",
    prereq: [],
    tagline: "Commence ici : comprends l'IA avant de la faire travailler pour toi."
  },
  "full-vibe-coding": {
    order: 2,
    level: "Debutant",
    prereq: ["ia-fondamentaux"],
    tagline: "Construis et publie ton projet avec l'IA, sans apprendre a coder."
  },
  "dev-web-assiste-ia": {
    order: 3,
    level: "DebutantPlus",
    prereq: ["ia-fondamentaux", "bases-internet"],
    tagline: "Apprends le developpement web avec l'IA comme copilote."
  }
};

const DEFAULT_GUIDANCE = { order: 50, level: "", prereq: [], tagline: "" };

export function getTrackGuidance(slug) {
  const key = typeof slug === "string" ? slug.trim().toLowerCase() : "";
  return GUIDANCE[key] || DEFAULT_GUIDANCE;
}

// Trie une liste de parcours (objets avec .slug) selon l'ordre conseille, puis titre.
export function orderTracksByGuidance(tracks) {
  return [...(tracks || [])].sort((a, b) => {
    const ga = getTrackGuidance(a?.slug).order;
    const gb = getTrackGuidance(b?.slug).order;
    if (ga !== gb) {
      return ga - gb;
    }
    return String(a?.title || "").localeCompare(String(b?.title || ""));
  });
}

// Prerequis conseilles qui ne sont pas encore demarres/termines par le membre.
// startedSlugs : Set (ou tableau) des slugs deja demarres ou termines.
// trackTitleBySlug : map slug -> titre, pour afficher un libelle lisible.
export function missingPrerequisites(slug, startedSlugs, trackTitleBySlug = {}) {
  const started = startedSlugs instanceof Set ? startedSlugs : new Set(startedSlugs || []);
  const prereq = getTrackGuidance(slug).prereq || [];

  return prereq
    .filter((prereqSlug) => !started.has(prereqSlug))
    .map((prereqSlug) => ({
      slug: prereqSlug,
      title: trackTitleBySlug[prereqSlug] || getTrackGuidance(prereqSlug).tagline || prereqSlug
    }));
}

const LEVEL_CHIP = {
  Fondations: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  Debutant: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  DebutantPlus: "border-teal-500/30 bg-teal-500/10 text-teal-100",
  Intermediaire: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  Avance: "border-violet-500/30 bg-violet-500/10 text-violet-200"
};

export function guidanceLevelChip(level) {
  return LEVEL_CHIP[level] || "border-white/[0.1] bg-white/[0.03] text-[#9f9f9f]";
}
