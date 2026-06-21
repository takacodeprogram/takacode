const DEFAULT_GOAL_KEY = "website";
const DEFAULT_LEVEL_KEY = "beginner";
const DEFAULT_CLARITY_KEY = "explore";
const DEFAULT_WEEKLY_COMMITMENT_KEY = "2_to_5";

const LEGACY_GOAL_KEY_MAP = {
  data_collection: "data_analysis",
  agritech: "custom_projects"
};

export const GOAL_OPTIONS = [
  { key: "website", label: "Site web", icon: "lucide:globe", accent: "#4F8EF7" },
  { key: "web_app", label: "Application web", icon: "lucide:monitor-smartphone", accent: "#9B6DFF" },
  { key: "mobile_app", label: "Application mobile", icon: "lucide:smartphone", accent: "#06B6D4" },
  { key: "automation_ai", label: "Automatisation et IA", icon: "lucide:bot", accent: "#22D3EE" },
  { key: "data_analysis", label: "Analyse et visualisation de donn\u00E9es", icon: "lucide:bar-chart-3", accent: "#10B981" },
  { key: "videos_youtube", label: "Contenu et vid\u00E9os", icon: "lucide:clapperboard", accent: "#F97316" },
  { key: "podcast_audio", label: "Podcast et audio", icon: "lucide:mic-2", accent: "#EC4899" },
  { key: "digital_business", label: "Business digital", icon: "lucide:rocket", accent: "#F59E0B" },
  { key: "marketing_online", label: "Marketing et pr\u00E9sence en ligne", icon: "lucide:megaphone", accent: "#EF4444" },
  { key: "custom_projects", label: "Outils et projets personnalis\u00E9s", icon: "lucide:wrench", accent: "#14B8A6" },
  { key: "learn_explore", label: "Apprendre et explorer", icon: "lucide:graduation-cap", accent: "#A78BFA" },
  { key: "other", label: "Autre", icon: "lucide:sparkles", accent: "#A78BFA" }
];

export const LEVEL_OPTIONS = [
  { key: "beginner", label: "Je d\u00E9bute compl\u00E8tement" },
  { key: "basics", label: "J'ai d\u00E9j\u00E0 quelques bases" },
  { key: "projects", label: "J'ai d\u00E9j\u00E0 r\u00E9alis\u00E9 quelques projets" },
  { key: "advanced", label: "Je veux surtout me perfectionner" }
];

export const PROJECT_CLARITY_OPTIONS = [
  { key: "clear_idea", label: "Oui, je sais exactement ce que je veux faire" },
  { key: "some_ideas", label: "J'ai quelques id\u00E9es" },
  { key: "explore", label: "Pas encore, je veux explorer" }
];

export const TOOL_OPTIONS = [
  "ChatGPT",
  "Claude",
  "n8n",
  "Make",
  "Power BI",
  "Python",
  "React",
  "Excel",
  "Canva",
  "CapCut",
  "KoboCollect",
  "YouTube",
  "Autre"
];

export const WEEKLY_COMMITMENT_OPTIONS = [
  { key: "lt_2", label: "Moins de 2h" },
  { key: "2_to_5", label: "2 \u00E0 5h" },
  { key: "5_to_10", label: "5 \u00E0 10h" },
  { key: "gt_10", label: "Plus de 10h" }
];

