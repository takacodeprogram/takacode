/**
 * Fondations i18n pour TakaCode.
 *
 * Architecture simple et légère sans dépendance lourde :
 * - Traductions stockées dans des fichiers JSON par locale
 * - Détection de la langue du navigateur
 * - Fallback vers le français
 * - Supporte les locales : fr (défaut), en (en préparation)
 *
 * Usage côté client :
 *   import { useLocale } from "./i18n";
 *   const { t } = useLocale();
 *   t("navbar.projets") → "Projets"
 *
 * Usage côté serveur :
 *   import { getLocale } from "./i18n";
 *   const { t } = getLocale("en");
 *   t("home.hero.title") → "Learn by building"
 */

// ─── Locales supportées ─────────────────────────────────────────

export type Locale = "fr" | "en";

export const SUPPORTED_LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_LOCALE: Locale = "fr";

// ─── Types de traduction ────────────────────────────────────────

type TranslationValue = string | string[] | NestedTranslations;
interface NestedTranslations {
  [key: string]: TranslationValue;
}
export type Translations = Record<string, NestedTranslations>;

// ─── Traductions (version initiale : juste fr, structure pour en) ──

const FR: Translations = {
  navbar: {
    accueil: "Accueil",
    parcours: "Parcours",
    competences: "Compétences",
    projets: "Projets",
    communaute: "Communauté",
    classement: "Classement",
    connexion: "Connexion",
    commencer: "Commencer",
    tableauDeBord: "Tableau de bord",
    monProfil: "Mon profil",
    seDeconnecter: "Se déconnecter",
    ouvrirMenu: "Ouvrir le menu"
  },
  home: {
    hero: {
      badge: "Plateforme de création de projets",
      title1: "CREE TON PROJET.",
      title2: "PUBLIE ET MONETISE.",
      subtitle: "TakaCode t'aide à transformer tes idées en projets digitaux concrets, les publier en ligne et générer des revenus. Parcours guidés, templates, IA et communauté pour accélérer chaque étape.",
      ctaPrimary: "Commencer un projet",
      ctaSecondary: "Explorer les parcours projets",
      statMembers: "Membres inscrits",
      statProjects: "Projets réalisés",
      statTracks: "Parcours projets",
      roadmapLabel: "ROADMAP PROJET",
      roadmapStatus: "Progression active",
      roadmapIdea: "IDÉE",
      roadmapDone: "Complète",
      roadmapTrack: "Parcours",
      roadmapInProgress: "En cours",
      roadmapMonetization: "Monétisation",
      roadmapUpcoming: "À venir"
    },
    stats: {
      members: "Membres",
      lessons: "Leçons validées",
      projects: "Projets",
      likes: "Likes"
    }
  },
  footer: {
    tagline: "Crée, publie et monétise ton projet digital.",
    sections: {
      platform: "Plateforme",
      community: "Communauté",
      account: "Compte",
      company: "Entreprise",
      legal: "Legal"
    },
    links: {
      parcours: "Parcours",
      competences: "Compétences",
      projets: "Projets",
      approche: "Approche",
      communaute: "Communauté",
      sessionsLive: "Sessions live",
      challenges: "Challenges",
      galerieProjets: "Galerie projets",
      connexion: "Connexion",
      inscription: "S'inscrire",
      monDashboard: "Mon dashboard",
      aPropos: "À propos",
      contact: "Contact",
      confidentialite: "Confidentialité",
      conditions: "Conditions"
    },
    copyright: "(c) 2025 TakaCode. Tous droits réservés.",
    footerLang: "Français"
  },
  values: {
    sectionLabel: "Plateforme",
    title: "Un cadre pour créer et monétiser",
    cards: {
      project: {
        title: "Projet central",
        desc: "Tout commence par ton projet. Les parcours, ressources et outils sont là pour t'aider à le réaliser, pas l'inverse."
      },
      ai: {
        title: "IA accélératrice",
        desc: "Utilise l'IA pour coder plus vite, mieux concevoir et automatiser les tâches répétitives de ton projet."
      },
      learning: {
        title: "Apprendre en construisant",
        desc: "Progresse en produisant des livrables concrets, pas seulement en accumulant de la théorie."
      },
      monetization: {
        title: "Monétisation",
        desc: "Chaque projet est conçu pour pouvoir être monétisé : abonnements, produits, pubs, affiliation."
      },
      community: {
        title: "Communauté active",
        desc: "Ne construis plus seul. Échange, collabore et progresse avec d'autres créateurs."
      },
      deploy: {
        title: "Du déploiement au revenu",
        desc: "De la première ligne de code à la première vente, on t'accompagne à chaque étape."
      }
    }
  },
  process: {
    sectionLabel: "PROCESSUS",
    title: "COMMENT ÇA MARCHE",
    subtitle: "De ton idée à ton projet rentable, un chemin clair et guidé.",
    steps: {
      idea: {
        title: "TON IDÉE",
        desc: "Tu as une idée de projet ou un problème à résoudre. On t'aide à la structurer."
      },
      track: {
        title: "LE PARCOURS LIÉ",
        desc: "Choisis le parcours qui correspond à ton archétype de projet (site, SaaS, e-commerce...)."
      },
      resources: {
        title: "RESSOURCES + IA",
        desc: "Accède aux ressources, templates, outils IA et exercices pour construire ton projet."
      },
      sessions: {
        title: "SESSIONS + MENTOR",
        desc: "Participe à des sessions live et fais reviewer tes livrables par un mentor."
      },
      publish: {
        title: "PUBLICATION",
        desc: "Déploie ton projet en ligne : GitHub, Vercel, domaine personnalisé."
      },
      monetize: {
        title: "MONÉTISATION",
        desc: "Génère des revenus : abonnements, produits digitaux, publicité, affiliation."
      }
    },
    cta: "Commencer mon projet"
  },
  community: {
    sectionLabel: "Communauté",      title1: "Une communauté",
      title2: "qui construit",
      subtitle: "Avance avec d'autres créateurs et partage tes progrès. Seul on va vite, ensemble on va loin.",
    cta: "Rejoindre la communauté",
    features: {
      challenges: {
        title: "Défis",
        desc: "Défis hebdomadaires et mensuels pour progresser."
      },
      studyGroups: {
        title: "Groupes d'étude",
        desc: "Étudie et construis avec d'autres membres."
      },
      sharing: {
        title: "Partage de projets",
        desc: "Publication et mise en avant de tes créations."
      },
      leaderboard: {
        title: "Classements",
        desc: "Suis ta progression et tes succès."
      }
    }
  },
  skills: {
    sectionLabel: "POSSIBILITÉS",
    title: "CE QUE TU PEUX CRÉER",
    tagsRow1: [
      "Sites web",
      "Applications web",
      "Automatisations",
      "Agents IA",
      "Web3 et blockchain",
      "3D immersif",
      "Musique",
      "Podcasts",
      "Chaînes YouTube",
      "Vidéos avec IA",
      "Analyse de données"
    ],
    tagsRow2: [
      "Tableaux de bord",
      "Web3 et blockchain",
      "3D et expériences immersives",
      "Produits numériques",
      "Business digitaux",
      "Outils SaaS",
      "Chatbots",
      "Applications mobiles",
      "IA générative"
    ]
  },
  faq: {
    sectionLabel: "FAQ",
    title1: "QUESTIONS",
    title2: "FRÉQUENTES",
    subtitle: "Une question sur la création de projet, la publication ou la monétisation ? La réponse est sûrement ici.",
    questions: {
      q1: "Dois-je savoir coder pour commencer ?",
      q2: "Puis-je commencer sans expérience ?",
      q3: "Comment les parcours aident à construire mon projet ?",
      q4: "Comment se déroulent les sessions live ?",
      q5: "Comment publier mes projets ?",
      q6: "Puis-je créer plusieurs projets ?"
    },
    answers: {
      q1: "Absolument pas. TakaCode est conçu pour les débutants complets. Les parcours commencent depuis zéro et l'assistant IA t'accompagne à chaque étape."
    }
  },
  dashboard: {
    myProject: "Mon projet",
    welcome: "Bonjour",
    startPrompt: "Tout commence par un projet. Définis ce que tu veux construire : il devient ton fil rouge, et les parcours t'accompagnent jusqu'à la mise en ligne et tes premiers revenus.",
    createProject: "Créer mon projet",
    seeExamples: "Voir des exemples",
    progressToLaunch: "Progression vers la mise en ligne",
    onlineGoal: "Projet en ligne — objectif : ton premier revenu",
    repo: "Dépôt",
    viewOnline: "Voir en ligne",
    acceleratedBy: "Accéléré par",
    openProject: "Ouvrir mon projet",
    allMyProjects: "Tous mes projets",
    pipeline: {
      idea: "Idée",
      build: "Construction",
      live: "En ligne",
      cash: "Cash"
    },
    hints: {
      idea: "Cadre ton idée",
      build: "Construis brique par brique",
      live: "Publie ton projet",
      cash: "Génère ton premier revenu"
    },
    deadline: {
      overdue: "dépassée",
      today: "aujourd'hui !",
      daysLeft: "J-"
    },
    revenueLabels: {
      vente: "Vente directe",
      abonnement: "Abonnement",
      publicite: "Publicité",
      affiliation: "Affiliation",
      freelance: "Freelance"
    }
  },
  profile: {
    edit: "ÉDITER MON PROFIL",
    avatar: "Avatar",
    moreSuggestions: "Autres propositions",
    removeAvatar: "Retirer l'avatar",
    publicName: "Nom public (leaderboard)",
    name: {
      generate: "Générer un pseudo",
      custom: "Écrire le mien",
      real: "Mon vrai nom"
    },
    namePlaceholder: "Ton pseudo public (sinon : Membre anonyme)",
    generatedPlaceholder: "Pseudo généré",
    regenerate: "Régénérer",
    realNameWarning: "Ton vrai nom sera affiché publiquement sur le classement.",
    bio: "Bio",
    bioPlaceholder: "Présente-toi : ton objectif, ton projet, ton parcours...",
    contentFormat: "Format du contenu",
    country: "Pays (leaderboard)",
    social: "Réseaux",
    socialFields: {
      website: "Site web"
    },
    skills: "Compétences",
    skillsPlaceholder: "HTML, CSS, React, Supabase (séparées par des virgules)",
    saving: "Enregistrement...",
    saved: "Profil enregistré.",
    saveError: "Impossible d'enregistrer le profil."
  },
  review: {
    empty: "Aucune soumission à revoir pour l'instant. Reviens plus tard !",
    feedbackPlaceholder: "Ton retour : ce qui est bien, ce qu'il faut améliorer...",
    approve: "Valider",
    requestChanges: "Demander des améliorations",
    validation: {
      peer: "Pairs",
      mentor: "Mentor",
      ai: "IA"
    },
    brief: "Consigne",
    error: {
      notAuthenticated: "Reconnecte-toi.",
      cannotReviewSelf: "Tu ne peux pas revoir ton propre travail.",
      invalidVerdict: "Verdict invalide.",
      commentRequired: "Ajoute un commentaire pour demander des améliorations.",
      forbidden: "Ce niveau de revue est réservé aux mentors.",
      notPending: "Cette soumission n'est plus en attente.",
      notReviewable: "Ce projet n'est pas en revue."
    }
  },
  revenue: {
    declared: "Premier revenu déclaré — bravo !",
    declare: "Déclarer mon premier revenu",
    amount: "Montant",
    confirming: "Confirmer",
    declaring: "Déclaration...",
    cancel: "Annuler",
    amountError: "Indique un montant valide",
    declaredSuccess: "Premier revenu déclaré :",
    networkError: "Erreur réseau"
  },
  notification: {
    bellLabel: "Notifications",
    loadingError: "Erreur lors du chargement des notifications",
    markReadError: "Erreur lors du marquage de la notification",
    markAllReadError: "Erreur lors du marquage de toutes les notifications",
    timeAgo: {
      justNow: "à l'instant",
      minutes: "il y a",
      hours: "il y a",
      days: "il y a"
    },
    min: "min",
    h: "h",
    j: "j"
  },
  project: {
    firstRevenue: "Premier revenu",
    firstRevenueDeclared: "Premier revenu déclaré — bravo !",
    declareFirstRevenue: "Déclarer mon premier revenu",
    declaring: "Déclaration...",
    currency: "Devise",
    revenueModel: "Modèle de revenu",
    status: {
      idea: "Idée",
      inProgress: "En cours",
      published: "Publié",
      archived: "Archivé"
    }
  },
  common: {
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    close: "Fermer",
    search: "Rechercher",
    seeAll: "Voir tout",
    noResults: "Aucun résultat",
    backToHome: "Retour à l'accueil"
  },
  auth: {
    signIn: "Se connecter",
    signUp: "Créer un compte",
    email: "Email",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    orContinueWith: "Ou continuer avec",
    noAccount: "Pas encore de compte ?",
    hasAccount: "Déjà un compte ?"
  }
};

