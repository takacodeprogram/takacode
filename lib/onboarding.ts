import { normalizeText as readString, normalizeArray as readArray, NextStep } from "./utils";

const DEFAULT_GOAL_KEY = "website";
const DEFAULT_LEVEL_KEY = "beginner";
const DEFAULT_CLARITY_KEY = "explore";
const DEFAULT_WEEKLY_COMMITMENT_KEY = "2_to_5";

const LEGACY_GOAL_KEY_MAP: Record<string, string> = {
  data_collection: "data_analysis",
  agritech: "custom_projects"
};

export interface Option {
  key: string;
  label: string;
  icon?: string;
  accent?: string;
}

export const GOAL_OPTIONS: Option[] = [
  { key: "website", label: "Site web", icon: "lucide:globe", accent: "#4F8EF7" },
  { key: "wordpress_nocode", label: "WordPress No-Code Elementor", icon: "lucide:layout", accent: "#9C59D6" },
  { key: "web_app", label: "Application web", icon: "lucide:monitor-smartphone", accent: "#9B6DFF" },
  { key: "mobile_app", label: "Application mobile", icon: "lucide:smartphone", accent: "#06B6D4" },
  { key: "automation_ai", label: "Automatisation et IA", icon: "lucide:bot", accent: "#22D3EE" },
  { key: "data_analysis", label: "Analyse et visualisation de donnees", icon: "lucide:bar-chart-3", accent: "#10B981" },
  { key: "videos_youtube", label: "Contenu et videos", icon: "lucide:clapperboard", accent: "#F97316" },
  { key: "podcast_audio", label: "Musique et audio", icon: "lucide:mic-2", accent: "#EC4899" },
  { key: "digital_business", label: "Business digital", icon: "lucide:rocket", accent: "#F59E0B" },
  { key: "marketing_online", label: "Marketing et presence en ligne", icon: "lucide:megaphone", accent: "#EF4444" },
  { key: "web3", label: "Web3 et blockchain", icon: "lucide:wallet", accent: "#38BDF8" },
  { key: "three_d", label: "3D et experiences immersives", icon: "lucide:box", accent: "#8B5CF6" },
  { key: "custom_projects", label: "Outils et projets personnalises", icon: "lucide:wrench", accent: "#14B8A6" },
  { key: "paid_ads", label: "Publicite payante et media buying", icon: "lucide:target", accent: "#EF4444" },
  { key: "learn_explore", label: "Apprendre et explorer", icon: "lucide:graduation-cap", accent: "#A78BFA" },
  { key: "other", label: "Autre", icon: "lucide:sparkles", accent: "#A78BFA" }
];

export const LEVEL_OPTIONS: Option[] = [
  { key: "beginner", label: "Je debute completement" },
  { key: "basics", label: "J'ai deja quelques bases" },
  { key: "projects", label: "J'ai deja realise quelques projets" },
  { key: "advanced", label: "Je veux surtout me perfectionner" }
];

export const PROJECT_CLARITY_OPTIONS: Option[] = [
  { key: "clear_idea", label: "Oui, je sais exactement ce que je veux faire" },
  { key: "some_ideas", label: "J'ai quelques idees" },
  { key: "explore", label: "Pas encore, je veux explorer" }
];

export const TOOL_OPTIONS: string[] = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Cursor",
  "GitHub Copilot",
  "n8n",
  "Make",
  "Zapier",
  "Power BI",
  "Python",
  "React",
  "WordPress",
  "Webflow",
  "Framer",
  "Shopify",
  "Figma",
  "Notion",
  "Airtable",
  "Excel",
  "Google Sheets",
  "Canva",
  "Ableton Live",
  "FL Studio",
  "CapCut",
  "Premiere Pro",
  "After Effects",
  "KoboCollect",
  "YouTube",
  "TikTok",
  "Autre"
];

export const WEEKLY_COMMITMENT_OPTIONS: Option[] = [
  { key: "lt_2", label: "Moins de 2h" },
  { key: "2_to_5", label: "2 a 5h" },
  { key: "5_to_10", label: "5 a 10h" },
  { key: "gt_10", label: "Plus de 10h" }
];