const RECOMMENDATION_PRESETS = {
  website: {
    parcoursTitle: "Parcours Site Web",
    parcoursMeta: "12 semaines - D\u00E9butant",
    resources: ["Guide HTML/CSS", "Introduction \u00E0 JavaScript", "Projet : Site vitrine"],
    objective: "Construire ton premier site web.",
    nextSession: "Mercredi 20h00",
    nextSteps: [
      { label: "D\u00E9couvrir HTML", state: "done" },
      { label: "Faire l'exercice 1", state: "current" },
      { label: "Construire le header", state: "locked" }
    ]
  },
  web_app: {
    parcoursTitle: "Parcours Application Web",
    parcoursMeta: "14 semaines - D\u00E9butant +",
    resources: ["Bases JavaScript", "Introduction React", "Projet : outil web complet"],
    objective: "Publier ta premi\u00E8re application web compl\u00E8te.",
    nextSession: "Jeudi 20h00",
    nextSteps: [
      { label: "Revoir JavaScript moderne", state: "done" },
      { label: "Cr\u00E9er les composants React", state: "current" },
      { label: "Connecter une base de donn\u00E9es", state: "locked" }
    ]
  },
  mobile_app: {
    parcoursTitle: "Parcours Application Mobile",
    parcoursMeta: "14 semaines - D\u00E9butant +",
    resources: ["UI mobile", "React Native bases", "Projet : app mobile MVP"],
    objective: "Publier ta premi\u00E8re application mobile.",
    nextSession: "Lundi 19h30",
    nextSteps: [
      { label: "Structurer les \u00E9crans", state: "done" },
      { label: "Coder la navigation", state: "current" },
      { label: "Tester et publier", state: "locked" }
    ]
  },
  automation_ai: {
    parcoursTitle: "Parcours Automatisation et IA",
    parcoursMeta: "10 semaines - Pratique",
    resources: ["Guide n8n", "Prompts robustes", "Projet : assistant m\u00E9tier"],
    objective: "Automatiser un workflow m\u00E9tier avec IA.",
    nextSession: "Mardi 20h30",
    nextSteps: [
      { label: "Map des t\u00E2ches \u00E0 automatiser", state: "done" },
      { label: "Cr\u00E9er ton premier sc\u00E9nario n8n", state: "current" },
      { label: "Ajouter la couche IA", state: "locked" }
    ]
  },
  data_analysis: {
    parcoursTitle: "Parcours Analyse et Visualisation de Donnees",
    parcoursMeta: "10 semaines - D\u00E9butant",
    resources: ["Excel propre", "Power BI de base", "Projet : dashboard KPI"],
    objective: "Transformer des donn\u00E9es en tableaux de bord utiles.",
    nextSession: "Lundi 20h00",
    nextSteps: [
      { label: "Nettoyer un jeu de donn\u00E9es", state: "done" },
      { label: "Cr\u00E9er les premiers KPI", state: "current" },
      { label: "Partager ton dashboard", state: "locked" }
    ]
  },
  videos_youtube: {
    parcoursTitle: "Parcours Contenu et Videos",
    parcoursMeta: "8 semaines - Cr\u00E9ation",
    resources: ["Script efficace", "Montage vid\u00E9o", "Projet : plan contenu 30 jours"],
    objective: "Produire du contenu r\u00E9gulier pour le web et les r\u00E9seaux.",
    nextSession: "Mercredi 18h30",
    nextSteps: [
      { label: "D\u00E9finir ton angle \u00E9ditorial", state: "done" },
      { label: "Produire le premier \u00E9pisode", state: "current" },
      { label: "Optimiser publication et SEO", state: "locked" }
    ]
  },
  podcast_audio: {
    parcoursTitle: "Parcours Podcast et Audio",
    parcoursMeta: "8 semaines - D\u00E9butant",
    resources: ["Mat\u00E9riel minimal", "Script audio", "Projet : \u00E9pisode pilote"],
    objective: "Lancer un podcast ou un contenu audio avec une ligne claire.",
    nextSession: "Jeudi 19h00",
    nextSteps: [
      { label: "Choisir le format", state: "done" },
      { label: "Enregistrer l'\u00E9pisode pilote", state: "current" },
      { label: "Distribuer sur les plateformes", state: "locked" }
    ]
  },
  digital_business: {
    parcoursTitle: "Parcours Business Digital",
    parcoursMeta: "12 semaines - Build",
    resources: ["Positionnement offre", "Tunnel de vente", "Projet : MVP mon\u00E9tisable"],
    objective: "Lancer un produit num\u00E9rique, SaaS ou activit\u00E9 en ligne.",
    nextSession: "Mardi 19h30",
    nextSteps: [
      { label: "Clarifier ton offre", state: "done" },
      { label: "Construire le MVP", state: "current" },
      { label: "Lancer les premi\u00E8res ventes", state: "locked" }
    ]
  },
  marketing_online: {
    parcoursTitle: "Parcours Marketing Digital",
    parcoursMeta: "10 semaines - Ex\u00E9cution",
    resources: ["Bases SEO", "Strat\u00E9gie r\u00E9seaux sociaux", "Projet : plan marketing 90 jours"],
    objective: "Construire une pr\u00E9sence en ligne qui attire et convertit.",
    nextSession: "Jeudi 19h30",
    nextSteps: [
      { label: "D\u00E9finir ton audience", state: "done" },
      { label: "Construire ton plan de contenu", state: "current" },
      { label: "Lancer tes campagnes", state: "locked" }
    ]
  },
  custom_projects: {
    parcoursTitle: "Parcours Projet Personnalise",
    parcoursMeta: "12 semaines - Sur mesure",
    resources: ["Cadrage du besoin", "Choix des outils", "Projet : solution personnalis\u00E9e"],
    objective: "Construire une solution adapt\u00E9e \u00E0 un besoin pr\u00E9cis.",
    nextSession: "Mercredi 20h00",
    nextSteps: [
      { label: "D\u00E9finir le r\u00E9sultat cible", state: "done" },
      { label: "D\u00E9couper le projet en sprints", state: "current" },
      { label: "Construire une premi\u00E8re version", state: "locked" }
    ]
  },
  learn_explore: {
    parcoursTitle: "Parcours Decouverte",
    parcoursMeta: "6 semaines - Exploration",
    resources: ["Parcours d'initiation", "Exercices pratiques", "Mini-projet guid\u00E9"],
    objective: "Explorer plusieurs domaines avant de choisir ton prochain cap.",
    nextSession: "Lundi 19h00",
    nextSteps: [
      { label: "Explorer les fondamentaux", state: "done" },
      { label: "R\u00E9aliser un mini-projet", state: "current" },
      { label: "Choisir ton parcours cible", state: "locked" }
    ]
  },
  other: {
    parcoursTitle: "Parcours Projet Personnalise",
    parcoursMeta: "12 semaines - Sur mesure",
    resources: ["Cadrage du besoin", "Roadmap claire", "Projet : premi\u00E8re version"],
    objective: "Transformer ton id\u00E9e en feuille de route ex\u00E9cutable.",
    nextSession: "Mercredi 20h00",
    nextSteps: [
      { label: "D\u00E9finir ton r\u00E9sultat cible", state: "done" },
      { label: "Choisir le bon parcours", state: "current" },
      { label: "Lancer ton premier sprint", state: "locked" }
    ]
  }
};