const EN: Translations = {
  navbar: {
    accueil: "Home",
    parcours: "Tracks",
    competences: "Skills",
    projets: "Projects",
    communaute: "Community",
    classement: "Leaderboard",
    connexion: "Sign in",
    commencer: "Get started",
    tableauDeBord: "Dashboard",
    monProfil: "My profile",
    seDeconnecter: "Sign out",
    ouvrirMenu: "Open menu"
  },
  home: {
    hero: {
      badge: "Project creation platform",
      title1: "BUILD YOUR PROJECT.",
      title2: "DEPLOY & MONETIZE.",
      subtitle: "TakaCode helps you turn your ideas into real digital projects, publish them online, and generate revenue. Guided tracks, templates, AI, and a community to accelerate every step.",
      ctaPrimary: "Start a project",
      ctaSecondary: "Explore project tracks",
      statMembers: "Members",
      statProjects: "Projects built",
      statTracks: "Project tracks",
      roadmapLabel: "PROJECT ROADMAP",
      roadmapStatus: "Active progress",
      roadmapIdea: "IDEA",
      roadmapDone: "Done",
      roadmapTrack: "Track",
      roadmapInProgress: "In progress",
      roadmapMonetization: "Monetization",
      roadmapUpcoming: "Upcoming"
    },
    stats: {
      members: "Members",
      lessons: "Lessons completed",
      projects: "Projects",
      likes: "Likes"
    }
  },
  footer: {
    tagline: "Create, publish and monetize your digital project.",
    sections: {
      platform: "Platform",
      community: "Community",
      account: "Account",
      company: "Company",
      legal: "Legal"
    },
    links: {
      parcours: "Tracks",
      competences: "Skills",
      projets: "Projects",
      approche: "Approach",
      communaute: "Community",
      sessionsLive: "Live sessions",
      challenges: "Challenges",
      galerieProjets: "Project gallery",
      connexion: "Sign in",
      inscription: "Sign up",
      monDashboard: "My dashboard",
      aPropos: "About",
      contact: "Contact",
      confidentialite: "Privacy",
      conditions: "Terms"
    },
    copyright: "(c) 2025 TakaCode. All rights reserved.",
    footerLang: "English"
  },
  values: {
    sectionLabel: "Platform",
    title: "A framework to create and monetize",
    cards: {
      project: {
        title: "Project-first",
        desc: "Everything starts with your project. Tracks, resources, and tools exist to help you build it, not the other way around."
      },
      ai: {
        title: "AI accelerator",
        desc: "Use AI to code faster, design better, and automate repetitive tasks in your project."
      },
      learning: {
        title: "Learn by building",
        desc: "Progress by producing concrete deliverables, not just accumulating theory."
      },
      monetization: {
        title: "Monetization",
        desc: "Every project is designed to be monetized: subscriptions, products, ads, affiliate."
      },
      community: {
        title: "Active community",
        desc: "No more building alone. Exchange, collaborate, and grow with other creators."
      },
      deploy: {
        title: "From deploy to revenue",
        desc: "From the first line of code to the first sale, we guide you every step of the way."
      }
    }
  },
  process: {
    sectionLabel: "PROCESS",
    title: "HOW IT WORKS",
    subtitle: "From your idea to a profitable project, a clear guided path.",
    steps: {
      idea: {
        title: "YOUR IDEA",
        desc: "You have a project idea or a problem to solve. We help you structure it."
      },
      track: {
        title: "THE MATCHED TRACK",
        desc: "Choose the track that matches your project archetype (website, SaaS, e-commerce...)."
      },
      resources: {
        title: "RESOURCES + AI",
        desc: "Access resources, templates, AI tools and exercises to build your project."
      },
      sessions: {
        title: "SESSIONS + MENTOR",
        desc: "Join live sessions and get your deliverables reviewed by a mentor."
      },
      publish: {
        title: "PUBLISH",
        desc: "Deploy your project online: GitHub, Vercel, custom domain."
      },
      monetize: {
        title: "MONETIZE",
        desc: "Generate revenue: subscriptions, digital products, ads, affiliate."
      }
    },
    cta: "Start my project"
  },
  community: {
    sectionLabel: "Community",      title1: "A community",
      title2: "that builds",
      subtitle: "Move forward with other creators and share your progress. Alone you go fast, together you go far.",
    cta: "Join the community",
    features: {
      challenges: {
        title: "Challenges",
        desc: "Weekly and monthly challenges to progress."
      },
      studyGroups: {
        title: "Study groups",
        desc: "Study and build with other members."
      },
      sharing: {
        title: "Project sharing",
        desc: "Publish and showcase your creations."
      },
      leaderboard: {
        title: "Leaderboards",
        desc: "Track your progress and achievements."
      }
    }
  },
  skills: {
    sectionLabel: "SKILLS",
    title: "WHAT YOU CAN CREATE",
    tagsRow1: [
      "Websites",
      "Web apps",
      "Automations",
      "AI agents",
      "Web3 & blockchain",
      "Immersive 3D",
      "Music",
      "Podcasts",
      "YouTube channels",
      "AI videos",
      "Data analysis"
    ],
    tagsRow2: [
      "Dashboards",
      "Web3 & blockchain",
      "3D & immersive experiences",
      "Digital products",
      "Digital businesses",
      "SaaS tools",
      "Chatbots",
      "Mobile apps",
      "Generative AI"
    ]
  },
  faq: {
    sectionLabel: "FAQ",
    title1: "FREQUENTLY",
    title2: "ASKED QUESTIONS",
    subtitle: "A question about project creation, publishing or monetization? The answer is probably here.",
    questions: {
      q1: "Do I need to know how to code to start?",
      q2: "Can I start with no experience?",
      q3: "How do tracks help build my project?",
      q4: "How do live sessions work?",
      q5: "How do I publish my projects?",
      q6: "Can I create multiple projects?"
    },
    answers: {
      q1: "Not at all. TakaCode is designed for complete beginners. The tracks start from zero and the AI assistant guides you every step of the way."
    }
  },
  dashboard: {
    myProject: "My project",
    welcome: "Hello",
    startPrompt: "Everything starts with a project. Define what you want to build: it becomes your guiding thread, and the tracks accompany you all the way to launch and your first revenue.",
    createProject: "Create my project",
    seeExamples: "See examples",
    progressToLaunch: "Progress toward launch",
    onlineGoal: "Project live — goal: your first revenue",
    repo: "Repository",
    viewOnline: "View live",
    acceleratedBy: "Accelerated by",
    openProject: "Open my project",
    allMyProjects: "All my projects",
    pipeline: {
      idea: "Idea",
      build: "Build",
      live: "Live",
      cash: "Cash"
    },
    hints: {
      idea: "Frame your idea",
      build: "Build brick by brick",
      live: "Publish your project",
      cash: "Generate your first revenue"
    },
    deadline: {
      overdue: "overdue",
      today: "today!",
      daysLeft: "D-"
    },
    revenueLabels: {
      vente: "Direct sales",
      abonnement: "Subscription",
      publicite: "Advertising",
      affiliation: "Affiliate",
      freelance: "Freelance"
    }
  },
  profile: {
    edit: "EDIT MY PROFILE",
    avatar: "Avatar",
    moreSuggestions: "More suggestions",
    removeAvatar: "Remove avatar",
    publicName: "Public name (leaderboard)",
    name: {
      generate: "Generate a username",
      custom: "Write my own",
      real: "My real name"
    },
    namePlaceholder: "Your public name (otherwise: Anonymous member)",
    generatedPlaceholder: "Generated username",
    regenerate: "Regenerate",
    realNameWarning: "Your real name will be displayed publicly on the leaderboard.",
    bio: "Bio",
    bioPlaceholder: "Introduce yourself: your goal, your project, your journey...",
    contentFormat: "Content format",
    country: "Country (leaderboard)",
    social: "Social",
    socialFields: {
      website: "Website"
    },
    skills: "Skills",
    skillsPlaceholder: "HTML, CSS, React, Supabase (separated by commas)",
    saving: "Saving...",
    saved: "Profile saved.",
    saveError: "Could not save profile."
  },
  review: {
    empty: "No submissions to review for now. Come back later!",
    feedbackPlaceholder: "Your feedback: what's good, what needs improvement...",
    approve: "Approve",
    requestChanges: "Request changes",
    validation: {
      peer: "Peer",
      mentor: "Mentor",
      ai: "AI"
    },
    brief: "Brief",
    error: {
      notAuthenticated: "Please reconnect.",
      cannotReviewSelf: "You cannot review your own work.",
      invalidVerdict: "Invalid verdict.",
      commentRequired: "Add a comment to request changes.",
      forbidden: "This review level is reserved for mentors.",
      notPending: "This submission is no longer pending.",
      notReviewable: "This project is not under review."
    }
  },
  revenue: {
    declared: "First revenue declared — congrats!",
    declare: "Declare my first revenue",
    amount: "Amount",
    confirming: "Confirm",
    declaring: "Declaring...",
    cancel: "Cancel",
    amountError: "Enter a valid amount",
    declaredSuccess: "First revenue declared:",
    networkError: "Network error"
  },
  notification: {
    bellLabel: "Notifications",
    loadingError: "Error loading notifications",
    markReadError: "Error marking notification as read",
    markAllReadError: "Error marking all notifications as read",
    timeAgo: {
      justNow: "just now",
      minutes: "",
      hours: "",
      days: ""
    },
    min: "min ago",
    h: "h ago",
    j: "d ago"
  },
  project: {
    firstRevenue: "First revenue",
    firstRevenueDeclared: "First revenue declared — congrats!",
    declareFirstRevenue: "Declare my first revenue",
    declaring: "Declaring...",
    currency: "Currency",
    revenueModel: "Revenue model",
    status: {
      idea: "Idea",
      inProgress: "In progress",
      published: "Published",
      archived: "Archived"
    }
  },
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    search: "Search",
    seeAll: "See all",
    noResults: "No results",
    backToHome: "Back to home"
  },
  auth: {
    signIn: "Sign in",
    signUp: "Create account",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    orContinueWith: "Or continue with",
    noAccount: "No account yet?",
    hasAccount: "Already have an account?"
  }
};

