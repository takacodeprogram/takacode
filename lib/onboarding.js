const DEFAULT_GOAL_KEY = "website";
const DEFAULT_LEVEL_KEY = "beginner";
const DEFAULT_CLARITY_KEY = "explore";
const DEFAULT_WEEKLY_COMMITMENT_KEY = "2_to_5";

export const GOAL_OPTIONS = [
  { key: "website", label: "Site web", icon: "lucide:globe" },
  { key: "web_app", label: "Application web", icon: "lucide:monitor-smartphone" },
  { key: "automation_ai", label: "Automatisation et IA", icon: "lucide:bot" },
  { key: "data_analysis", label: "Analyse de donnees", icon: "lucide:bar-chart-3" },
  { key: "data_collection", label: "Collecte de donnees", icon: "lucide:clipboard-list" },
  { key: "agritech", label: "Agritech", icon: "lucide:leaf" },
  { key: "videos_youtube", label: "Videos et YouTube", icon: "lucide:video" },
  { key: "podcast_audio", label: "Podcast et audio", icon: "lucide:mic-2" },
  { key: "digital_business", label: "Lancer un business digital", icon: "lucide:rocket" },
  { key: "mobile_app", label: "Application mobile", icon: "lucide:smartphone" },
  { key: "other", label: "Autre", icon: "lucide:sparkles" }
];

export const LEVEL_OPTIONS = [
  { key: "beginner", label: "Je debute completement" },
  { key: "basics", label: "J'ai deja quelques bases" },
  { key: "projects", label: "J'ai deja realise quelques projets" },
  { key: "advanced", label: "Je veux surtout me perfectionner" }
];

export const PROJECT_CLARITY_OPTIONS = [
  { key: "clear_idea", label: "Oui, je sais exactement ce que je veux faire" },
  { key: "some_ideas", label: "J'ai quelques idees" },
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
  { key: "2_to_5", label: "2 a 5h" },
  { key: "5_to_10", label: "5 a 10h" },
  { key: "gt_10", label: "Plus de 10h" }
];