function readString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function readArray(value) {
  return Array.isArray(value) ? value : [];
}

function findOption(options, key, fallbackKey) {
  const normalizedKey = readString(key);
  const direct = options.find((option) => option.key === normalizedKey);
  if (direct) {
    return direct;
  }

  const fallback = options.find((option) => option.key === fallbackKey);
  return fallback || options[0];
}

export function findGoalOption(goalKey) {
  const normalizedKey = readString(goalKey);
  const mappedKey = LEGACY_GOAL_KEY_MAP[normalizedKey] || normalizedKey;
  return findOption(GOAL_OPTIONS, mappedKey, DEFAULT_GOAL_KEY);
}

export function buildOnboardingRecommendation(goalKey = DEFAULT_GOAL_KEY) {
  const goal = findGoalOption(goalKey);
  const preset = RECOMMENDATION_PRESETS[goal.key] || RECOMMENDATION_PRESETS[DEFAULT_GOAL_KEY];

  return {
    goalKey: goal.key,
    goalLabel: goal.label,
    parcoursTitle: preset.parcoursTitle,
    parcoursMeta: preset.parcoursMeta,
    resources: [...preset.resources],
    objective: preset.objective,
    nextSession: preset.nextSession,
    nextSteps: preset.nextSteps.map((step) => ({ ...step }))
  };
}

export function isOnboardingCompleted(user) {
  return user?.user_metadata?.onboarding_completed === true;
}

export function getOnboardingProfile(user) {
  const metadata = user?.user_metadata ?? {};
  const profile = typeof metadata.onboarding_profile === "object" && metadata.onboarding_profile !== null
    ? metadata.onboarding_profile
    : {};

  const goal = findGoalOption(profile.goal_key);
  const level = findOption(LEVEL_OPTIONS, profile.level_key, DEFAULT_LEVEL_KEY);
  const clarity = findOption(PROJECT_CLARITY_OPTIONS, profile.project_clarity, DEFAULT_CLARITY_KEY);
  const weeklyCommitment = findOption(WEEKLY_COMMITMENT_OPTIONS, profile.weekly_commitment, DEFAULT_WEEKLY_COMMITMENT_KEY);

  const fallbackRecommendation = buildOnboardingRecommendation(goal.key);
  const rawRecommendation = typeof profile.recommendation === "object" && profile.recommendation !== null
    ? profile.recommendation
    : {};

  const normalizedResources = readArray(rawRecommendation.resources)
    .map((item) => readString(item))
    .filter(Boolean);

  const normalizedNextSteps = readArray(rawRecommendation.next_steps)
    .map((step) => {
      if (typeof step !== "object" || step === null) {
        return null;
      }

      const label = readString(step.label);
      if (!label) {
        return null;
      }

      const state = readString(step.state) || "locked";
      return { label, state };
    })
    .filter(Boolean);

  const normalizedTools = readArray(profile.tools)
    .map((item) => readString(item))
    .filter(Boolean)
    .slice(0, 12);

  const rawProgress = Number(profile.progress);
  const progress = Number.isFinite(rawProgress)
    ? Math.max(0, Math.min(100, Math.round(rawProgress)))
    : 8;

  return {
    goalKey: goal.key,
    goalLabel: readString(profile.goal_label) || goal.label,
    levelKey: level.key,
    levelLabel: readString(profile.level_label) || level.label,
    projectClarityKey: clarity.key,
    projectClarityLabel: readString(profile.project_clarity_label) || clarity.label,
    projectIdea: readString(profile.project_idea),
    tools: normalizedTools,
    weeklyCommitmentKey: weeklyCommitment.key,
    weeklyCommitmentLabel: readString(profile.weekly_commitment_label) || weeklyCommitment.label,
    progress,
    recommendation: {
      parcoursTitle: readString(rawRecommendation.parcours_title) || fallbackRecommendation.parcoursTitle,
      parcoursMeta: readString(rawRecommendation.parcours_meta) || fallbackRecommendation.parcoursMeta,
      resources: normalizedResources.length ? normalizedResources : fallbackRecommendation.resources,
      objective: readString(rawRecommendation.objective) || fallbackRecommendation.objective,
      nextSession: readString(rawRecommendation.next_session) || fallbackRecommendation.nextSession,
      nextSteps: normalizedNextSteps.length ? normalizedNextSteps : fallbackRecommendation.nextSteps
    }
  };
}