// ─── Store des traductions ──────────────────────────────────────

const STORE: Record<Locale, Translations> = {
  fr: FR,
  en: EN
};

// ─── Helpers ─────────────────────────────────────────────────────

function resolveTranslation(obj: TranslationValue, path: string[]): string {
  let current: TranslationValue = obj;

  for (const key of path) {
    if (typeof current === "string") {
      return current;
    }
    if (Array.isArray(current)) {
      const idx = parseInt(key, 10);
      if (isNaN(idx) || idx < 0 || idx >= current.length) {
        return path.join(".");
      }
      const val = current[idx];
      return typeof val === "string" ? val : path.join(".");
    }
    const next = (current as NestedTranslations)[key];
    if (next === undefined) {
      return path.join(".");
    }
    current = next;
  }

  return typeof current === "string" ? current : path.join(".");
}

/**
 * Crée une fonction `t()` pour une locale donnée.
 * Utilise le chemin en dot-notation : t("navbar.projets")
 */
export function createT(locale: Locale) {
  const translations = STORE[locale] || STORE[DEFAULT_LOCALE];

  return (key: string, fallback?: string): string => {
    const parts = key.split(".");
    const result = resolveTranslation(translations as TranslationValue, parts);
    return result === key && fallback ? fallback : result;
  };
}