const RECOMMENDATION_PRESETS = {
  website: {
    parcoursTitle: "Parcours Developpement Web",
    parcoursMeta: "12 semaines - Debutant",
    resources: ["Guide HTML/CSS", "Introduction a JavaScript", "Projet : Site vitrine"],
    objective: "Construire ton premier site web.",
    nextSession: "Mercredi 20h00",
    nextSteps: [
      { label: "Decouvrir HTML", state: "done" },
      { label: "Faire l'exercice 1", state: "current" },
      { label: "Construire le header", state: "locked" }
    ]
  },
  web_app: {
    parcoursTitle: "Parcours Application Web",
    parcoursMeta: "14 semaines - Debutant +",
    resources: ["Bases JavaScript", "Introduction React", "Projet : CRUD complet"],
    objective: "Publier ta premiere application web complete.",
    nextSession: "Jeudi 20h00",
    nextSteps: [
      { label: "Revoir JavaScript moderne", state: "done" },
      { label: "Creer les composants React", state: "current" },
      { label: "Connecter une base de donnees", state: "locked" }
    ]
  },
  automation_ai: {
    parcoursTitle: "Parcours Automatisation et IA",
    parcoursMeta: "10 semaines - Pratique",
    resources: ["Guide n8n", "Prompts robustes", "Projet : assistant metier"],
    objective: "Automatiser un workflow metier avec IA.",
    nextSession: "Mardi 20h30",
    nextSteps: [
      { label: "Map des taches a automatiser", state: "done" },
      { label: "Creer ton premier scenario n8n", state: "current" },
      { label: "Ajouter la couche IA", state: "locked" }
    ]
  },
  data_analysis: {
    parcoursTitle: "Parcours Data Analytics",
    parcoursMeta: "10 semaines - Debutant",
    resources: ["Excel propre", "Power BI de base", "Projet : dashboard KPI"],
    objective: "Construire un dashboard utile pour tes decisions.",
    nextSession: "Lundi 20h00",
    nextSteps: [
      { label: "Nettoyer un jeu de donnees", state: "done" },
      { label: "Creer les premiers KPI", state: "current" },
      { label: "Partager ton dashboard", state: "locked" }
    ]
  },
  data_collection: {
    parcoursTitle: "Parcours Collecte Terrain",
    parcoursMeta: "8 semaines - Terrain",
    resources: ["KoboCollect setup", "Structurer un formulaire", "Projet : collecte terrain"],
    objective: "Mettre en place une collecte de donnees fiable.",
    nextSession: "Samedi 16h00",
    nextSteps: [
      { label: "Definir les indicateurs", state: "done" },
      { label: "Construire le formulaire", state: "current" },
      { label: "Analyser les resultats", state: "locked" }
    ]
  },
  agritech: {
    parcoursTitle: "Parcours Agritech",
    parcoursMeta: "12 semaines - Projet",
    resources: ["Cas terrain", "Data agricole", "Projet : suivi production"],
    objective: "Construire un systeme digital utile pour le terrain.",
    nextSession: "Vendredi 19h30",
    nextSteps: [
      { label: "Cadrer le probleme terrain", state: "done" },
      { label: "Designer la solution", state: "current" },
      { label: "Lancer un pilote", state: "locked" }
    ]
  },
  videos_youtube: {
    parcoursTitle: "Parcours Videos et YouTube",
    parcoursMeta: "8 semaines - Creation",
    resources: ["Script efficace", "Montage CapCut", "Projet : serie YouTube"],
    objective: "Publier des videos regulieres avec un systeme simple.",
    nextSession: "Mercredi 18h30",
    nextSteps: [
      { label: "Definir ton angle editorial", state: "done" },
      { label: "Produire le premier episode", state: "current" },
      { label: "Optimiser publication et SEO", state: "locked" }
    ]
  },
  podcast_audio: {
    parcoursTitle: "Parcours Podcast et Audio",
    parcoursMeta: "8 semaines - Debutant",
    resources: ["Materiel minimal", "Script audio", "Projet : episode pilote"],
    objective: "Lancer un podcast avec une ligne claire.",
    nextSession: "Jeudi 19h00",
    nextSteps: [
      { label: "Choisir le format", state: "done" },
      { label: "Enregistrer l'episode pilote", state: "current" },
      { label: "Distribuer sur les plateformes", state: "locked" }
    ]
  },
  digital_business: {
    parcoursTitle: "Parcours Business Digital",
    parcoursMeta: "12 semaines - Build",
    resources: ["Positionnement offre", "Tunnel de vente", "Projet : MVP monetisable"],
    objective: "Passer d'idee a offre digitale vendable.",
    nextSession: "Mardi 19h30",
    nextSteps: [
      { label: "Clarifier ton offre", state: "done" },
      { label: "Construire le MVP", state: "current" },
      { label: "Lancer les premieres ventes", state: "locked" }
    ]
  },
  mobile_app: {
    parcoursTitle: "Parcours Application Mobile",
    parcoursMeta: "14 semaines - Debutant +",
    resources: ["UI mobile", "React Native bases", "Projet : app mobile MVP"],
    objective: "Publier ta premiere application mobile.",
    nextSession: "Lundi 19h30",
    nextSteps: [
      { label: "Structurer les ecrans", state: "done" },
      { label: "Coder la navigation", state: "current" },
      { label: "Tester et publier", state: "locked" }
    ]
  },
  other: {
    parcoursTitle: "Parcours Projet Personnalise",
    parcoursMeta: "12 semaines - Sur mesure",
    resources: ["Cadrage du besoin", "Roadmap claire", "Projet : premiere version"],
    objective: "Transformer ton idee en feuille de route executable.",
    nextSession: "Mercredi 20h00",
    nextSteps: [
      { label: "Definir ton resultat cible", state: "done" },
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
  return findOption(GOAL_OPTIONS, goalKey, DEFAULT_GOAL_KEY);
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