interface TrackGuidance {
  order: number;
  level: string;
  prereq: string[];
  tagline: string;
}

const GUIDANCE: Record<string, TrackGuidance> = {
  "bases-internet": {
    order: 0,
    level: "Fondations",
    prereq: [],
    tagline: "Les fondations : comment marche Internet, les IP, le DNS, la sécurité et l'hébergement."
  },
  "ia-fondamentaux": {
    order: 1,
    level: "Débutant",
    prereq: [],
    tagline: "Commence ici : comprends l'IA avant de la faire travailler pour toi."
  },
  "full-vibe-coding": {
    order: 2,
    level: "Débutant",
    prereq: ["ia-fondamentaux"],
    tagline: "Construis et publie ton projet avec l'IA, sans apprendre à coder."
  },
  "dev-web-assiste-ia": {
    order: 3,
    level: "Débutant",
    prereq: ["ia-fondamentaux", "bases-internet"],
    tagline: "Apprends le développement web avec l'IA comme copilote."
  },
  "creation-contenu-ia": {
    order: 4,
    level: "Débutant",
    prereq: ["ia-fondamentaux"],
    tagline: "Lance une chaîne YouTube faceless rentable, sans sonner robotique."
  },
  "produits-digitaux": {
    order: 5,
    level: "Débutant",
    prereq: ["ia-fondamentaux"],
    tagline: "Crée et vends ton premier produit digital — la voie directe vers le premier euro."
  },
  "media-buyer": {
    order: 6,
    level: "Intermédiaire",
    prereq: ["ia-fondamentaux"],
    tagline: "Achète du trafic rentable : Facebook Ads, Google Ads et TikTok Ads pour générer des ventes."
  },
  "automatisation-ia": {
    order: 7,
    level: "Intermédiaire",
    prereq: ["ia-fondamentaux"],
    tagline: "Automatise les tâches répétitives et déploie un chatbot IA — puis vends-le en service."
  },
  "web3-blockchain": {
    order: 8,
    level: "Avancé",
    prereq: ["ia-fondamentaux", "bases-internet"],
    tagline: "Du wallet au smart contract vérifié sur testnet — des compétences rares qui se vendent."
  },
  "bot-trading-ia": {
    order: 9,
    level: "Avancé",
    prereq: ["ia-fondamentaux", "automatisation-ia"],
    tagline: "Ta stratégie codée par l'IA, backtestée et disciplinée — l'outil avant les promesses."
  }
};

const DEFAULT_GUIDANCE: TrackGuidance = { order: 50, level: "", prereq: [], tagline: "" };

export function getTrackGuidance(slug: string): TrackGuidance {
  const key = typeof slug === "string" ? slug.trim().toLowerCase() : "";
  return GUIDANCE[key] || DEFAULT_GUIDANCE;
}

interface TrackWithSlug {
  slug?: string;
  title?: string;
}

export function orderTracksByGuidance<T extends TrackWithSlug>(tracks: T[]): T[] {
  return [...(tracks || [])].sort((a, b) => {
    const ga = getTrackGuidance(a?.slug!).order;
    const gb = getTrackGuidance(b?.slug!).order;
    if (ga !== gb) {
      return ga - gb;
    }
    return String(a?.title || "").localeCompare(String(b?.title || ""));
  });
}

interface PrereqInfo {
  slug: string;
  title: string;
}

export function missingPrerequisites(slug: string, startedSlugs: Set<string> | string[], trackTitleBySlug: Record<string, string> = {}): PrereqInfo[] {
  const started = startedSlugs instanceof Set ? startedSlugs : new Set(startedSlugs || []);
  const prereq = getTrackGuidance(slug).prereq || [];

  return prereq
    .filter((prereqSlug) => !started.has(prereqSlug))
    .map((prereqSlug) => ({
      slug: prereqSlug,
      title: trackTitleBySlug[prereqSlug] || getTrackGuidance(prereqSlug).tagline || prereqSlug
    }));
}

const LEVEL_CHIP: Record<string, string> = {
  Fondations: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  "Débutant": "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  "Intermédiaire": "border-amber-500/30 bg-amber-500/10 text-amber-100",
  "Avancé": "border-violet-500/30 bg-violet-500/10 text-violet-200",
  Expert: "border-red-500/30 bg-red-500/10 text-red-200"
};

export function guidanceLevelChip(level: string): string {
  return LEVEL_CHIP[level] || "border-white/[0.1] bg-white/[0.03] text-[#9f9f9f]";
}