/**
 * Détecte la locale préférée de l'utilisateur côté serveur.
 * Accepte : "fr", "en", "fr-FR", "en-US", "en-GB", etc.
 */
export function detectLocale(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const locales = acceptLanguage
    .split(",")
    .map((l) => l.split(";")[0].trim().toLowerCase().slice(0, 2));

  for (const locale of locales) {
    if (SUPPORTED_LOCALES.includes(locale as Locale)) {
      return locale as Locale;
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Hook côté serveur : récupère la locale et la fonction t().
 * Usage : const { t, locale } = getLocale("en");
 */
export function getLocale(locale?: Locale | string): { t: ReturnType<typeof createT>; locale: Locale } {
  const normalized = SUPPORTED_LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;

  return {
    t: createT(normalized),
    locale: normalized
  };
}

/**
 * Retourne les URLs alternatives pour le SEO (hreflang).
 * À utiliser dans les metadata Next.js.
 */
export function getAlternateUrls(basePath: string): Record<string, string> {
  const base = basePath === "/" ? "" : basePath;
  const alternates: Record<string, string> = {};

  for (const locale of SUPPORTED_LOCALES) {
    const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
    alternates[locale] = `${prefix}${base}`;
  }

  return alternates;
}

/**
 * Hook React pour utiliser les traductions côté client.
 * Par défaut utilise "fr". À terme, lira la locale depuis un context/provider.
 *
 * Usage :
 *   const { t, locale } = useLocale();
 *   t("navbar.projets") → "Projets"
 */
export function useLocale(locale: Locale = DEFAULT_LOCALE) {
  const normalized = SUPPORTED_LOCALES.includes(locale)
    ? locale
    : DEFAULT_LOCALE;

  return {
    t: (key: string, fallback?: string) => createT(normalized)(key, fallback),
    locale: normalized
  };
}
