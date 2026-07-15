const GOAL_COMPETENCY_MAP = {
  website: [
    "Structurer une page web propre",
    "Creer un design responsive",
    "Optimiser SEO et performance",
    "Mettre en ligne sur Vercel"
  ],
  web_app: [
    "Concevoir une architecture front claire",
    "Construire des composants React reutilisables",
    "Brancher API et base de donnees",
    "Gerer auth et roles utilisateur"
  ],
  mobile_app: [
    "Creer des ecrans mobiles fluides",
    "Organiser navigation et etats",
    "Connecter notifications et backend",
    "Publier une app testable"
  ],
  automation_ai: [
    "Mapper un workflow metier",
    "Automatiser avec n8n ou Make",
    "Integrer un agent IA utile",
    "Superviser les executions"
  ],
  data_analysis: [
    "Nettoyer des jeux de donnees",
    "Construire des KPI actionnables",
    "Visualiser dans un dashboard",
    "Presenter des insights decisions"
  ],
  videos_youtube: [
    "Definir une ligne editoriale",
    "Structurer un script efficace",
    "Monter et publier proprement",
    "Optimiser miniatures et retention"
  ],
  podcast_audio: [
    "Preparer un format audio clair",
    "Enregistrer avec bonne qualite",
    "Mixer et masteriser rapidement",
    "Publier sur les plateformes"
  ],
  digital_business: [
    "Positionner une offre claire",
    "Creer un MVP monetisable",
    "Structurer acquisition et vente",
    "Suivre conversion et revenu"
  ],
  marketing_online: [
    "Definir audience et message",
    "Planifier contenu multicanal",
    "Lancer des campagnes testables",
    "Mesurer ROI des actions"
  ],
  web3: [
    "Comprendre wallets et chaines",
    "Coder un smart contract simple",
    "Connecter wallet au front",
    "Deployer une dApp de base"
  ],
  three_d: [
    "Modeliser des assets 3D",
    "Animer une scene interactive",
    "Exporter vers web ou produit",
    "Optimiser rendu et fluidite"
  ],
  custom_projects: [
    "Cadrer un besoin client",
    "Choisir le stack adapte",
    "Decouper en sprints realistes",
    "Livrer une V1 fonctionnelle"
  ],
  learn_explore: [
    "Tester plusieurs domaines tech",
    "Identifier tes points forts",
    "Construire un mini-projet guide",
    "Choisir ton prochain cap"
  ],
  other: [
    "Transformer une idee en plan",
    "Prioriser les etapes critiques",
    "Executer un premier sprint",
    "Mesurer les premiers resultats"
  ]
};

export function getLevelChipClass(levelLabel) {
  const normalized = String(levelLabel || "").toLowerCase();

  if (normalized.includes("fondation")) {
    return "level-foundations";
  }

  if (normalized.includes("debutant")) {
    return "level-beginner";
  }

  if (normalized.includes("inter") || normalized.includes("build") || normalized.includes("execution") || normalized.includes("pratique")) {
    return "level-intermediate";
  }

  return "level-advanced";
}

export function toProgress(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numeric)));
}

export function toTextList(values, limit = 4) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, limit);
}

export function buildTrackCompetencies(track) {
  const goalKey = String(track?.goalKey || track?.goal_key || "").trim();

  const mapped = toTextList(GOAL_COMPETENCY_MAP[goalKey], 4);
  if (mapped.length) {
    return mapped;
  }

  const fromResources = toTextList(track?.resources, 4);
  if (fromResources.length) {
    return fromResources;
  }

  const rawSteps = Array.isArray(track?.nextSteps)
    ? track.nextSteps
    : Array.isArray(track?.next_steps)
      ? track.next_steps
      : [];

  const fromSteps = toTextList(rawSteps.map((step) => step?.label), 4);
  if (fromSteps.length) {
    return fromSteps;
  }

  return [
    "Construire un plan de progression",
    "Executer des exercices pratiques",
    "Finaliser un projet concret"
  ];
}

export function getStepUi(stepState) {
  const state = String(stepState || "locked").toLowerCase();

  if (state === "done") {
    return {
      icon: "lucide:check",
      chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
    };
  }

  if (state === "current") {
    return {
      icon: "lucide:play",
      chip: "border-blue-500/30 bg-blue-500/10 text-blue-200"
    };
  }

  return {
    icon: "lucide:lock",
    chip: "border-white/[0.12] bg-white/[0.03] text-[#7a7a7a]"
  };
}

export function buildStepRows(track) {
  const rawSteps = Array.isArray(track?.nextSteps)
    ? track.nextSteps
    : Array.isArray(track?.next_steps)
      ? track.next_steps
      : [];

  const fromTrack = rawSteps
    .map((step) => {
      const label = String(step?.label || "").trim();
      if (!label) {
        return null;
      }

      return {
        label,
        state: String(step?.state || "locked").trim().toLowerCase() || "locked"
      };
    })
    .filter(Boolean);

  if (fromTrack.length) {
    return fromTrack.slice(0, 4);
  }

  return [
    { label: "Demarrer le parcours", state: "current" },
    { label: "Completer la premiere pratique", state: "locked" },
    { label: "Finaliser le mini-projet", state: "locked" }
  ];
}