interface RecommendationPreset {
  parcoursTitle: string;
  parcoursMeta: string;
  resources: string[];
  objective: string;
  nextSession: string;
  nextSteps: { label: string; state: string }[];
}

const RECOMMENDATION_PRESETS: Record<string, RecommendationPreset> = {
  website: {
    parcoursTitle: "Parcours Site Web",
    parcoursMeta: "12 semaines - Débutant",
    resources: ["Guide HTML/CSS", "Introduction a JavaScript", "Projet : Site vitrine"],
    objective: "Construire ton premier site web.",
    nextSession: "Mercredi 20h00",
    nextSteps: [
      { label: "Decouvrir HTML", state: "done" },
      { label: "Faire l'exercice 1", state: "current" },
      { label: "Construire le header", state: "locked" }
    ]
  },
  wordpress_nocode: {
    parcoursTitle: "Parcours WordPress No-Code Elementor",
    parcoursMeta: "8 semaines - Débutant",
    resources: ["WP Addict : Elementor complet", "Elementor Academy", "Hello Theme + Templates"],
    objective: "Creer et publier un site WordPress pro sans coder avec Elementor.",
    nextSession: "Mardi 19h00",
    nextSteps: [
      { label: "Installer WordPress + Elementor", state: "done" },
      { label: "Construire la page d'accueil", state: "current" },
      { label: "Publier et connecter domaine", state: "locked" }
    ]
  },
  web_app: {
    parcoursTitle: "Parcours Application Web",
    parcoursMeta: "14 semaines - Débutant",
    resources: ["Bases JavaScript", "Introduction React", "Projet : outil web complet"],
    objective: "Publier ta premiere application web complete.",
    nextSession: "Jeudi 20h00",
    nextSteps: [
      { label: "Revoir JavaScript moderne", state: "done" },
      { label: "Creer les composants React", state: "current" },
      { label: "Connecter une base de donnees", state: "locked" }
    ]
  },
  mobile_app: {
    parcoursTitle: "Parcours Application Mobile",
    parcoursMeta: "14 semaines - Débutant",
    resources: ["UI mobile", "React Native bases", "Projet : app mobile MVP"],
    objective: "Publier ta premiere application mobile.",
    nextSession: "Lundi 19h30",
    nextSteps: [
      { label: "Structurer les ecrans", state: "done" },
      { label: "Coder la navigation", state: "current" },
      { label: "Tester et publier", state: "locked" }
    ]
  },
  three_d: {
    parcoursTitle: "Parcours 3D et Experiences Immersives",
    parcoursMeta: "12 semaines - Creation",
    resources: ["Blender foundations", "Modélisation 3D", "Projet : scene interactive"],
    objective: "Creer des experiences 3D pour le web, le jeu ou la visualisation.",
    nextSession: "Samedi 19h00",
    nextSteps: [
      { label: "Prendre en main Blender", state: "done" },
      { label: "Modeliser un premier asset", state: "current" },
      { label: "Animer et exporter", state: "locked" }
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
    parcoursTitle: "Parcours Analyse et Visualisation de Donnees",
    parcoursMeta: "10 semaines - Debutant",
    resources: ["Excel propre", "Power BI de base", "Projet : dashboard KPI"],
    objective: "Transformer des donnees en tableaux de bord utiles.",
    nextSession: "Lundi 20h00",
    nextSteps: [
      { label: "Nettoyer un jeu de donnees", state: "done" },
      { label: "Creer les premiers KPI", state: "current" },
      { label: "Partager ton dashboard", state: "locked" }
    ]
  },
  videos_youtube: {
    parcoursTitle: "Parcours Contenu et Videos",
    parcoursMeta: "8 semaines - Creation",
    resources: ["Script efficace", "Montage video", "Projet : plan contenu 30 jours"],
    objective: "Produire du contenu regulier pour le web et les reseaux.",
    nextSession: "Mercredi 18h30",
    nextSteps: [
      { label: "Definir ton angle editorial", state: "done" },
      { label: "Produire le premier episode", state: "current" },
      { label: "Optimiser publication et SEO", state: "locked" }
    ]
  },
  podcast_audio: {
    parcoursTitle: "Parcours Musique et Audio",
    parcoursMeta: "8 semaines - Creation",
    resources: ["Home studio minimal", "Mixage et mastering", "Projet : morceau ou episode pilote"],
    objective: "Produire un projet musical ou audio de qualite et le publier.",
    nextSession: "Jeudi 19h00",
    nextSteps: [
      { label: "Choisir ton format", state: "done" },
      { label: "Composer ou enregistrer une premiere version", state: "current" },
      { label: "Finaliser et publier", state: "locked" }
    ]
  },
  digital_business: {
    parcoursTitle: "Parcours Business Digital",
    parcoursMeta: "12 semaines - Build",
    resources: ["Positionnement offre", "Tunnel de vente", "Projet : MVP monetisable"],
    objective: "Lancer un produit numerique, SaaS ou activite en ligne.",
    nextSession: "Mardi 19h30",
    nextSteps: [
      { label: "Clarifier ton offre", state: "done" },
      { label: "Construire le MVP", state: "current" },
      { label: "Lancer les premieres ventes", state: "locked" }
    ]
  },
  web3: {
    parcoursTitle: "Parcours Web3 et Blockchain",
    parcoursMeta: "12 semaines - Build",
    resources: ["Bases blockchain", "Smart contracts", "Projet : dApp MVP"],
    objective: "Construire une application Web3 avec wallet et smart contract.",
    nextSession: "Jeudi 20h30",
    nextSteps: [
      { label: "Comprendre wallets et reseaux", state: "done" },
      { label: "Coder ton premier smart contract", state: "current" },
      { label: "Connecter ton front-end", state: "locked" }
    ]
  },
  marketing_online: {
    parcoursTitle: "Parcours Marketing Digital",
    parcoursMeta: "10 semaines - Execution",
    resources: ["Bases SEO", "Strategie reseaux sociaux", "Projet : plan marketing 90 jours"],
    objective: "Construire une presence en ligne qui attire et convertit.",
    nextSession: "Jeudi 19h30",
    nextSteps: [
      { label: "Definir ton audience", state: "done" },
      { label: "Construire ton plan de contenu", state: "current" },
      { label: "Lancer tes campagnes", state: "locked" }
    ]
  },
  custom_projects: {
    parcoursTitle: "Parcours Projet Personnalise",
    parcoursMeta: "12 semaines - Sur mesure",
    resources: ["Cadrage du besoin", "Choix des outils", "Projet : solution personnalisee"],
    objective: "Construire une solution adaptee a un besoin precis.",
    nextSession: "Mercredi 20h00",
    nextSteps: [
      { label: "Definir le resultat cible", state: "done" },
      { label: "Decouper le projet en sprints", state: "current" },
      { label: "Construire une premiere version", state: "locked" }
    ]
  },
  paid_ads: {
    parcoursTitle: "Parcours Media Buyer",
    parcoursMeta: "6 semaines - Execution",
    resources: ["Meta Business Suite", "Google Ads", "TikTok Ads", "Google Analytics", "Pixel"],
    objective: "Gerer un budget publicitaire de 1000 euros avec un ROAS positif et des campagnes optimisees.",
    nextSession: "Mercredi 20h00",
    nextSteps: [
      { label: "Fondamentaux du media buying", state: "done" },
      { label: "Facebook et Instagram Ads", state: "current" },
      { label: "Google Ads et tracking", state: "locked" },
      { label: "Scaling et optimisation", state: "locked" }
    ]
  },
  learn_explore: {
    parcoursTitle: "Parcours Decouverte",
    parcoursMeta: "6 semaines - Exploration",
    resources: ["Parcours d'initiation", "Exercices pratiques", "Mini-projet guide"],
    objective: "Explorer plusieurs domaines avant de choisir ton prochain cap.",
    nextSession: "Lundi 19h00",
    nextSteps: [
      { label: "Explorer les fondamentaux", state: "done" },
      { label: "Realiser un mini-projet", state: "current" },
      { label: "Choisir ton parcours cible", state: "locked" }
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

export interface GoalOption extends Option {
  icon: string;
  accent: string;
}

export interface OnboardingRecommendation {
  goalKey?: string;
  goalLabel?: string;
  parcoursTitle: string;
  parcoursMeta: string;
  resources: string[];
  objective: string;
  nextSession: string;
  nextSteps: NextStep[];
}

export interface OnboardingProfile {
  goalKey: string;
  goalLabel: string;
  levelKey: string;
  levelLabel: string;
  projectClarityKey: string;
  projectClarityLabel: string;
  projectIdea: string;
  tools: string[];
  weeklyCommitmentKey: string;
  weeklyCommitmentLabel: string;
  progress: number;
  recommendation: OnboardingRecommendation;
}

function findOption(options: Option[], key: string | undefined, fallbackKey: string): Option {
  const normalizedKey = readString(key);
  const direct = options.find((option) => option.key === normalizedKey);
  if (direct) {
    return direct;
  }

  const fallback = options.find((option) => option.key === fallbackKey);
  return fallback || options[0];
}

export function findGoalOption(goalKey: string): GoalOption | undefined {
  const normalizedKey = readString(goalKey);
  const mappedKey = LEGACY_GOAL_KEY_MAP[normalizedKey] || normalizedKey;
  const found = findOption(GOAL_OPTIONS, mappedKey, DEFAULT_GOAL_KEY);
  return GOAL_OPTIONS.find((o) => o.key === found.key) as GoalOption | undefined;
}

export function buildOnboardingRecommendation(goalKey = DEFAULT_GOAL_KEY): OnboardingRecommendation {
  const goal = findGoalOption(goalKey);
  const preset = RECOMMENDATION_PRESETS[goal!.key] || RECOMMENDATION_PRESETS[DEFAULT_GOAL_KEY];

  return {
    goalKey: goal!.key,
    goalLabel: goal!.label,
    parcoursTitle: preset.parcoursTitle,
    parcoursMeta: preset.parcoursMeta,
    resources: [...preset.resources],
    objective: preset.objective,
    nextSession: preset.nextSession,
    nextSteps: preset.nextSteps.map((step) => ({ ...step }))
  };
}

export function isOnboardingCompleted(user: { user_metadata?: Record<string, unknown> } | null | undefined): boolean {
  return user?.user_metadata?.onboarding_completed === true;
}

export function getOnboardingProfile(user: { user_metadata?: Record<string, unknown> } | null | undefined): OnboardingProfile {
  const metadata = user?.user_metadata ?? {};
  const profile = (typeof metadata.onboarding_profile === "object" && metadata.onboarding_profile !== null
    ? metadata.onboarding_profile
    : {}) as Record<string, unknown>;

  const goal = findGoalOption(profile.goal_key as string);
  const level = findOption(LEVEL_OPTIONS, profile.level_key as string, DEFAULT_LEVEL_KEY);
  const clarity = findOption(PROJECT_CLARITY_OPTIONS, profile.project_clarity as string, DEFAULT_CLARITY_KEY);
  const weeklyCommitment = findOption(WEEKLY_COMMITMENT_OPTIONS, profile.weekly_commitment as string, DEFAULT_WEEKLY_COMMITMENT_KEY);

  const fallbackRecommendation = buildOnboardingRecommendation(goal!.key);
  const rawRecommendation = (typeof profile.recommendation === "object" && profile.recommendation !== null
    ? profile.recommendation
    : {}) as Record<string, unknown>;

  const normalizedResources = readArray<string>(rawRecommendation.resources)
    .map((item) => readString(item))
    .filter(Boolean);

  const normalizedNextSteps = readArray<unknown>(rawRecommendation.next_steps)
    .map((step: unknown): NextStep | null => {
      if (typeof step !== "object" || step === null) {
        return null;
      }

      const s = step as Record<string, unknown>;
      const label = readString(s.label);
      if (!label) {
        return null;
      }

      const state = readString(s.state) || "locked";
      return { label, state };
    })
    .filter(Boolean) as NextStep[];

  const normalizedTools = readArray<string>(profile.tools)
    .map((item) => readString(item))
    .filter(Boolean)
    .slice(0, 12);

  const rawProgress = Number(profile.progress);
  const progress = Number.isFinite(rawProgress)
    ? Math.max(0, Math.min(100, Math.round(rawProgress)))
    : 8;

  return {
    goalKey: goal!.key,
    goalLabel: readString(profile.goal_label) || goal!.label,
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
