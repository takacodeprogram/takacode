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
export const DEFAULT_LOCALE: Locale = "en";

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
    proposerParcours: "Proposer un parcours",
    centreAdmin: "Centre d'administration",
    seDeconnecter: "Se déconnecter",
    ouvrirMenu: "Ouvrir le menu",
    member: "Membre"
  },
  referral: {
    copy: "Copier",
    copied: "Copié !",
    description: "Chaque inscription via ton lien te fait gagner +100 points.",
    linkLabel: "Ton lien de parrainage"
  },
  glossary: {
    token: "Fragment de texte (mot, morceau de mot ou ponctuation) : l'unité de base que le LLM manipule à chaque étape.",
    tokens: "Fragments de texte (mots, morceaux de mots ou ponctuation) : les unités de base manipulées par le LLM.",
    LLM: "Large Language Model : modèle d'IA entraîné sur d'immenses corpus de textes. Il prédit le prochain token le plus probable.",
    contextWindow: "Quantité maximale de tokens que le modèle peut traiter en une seule fois : sa mémoire de travail.",
    hallucination: "Réponse plausible mais factuellement fausse générée par le modèle. Toujours vérifier les faits critiques.",
    mcp: "Model Context Protocol : standard ouvert pour connecter une IA à des outils externes (BDD, API, fichiers...).",
    rag: "Retrieval-Augmented Generation : technique qui injecte des documents pertinents dans le prompt pour que l'IA réponde sur tes données.",
    agent: "LLM équipé d'outils (fichiers, terminal, web...) qui travaille en boucle : planifie, agit, observe et recommence.",
    api: "Interface de programmation qui permet à des applications de communiquer entre elles.",
    fineTuning: "Entraînement supplémentaire d'un modèle sur des données spécifiques pour le spécialiser.",
    fewShot: "Technique de prompt : donner 2-3 exemples du résultat attendu pour calibrer le format et le style.",
    zeroShot: "Technique de prompt : demander directement sans exemple.",
    chainOfThought: "Technique de prompt : demander au modèle d'expliquer son raisonnement étape par étape avant la réponse finale.",
    systemPrompt: "Instruction de base donnée au LLM en début de contexte, qui définit son rôle, son ton et ses contraintes pour toute la conversation.",
    temperature: "Paramètre qui contrôle la créativité du modèle (0 = déterministe, 1 = très créatif).",
    topP: "Nucleus sampling : le modèle ne considère que les tokens dont la probabilité cumulée atteint le seuil P. Alternative à la température.",
    embedding: "Transformation d'un texte en vecteur de nombres réels qui représente son sens. Deux textes proches ont des vecteurs proches.",
    RAG: "Retrieval-Augmented Generation : technique qui injecte des documents pertinents dans le prompt pour que l'IA réponde sur tes données."
  },
  projectForm: {
    titleRequired: "Le titre du projet est obligatoire.",
    trackLinked: "Parcours accélérateur lié : tu y es inscrit.",
    saved: "Projet enregistré.",
    deleted: "Projet supprimé.",
    fileTooLarge: "Le fichier dépasse 5 Mo.",
    fileUploaded: "Fichier uploadé.",
    uploadFailed: "Échec de l'upload.",
    lesson: {
      fileTooLarge: "Le fichier dépasse 5 Mo.",
      uploaded: "Fichier uploadé.",
      uploadFailed: "Échec de l'upload.",
      microProjectSaved: "Ton micro-projet est enregistré. Bravo, continue !",
      trackCompleted: "Félicitations, tu as terminé tout le parcours !",
      aiValidated: "L'IA a validé ton travail.",
      lessonValidatedTitle: "LECON VALIDEE !",
      trackCompletedTitle: "PARCOURS TERMINE !"
    }
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
      roadmapUpcoming: "À venir",
      liveStatus: "En cours",
      floatingPublished: "PROJET PUBLIÉ",
      floatingWebApp: "Application web",
      floatingSessionLive: "SESSION LIVE",
      floatingSessionInfo: "Dans 2h - 34 inscrits"
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
    },
    title: "DASHBOARD",
    trainToAdvance: "SE FORMER POUR AVANCER",
    nextCompetence: "Prochaine competence a debloquer pour ton projet : {title}.",
    trackCompleted: "Parcours termine — toutes les competences sont debloquees pour ton projet.",
    continueLesson: "Continuer la leçon",
    startTraining: "Démarrer la formation",
    trackUnlocksSkills: "Ce parcours debloque les competences dont ton projet a besoin, sprint par sprint.",
    startThisTrack: "Démarrer ce parcours",
    myStats: "MES STATS",
    points: "Points",
    grade: "Grade",
    tracks: "Parcours",
    projectAccelerators: "ACCELERATEURS DE PROJET",
    viewAllCatalog: "Voir tout le catalogue",
    roadmapDescription: "Chaque parcours debloque des competences dont ton projet a besoin, dans l'ordre conseille : comprends l'IA, puis construis avec elle.",
    step: "Étape {n}",
    completed: "terminé",
    inProgress: "en cours",
    myTracks: "Mes parcours",
    myProjects: "Mes projets",
    leaderboard: "Classement",
    quickActions: "Actions rapides"
  },
  dashboardTracks: {
    title: "MES PARCOURS",
    exploreCatalog: "Explorer le catalogue",
    progress: "Progression",
    continue: "Continuer",
    start: "Demarrer",
    program: "Programme",
    emptyTitle: "AUCUN PARCOURS ACTIF",
    emptyDesc: "Choisis un parcours dans le catalogue pour commencer à apprendre et construire ton projet.",
    exploreTracks: "Explorer les parcours"
  },
  dashboardProjects: {
    title: "MES PROJETS",
    newProject: "Nouveau projet",
    schemaNotReady: "Table projets absente. Lance supabase/sql/008_user_projects.sql pour activer la creation de projets.",
    firstEuro: "1er euro",
    deadline: "Deadline",
    emptyTitle: "CREE TON PREMIER PROJET",
    emptyDesc: "Definis le projet que tu veux construire: titre, objectif, deadline. Il te servira de fil rouge pendant tes parcours.",
    microProjects: "MICRO-PROJETS REALISES",
    completed: "Valide",
    inProgress: "En cours",
    reviewLesson: "Revoir la leçon"
  },
  dashboardProjectDetail: {
    subtitle: "Editer mon projet",
    backLabel: "Mes projets",
    deliverables: "Livrables",
    acceleratorTrack: "Parcours accelerateur",
    lessonDrivesProject: "Chaque leçon validée fait avancer ce projet : les micro-projets du parcours sont tes livrables (listes ci-contre).",
    continueSprint: "Continuer le sprint",
    trackCompleted: "Parcours termine — revoir le programme",
    openTrack: "Ouvrir le parcours",
    chooseAccelerator: "Choisis ton accelerateur",
    suggestedTracks: "Parcours conseilles pour ce projet",
    noAccelerator: "Ce projet n'a pas encore de parcours accelerateur. Choisis-en un dans le champ \"Parcours accélérateur\" du formulaire : sa progression s'affichera ici.",
    viewAllTracks: "Voir tous les parcours",
    validated: "Valide",
    needsImprovement: "A améliorer",
    submitted: "Soumis"
  },
  dashboardProjectNew: {
    title: "NOUVEAU PROJET",
    subtitle: "Cree le projet que tu vas construire",
    backLabel: "Mes projets"
  },
  dashboardProfile: {
    title: "PROFIL",
    points: "Points",
    grade: "Grade",
    role: "Rôle",
    shareProgress: "Partager ma progression",
    shareText: "Je suis {grade} avec {points} XP sur TakaCode !"
  },
  dashboardResources: {
    title: "MES RESSOURCES",
    emptyTitle: "PAS ENCORE DE RESSOURCES",
    emptyDesc: "Inscris-toi a un parcours: toutes les ressources selectionnees de ses leçons apparaitront ici.",
    viewTracks: "Voir mes parcours"
  },
  dashboardCommunity: {
    title: "COMMUNAUTE",
    members: "Membres",
    projects: "Projets",
    likes: "Likes",
    lessons: "Leçons validées",
    noTrack: "Aucun parcours",
    viewCommunity: "Voir la communauté",
    emptyTitle: "LE FIL DEMARRE BIENTOT",
    emptyDesc: "Le fil de la communauté affichera les projets publiés par les membres. Termine un parcours et publie ton projet pour l'alimenter.",
    advanceTrack: "Avancer sur un parcours"
  },
  dashboardChangelog: {
    title: "NOUVEAUTES",
    subtitle: "TakaCode evolue avec toi",
    productJournal: "Journal produit",
    heading: "CHAQUE VERSION RAPPROCHE TON IDEE DE LA MISE EN LIGNE",
    description: "Retrouve ici les grands changements livres, les ameliorations en cours et ce qu'ils changent concretement dans ton experience.",
    currentVersion: "Version actuelle",
    latestVersion: "Dernière version",
    statusLivree: "Livree",
    statusEnCours: "En cours",
    statusPlanifiee: "Planifiee"
  },
  dashboardTools: {
    title: "OUTILS RECOMMANDES",
    subtitle: "Pour construire et mettre en ligne ton projet",
    schemaNotReady: "Section outils bientot disponible (execute supabase/sql/015_affiliate_links.sql).",
    empty: "Aucun outil recommande pour l'instant."
  },
  dashboardGuide: {
    title: "GUIDE DE DEMARRAGE",
    subtitle: "Les sections de ton espace",
    welcome: "Bienvenue ! Voici un tour rapide de ton espace. Clique sur une section pour t'y rendre.",
    startBuilding: "Commencer à construire"
  },
  dashboardMentor: {
    title: "MES PROPOSITIONS",
    subtitle: "Parcours proposés à la communauté",
    proposeTrack: "Proposer un parcours",
    info: "En tant que mentor, tes parcours sont {strong}valides par un admin{/strong} avant d'etre visibles publiquement.",
    pending: "En attente de validation",
    published: "Publie",
    rejected: "Refuse",
    edit: "Editer",
    empty: "Tu n'as pas encore propose de parcours.",
    firstProposal: "Proposer mon premier parcours"
  },
  dashboardMentorNew: {
    title: "PROPOSER UN PARCOURS",
    subtitle: "Sera valide par un admin",
    backLabel: "Mes propositions"
  },
  dashboardMentorEdit: {
    subtitle: "Ma proposition",
    backLabel: "Mes propositions",
    published: "Cette proposition a été validée et publiée. Merci pour ta contribution !",
    rejected: "Cette proposition n'a pas été retenue. Tu peux en proposer une nouvelle."
  },
  dashboardMentorLesson: {
    title: "EDITER LA LECON",
    backLabel: "Retour au parcours"
  },
  dashboardMentorNewLesson: {
    title: "NOUVELLE LECON",
    backLabel: "Retour au parcours"
  },
  dashboardReviews: {
    title: "REVUES",
    subtitle: "Relis et valide les micro-projets des autres",
    info: "Aide la communauté : donne un retour constructif. Chaque revue te rapporte des points.",
    schemaNotReady: "Revues bientot disponibles (execute supabase/sql/016_project_reviews.sql)."
  },
  dashboardSessions: {
    title: "SESSIONS LIVE",
    subtitle: "A venir et replays",
    schemaNotReady: "Table sessions absente. Lance supabase/sql/010_live_sessions.sql.",
    emptyTitle: "AUCUNE SESSION PROGRAMMEE",
    emptyDesc: "Les prochaines sessions live seront annoncees ici.",
    upcoming: "A VENIR",
    join: "Rejoindre",
    replays: "REPLAYS",
    review: "Revoir",
    dateToConfirm: "Date a confirmer"
  },
  dashboardDocs: {
    title: "DOCUMENTATION",
    subtitle: "Tout pour lancer ton projet",
    info: "TakaCode t'aide a creer un projet digital et a le monetiser. Choisis un guide ci-dessous.",
    userGuide: "Guide utilisateur",
    userDesc: "Crée ton projet, suis les parcours associes, passe les quiz et publie en ligne.",
    mentorGuide: "Guide mentor",
    mentorDesc: "Crée des parcours projets, édite du contenu et accompagne les membres vers le lancement.",
    adminGuide: "Guide administrateur",
    adminDesc: "Administre la plateforme, gère les utilisateurs, les rôles et la configuration.",
    linkProjects: "Construire et publier ton projet",
    linkTracks: "Suivre un parcours lie a ton projet",
    linkQuiz: "Passer un quiz",
    linkProgress: "Comprendre la progression et les points",
    linkMentoring: "Travailler avec un mentor",
    linkMentorTracks: "Créer et gérer un parcours projet",
    linkMentorEditing: "Éditer modules, leçons et ressources",
    linkMentorQuestions: "Gérer la banque de questions",
    linkMentorReviews: "Reviewer les projets",
    linkAdminRoles: "Gérer les utilisateurs et rôles",
    linkAdminAffiliates: "Configurer les affiliations",
    linkAdminSessions: "Organiser des sessions live"
  },
  dashboardDocsUserTracks: {
    title: "SUIVRE UN PARCOURS PROJET",
    subtitle: "Guide utilisateur",
    h2: "Les parcours sont au service de ton projet",
    p1: "Sur TakaCode, chaque parcours est lie a un archetype de projet (site vitrine, SaaS, e-commerce, blog, app mobile, API, etc.). Tu ne suis pas un parcours « pour apprendre » : tu le suis {strong}pour construire ton projet{/strong}.",
    h3_1: "Choisir un parcours",
    ol1_1: "Va dans {strong}Mes parcours{/strong} depuis le menu.",
    ol1_2: "Chaque parcours indique le type de projet auquel il est lie.",
    ol1_3: "Selectionne celui qui correspond a ton projet ou a l'etape que tu veux franchir.",
    ol1_4: "Le premier module se lance automatiquement.",
    h3_2: "Comment ca marche",
    p2: "Un parcours est compose de modules, de leçons, de quiz et de micro-projets. Chaque élément est concu pour produire un livrable concret qui fait avancer ton projet.",
    ul2_1: "{strong}Modules :{/strong} grandes étapes du projet (conception, développement, déploiement, marketing).",
    ul2_2: "{strong}Leçons :{/strong} actions concretes a réaliser (écrire du code, configurer un outil, rédiger une page).",
    ul2_3: "{strong}Quiz :{/strong} valider ta comprehension avant de passer a l'etape suivante.",
    ul2_4: "{strong}Ressources :{/strong} documentation, outils, exemples pour t'aider.",
    h3_3: "Progression",
    p3: "Chaque leçon complétée, chaque quiz réussi et chaque micro-projet valide te rapporte des XP. Accumule assez de points pour monter en grade. Mais le vrai objectif, c'est ton projet en ligne.",
    h3_4: "Conseils",
    ul4_1: "Commence par créer ou définir ton projet avant de choisir un parcours.",
    ul4_2: "Ne saute pas les étapes : chaque leçon produit un livrable utile pour la suite.",
    ul4_3: "Pose tes questions dans la communauté si tu es bloque sur une étape.",
    ul4_4: "Une fois le parcours termine, pense a la publication et a la monétisation."
  },
  dashboardDocsUserProjects: {
    title: "CONSTRUIRE ET PUBLIER TON PROJET",
    subtitle: "Guide utilisateur",
    h2: "Le projet est au coeur de TakaCode",
    p1: "Tout commence par un projet. Pas un exercice, pas un devoir : un vrai projet digital que tu vas construire, mettre en ligne et monetiser. Les parcours, les ressources et les mentors sont la pour t'y aider.",
    h3_1: "1. Creer ton projet",
    p2: "Apres ton inscription, un premier projet est cree automatiquement. Tu peux le modifier ou en creer d'autres depuis la section {strong}Mes projets{/strong}.",
    ul2_1: "Choisis un nom et un objectif clair pour ton projet.",
    ul2_2: "Sélectionne un starter kit (site vitrine, SaaS, e-commerce, blog, app mobile, API, IA chatbot, dashboard).",
    ul2_3: "Definis une deadline pour te fixer un rythme.",
    h3_2: "2. Suivre les parcours lies a ton projet",
    p3: "Chaque parcours correspond a un archetype de projet. Quand tu choisis un starter kit, les parcours recommandes te sont proposes. Chaque leçon te rapproche de la mise en ligne.",
    ul3_1: "Les modules et leçons sont concus pour produire des livrables concrets.",
    ul3_2: "Les quiz verifient ta comprehension avant de passer a la suite.",
    ul3_3: "Les micro-projets sont des étapes de ton projet principal.",
    h3_3: "3. Publier ton projet",
    p4: "Une fois construit, suis le guide de déploiement pour mettre ton projet en ligne :",
    ol4_1: "Pousse ton code sur GitHub (un dépôt est crée automatiquement).",
    ol4_2: "Connecte-le a Vercel ou Netlify pour le déploiement.",
    ol4_3: "Attache un domaine personnalise si tu en as un.",
    ol4_4: "Active les analytics pour suivre tes visiteurs.",
    h3_4: "4. Monetiser ton projet",
    p5: "Un projet en ligne peut generer des revenus. Selon le type de projet, plusieurs voies s'offrent a toi :",
    ul5_1: "{strong}Abonnements{/strong} : Stripe, factures recurrentes, metering.",
    ul5_2: "{strong}Produits digitaux{/strong} : ebooks, formations, templates, presets.",
    ul5_3: "{strong}Publicite et affiliation{/strong} : audiences, partenariats.",
    ul5_4: "{strong}Freelance / prestation{/strong} : utilise ton projet comme portfolio.",
    p6: "Les guides de monetisation t'accompagnent pas a pas dans chaque approche.",
    h3_5: "Modes de validation des etapes",
    ul6_1: "{strong}Automatique :{/strong} vérification par des critères prédéfinis.",
    ul6_2: "{strong}Par l'IA :{/strong} analyse et feedback generes automatiquement.",
    ul6_3: "{strong}Par un pair :{/strong} un autre membre evalue ton livrable.",
    ul6_4: "{strong}Par un mentor :{/strong} evaluation personnalisée par un encadrant."
  },
  dashboardDocsUserProgress: {
    title: "PROGRESSION ET POINTS",
    subtitle: "Guide utilisateur",
    h2: "Ta progression reflete l'avancement de ton projet",
    p1: "Sur TakaCode, les points (XP) et les grades mesurent l'avancement de ton projet, pas seulement ton apprentissage. Chaque action qui fait avancer ton projet te rapporte des points.",
    h3_1: "Gagner des points",
    ul1_1: "{strong}Leçon complétée :{/strong} chaque leçon qui produit un livrable pour ton projet.",
    ul1_2: "{strong}Quiz réussi :{/strong} valide ta comprehension avant de passer a l'etape suivante.",
    ul1_3: "{strong}Micro-projet valide :{/strong} une étape de ton projet principal est livree.",
    ul1_4: "{strong}Projet publie :{/strong} ton projet est en ligne (gros bonus).",
    ul1_5: "{strong}Premier revenu :{/strong} ton projet commence a generer de l'argent (bonus majeur).",
    h3_2: "Grades",
    p2: "Les grades refletent ta progression dans la construction et la monétisation de tes projets.",
    ul2_1: "{strong}Apprenti{/strong} — projet crée, premiers livrables",
    ul2_2: "{strong}Compagnon{/strong} — projet construit, en cours de déploiement",
    ul2_3: "{strong}Expert{/strong} — projet publie et commence a générer",
    ul2_4: "{strong}Maitre{/strong} — projet rentable, tu aides les autres",
    h3_3: "Tableau de bord",
    p3: "Ton dashboard affiche un résumé : projets en cours, prochaine action recommandee, points gagnes et classement. Consulte-le pour savoir quoi faire ensuite."
  },
  dashboardDocsUserMentoring: {
    title: "TRAVAILLER AVEC UN MENTOR",
    subtitle: "Guide utilisateur",
    h2: "Un mentor pour accelérer ton projet",
    p1: "Les mentors t'accompagnent dans la construction et le lancement de ton projet. Ils peuvent repondre à tes questions, review tes livrables et t'aider a debloquer les etapes critiques.",
    h3_1: "Trouver un mentor",
    ul1_1: "Consulte la section {strong}Sessions live{/strong} pour les creneaux disponibles.",
    ul1_2: "Rejoins la communauté pour echanger avec les mentors.",
    ul1_3: "Certains parcours projets sont encadres par des mentors dedies.",
    h3_2: "Solliciter une revue",
    p2: "Quand tu soumets un livrable de ton projet, tu peux demander une revue par un mentor. Le mentor examine ton travail, te donne un feedback détaillé et valide ou non ton avancement.",
    h3_3: "Sessions live",
    p3: "Les sessions live sont des rendez-vous en visio avec un mentor. Elles peuvent être :",
    ul3_1: "{strong}Q&A :{/strong} pose toutes tes questions sur ton projet.",
    ul3_2: "{strong}Atelier :{/strong} travaille sur une étape spécifique de ton projet.",
    ul3_3: "{strong}Revue de projet :{/strong} présente ton projet et reçoit un feedback oral.",
    ul3_4: "{strong}Stratégie :{/strong} conseils sur la monétisation et le lancement."
  },
  dashboardDocsUserQuiz: {
    title: "PASSER UN QUIZ",
    subtitle: "Guide utilisateur",
    h2: "Fonctionnement des quiz",
    p1: "Les quiz valident ta comprehension des leçons. Chaque quiz est compose de plusieurs questions a choix multiples. Les choix sont melanges pour chaque utilisateur, ce qui rend chaque tentative unique.",
    h3_1: "Déroulement",
    ol1_1: "Après une leçon, tu accedes au quiz associé.",
    ol1_2: "Pour chaque question, sélectionne une réponse parmi les choix proposees.",
    ol1_3: "Valide l'ensemble de tes reponses en cliquant sur {strong}Soumettre{/strong}.",
    ol1_4: "Le résultat s'affiche immédiatement : score, reponses correctes/incorrectes et explications.",
    h3_2: "Conditions de reussite",
    ul2_1: "Il faut au moins {strong}70% de bonnes réponses{/strong} pour valider le quiz.",
    ul2_2: "Si tu echoues, tu peux retenter immédiatement.",
    ul2_3: "Les questions peuvent varier d'une tentative à l'autre (tirage depuis la banque de questions).",
    ul2_4: "Ton meilleur score est conserve.",
    h3_3: "Types de questions",
    p3: "Les questions sont classees par difficulte : {strong}fondation{/strong}, {strong}standard{/strong} et {strong}défi{/strong}. Elles sont liées a des objectifs pedagogiques precis, ce qui t'aide a identifier les points a retravailler.",
    h3_4: "Conseils",
    ul4_1: "Lis attentivement l'explication après chaque question, même si tu as juste.",
    ul4_2: "Si une question te pose problème, consulte la ressource associee dans la leçon.",
    ul4_3: "Le quiz n'est pas chronometre : prends le temps de reflechir."
  },
  dashboardDocsMentorTracks: {
    title: "CREER ET GERER UN PARCOURS",
    subtitle: "Guide mentor",
    h2: "Proposer un parcours",
    p1: "En tant que mentor, tu peux créer des parcours de formation. Rends-toi dans {strong} Proposer un parcours{/strong} depuis le menu pour commencer.",
    h3_1: "Structure d'un parcours",
    ul1_1: "{strong}Modules :{/strong} grandes sections thematiques du parcours.",
    ul1_2: "{strong}Leçons :{/strong} unites d'apprentissage au sein d'un module.",
    ul1_3: "{strong}Ressources :{/strong} liens et références pour approfondir chaque leçon.",
    ul1_4: "{strong}Quiz :{/strong} questions a choix multiples pour valider les acquis.",
    ul1_5: "{strong}Micro-projets :{/strong} mises en pratique pour appliquer les concepts.",
    h3_2: "Validation et publication",
    p2: "Après avoir crée un parcours, tu peux le soumettre pour validation. Un administrateur vérifie le contenu avant publication. Une fois approuvé, le parcours est visible par tous les apprenants.",
    h3_3: "Modifier un parcours existant",
    p3: "Tu peux modifier les parcours dont tu es l'auteur. Les modifications sont visibles immédiatement pour les apprenants (sauf si le parcours est en cours de validation)."
  },
  dashboardDocsMentorReviews: {
    title: "REVIEWER LES PROJETS",
    subtitle: "Guide mentor",
    h2: "Revue de projets",
    p1: "En tant que mentor, tu peux reviewer les projets soumis par les apprenants. Rends-toi dans la section {strong}Revues{/strong} pour voir la file d'attente.",
    h3_1: "Processus de revue",
    ol1_1: "Consulte la liste des projets en attente de revue.",
    ol1_2: "Ouvre un projet pour voir le travail soumis et les consignes.",
    ol1_3: "Evalue le projet selon les critères definis dans le parcours.",
    ol1_4: "Ajoute un feedback ecrit avec des suggestions d'amelioration.",
    ol1_5: "Valide ou refuse le projet.",
    h3_2: "Criteres d'evaluation",
    ul2_1: "Respect des consignes",
    ul2_2: "Qualité technique du travail",
    ul2_3: "Pertinence des choix effectues",
    ul2_4: "Effort et progression visibles",
    h3_3: "Notifications",
    p3: "Quand tu reviews un projet, l'apprenant recoit une notification. Il peut voir ton feedback et retravailler son projet si nécessaire."
  },
  dashboardDocsMentorQuestions: {
    title: "BANQUE DE QUESTIONS",
    subtitle: "Guide mentor",
    h2: "Banque de questions",
    p1: "Chaque lecon dispose d'une banque de questions associee. Tu peux ajouter, modifier ou supprimer des questions depuis l'editeur de lecon.",
    h3_1: "Ajouter une question",
    ul1_1: "Definis le {strong}prompt{/strong} (8 caractères minimum).",
    ul1_2: "Ajoute entre {strong}2 et 6 choix{/strong} possibles.",
    ul1_3: "Indique l'{strong}index de la bonne reponse{/strong} (commence a 0).",
    ul1_4: "Ajoute une {strong}explication{/strong} pour justifier la réponse.",
    ul1_5: "Choisis un {strong}objectif pédagogique{/strong} parmi ceux de la leçon.",
    ul1_6: "Definis la {strong}difficulte{/strong} : fondation, standard ou défi.",
    ul1_7: "Ajoute eventuellement une {strong}URL de ressource{/strong} liee.",
    h3_2: "Validateur automatique",
    p2: "Lors de l'enregistrement, un validateur integre controle :",
    ul2_1: "L'absence de doublons dans les choix",
    ul2_2: "La presence d'une bonne reponse",
    ul2_3: "L'equilibre de la distribution des positions de reponses",
    ul2_4: "La presence d'une explication non vide",
    h3_3: "Equilibrage automatique",
    p3: "Les positions des bonnes reponses sont automatiquement reparties sur l'ensemble des questions pour eviter qu'une position (ex: A) ne soit trop souvent correcte.",
    h3_4: "Statuts des questions",
    ul4_1: "{strong}Brouillon :{/strong} en cours de rédaction, pas encore utilisable.",
    ul4_2: "{strong}Approuvee :{/strong} prête à être utilisée dans les quiz.",
    ul4_3: "{strong}Archived :{/strong} retiree mais conservee pour historique."
  },
  dashboardDocsMentorEditing: {
    title: "EDITER LE CONTENU",
    subtitle: "Guide mentor",
    h2: "Editeur de lecons",
    p1: "Chaque lecon peut etre modifiee via l'interface d'edition. Tu peux y changer :",
    ul1_1: "{strong}Titre et description :{/strong} le nom de la leçon et son résumé.",
    ul1_2: "{strong}Contenu :{/strong} le corps de la leçon au format texte.",
    ul1_3: "{strong}Ressources :{/strong} ajoute ou retire des liens (label, URL, type).",
    ul1_4: "{strong}Objectifs :{/strong} les compétences visees par la leçon.",
    ul1_5: "{strong}Mode de validation :{/strong} auto, IA, pair ou mentor pour le projet.",
    h3_2: "Ressources",
    p2: "Chaque leçon peut avoir plusieurs ressources (articles, vidéos, outils). Pour chaque ressource, tu peux définir :",
    ul2_1: "Le label (titre visible)",
    ul2_2: "L'URL",
    ul2_3: "Le type (article, vidéo, outil, etc.)",
    ul2_4: "La raison (pourquoi cette ressource est utile)",
    ul2_5: "Le commentaire d'utilisation (comment l'exploiter)",
    h3_3: "Ordre des modules et lecons",
    p3: "Les modules et les leçons sont ordonnes par leur position. Utilise les controles de l'interface pour rearranger l'ordre d'apprentissage."
  },
  dashboardDocsAdminSessions: {
    title: "SESSIONS LIVE",
    subtitle: "Guide administrateur",
    h2: "Sessions live",
    p1: "Les sessions live sont des rendez-vous en direct avec les apprenants. Elles peuvent etre programmees et gerees depuis l'interface d'administration.",
    h3_1: "Créer une session",
    ul1_1: "Choisis un titre et une description pour la session.",
    ul1_2: "Definis la date, l'heure et la duree.",
    ul1_3: "Sélectionne le type : Q&A, atelier, revue de projet.",
    ul1_4: "Ajoute un lien de visioconference (Zoom, Google Meet, etc.).",
    h3_2: "Gerer les inscriptions",
    p2: "Les apprenants peuvent s'inscrire aux sessions. Tu vois le nombre de places restantes et la liste des inscrits. Tu peux annuler ou reporter une session si nécessaire.",
    h3_3: "Notifications",
    p3: "Les inscrits recoivent une notification avant le début de la session. Un rappel est envoye automatiquement 24h et 1h avant l'evenement."
  },
  dashboardDocsAdminRoles: {
    title: "GERER LES UTILISATEURS",
    subtitle: "Guide administrateur",
    h2: "Roles utilisateur",
    p1: "La plateforme définit plusieurs rôles avec des permissions croissantes :",
    ul1_1: "{strong}user :{/strong} apprenant standard, accès aux parcours et quiz.",
    ul1_2: "{strong}mentor :{/strong} peut créer des parcours, éditer du contenu et reviewer les projets.",
    ul1_3: "{strong}admin :{/strong} accès complèt à toutes les fonctionnalites et à l'administration.",
    h3_2: "Gerer les roles",
    p2: "Depuis la section {strong}Utilisateurs{/strong} du panneau d'administration, tu peux voir la liste de tous les utilisateurs et modifier leur rôle.",
    ul2_1: "Recherche un utilisateur par nom ou email.",
    ul2_2: "Consulte son role actuel, sa date d'inscription et ses statistiques.",
    ul2_3: "Change son rôle si nécessaire (ex: promouvoir un utilisateur en mentor).",
    h3_3: "Sécurité",
    p3: "Les mots de passe doivent comporter au moins 8 caractères avec minuscules, majuscules, chiffres et symboles. La protection contre les mots de passe compromis est activee en production."
  },
  dashboardDocsAdminAffiliates: {
    title: "PROGRAMME D'AFFILIATION",
    subtitle: "Guide administrateur",
    h2: "Programme d'affiliation",
    p1: "Le programme d'affiliation permet aux membres de parrainer de nouveaux utilisateurs et de suivre leurs recommandations. Chaque membre dispose d'un lien unique.",
    h3_1: "Configuration",
    ul1_1: "Accede à la section {strong}Affiliations{/strong} du panneau d'administration.",
    ul1_2: "Consulte la liste des affiliés et leurs statistiques.",
    ul1_3: "Configure les récompenses et les conditions de validation.",
    h3_2: "Suivi",
    p2: "Le tableau de bord des affiliations affiche pour chaque membre :",
    ul2_1: "Nombre de personnes parrainees",
    ul2_2: "Points gagnes via le parrainage",
    ul2_3: "Date du dernier parrainage"
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
    markAllRead: "Tout marquer lu",
    empty: "Aucune notification",
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
  tour: {
    overlay: {
      ariaLabel: "Guide interactif",
      skipTour: "Passer le guide",
      previous: "Précédent",
      skip: "Passer",
      next: "Suivant",
      start: "C'est parti !"
    },
    parcours: {
      welcome: { title: "Bienvenue sur les parcours", body: "Découvre la liste complète des parcours TakaCode, du plus fondamental au plus avancé. Chaque parcours te guidera pas à pas." },
      ordering: { title: "Ordre conseillé", body: "Les parcours sont rangés du plus fondamental au plus avancé. Il est conseillé de commencer par les bases avant de passer à la suite, mais tu es libre de choisir." },
      cards: { title: "Fiches parcours", body: "Chaque fiche affiche le niveau, les compétences clés, et le nombre d'étapes. Clique sur un parcours pour voir sa fiche détaillée avec le plan de progression." },
      enrollment: { title: "Commence maintenant", body: "Ouvre un parcours qui t'intéresse et inscris-toi pour suivre ta progression, accéder aux leçons et valider des projets." }
    },
    detail: {
      welcome: { title: "Fiche détaillée du parcours", body: "Tu es sur la page détail d'un parcours. Tu y trouveras les compétences, le plan de cours, et les ressources associées." },
      prereqs: { title: "Prérequis conseillés", body: "Les prérequis te montrent les parcours à connaître avant d'attaquer celui-ci. Ce n'est pas bloquant mais fortement conseillé." },
      curriculum: { title: "Plan de progression", body: "Le curriculum découpe le parcours en modules et leçons. Suis l'ordre indiqué pour une progression optimale." }
    },
    lecon: {
      welcome: { title: "Bienvenue dans la leçon", body: "Chaque leçon contient des ressources sélectionnées, un quiz de validation et un micro-projet pratique." },
      resources: { title: "Ressources", body: "Lis les ressources recommandées pour comprendre les concepts avant de passer au quiz et au projet." },
      quiz: { title: "Quiz de validation", body: "Teste ta compréhension avec le quiz. Valide-le pour débloquer la suite du parcours." },
      project: { title: "Micro-projet", body: "Mets en pratique ce que tu as appris en réalisant le micro-projet. Soumets-le pour obtenir une review." },
      nav: { title: "Navigation", body: "Utilise les boutons précédent/suivant pour avancer dans le parcours à ton rythme." }
    },
    guide: {
      welcome: { title: "Guide de démarrage", body: "Voici un tour rapide des sections de ton espace TakaCode. Explore chaque section pour découvrir tout ce que tu peux faire." },
      navigate: { title: "Navigation", body: "Clique sur une section dans la liste ci-dessous pour t'y rendre directement. Tu peux aussi utiliser la sidebar à gauche." },
      done: { title: "Prêt à créer", body: "Tu connais maintenant les sections clés. Explore, apprends et construis ton projet. Ce guide reste accessible depuis ton Tableau de bord." }
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
    hasAccount: "Déjà un compte ?",
    authLabel: "Authentification",
    backToSite: "Retour au site",
    signInTitle: "SE CONNECTER",
    signUpTitle: "CREER UN COMPTE",
    continueWithGoogle: "Continuer avec Google",
    continueWithGithub: "Continuer avec GitHub",
    continueWithWallet: "Continuer avec Wallet Ethereum",
    orDivider: "ou",
    emailPlaceholder: "nom@exemple.com",
    hidePassword: "Masquer",
    showPassword: "Afficher",
    passwordWeak: "Mot de passe faible",
    passwordMedium: "Mot de passe moyen",
    passwordStrong: "Mot de passe solide",
    resetBadge: "C'est bon !",
    resetTitle: "Ton mot de passe a été mis à jour",
    resetDescription: "Tu peux maintenant te reconnecter et reprendre là où tu t'étais arrêté.",
    resetContinue: "Continuer mon parcours",
    referralDetected: "Code parrainage détecté:",
    signUpFirstName: "Prenom",
    signUpLastName: "Nom",
    signUpReferralCode: "Code de parrainage (facultatif)",
    signUpReferralPlaceholder: "ABC123DEF0",
    signUpConfirmPassword: "Confirmer le mot de passe",
    signUpCreateAccount: "Créer mon compte",
    noAccountPrompt: "Pas encore membre ?",
    hasAccountPrompt: "Déjà membre ?",
    createAccountLink: "Créer un compte",
    signInLink: "Se connecter",
    signUpHeroBadge: "Communauté TakaCode",
    signUpHeroTitle1: "Commence ton",
    signUpHeroTitle2: "prochain projet",
    signUpHeroDesc: "Crée ton compte et accède aux parcours, ressources, sessions live et à une communauté qui apprend en construisant.",
    signUpHighlight1Title: "Apprends avec methode",
    signUpHighlight1Desc: "Parcours guidés, ressources sélectionnées et exercices pratiques pour progresser à ton rythme.",
    signUpHighlight2Title: "Construis avec la communaute",
    signUpHighlight2Desc: "Participe aux sessions live, échange avec d'autres créateurs et avance ensemble.",
    signUpHighlight3Title: "Accelere avec l'IA",
    signUpHighlight3Desc: "Profite des meilleurs outils d'IA pour comprendre plus vite et transformer tes idées en projets concrets.",
    signInHeroBadge: "Bon retour",
    signInHeroTitle1: "Retrouve tes projets",
    signInHeroTitle2: "et continue à avancer",
    signInHeroDesc: "Reconnecte-toi pour reprendre ton parcours, participer aux sessions live et poursuivre tes réalisations.",
    signInHighlight1Title: "Reprends la ou tu t'es arrete",
    signInHighlight1Desc: "Tes parcours, ressources et projets t'attendent.",
    signInHighlight2Title: "Retrouve la communaute",
    signInHighlight2Desc: "Échange avec d'autres créateurs et participe aux prochaines sessions.",
    signInHighlight3Title: "Continue a progresser",
    signInHighlight3Desc: "Chaque étape te rapproche un peu plus de ton prochain projet.",
    enterEmailError: "Entre ton email pour te connecter.",
    validEmailError: "Entre une adresse email valide.",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    weakPasswordError: "Utilise un mot de passe plus solide (min 10 caractères, majuscule, chiffre, symbole).",
    signInError: "Connexion impossible pour le moment.",
    signUpError: "Inscription impossible pour le moment.",
    checkEmail: "Compte créé. Vérifie ton email pour confirmer ton inscription.",
    networkError: "Problème réseau. Réessaie dans un instant.",
    oauthError: "Impossible de démarrer la connexion OAuth.",
    walletError: "Impossible de connecter le wallet.",
    errorForbidden: "Ton compte ne dispose pas du rôle requis pour accéder au dashboard.",
    errorOauthCallback: "La connexion n'a pas abouti. Réessaie.",
    errorOauthCodeMissing: "La connexion a été interrompue. Réessaie.",
    errorOauthDenied: "Connexion annulée ou refusée.",
    errorAuthConfigMissing: "Configuration auth manquante. Contacte l'administrateur.",
    errorAuthNetwork: "Problème réseau pendant la connexion OAuth. Réessaie.",
    signUpLoading: "Chargement...",
    forgotPasswordTitle: "BESOIN D'UN NOUVEAU MOT DE PASSE ?",
    forgotPasswordSentTitle: "VERIFIE TA BOITE DE RECEPTION",
    forgotPasswordBadge: "RECUPERATION",
    forgotPasswordSentBadge: "EMAIL ENVOYE",
    forgotPasswordDesc: "Pas d'inquiétude. Indique ton adresse email et nous t'enverrons un lien pour retrouver ton espace TakaCode.",
    forgotPasswordSentDesc: "Un lien de réinitialisation a été envoyé à",
    forgotPasswordSentHint: "Regarde aussi dans les dossiers spam, promotions ou social puis ouvre le lien reçu.",
    forgotPasswordWaiting: "Tes projets t'attendent",
    forgotPasswordWaitingSub: "Reviens continuer ce que tu as commencé.",
    forgotPasswordSubmit: "Envoyer le lien",
    forgotPasswordLoading: "Envoi...",
    forgotPasswordBack: "Retour à la connexion",
    forgotPasswordResend: "Renvoyer un lien",
    forgotPasswordSignUp: "Créer un compte",
    forgotPasswordInvalidEmail: "Entre une adresse email valide.",
    forgotPasswordSendError: "Impossible d'envoyer le lien pour le moment.",
    forgotPasswordNetworkError: "Problème réseau. Vérifie ta connexion puis réessaie.",
    resetPasswordBadge: "NOUVEAU MOT DE PASSE",
    resetPasswordTitle: "PRET A REPRENDRE ?",
    resetPasswordDesc: "Choisis un nouveau mot de passe pour retrouver ton espace et poursuivre tes projets.",
    resetPasswordNewLabel: "Nouveau mot de passe",
    resetPasswordConfirmLabel: "Confirmer le mot de passe",
    resetPasswordSubmit: "Reprendre mon parcours",
    resetPasswordLoading: "Mise à jour...",
    resetPasswordBack: "Retour à la connexion",
    resetPasswordNewLink: "Nouveau lien",
    resetPasswordMismatch: "Les mots de passe ne correspondent pas.",
    resetPasswordWeakError: "Choisis un mot de passe plus solide (min 10 caractères, majuscule, chiffre, symbole).",
    resetPasswordUpdateError: "Impossible de mettre à jour le mot de passe.",
    resetPasswordNoSession: "Ouvre cette page depuis le lien reçu par email pour choisir ton nouveau mot de passe.",
    resetPasswordSessionError: "Impossible de vérifier la session. Recharge la page depuis le lien reçu par email.",
    resetPasswordNetworkError: "Problème réseau. Réessaie dans un instant.",
    signUpDesc: "Crée ton compte TakaCode et commence à construire des projets réels avec des parcours guides.",
    signInDesc: "Reconnecte-toi à ton espace TakaCode pour reprendre tes projets, tes parcours et tes sessions live."
  },
  onboarding: {
    backToSite: "Retour au site",
    welcomeSection: {
      label: "Bienvenue",
      title: "BIENVENUE SUR TAKACODE",
      desc: "L'endroit où l'on apprend en construisant. Nous allons personnaliser ton expérience en moins d'une minute.",
      card1Title: "Parcours cible",
      card1Desc: "Ton plan s'adapte à ton objectif réel.",
      card2Title: "Communaute active",
      card2Desc: "Sessions live, échanges et feedback concrets.",
      card3Title: "IA pratique",
      card3Desc: "Tu gagnes du temps sur chaque étape."
    },
    goalSection: {
      label: "Ton objectif",
      title: "QUE VEUX-TU REALISER ?"
    },
    levelSection: {
      label: "Ton niveau",
      title: "OU EN ES-TU AUJOURD'HUI ?"
    },
    projectSection: {
      label: "Ton projet",
      title: "AS-TU DEJA UNE IDEE PRECISE ?",
      ideaLabel: "Décris ton projet en quelques mots",
      ideaPlaceholder: "Ex: créer un site pour mon restaurant, automatiser WhatsApp, lancer une chaîne YouTube",
      ideaHint: "Ajoute un peu plus de contexte pour un plan plus précis.",
      nameLabel: "Donne un nom à ton projet",
      nameHint: "(modifiable plus tard)",
      namePlaceholder: "Ex : La Table de Marco, AutoWhats, Ma chaîne Histoires",
      monetizationLabel: "Comment veux-tu le monétiser un jour ?",
      monetizationHint: "Sur TakaCode, un projet vise le premier euro. Choisis une piste — tu pourras changer d'avis.",
      noIdea: "Je ne sais pas encore"
    },
    toolsSection: {
      label: "Tes outils",
      title: "QUELS OUTILS T'INTERESSENT ?",
      subtitle: "Étape facultative. Tu peux continuer sans sélection."
    },
    rhythmSection: {
      label: "Ton rythme",
      title: "COMBIEN DE TEMPS PEUX-TU CONSACRER CHAQUE SEMAINE ?"
    },
    resultSection: {
      label: "Resultat",
      title: "TON ESPACE EST PRET",
      desc: "On t'a préparé une première trajectoire selon ton objectif: ",
      recommendedTrack: "Parcours recommande",
      firstResources: "Premieres ressources",
      objective: "Objectif",
      yourProfile: "Ton profil",
      nextSession: "Prochaine session live",
      nextSteps: "Prochaines etapes",
      profileTitle: "Mon {goal}",
      step: "Étape",
      back: "Retour",
      start: "Commencer",
      continue: "Continuer",
      saveLoading: "Chargement...",
      explorePlatform: "Explorer la plateforme",
      startTrack: "Commencer mon parcours",
      draftSaveError: "Impossible de sauvegarder le brouillon"
    }
  },
  nextAction: {
    label: "Prochaine action",
    noOnboardingTitle: "Termine ton onboarding",
    noOnboardingDesc: "Réponds a quelques questions pour qu'on personnalise ton expérience.",
    noOnboardingLabel: "Continuer l'onboarding",
    noTrackTitle: "Choisis ton premier parcours",
    noTrackDesc: "Sélectionne un parcours adapte a ton objectif pour commencer à construire.",
    noTrackLabel: "Voir les parcours",
    noProjectTitle: "Cree ton projet principal",
    noProjectDesc: "Définit le projet que tu veux construire. Il servira de fil rouge a tes parcours.",
    noProjectLabel: "Créer mon projet",
    ideaTitle: "Finalise les details de ton projet",
    ideaDesc: "Ajoute une description, un statut et une deadline pour lancer ton projet.",
    ideaLabel: "Éditer mon projet",
    noRepoTitle: "Connecte ton depot GitHub",
    noRepoDesc: "Héberge ton code sur GitHub pour le déployer facilement et suivre les versions.",
    noRepoLabel: "Ajouter le dépôt",
    noLiveTitle: "Deploie ton projet en ligne",
    noLiveDesc: "Publie ton projet avec Vercel ou Netlify pour le rendre accessible au monde entier.",
    noLiveLabel: "Déployer mon projet",
    doneTitle: "Partage ton projet",
    doneDesc: "Ton projet est en ligne ! Montre-le a la communauté et ajoute-le a ton portfolio.",
    doneLabel: "Partager mon projet"
  },
  communityContent: {
    title: "Communauté",
    heading: "Construire ensemble",
    subtitle: "Les membres, leurs projets et les prochaines sessions live.",
    loading: "Chargement...",
    statsMembers: "Membres",
    statsLessons: "Leçons validées",
    statsProjects: "Projets",
    statsLikes: "Likes",
    activityFeed: "ACTIVITE RECENTE",
    noActivity: "Aucune activité récente. Publie ton premier projet !",
    projectsTitle: "PROJETS COMMUNAUTAIRES",
    filterPublished: "Publiés",
    filterInProgress: "En cours",
    filterAll: "Tous",
    viewAll: "Voir tout",
    statusOnline: "En ligne",
    statusInProgress: "En cours",
    firstEuro: "1er euro",
    viewOnline: "Voir en ligne",
    code: "Code",
    commentsShow: "Afficher",
    commentsHide: "Masquer",
    commentsEmpty: "Aucun commentaire pour l'instant.",
    commentsPlaceholder: "Ajouter un commentaire...",
    commentsSend: "Envoyer",
    noProjectsFilter: "Aucun projet pour ce filtre. Change le filtre ou cree ton projet !",
    topMembers: "TOP MEMBRES",
    leaderboardLink: "Classement",
    noMembers: "Le classement se remplira bientôt.",
    upcomingSessions: "SESSIONS A VENIR",
    noSessions: "Pas de session programmee pour le moment.",
    dateToConfirm: "Date a confirmer"
  },
  appShell: {
    closeMenu: "Fermer le menu",
    openMenu: "Ouvrir le menu",
    myProfile: "Mon profil",
    startGuide: "Guide de démarrage",
    documentation: "Documentation",
    adminCenter: "Centre admin",
    signOut: "Se déconnecter",
    signOutSidebar: "Deconnexion",
    memberArea: "Espace membre",
    roleLabel: "Role",
    member: "Membre",
    memberEmail: "membre@takacode.app",
    live: "En direct"
  },
  cookieNotice: {
    label: "Consentement cookies",
    description: "TakaCode utilise des cookies essentiels (session, preferences) pour fonctionner. Aucune pub, aucun traceur tiers.",
    learnMore: "En savoir plus",
    essentialOnly: "Essentiels seulement",
    accept: "J'ai compris"
  },
  parcoursSection: {
    sectionLabel: "CATALOGUE",
    title: "PARCOURS DISPONIBLES",
    viewAll: "Tous les parcours",
    discover: "Découvrir",
    weeks: "semaines",
    shortWeeks: "sem.",
    empty: "Le catalogue parcours sera visible ici dès que les données BDD sont actives."
  },
  ressources: {
    sectionLabel: "BIBLIOTHÈQUE",
    title: "RESSOURCES POUR AVANCER",
    description: "Guides, tutoriels, templates, prompts, outils recommandés et bien plus. Tout ce dont tu as besoin pour construire ton projet.",
    tags: "Guides, Tutoriels, Vidéos, Templates, Prompts IA, Outils, Cheat Sheets, Bibliothèque IA",
    cta: "Explorer les ressources",
    cards: {
      guides: {
        title: "GUIDES",
        desc: "Explications simples et structurées pour chaque concept clé.",
        count: "124 guides disponibles"
      },
      videos: {
        title: "VIDÉOS",
        desc: "Démonstrations et tutoriels pratiques en vidéo.",
        count: "89 vidéos"
      },
      templates: {
        title: "MODÈLES ET TEMPLATES",
        desc: "Templates de prompts, documents et modèles réutilisables.",
        count: "67 templates"
      },
      tools: {
        title: "OUTILS",
        desc: "Une sélection d'outils pour aller plus loin rapidement.",
        count: "200+ outils référencés"
      }
    }
  },
  sessions: {
    sectionLabel: "En direct",
    title: "Apprendre ensemble",
    viewAll: "Voir toutes les sessions",
    description: "Participe à des sessions de pratique en direct avec la communauté. Pose des questions, construis avec d'autres, avance plus vite.",
    features: {
      workshops: "Ateliers pratiques",
      qanda: "Questions & réponses",
      collaborative: "Construction collaborative",
      debugging: "Débogage en direct",
      masterclass: "Masterclass & Démonstrations"
    },
    upcoming: "À venir",
    registered: "inscrits",
    live: "Live"
  },
  projectsSection: {
    sectionLabel: "Galerie",
    title1: "Des projets publiés.",
    title2: "Pas seulement des exercices.",
    viewAll: "Voir tous les projets",
    emptyTitle: "La galerie démarre avec toi",
    emptyDesc: "Aucun projet publié pour l'instant. Construis ton projet, publie-le et inspire la communauté.",
    startProject: "Commencer un projet",
    joinAndPublish: "Rejoindre et publier mon projet",
    emptyLabel: "Les projets publiés par les membres apparaîtront ici.",
    projectLabel: "Projet",
    firstEuro: "1er euro",
    revenueModel: "Modèle :",
    publishedOn: "Publié le"
  },
  finalCta: {
    sectionLabel: "COMMENCE MAINTENANT",
    title1: "TON PROJET",
    title2: "COMMENCE ICI",
    desc1: "Tu n'as pas besoin d'être expert. Tu as besoin d'un plan et d'exécution.",
    desc2: "TakaCode te guide pour créer ton projet, le publier et le rentabiliser.",
    ctaPrimary: "Commencer un projet",
    ctaSecondary: "Explorer les parcours"
  },
  globe: {
    sectionLabel: "Communauté mondiale",
    title: "Des builders partout dans le monde",
    subtitle: "pays représentés — explore le globe pour voir où sont les membres."
  },
  projetsPage: {
    sectionLabel: "Projets",
    title: "Les projets de la communauté",
    description: "Découvre les projets digitaux construits, publiés et parfois monétisés par les membres TakaCode. Inspire-toi, explore les stacks et lance le tien.",
    stats: {
      library: { label: "Bibliothèque", desc: "Des projets publics par les membres." },
      goal: { label: "Objectif", value: "Publier", desc: "Chaque projet est en ligne et accessible." },
      next: { label: "Prochaine étape", value: "Monétiser", desc: "Transformer un projet en revenus." }
    },
    projectCard: { label: "Projet", objective: "Objectif", track: "Parcours", deadline: "Deadline", publishedOn: "Publié le" },
    empty: {
      title: "Sois le premier à publier",
      desc: "Aucun projet publié pour l'instant. La communauté attend tes réalisations.",
      cta: "Rejoindre et créer mon projet"
    }
  },
  classementPage: {
    sectionLabel: "CLASSEMENT",
    title: "LES MEMBRES LES PLUS ACTIFS",
    description: "Gagne des points en validant tes leçons et micro-projets.",
    xp: "XP",
    empty: "Le classement se remplit dès les premiers points gagnés. Sois le premier !",
    schemaPending: "Classement bientôt disponible (exécute supabase/sql/012_profile_public.sql)."
  },
  communautePage: {
    sectionLabel: "COMMUNAUTE",
    title: "REJOINS LA COMMUNAUTE",
    description: "Connecte-toi ou crée un compte pour découvrir les projets, le classement et les prochaines sessions live.",
    signIn: "Se connecter",
    signUp: "Créer un compte"
  },
  tarifsPage: {
    sectionLabel: "TARIFS",
    title: "CONSTRUIS, LANCE, GAGNE",
    description: "Les formules seront publiées ici. En attendant, démarre gratuitement et construis ton premier projet. L'idée est de t'aider à réaliser des projets digitaux qui peuvent un jour te rapporter.",
    ctaTracks: "Voir les parcours",
    ctaProject: "Commencer un projet"
  },
  tracksPage: {
    sectionLabel: "CATALOGUE",
    title: "LISTE COMPLETE DES PARCOURS",
    description: "Cette page affiche uniquement la liste des parcours. Clique sur un parcours pour ouvrir sa fiche détaillée.",
    guestCTA: {
      sectionLabel: "PARCOURS",
      title: "ACCEDE AUX PARCOURS",
      description: "Connecte-toi ou crée un compte pour découvrir la liste complète des parcours et commencer à apprendre.",
      signIn: "Se connecter",
      signUp: "Créer un compte"
    },
    schemaNotReady: "Tables parcours non detectees.",
    loadError: "Impossible de charger le catalogue parcours maintenant.",
    availableTitle: "PARCOURS DISPONIBLES",
    activeCount: "{n} parcours actifs",
    orderHint: "Ordre conseille : les parcours sont ranges du plus fondamental au plus avance.",
    stepLabel: "Etape {n}",
    viewDetails: "Voir les détails",
    empty: "Aucun parcours publie pour le moment."
  },
  trackDetail: {
    back: "Retour",
    notFound: {
      title: "Parcours non trouvé - TakaCode",
      description: "Ce parcours n'existe pas ou n'est pas encore publié."
    },
    defaultDescription: "Découvre ce parcours TakaCode : compétences, plan de progression, objectif et ressources.",
    schemaNotReady: "Tables parcours non detectees. Execute `supabase/sql/003_learning_tracks.sql` pour activer le catalogue BDD.",
    loadError: "Impossible de charger ce parcours maintenant.",
    myTrack: "Mon parcours",
    project: "Projet",
    sprintCount: "{cleared}/{total} sprints",
    orderAdvice: {
      title: "Conseil d'ordre",
      description: "Pour tirer le meilleur de ce parcours, on te conseille de suivre d'abord :",
      note: "Ce n'est qu'un conseil : tu peux commencer ce parcours quand tu veux."
    },
    competenciesTitle: "Compétences fournies",
    objectiveTitle: "Objectif du parcours",
    myProject: {
      title: "MON PROJET",
      edit: "Modifier",
      noDescription: "Aucune description",
      statusPublished: "Publie",
      statusInProgress: "En cours",
      noProject: "Tu n'as pas encore cree de projet pour ce parcours.",
      viewProject: "Voir mon projet",
      createProject: "Créer mon projet"
    },
    progressionPlan: "Plan de progression",
    stepLabel: "Etape {n}",
    resourcesTitle: "Ressources incluses",
    resourcesPreparing: "Ressources en préparation",
    partnersTitle: "Plateformes partenaires",
    partnersAffiliateNotice: "Liens affiliés : ils soutiennent TakaCode sans coût pour toi.",
    sprints: {
      title: "SPRINTS DU PROJET",
      description: "Chaque sprint livre une version fonctionnelle de ton projet",
      accomplished: "{cleared}/{total} sprints accomplis",
      sprint: "SPRINT {n}",
      deliverable: "Livrable : {deliverable}",
      lessonCount: "{completed}/{total} lecons",
      continue: "Continuer",
      locked: "Verrouille",
      completed: "Livre"
    },
    cta: {
      continueProject: "Continuer mon projet",
      startProject: "Démarrer mon projet",
      manageProject: "Gérer mon projet",
      createProject: "Créer mon projet",
      startTrack: "Commencer ce parcours",
      haveAccount: "J'ai deja un compte"
    },
    guest: {
      sectionLabel: "Parcours",
      title: "Accède à ce parcours",
      description: "Connecte-toi ou crée un compte pour acceder au détail de ce parcours et commencer à apprendre.",
      signIn: "Se connecter",
      signUp: "Créer un compte"
    }
  },
  lessonPage: {
    metadata: {
      title: "Lecon",
      description: "Lecon TakaCode : ressources selectionnees, quiz de validation et micro projet pratique."
    },
    backToTrack: "Retour au parcours",
    lessonPosition: "Lecon {position}/{total}",
    lessonCompleted: "Leçon validée",
    lessonInProgress: "En cours",
    lessonCount: "{completed}/{total} lecons ({progress}%)",
    guest: {
      sectionLabel: "LECON",
      title: "ACCEDE AUX LECONS",
      description: "Connecte-toi ou crée un compte pour acceder au contenu des leçons et progresser dans tes parcours.",
      signIn: "Se connecter",
      signUp: "Créer un compte"
    }
  },
  cookiesPage: {
    sectionLabel: "POLITIQUE",
    title: "COOKIES",
    description: "TakaCode utilise le strict minimum : des cookies essentiels au fonctionnement du site.",
    sections: {
      essential: {
        title: "Cookies essentiels",
        body: "Ils sont nécessaires au fonctionnement du site : garder ta session ouverte après connexion et mémoriser tes préférences (ex : consentement cookies, avatar). Sans eux, tu ne pourrais pas rester connecté."
      },
      noAds: {
        title: "Aucune publicite, aucun traceur tiers",
        body: "TakaCode n'utilise pas de cookies publicitaires ni de traceurs marketing tiers. Nous ne revendons pas tes données."
      },
      localStorage: {
        title: "Stockage local",
        body: "Certaines préférences (consentement, guide vu, son activé/coupé) sont conservées dans le stockage local de ton navigateur, pas dans un cookie envoyé au serveur."
      },
      affiliate: {
        title: "Liens d'affiliation",
        body: "Certains liens vers des outils recommandés sont affiliés : si tu passes par eux, TakaCode peut percevoir une commission sans coût supplémentaire pour toi. Ces liens peuvent déposer leurs propres cookies sur le site du partenaire, selon leur propre politique."
      },
      manage: {
        title: "Gerer tes choix",
        body: "Tu peux effacer les cookies et le stockage local à tout moment depuis les paramètres de ton navigateur. La bannière de consentement réapparaîtra après effacement."
      }
    }
  },
  privacyPage: {
    sectionLabel: "LEGAL",
    title: "POLITIQUE DE CONFIDENTIALITE",
    description: "Cette page explique quelles données TakaCode collecte, comment elles sont utilisées et quelles options tu as pour les gérer. En utilisant la plateforme, tu acceptes les pratiques décrites ici.",
    sections: {
      dataCollected: {
        title: "1. Donnees collectees",
        body: "Nous pouvons collecter des informations de compte (nom, email), des données d'usage (pages consultées, progression), et des données techniques (navigateur, appareil, logs de sécurité)."
      },
      dataUsage: {
        title: "2. Utilisation des donnees",
        body: "Ces données sont utilisées pour fournir le service, améliorer l'expérience, personnaliser les contenus, assurer la sécurité de la plateforme et communiquer des informations importantes."
      },
      storage: {
        title: "3. Conservation et protection",
        body: "Les données sont conservées pendant la durée nécessaire au fonctionnement du service et protégées par des mesures techniques et organisationnelles adaptées."
      },
      rights: {
        title: "4. Tes droits",
        body: "Tu peux demander l'accès, la correction ou la suppression de tes données, selon la réglementation applicable. Pour toute demande, utilise la page communauté/contact."
      }
    },
    cta: {
      terms: "Voir les conditions",
      contact: "Contacter TakaCode"
    }
  },
  termsPage: {
    sectionLabel: "LEGAL",
    title: "CONDITIONS D'UTILISATION",
    description: "Ces conditions definissent les regles d'usage de TakaCode. En utilisant la plateforme, tu acceptes les termes ci-dessous.",
    sections: {
      purpose: {
        title: "1. Objet du service",
        body: "TakaCode fournit des parcours, ressources et outils de création de projets numériques a vocation educative."
      },
      account: {
        title: "2. Compte utilisateur",
        body: "Tu es responsable des informations de ton compte et de la confidentialite de tes accès. Toute activite effectuee depuis ton compte est presumee t'etre attribuable."
      },
      acceptableUse: {
        title: "3. Usage acceptable",
        body: "Il est interdit d'utiliser la plateforme pour des activites illegales, malveillantes, frauduleuses, ou portant atteinte aux autres utilisateurs et aux infrastructures."
      },
      intellectualProperty: {
        title: "4. Propriete intellectuelle",
        body: "Les contenus, marques et éléments de la plateforme restent la propriété de TakaCode ou de leurs ayants droit, sauf mention contraire explicite."
      },
      modifications: {
        title: "5. Modification des conditions",
        body: "TakaCode peut mettre à jour ces conditions a tout moment. La version en ligne fait foi."
      }
    },
    cta: {
      privacy: "Voir la politique de confidentialite",
      contact: "Contacter TakaCode"
    }
  },
  admin: {
    centreTitle: "CENTRE ADMIN",
    centreSubtitle: "Pilotage de la plateforme",
    backAdmin: "Centre admin",
    backAdminShort: "Admin",
    backTracks: "Parcours",
    backSessions: "Sessions",
    backAffiliations: "Affiliations",
    northStar: "Étoile du nord",
    members: "membres",
    member: "Membre",
    save: "Enregistrer",
    saving: "Enregistrement...",
    saved: "Enregistré",
    cancel: "Annuler",
    delete: "Supprimer",
    create: "Créer",
    publishedLabel: "Publié",
    draftLabel: "Brouillon",
    activeLabel: "Actif",
    inactiveLabel: "Inactif",
    hiddenLabel: "Masqué",
    publishedLabelF: "Publiée",
    seePublic: "Voir en public",
    loading: "Chargement...",
    error: "Erreur",
    confirmDelete: "Confirmer la suppression ?",
    noResults: "Aucun résultat",
    tableMissing: "Table {table} manquante.",
    runSql: "Lance {sql}.",
    view: "Voir",
    search: "Rechercher"
  },
  adminOverview: {
    metaTitle: "Admin",
    metaDesc: "Centre d'administration TakaCode.",
    users: "Utilisateurs",
    admins: "Admins",
    activeTracks: "Parcours actifs",
    published: "Publiés",
    modules: "Modules",
    lessons: "Leçons",
    lessonsCompleted: "Leçons validées",
    submittedProjects: "Micro-projets soumis",
    actionRequired: "Action requise",
    leaderboard: "Leaderboard (top 5 XP)",
    management: "Gestion",
    manageUsers: "Gérer les utilisateurs",
    manageTracks: "Gérer les parcours et leurs leçons",
    reviewHistory: "Historique des revues",
    starter: "Starter",
    membersOnline: "Membres avec un projet en ligne",
    membersEuro: "Membres avec un premier euro",
    membersWithLive: "{n} membre{s} avec un lien live ou un projet publié",
    membersWithEuro: "{n} membre{s} avec un premier euro déclaré",
    noTracks: "Aucun parcours en base. Vérifie les seeds et les policies RLS admin.",
    tableUserProfiles: "Table user_profiles manquante. Lance supabase/sql/001_roles_points_referrals.sql.",
    tableLearningTracks: "Table learning_tracks manquante. Lance supabase/sql/003_learning_tracks.sql."
  },
  adminUsers: {
    metaTitle: "Admin - Utilisateurs",
    metaDesc: "Gestion des utilisateurs TakaCode.",
    title: "UTILISATEURS",
    subtitle: "{n} compte{s}",
    tableMissing: "Table user_profiles manquante. Lance d'abord les scripts SQL d'initialisation.",
    loadError: "Erreur de chargement des utilisateurs.",
    user: "Utilisateur",
    role: "Rôle",
    points: "Points",
    grade: "Grade",
    registration: "Inscription",
    emailNotAvailable: "Email non disponible",
    yourself: "toi",
    pointsUpdated: "Points mis à jour.",
    roleChangeFailed: "Impossible de changer le rôle."
  },
  adminTracks: {
    metaTitle: "Admin - Parcours",
    metaDesc: "Gestion des parcours et de leurs leçons.",
    title: "PARCOURS",
    subtitle: "{n} parcours",
    newTrack: "Nouveau parcours",
    createFirst: "Créer le premier parcours",
    tableMissing: "Tables parcours manquantes. Lance supabase/sql/003_learning_tracks.sql et 004_track_curriculum.sql.",
    loadError: "Erreur de chargement.",
    empty: "Aucun parcours pour l'instant.",
    pendingTitle: "PROPOSITIONS A VALIDER ({n})",
    proposedBy: "proposé par un mentor",
    reject: "Rejeter",
    validate: "Valider"
  },
  adminTrackDetail: {
    metaTitle: "Admin - Parcours",
    metaDesc: "Gérer un parcours et ses leçons.",
    tableMissing: "Tables parcours manquantes. Lance les migrations SQL 003 et 004.",
    trackInfo: "INFORMATIONS DU PARCOURS"
  },
  adminLessonEdit: {
    metaTitle: "Admin - Editer leçon",
    metaDesc: "Éditer une leçon.",
    title: "EDITER LA LEÇON",
    backToTrack: "Retour au parcours"
  },
  adminLessonNew: {
    metaTitle: "Admin - Nouvelle leçon",
    metaDesc: "Créer une leçon.",
    title: "NOUVELLE LEÇON",
    backToTrack: "Retour au parcours",
    createModuleFirst: "Crée d'abord un module dans ce parcours avant d'ajouter une leçon."
  },
  adminTrackNew: {
    metaTitle: "Admin - Nouveau parcours",
    metaDesc: "Créer un parcours.",
    title: "NOUVEAU PARCOURS",
    subtitle: "Créer un parcours"
  },
  adminSessions: {
    metaTitle: "Admin - Sessions live",
    metaDesc: "Gestion des sessions live.",
    title: "SESSIONS LIVE",
    subtitle: "{n} session{s}",
    newSession: "Nouvelle session",
    createFirst: "Créer la première session",
    tableMissing: "Table sessions absente. Lance supabase/sql/010_live_sessions.sql.",
    loadError: "Erreur",
    empty: "Aucune session pour l'instant.",
    dateToConfirm: "Date à confirmer",
    sessionSaved: "Session enregistrée."
  },
  adminSessionNew: {
    metaTitle: "Admin - Nouvelle session",
    metaDesc: "Créer une session live.",
    title: "NOUVELLE SESSION",
    subtitle: "Programmer une session live"
  },
  adminReviews: {
    metaTitle: "Historique des revues",
    metaDesc: "Historique des revues de micro-projets avec méthode (IA, pairs, mentor, heuristique).",
    title: "HISTORIQUE DES REVUES",
    subtitle: "Micro-projets revus : IA, pairs, mentor ou heuristique",
    empty: "Aucune revue pour l'instant.",
    notAvailable: "Impossible de charger l'historique. Execute supabase/sql/021_ai_review_support.sql pour activer cette fonctionnalité.",
    examiner: "Examinateur"
  },
  adminAi: {
    metaTitle: "Configuration IA",
    metaDesc: "Configuration de la revue automatique par IA des micro-projets.",
    title: "CONFIGURATION IA",
    subtitle: "Revue automatique des micro-projets par intelligence artificielle",
    statusTitle: "État de la configuration",
    providerLabel: "Provider",
    modelLabel: "Modèle",
    defaultModel: "(défaut du provider)",
    notConfigured: "Non configuré",
    enabled: "Review IA active",
    disabled: "Review IA non configurée",
    enabledDesc: "Les micro-projets en mode 'ai' seront automatiquement revus par l'IA.",
    disabledDesc: "Ajoute une clé API et un provider pour activer la revue automatique.",
    envConfig: "Configuration via variables d'environnement",
    envDesc: "Ajoute ces variables dans ton fichier {dev} (développement) ou dans les {prod} de Vercel (production).",
    envDev: ".env.local",
    envProd: "Environment Variables",
    stepChooseProvider: "1. Choisir un provider gratuit",
    stepQuickChoice: "2. Choix rapide selon ton besoin",
    optionA: "Option A : OpenRouter (recommandé)",
    optionAKey: "Obtenir une clé OpenRouter gratuit →",
    optionB: "Option B : Hugging Face (sans clé API)",
    optionBDesc: "Aucune clé requise. Modèle libre hébergé gratuitement.",
    optionC: "Option C : Google Gemini (si tu as déjà une clé)",
    stepGetKey: "3. Obtenir une clé API (optionnel pour Hugging Face)",
    getApiKey: "{name} — Obtenir une clé API",
    hfNoKey: "Hugging Face : aucune clé requise ! prêt à l'emploi.",
    availableModels: "Modèles disponibles",
    activeLabel: "(actif)",
    privacy: "Confidentialité :",
    privacyDesc: "Les providers gratuits (Gemini, OpenRouter) peuvent utiliser les données envoyées pour améliorer leurs modèles. Ne configure pas la review IA si tu travailles sur du code sensible et confidentiel.",
    fallbackTitle: "Fallback automatique",
    fallbackDesc: "Si le premier provider est en erreur (quota épuisé 429, timeout...), le suivant est essayé automatiquement.",
    fallbackConfigTitle: "Configuration avec fallback",
    fallbackPrimary: "# Provider principal (essaye en premier)",
    fallbackKey: "# Clé spécifique {provider} (détectée automatiquement)",
    fallbackChain: "# Fallback : si {provider} échoue, essaye {fallbacks}",
    fallbackGeminiKey: "# Clé pour le fallback Gemini (optionnel)",
    fallbackActive: "Chaîne de fallback active :",
    fallbackNone: "Aucun fallback configuré. Ajoute {var}",
    testTitle: "Tester la connexion",
    testDesc: "Vérifie que ta clé API est valide et que le provider IA répond correctement.",
    testInfo: "Ce test envoie un prompt minimal (\"Réponds OK\") au provider configuré. Aucune donnée sensible n'est transmise. Le résultat s'affiche ci-dessus."
  },
  adminAffiliates: {
    metaTitle: "Admin - Affiliations",
    metaDesc: "Gestion des liens d'affiliation.",
    title: "AFFILIATIONS",
    subtitle: "{n} lien{s}",
    newLink: "Nouveau lien",
    addFirst: "Ajouter le premier lien",
    tableMissing: "Table absente. Lance supabase/sql/015_affiliate_links.sql.",
    empty: "Aucun lien d'affiliation."
  },
  adminAffiliateDetail: {
    metaTitle: "Admin - Lien d'affiliation",
    metaDesc: "Éditer un lien d'affiliation.",
    subtitle: "Editer le lien"
  },
  adminAffiliateNew: {
    metaTitle: "Admin - Nouveau lien",
    metaDesc: "Ajouter un lien d'affiliation.",
    title: "NOUVEAU LIEN",
    subtitle: "Ajouter un lien d'affiliation"
  },
  adminQuestions: {
    completePromptAndChoices: "Complète l'énoncé et tous les choix avant d'enregistrer.",
    choicesMustBeDifferent: "Les choix d'une question doivent être différents."
  },
  trackForm: {
    tabsIdentite: "Identité",
    tabsCible: "Cible",
    tabsPromesse: "Promesse",
    tabsStructure: "Structure",
    tabsPublication: "Publication",
    completeness: "Complétude : {n}/{total}",
    fieldRequired: "Ce champ est obligatoire.",
    slugRequired: "Le slug est obligatoire.",
    slugInvalid: "Lettres minuscules, chiffres et tirets uniquement.",
    fieldSlug: "Slug (url)",
    fieldSlugPlaceholder: "ex: automatisation-ia",
    fieldTitle: "Titre",
    fieldIcon: "Icône",
    fieldSummary: "Résumé",
    fieldObjective: "Objectif",
    fieldGoalKey: "goal_key",
    fieldLevel: "Niveau",
    fieldNextSession: "Session suivante",
    fieldResources: "Ressources (séparées par virgule)",
    promiseHint: "Explique pourquoi ce parcours existe et ce que l'apprenant va construire.",
    promisePublic: "Cette promesse sera affichée sur la carte du parcours dans le catalogue.",
    fieldDuration: "Durée (sem.)",
    fieldOrder: "Ordre",
    fieldColor: "Couleur",
    proposalNote: "Cette proposition sera validée par un admin avant d'être publiée.",
    publishedLabel: "Publié",
    activeLabel: "Actif",
    previewShow: "Aperçu public — montrer",
    previewHide: "Aperçu public — masquer",
    previewCatalog: "Tel qu'affiché dans le catalogue",
    createVersion: "Créer une version manuelle",
    versionLabel: "Label (ex: Avant refonte design)",
    versionCreate: "Créer",
    versionCreated: "Version créée avec succès",
    compareTitle: "Comparaison avec la version actuelle",
    autosaving: "Enregistrement automatique...",
    autosaved: "Brouillon sauvegardé",
    unsaved: "Modifications non enregistrées",
    submitCreate: "Créer le parcours",
    submitSave: "Enregistrer",
    updated: "Parcours mis à jour.",
    saving: "Enregistrement...",
    closeComparison: "Fermer la comparaison",
    trackDefault: "Parcours"
  },
  trackEl: {
    sectionTitle: "MODULES ET LEÇONS",
    moduleCount: "{n} module(s)",
    publishedTooltip: "Publié - cliquer pour brouillon",
    draftTooltip: "Brouillon - cliquer pour publier",
    editModule: "Editer le module",
    duplicateModule: "Dupliquer le module",
    deleteModule: "Supprimer le module",
    editLesson: "Editer la leçon",
    duplicateLesson: "Dupliquer la leçon",
    deleteLesson: "Supprimer la leçon",
    addLesson: "Ajouter une leçon",
    newModule: "Nouveau module",
    fieldTitle: "Titre",
    fieldTitleModule: "Titre du module",
    fieldSlug: "slug (ex: bases-html)",
    fieldSlugDisabled: "slug",
    fieldOrder: "ordre",
    fieldSummary: "Résumé (optionnel)",
    addModule: "Ajouter le module",
    save: "Enregistrer",
    cancel: "Annuler",
    confirmDeleteModule: "Supprimer ce module et toutes ses leçons ? Cette action est irréversible.",
    confirmDeleteLesson: "Supprimer cette leçon ? Cette action est irréversible.",
    slugInvalid: "Slug de module invalide (minuscules, chiffres, tirets).",
    titleRequired: "Le titre du module est obligatoire.",
    duplicateError: "Erreur duplication module",
    lessonDuration: "{duration} min · {xp} XP",
    module: "Module"
  },
  lessonForm: {
    module: "Module",
    fieldSlug: "Slug",
    fieldSlugNew: "Slug (url)",
    fieldSlugPlaceholder: "ex: bases-html",
    fieldTitle: "Titre",
    fieldIntro: "Introduction",
    fieldWhyImportant: "Pourquoi c'est important",
    fieldHowToUse: "Comment travailler la leçon",
    fieldObjectives: "Objectifs",
    objectivesHint: "Un objectif par ligne",
    quizLabel: "Quiz (JSON)",
    quizHint: "answer = index de la bonne réponse (commence à 0)",
    quizQuality: "QUALITE DU QUIZ",
    quizQuestionCount: "{n} question{s}",
    quizPosition: "Position {n} : {count}",
    quizError: "À corriger",
    quizAdvice: "Conseil",
    quizValid: "Structure valide. Les bonnes réponses seront réparties automatiquement entre les positions.",
    fieldXp: "XP",
    fieldDuration: "Durée (min)",
    fieldOrder: "Ordre",
    publishedLabel: "Publiée",
    submitCreate: "Créer la leçon",
    submitSave: "Enregistrer la leçon",
    saving: "Enregistrement...",
    saved: "Leçon enregistrée.",
    chooseModule: "Choisis un module.",
    titleRequired: "Le titre est obligatoire.",
    slugInvalid: "Slug de leçon invalide (minuscules, chiffres, tirets).",
    lessonDefault: "Leçon",
    invalidSlug: "Slug de leçon invalide (minuscules, chiffres, tirets).",
    issueError: "À corriger",
    issueTip: "Conseil",
    structureValid: "Structure valide. Les bonnes réponses seront reparties automatiquement entre les positions.",
    questionCount: "{n} question{s}",
    slug: "Slug",
    title: "Titre",
    introduction: "Introduction",
    whyImportant: "Pourquoi c'est important",
    howToUse: "Comment travailler la leçon",
    objectives: "Objectifs",
    quiz: "Quiz (JSON)",
    xp: "XP",
    duration: "Durée (min)",
    order: "Ordre",
    published: "Publiée"
  },
  affiliateForm: {
    provider: "Fournisseur",
    providerPlaceholder: "Ex: Hostinger",
    category: "Catégorie",
    title: "Titre",
    titlePlaceholder: "Ex: Hébergement web Hostinger",
    description: "Description",
    url: "Lien d'affiliation",
    urlPlaceholder: "https://...",
    logoUrl: "Logo (URL, optionnel)",
    logoUrlPlaceholder: "https://.../logo.png",
    trackSlug: "Parcours associé (slug, optionnel)",
    trackSlugPlaceholder: "Ex: media-buyer, produits-digitaux",
    order: "Ordre",
    publishedLabel: "Publié",
    providerRequired: "Le fournisseur est obligatoire.",
    tableMissing: "Table absente. Lance supabase/sql/015_affiliate_links.sql.",
    saved: "Lien enregistré.",
    submitAdd: "Ajouter le lien",
    submitSave: "Enregistrer",
    saving: "Enregistrement...",
    deleting: "Suppression...",
    delete: "Supprimer",
    confirmDelete: "Supprimer ce lien d'affiliation ?",
    deleteConfirm: "Supprimer ce lien d'affiliation ?",
    fieldProvider: "Fournisseur",
    placeholderProvider: "Ex: Hostinger",
    fieldCategory: "Catégorie",
    fieldTitle: "Titre",
    placeholderTitle: "Ex: Hébergement web Hostinger",
    fieldDescription: "Description",
    fieldUrl: "Lien d'affiliation",
    fieldLogo: "Logo (URL, optionnel)",
    fieldTrackSlug: "Parcours associé (slug, optionnel)",
    placeholderTrackSlug: "Ex: media-buyer, produits-digitaux",
    fieldOrder: "Ordre",
    published: "Publié",
    offer: "Offre"
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
    proposerParcours: "Propose a track",
    centreAdmin: "Admin center",
    seDeconnecter: "Sign out",
    ouvrirMenu: "Open menu",
    member: "Member"
  },
  referral: {
    copy: "Copy",
    copied: "Copied!",
    description: "Each referral via your link earns you +100 points.",
    linkLabel: "Your referral link"
  },
  glossary: {
    token: "Text fragment (word, word piece, or punctuation): the basic unit the LLM processes at each step.",
    tokens: "Text fragments (words, word pieces, or punctuation): the basic units processed by the LLM.",
    LLM: "Large Language Model: AI model trained on vast text corpora. It predicts the most likely next token.",
    contextWindow: "Maximum number of tokens the model can process at once: its working memory.",
    hallucination: "Plausible but factually incorrect response generated by the model. Always verify critical facts.",
    mcp: "Model Context Protocol: open standard to connect AI to external tools (DB, API, files...).",
    rag: "Retrieval-Augmented Generation: technique that injects relevant documents into the prompt so the AI answers based on your data.",
    agent: "LLM equipped with tools (files, terminal, web...) that works in a loop: plan, act, observe, repeat.",
    api: "Application Programming Interface that allows applications to communicate with each other.",
    fineTuning: "Additional training of a model on specific data to specialize it.",
    fewShot: "Prompt technique: provide 2-3 examples of the expected output to calibrate format and style.",
    zeroShot: "Prompt technique: ask directly without examples.",
    chainOfThought: "Prompt technique: ask the model to explain its reasoning step by step before the final answer.",
    systemPrompt: "Base instruction given to the LLM at the start of context, defining its role, tone, and constraints for the entire conversation.",
    temperature: "Parameter controlling model creativity (0 = deterministic, 1 = very creative).",
    topP: "Nucleus sampling: the model only considers tokens whose cumulative probability reaches threshold P. Alternative to temperature.",
    embedding: "Transformation of text into a vector of real numbers representing its meaning. Similar texts have similar vectors.",
    RAG: "Retrieval-Augmented Generation: technique that injects relevant documents into the prompt so the AI answers based on your data."
  },
  projectForm: {
    titleRequired: "Project title is required.",
    trackLinked: "Accelerator track linked: you are enrolled.",
    saved: "Project saved.",
    deleted: "Project deleted.",
    fileTooLarge: "File exceeds 5 MB.",
    fileUploaded: "File uploaded.",
    uploadFailed: "Upload failed.",
    lesson: {
      fileTooLarge: "File exceeds 5 MB.",
      uploaded: "File uploaded.",
      uploadFailed: "Upload failed.",
      microProjectSaved: "Your micro-project is saved. Well done, keep going!",
      trackCompleted: "Congratulations, you completed the entire track!",
      aiValidated: "AI validated your work.",
      lessonValidatedTitle: "LESSON VALIDATED!",
      trackCompletedTitle: "TRACK COMPLETED!"
    }
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
      roadmapUpcoming: "Upcoming",
      liveStatus: "In progress",
      floatingPublished: "PROJECT PUBLISHED",
      floatingWebApp: "Web app",
      floatingSessionLive: "LIVE SESSION",
      floatingSessionInfo: "In 2h - 34 registered"
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
    },
    title: "DASHBOARD",
    trainToAdvance: "TRAIN TO ADVANCE",
    nextCompetence: "Next competence to unlock for your project: {title}.",
    trackCompleted: "Track completed — all competences are unlocked for your project.",
    continueLesson: "Continue lesson",
    startTraining: "Start training",
    trackUnlocksSkills: "This track unlocks the skills your project needs, sprint by sprint.",
    startThisTrack: "Start this track",
    myStats: "MY STATS",
    points: "Points",
    grade: "Grade",
    tracks: "Tracks",
    projectAccelerators: "PROJECT ACCELERATORS",
    viewAllCatalog: "View full catalog",
    roadmapDescription: "Each track unlocks skills your project needs, in the recommended order: understand AI, then build with it.",
    step: "Step {n}",
    completed: "completed",
    inProgress: "in progress",
    myTracks: "My tracks",
    myProjects: "My projects",
    leaderboard: "Leaderboard",
    quickActions: "Quick actions"
  },
  dashboardTracks: {
    title: "MY TRACKS",
    exploreCatalog: "Explore the catalog",
    progress: "Progress",
    continue: "Continue",
    start: "Start",
    program: "Program",
    emptyTitle: "NO ACTIVE TRACK",
    emptyDesc: "Choose a track from the catalog to start learning and building your project.",
    exploreTracks: "Explore tracks"
  },
  dashboardProjects: {
    title: "MY PROJECTS",
    newProject: "New project",
    schemaNotReady: "Projects table missing. Run supabase/sql/008_user_projects.sql to enable project creation.",
    firstEuro: "1st euro",
    deadline: "Deadline",
    emptyTitle: "CREATE YOUR FIRST PROJECT",
    emptyDesc: "Define the project you want to build: title, goal, deadline. It will serve as your guiding thread through your tracks.",
    microProjects: "MICRO-PROJECTS COMPLETED",
    completed: "Completed",
    inProgress: "In progress",
    reviewLesson: "Review lesson"
  },
  dashboardProjectDetail: {
    subtitle: "Edit my project",
    backLabel: "My projects",
    deliverables: "Deliverables",
    acceleratorTrack: "Accelerator track",
    lessonDrivesProject: "Each completed lesson moves this project forward: the track micro-projects are your deliverables (listed opposite).",
    continueSprint: "Continue sprint",
    trackCompleted: "Track completed — review the program",
    openTrack: "Open the track",
    chooseAccelerator: "Choose your accelerator",
    suggestedTracks: "Suggested tracks for this project",
    noAccelerator: "This project doesn't have an accelerator track yet. Choose one from the \"Accelerator track\" field in the form: its progress will show here.",
    viewAllTracks: "View all tracks",
    validated: "Completed",
    needsImprovement: "Needs improvement",
    submitted: "Submitted"
  },
  dashboardProjectNew: {
    title: "NEW PROJECT",
    subtitle: "Create the project you will build",
    backLabel: "My projects"
  },
  dashboardProfile: {
    title: "PROFILE",
    points: "Points",
    grade: "Grade",
    role: "Role",
    shareProgress: "Share my progress",
    shareText: "I'm {grade} with {points} XP on TakaCode!"
  },
  dashboardResources: {
    title: "MY RESOURCES",
    emptyTitle: "NO RESOURCES YET",
    emptyDesc: "Enroll in a track: all curated resources from its lessons will appear here.",
    viewTracks: "View my tracks"
  },
  dashboardCommunity: {
    title: "COMMUNITY",
    members: "Members",
    projects: "Projects",
    likes: "Likes",
    lessons: "Lessons completed",
    noTrack: "No track",
    viewCommunity: "View community",
    emptyTitle: "THE FEED STARTS SOON",
    emptyDesc: "The community feed will display projects published by members. Complete a track and publish your project to contribute.",
    advanceTrack: "Advance on a track"
  },
  dashboardChangelog: {
    title: "UPDATES",
    subtitle: "TakaCode evolves with you",
    productJournal: "Product journal",
    heading: "EACH VERSION BRINGS YOUR IDEA CLOSER TO LAUNCH",
    description: "Find the major changes delivered, improvements in progress, and what they concretely change in your experience.",
    currentVersion: "Current version",
    latestVersion: "Latest version",
    statusLivree: "Delivered",
    statusEnCours: "In progress",
    statusPlanifiee: "Planned"
  },
  dashboardTools: {
    title: "RECOMMENDED TOOLS",
    subtitle: "To build and launch your project",
    schemaNotReady: "Tools section coming soon (run supabase/sql/015_affiliate_links.sql).",
    empty: "No recommended tools yet."
  },
  dashboardGuide: {
    title: "GETTING STARTED GUIDE",
    subtitle: "The sections of your space",
    welcome: "Welcome! Here's a quick tour of your space. Click a section to go there.",
    startBuilding: "Start building"
  },
  dashboardMentor: {
    title: "MY PROPOSALS",
    subtitle: "Tracks proposed to the community",
    proposeTrack: "Propose a track",
    info: "As a mentor, your tracks are {strong}validated by an admin{/strong} before being publicly visible.",
    pending: "Pending validation",
    published: "Published",
    rejected: "Rejected",
    edit: "Edit",
    empty: "You haven't proposed any tracks yet.",
    firstProposal: "Propose my first track"
  },
  dashboardMentorNew: {
    title: "PROPOSE A TRACK",
    subtitle: "Will be validated by an admin",
    backLabel: "My proposals"
  },
  dashboardMentorEdit: {
    subtitle: "My proposal",
    backLabel: "My proposals",
    published: "This proposal has been validated and published. Thanks for your contribution!",
    rejected: "This proposal was not accepted. You can submit a new one."
  },
  dashboardMentorLesson: {
    title: "EDIT LESSON",
    backLabel: "Back to track"
  },
  dashboardMentorNewLesson: {
    title: "NEW LESSON",
    backLabel: "Back to track"
  },
  dashboardReviews: {
    title: "REVIEWS",
    subtitle: "Review and validate other members' micro-projects",
    info: "Help the community: give constructive feedback. Each review earns you points.",
    schemaNotReady: "Reviews coming soon (run supabase/sql/016_project_reviews.sql)."
  },
  dashboardSessions: {
    title: "LIVE SESSIONS",
    subtitle: "Upcoming and replays",
    schemaNotReady: "Sessions table missing. Run supabase/sql/010_live_sessions.sql.",
    emptyTitle: "NO SESSIONS SCHEDULED",
    emptyDesc: "Upcoming live sessions will be announced here.",
    upcoming: "UPCOMING",
    join: "Join",
    replays: "REPLAYS",
    review: "Watch again",
    dateToConfirm: "Date to be confirmed"
  },
  dashboardDocs: {
    title: "DOCUMENTATION",
    subtitle: "Everything to launch your project",
    info: "TakaCode helps you create a digital project and monetize it. Choose a guide below.",
    userGuide: "User guide",
    userDesc: "Create your project, follow the associated tracks, take quizzes and publish online.",
    mentorGuide: "Mentor guide",
    mentorDesc: "Create project tracks, edit content, and guide members toward launch.",
    adminGuide: "Admin guide",
    adminDesc: "Administer the platform, manage users, roles and configuration.",
    linkProjects: "Build and publish your project",
    linkTracks: "Follow a track linked to your project",
    linkQuiz: "Take a quiz",
    linkProgress: "Understand progression and points",
    linkMentoring: "Work with a mentor",
    linkMentorTracks: "Create and manage a project track",
    linkMentorEditing: "Edit modules, lessons and resources",
    linkMentorQuestions: "Manage the question bank",
    linkMentorReviews: "Review projects",
    linkAdminRoles: "Manage users and roles",
    linkAdminAffiliates: "Configure affiliations",
    linkAdminSessions: "Organize live sessions"
  },
  dashboardDocsUserTracks: {
    title: "FOLLOWING A PROJECT TRACK",
    subtitle: "User guide",
    h2: "Tracks serve your project",
    p1: "On TakaCode, each track is linked to a project archetype (showcase site, SaaS, e-commerce, blog, mobile app, API, etc.). You don't follow a track \"to learn\": you follow it {strong}to build your project{/strong}.",
    h3_1: "Choosing a track",
    ol1_1: "Go to {strong}My tracks{/strong} from the menu.",
    ol1_2: "Each track shows what type of project it's linked to.",
    ol1_3: "Select the one that matches your project or the step you want to complete.",
    ol1_4: "The first module starts automatically.",
    h3_2: "How it works",
    p2: "A track is made up of modules, lessons, quizzes and micro-projects. Each element is designed to produce a concrete deliverable that moves your project forward.",
    ul2_1: "{strong}Modules:{/strong} major project stages (design, development, deployment, marketing).",
    ul2_2: "{strong}Lessons:{/strong} concrete actions to perform (writing code, configuring a tool, writing a page).",
    ul2_3: "{strong}Quiz:{/strong} validate your understanding before moving to the next step.",
    ul2_4: "{strong}Resources:{/strong} documentation, tools, examples to help you.",
    h3_3: "Progress",
    p3: "Each completed lesson, each passed quiz and each validated micro-project earns you XP. Accumulate enough points to level up. But the real goal is your project going live.",
    h3_4: "Tips",
    ul4_1: "Start by creating or defining your project before choosing a track.",
    ul4_2: "Don't skip steps: each lesson produces a useful deliverable for what comes next.",
    ul4_3: "Ask questions in the community if you're stuck on a step.",
    ul4_4: "Once the track is complete, think about publishing and monetization."
  },
  dashboardDocsUserProjects: {
    title: "BUILD AND PUBLISH YOUR PROJECT",
    subtitle: "User guide",
    h2: "The project is at the heart of TakaCode",
    p1: "Everything starts with a project. Not an exercise, not homework: a real digital project that you will build, put online and monetize. The tracks, resources and mentors are there to help you.",
    h3_1: "1. Create your project",
    p2: "After registration, a first project is created automatically. You can modify it or create others from the {strong}My projects{/strong} section.",
    ul2_1: "Choose a name and clear goal for your project.",
    ul2_2: "Select a starter kit (showcase site, SaaS, e-commerce, blog, mobile app, API, AI chatbot, dashboard).",
    ul2_3: "Set a deadline to keep a steady pace.",
    h3_2: "2. Follow the tracks linked to your project",
    p3: "Each track corresponds to a project archetype. When you choose a starter kit, recommended tracks are suggested. Each lesson brings you closer to launch.",
    ul3_1: "Modules and lessons are designed to produce concrete deliverables.",
    ul3_2: "Quizzes verify your understanding before moving on.",
    ul3_3: "Micro-projects are steps of your main project.",
    h3_3: "3. Publish your project",
    p4: "Once built, follow the deployment guide to put your project online:",
    ol4_1: "Push your code to GitHub (a repository is created automatically).",
    ol4_2: "Connect it to Vercel or Netlify for deployment.",
    ol4_3: "Attach a custom domain if you have one.",
    ol4_4: "Enable analytics to track your visitors.",
    h3_4: "4. Monetize your project",
    p5: "An online project can generate revenue. Depending on the project type, several paths are available:",
    ul5_1: "{strong}Subscriptions{/strong}: Stripe, recurring invoices, metering.",
    ul5_2: "{strong}Digital products{/strong}: ebooks, courses, templates, presets.",
    ul5_3: "{strong}Advertising and affiliate{/strong}: audiences, partnerships.",
    ul5_4: "{strong}Freelance / services{/strong}: use your project as a portfolio.",
    p6: "Monetization guides walk you through each approach step by step.",
    h3_5: "Validation modes",
    ul6_1: "{strong}Automatic:{/strong} verification by predefined criteria.",
    ul6_2: "{strong}AI:{/strong} analysis and feedback generated automatically.",
    ul6_3: "{strong}Peer:{/strong} another member evaluates your deliverable.",
    ul6_4: "{strong}Mentor:{/strong} personalized evaluation by a supervisor."
  },
  dashboardDocsUserProgress: {
    title: "PROGRESS AND POINTS",
    subtitle: "User guide",
    h2: "Your progress reflects your project's advancement",
    p1: "On TakaCode, points (XP) and grades measure your project's progress, not just your learning. Every action that moves your project forward earns you points.",
    h3_1: "Earning points",
    ul1_1: "{strong}Completed lesson:{/strong} each lesson that produces a deliverable for your project.",
    ul1_2: "{strong}Passed quiz:{/strong} validates your understanding before moving to the next step.",
    ul1_3: "{strong}Validated micro-project:{/strong} a step of your main project is delivered.",
    ul1_4: "{strong}Published project:{/strong} your project is live (big bonus).",
    ul1_5: "{strong}First revenue:{/strong} your project starts generating money (major bonus).",
    h3_2: "Grades",
    p2: "Grades reflect your progress in building and monetizing your projects.",
    ul2_1: "{strong}Apprentice{/strong} — project created, first deliverables",
    ul2_2: "{strong}Journeyman{/strong} — project built, being deployed",
    ul2_3: "{strong}Expert{/strong} — project published and starting to generate",
    ul2_4: "{strong}Master{/strong} — project profitable, you help others",
    h3_3: "Dashboard",
    p3: "Your dashboard shows a summary: ongoing projects, next recommended action, points earned and leaderboard. Check it to know what to do next."
  },
  dashboardDocsUserMentoring: {
    title: "WORKING WITH A MENTOR",
    subtitle: "User guide",
    h2: "A mentor to accelerate your project",
    p1: "Mentors support you in building and launching your project. They can answer your questions, review your deliverables, and help you unlock critical steps.",
    h3_1: "Finding a mentor",
    ul1_1: "Check the {strong}Live sessions{/strong} section for available slots.",
    ul1_2: "Join the community to connect with mentors.",
    ul1_3: "Some project tracks are led by dedicated mentors.",
    h3_2: "Requesting a review",
    p2: "When you submit a project deliverable, you can request a mentor review. The mentor examines your work, gives detailed feedback, and validates your progress.",
    h3_3: "Live sessions",
    p3: "Live sessions are video meetings with a mentor. They can be:",
    ul3_1: "{strong}Q&A:{/strong} ask all your questions about your project.",
    ul3_2: "{strong}Workshop:{/strong} work on a specific step of your project.",
    ul3_3: "{strong}Project review:{/strong} present your project and receive oral feedback.",
    ul3_4: "{strong}Strategy:{/strong} advice on monetization and launch."
  },
  dashboardDocsUserQuiz: {
    title: "TAKING A QUIZ",
    subtitle: "User guide",
    h2: "How quizzes work",
    p1: "Quizzes validate your understanding of the lessons. Each quiz consists of multiple-choice questions. Choices are shuffled for each user, making each attempt unique.",
    h3_1: "Process",
    ol1_1: "After a lesson, access the associated quiz.",
    ol1_2: "For each question, select an answer from the choices provided.",
    ol1_3: "Submit all your answers by clicking {strong}Submit{/strong}.",
    ol1_4: "Results appear immediately: score, correct/incorrect answers and explanations.",
    h3_2: "Passing conditions",
    ul2_1: "You need at least {strong}70% correct answers{/strong} to pass the quiz.",
    ul2_2: "If you fail, you can retry immediately.",
    ul2_3: "Questions may vary between attempts (drawn from the question bank).",
    ul2_4: "Your best score is kept.",
    h3_3: "Question types",
    p3: "Questions are categorized by difficulty: {strong}foundation{/strong}, {strong}standard{/strong} and {strong}challenge{/strong}. They are linked to specific learning objectives, helping you identify areas to review.",
    h3_4: "Tips",
    ul4_1: "Read the explanation after each question carefully, even if you got it right.",
    ul4_2: "If a question gives you trouble, check the associated resource in the lesson.",
    ul4_3: "The quiz is not timed: take your time to think."
  },
  dashboardDocsMentorTracks: {
    title: "CREATE AND MANAGE A TRACK",
    subtitle: "Mentor guide",
    h2: "Proposing a track",
    p1: "As a mentor, you can create training tracks. Go to {strong}Propose a track{/strong} from the menu to get started.",
    h3_1: "Track structure",
    ul1_1: "{strong}Modules:{/strong} major thematic sections of the track.",
    ul1_2: "{strong}Lessons:{/strong} learning units within a module.",
    ul1_3: "{strong}Resources:{/strong} links and references to deepen each lesson.",
    ul1_4: "{strong}Quiz:{/strong} multiple-choice questions to validate learning.",
    ul1_5: "{strong}Micro-projects:{/strong} hands-on practice to apply concepts.",
    h3_2: "Validation and publication",
    p2: "After creating a track, you can submit it for validation. An administrator reviews the content before publication. Once approved, the track is visible to all learners.",
    h3_3: "Modifying an existing track",
    p3: "You can modify tracks you are the author of. Changes are immediately visible to learners (unless the track is being validated)."
  },
  dashboardDocsMentorReviews: {
    title: "REVIEWING PROJECTS",
    subtitle: "Mentor guide",
    h2: "Project reviews",
    p1: "As a mentor, you can review projects submitted by learners. Go to the {strong}Reviews{/strong} section to see the queue.",
    h3_1: "Review process",
    ol1_1: "Check the list of projects awaiting review.",
    ol1_2: "Open a project to see the submitted work and instructions.",
    ol1_3: "Evaluate the project according to the criteria defined in the track.",
    ol1_4: "Add written feedback with suggestions for improvement.",
    ol1_5: "Validate or reject the project.",
    h3_2: "Evaluation criteria",
    ul2_1: "Compliance with instructions",
    ul2_2: "Technical quality of the work",
    ul2_3: "Relevance of choices made",
    ul2_4: "Visible effort and progress",
    h3_3: "Notifications",
    p3: "When you review a project, the learner receives a notification. They can see your feedback and rework their project if needed."
  },
  dashboardDocsMentorQuestions: {
    title: "QUESTION BANK",
    subtitle: "Mentor guide",
    h2: "Question bank",
    p1: "Each lesson has an associated question bank. You can add, modify or delete questions from the lesson editor.",
    h3_1: "Adding a question",
    ul1_1: "Define the {strong}prompt{/strong} (8 characters minimum).",
    ul1_2: "Add between {strong}2 and 6 choices{/strong}.",
    ul1_3: "Indicate the {strong}correct answer index{/strong} (starts at 0).",
    ul1_4: "Add an {strong}explanation{/strong} to justify the answer.",
    ul1_5: "Choose a {strong}learning objective{/strong} from those in the lesson.",
    ul1_6: "Set the {strong}difficulty{/strong}: foundation, standard or challenge.",
    ul1_7: "Optionally add a related {strong}resource URL{/strong}.",
    h3_2: "Automatic validator",
    p2: "When saving, a built-in validator checks:",
    ul2_1: "No duplicate choices",
    ul2_2: "Presence of a correct answer",
    ul2_3: "Balanced answer position distribution",
    ul2_4: "Non-empty explanation",
    h3_3: "Automatic balancing",
    p3: "Correct answer positions are automatically distributed across all questions to prevent any one position (e.g., A) from being correct too often.",
    h3_4: "Question statuses",
    ul4_1: "{strong}Draft:{/strong} being written, not yet usable.",
    ul4_2: "{strong}Approved:{/strong} ready to be used in quizzes.",
    ul4_3: "{strong}Archived:{/strong} removed but kept for history."
  },
  dashboardDocsMentorEditing: {
    title: "EDITING CONTENT",
    subtitle: "Mentor guide",
    h2: "Lesson editor",
    p1: "Each lesson can be modified via the editing interface. You can change:",
    ul1_1: "{strong}Title and description:{/strong} the lesson name and summary.",
    ul1_2: "{strong}Content:{/strong} the lesson body in text format.",
    ul1_3: "{strong}Resources:{/strong} add or remove links (label, URL, type).",
    ul1_4: "{strong}Objectives:{/strong} the skills targeted by the lesson.",
    ul1_5: "{strong}Validation mode:{/strong} auto, AI, peer or mentor for the project.",
    h3_2: "Resources",
    p2: "Each lesson can have multiple resources (articles, videos, tools). For each resource, you can define:",
    ul2_1: "The label (visible title)",
    ul2_2: "The URL",
    ul2_3: "The type (article, video, tool, etc.)",
    ul2_4: "The reason (why this resource is useful)",
    ul2_5: "Usage notes (how to use it)",
    h3_3: "Module and lesson order",
    p3: "Modules and lessons are ordered by their position. Use the interface controls to rearrange the learning order."
  },
  dashboardDocsAdminSessions: {
    title: "LIVE SESSIONS",
    subtitle: "Admin guide",
    h2: "Live sessions",
    p1: "Live sessions are real-time meetings with learners. They can be scheduled and managed from the admin interface.",
    h3_1: "Creating a session",
    ul1_1: "Choose a title and description for the session.",
    ul1_2: "Set the date, time and duration.",
    ul1_3: "Select the type: Q&A, workshop, project review.",
    ul1_4: "Add a video conference link (Zoom, Google Meet, etc.).",
    h3_2: "Managing registrations",
    p2: "Learners can register for sessions. You can see the number of remaining spots and the list of registrants. You can cancel or reschedule a session if needed.",
    h3_3: "Notifications",
    p3: "Registrants receive a notification before the session starts. A reminder is sent automatically 24h and 1h before the event."
  },
  dashboardDocsAdminRoles: {
    title: "MANAGE USERS AND ROLES",
    subtitle: "Admin guide",
    h2: "User roles",
    p1: "The platform defines several roles with increasing permissions:",
    ul1_1: "{strong}user:{/strong} standard learner, access to tracks and quizzes.",
    ul1_2: "{strong}mentor:{/strong} can create tracks, edit content and review projects.",
    ul1_3: "{strong}admin:{/strong} full access to all features and administration.",
    h3_2: "Managing roles",
    p2: "From the {strong}Users{/strong} section in the admin panel, you can view all users and change their role.",
    ul2_1: "Search for a user by name or email.",
    ul2_2: "Check their current role, registration date and statistics.",
    ul2_3: "Change their role if needed (e.g., promote a user to mentor).",
    h3_3: "Security",
    p3: "Passwords must be at least 8 characters with lowercase, uppercase, numbers and symbols. Compromised password protection is enabled in production."
  },
  dashboardDocsAdminAffiliates: {
    title: "AFFILIATE PROGRAM",
    subtitle: "Admin guide",
    h2: "Affiliate program",
    p1: "The affiliate program allows members to refer new users and track their referrals. Each member has a unique link.",
    h3_1: "Configuration",
    ul1_1: "Go to the {strong}Affiliations{/strong} section in the admin panel.",
    ul1_2: "View the list of affiliates and their statistics.",
    ul1_3: "Configure rewards and validation conditions.",
    h3_2: "Tracking",
    p2: "The affiliate dashboard shows for each member:",
    ul2_1: "Number of people referred",
    ul2_2: "Points earned through referrals",
    ul2_3: "Date of last referral"
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
    markAllRead: "Mark all read",
    empty: "No notifications",
    timeAgo: {
      justNow: "just now",
      minutes: "",
      hours: "",
      days: ""
    },
    min: "min",
    h: "h",
    j: "d"
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
  tour: {
    overlay: {
      ariaLabel: "Interactive guide",
      skipTour: "Skip the guide",
      previous: "Previous",
      skip: "Skip",
      next: "Next",
      start: "Let's go!"
    },
    parcours: {
      welcome: { title: "Welcome to the tracks", body: "Discover the complete list of TakaCode tracks, from fundamental to advanced. Each track will guide you step by step." },
      ordering: { title: "Recommended order", body: "Tracks are ordered from fundamental to advanced. It is recommended to start with the basics before moving on, but you are free to choose." },
      cards: { title: "Track cards", body: "Each card shows the level, key skills, and number of steps. Click a track to see its detailed card with the progression plan." },
      enrollment: { title: "Start now", body: "Open a track that interests you and enroll to track your progress, access lessons, and validate projects." }
    },
    detail: {
      welcome: { title: "Track details", body: "You are on a track detail page. Here you will find skills, the course plan, and associated resources." },
      prereqs: { title: "Recommended prerequisites", body: "Prerequisites show you which tracks to know before starting this one. It is not blocking but highly recommended." },
      curriculum: { title: "Progression plan", body: "The curriculum breaks the track into modules and lessons. Follow the indicated order for optimal progression." }
    },
    lecon: {
      welcome: { title: "Welcome to the lesson", body: "Each lesson contains selected resources, a validation quiz, and a hands-on micro-project." },
      resources: { title: "Resources", body: "Read the recommended resources to understand the concepts before moving to the quiz and project." },
      quiz: { title: "Validation quiz", body: "Test your understanding with the quiz. Pass it to unlock the rest of the track." },
      project: { title: "Micro-project", body: "Put what you've learned into practice by completing the micro-project. Submit it for a review." },
      nav: { title: "Navigation", body: "Use the previous/next buttons to progress through the track at your own pace." }
    },
    guide: {
      welcome: { title: "Getting started guide", body: "Here is a quick tour of your TakaCode space sections. Explore each section to discover everything you can do." },
      navigate: { title: "Navigation", body: "Click a section in the list below to go there directly. You can also use the sidebar on the left." },
      done: { title: "Ready to create", body: "You now know the key sections. Explore, learn, and build your project. This guide remains accessible from your Dashboard." }
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
    hasAccount: "Already have an account?",
    authLabel: "Authentication",
    backToSite: "Back to site",
    signInTitle: "SIGN IN",
    signUpTitle: "CREATE ACCOUNT",
    continueWithGoogle: "Continue with Google",
    continueWithGithub: "Continue with GitHub",
    continueWithWallet: "Continue with Ethereum Wallet",
    orDivider: "or",
    emailPlaceholder: "name@example.com",
    hidePassword: "Hide",
    showPassword: "Show",
    passwordWeak: "Weak password",
    passwordMedium: "Medium password",
    passwordStrong: "Strong password",
    resetBadge: "All set!",
    resetTitle: "Your password has been updated",
    resetDescription: "You can now sign in and pick up where you left off.",
    resetContinue: "Continue my journey",
    referralDetected: "Referral code detected:",
    signUpFirstName: "First name",
    signUpLastName: "Last name",
    signUpReferralCode: "Referral code (optional)",
    signUpReferralPlaceholder: "ABC123DEF0",
    signUpConfirmPassword: "Confirm password",
    signUpCreateAccount: "Create my account",
    noAccountPrompt: "Not a member yet?",
    hasAccountPrompt: "Already a member?",
    createAccountLink: "Create account",
    signInLink: "Sign in",
    signUpHeroBadge: "TakaCode Community",
    signUpHeroTitle1: "Start your",
    signUpHeroTitle2: "next project",
    signUpHeroDesc: "Create your account and access tracks, resources, live sessions and a community that learns by building.",
    signUpHighlight1Title: "Learn with method",
    signUpHighlight1Desc: "Guided tracks, curated resources and hands-on exercises to progress at your own pace.",
    signUpHighlight2Title: "Build with the community",
    signUpHighlight2Desc: "Join live sessions, connect with other creators and move forward together.",
    signUpHighlight3Title: "Accelerate with AI",
    signUpHighlight3Desc: "Leverage the best AI tools to understand faster and turn your ideas into concrete projects.",
    signInHeroBadge: "Welcome back",
    signInHeroTitle1: "Find your projects",
    signInHeroTitle2: "and keep moving forward",
    signInHeroDesc: "Sign back in to resume your track, join live sessions and continue your achievements.",
    signInHighlight1Title: "Pick up where you left off",
    signInHighlight1Desc: "Your tracks, resources and projects are waiting.",
    signInHighlight2Title: "Rejoin the community",
    signInHighlight2Desc: "Connect with other creators and join upcoming sessions.",
    signInHighlight3Title: "Keep progressing",
    signInHighlight3Desc: "Every step brings you closer to your next project.",
    enterEmailError: "Enter your email to sign in.",
    validEmailError: "Enter a valid email address.",
    passwordMismatch: "Passwords do not match.",
    weakPasswordError: "Use a stronger password (min 10 characters, uppercase, number, symbol).",
    signInError: "Unable to sign in at this time.",
    signUpError: "Unable to sign up at this time.",
    checkEmail: "Account created. Check your email to confirm your registration.",
    networkError: "Network error. Try again shortly.",
    oauthError: "Unable to start OAuth sign in.",
    walletError: "Unable to connect wallet.",
    errorForbidden: "Your account doesn't have the required role to access the dashboard.",
    errorOauthCallback: "Sign in failed. Try again.",
    errorOauthCodeMissing: "Sign in was interrupted. Try again.",
    errorOauthDenied: "Sign in cancelled or denied.",
    errorAuthConfigMissing: "Auth configuration missing. Contact the administrator.",
    errorAuthNetwork: "Network error during OAuth sign in. Try again.",
    signUpLoading: "Loading...",
    forgotPasswordTitle: "NEED A NEW PASSWORD?",
    forgotPasswordSentTitle: "CHECK YOUR INBOX",
    forgotPasswordBadge: "RESET",
    forgotPasswordSentBadge: "EMAIL SENT",
    forgotPasswordDesc: "No worries. Enter your email address and we'll send you a link to get back into your TakaCode space.",
    forgotPasswordSentDesc: "A reset link has been sent to",
    forgotPasswordSentHint: "Also check spam, promotions or social folders, then open the link you received.",
    forgotPasswordWaiting: "Your projects are waiting",
    forgotPasswordWaitingSub: "Come back and continue what you started.",
    forgotPasswordSubmit: "Send the link",
    forgotPasswordLoading: "Sending...",
    forgotPasswordBack: "Back to sign in",
    forgotPasswordResend: "Resend link",
    forgotPasswordSignUp: "Create account",
    forgotPasswordInvalidEmail: "Enter a valid email address.",
    forgotPasswordSendError: "Unable to send the link at this time.",
    forgotPasswordNetworkError: "Network error. Check your connection and try again.",
    resetPasswordBadge: "NEW PASSWORD",
    resetPasswordTitle: "READY TO RESUME?",
    resetPasswordDesc: "Choose a new password to get back to your space and continue your projects.",
    resetPasswordNewLabel: "New password",
    resetPasswordConfirmLabel: "Confirm password",
    resetPasswordSubmit: "Resume my journey",
    resetPasswordLoading: "Updating...",
    resetPasswordBack: "Back to sign in",
    resetPasswordNewLink: "New link",
    resetPasswordMismatch: "Passwords do not match.",
    resetPasswordWeakError: "Choose a stronger password (min 10 characters, uppercase, number, symbol).",
    resetPasswordUpdateError: "Unable to update the password.",
    resetPasswordNoSession: "Open this page from the link you received by email to choose your new password.",
    resetPasswordSessionError: "Unable to verify session. Reload the page from the link you received by email.",
    resetPasswordNetworkError: "Network error. Try again shortly.",
    signUpDesc: "Create your TakaCode account and start building real projects with guided tracks.",
    signInDesc: "Sign back into your TakaCode space to resume your projects, tracks, and live sessions."
  },
  onboarding: {
    backToSite: "Back to site",
    welcomeSection: {
      label: "Welcome",
      title: "WELCOME TO TAKACODE",
      desc: "The place where you learn by building. We'll personalize your experience in under a minute.",
      card1Title: "Targeted track",
      card1Desc: "Your plan adapts to your real goal.",
      card2Title: "Active community",
      card2Desc: "Live sessions, exchanges, and concrete feedback.",
      card3Title: "Practical AI",
      card3Desc: "Save time on every step."
    },
    goalSection: {
      label: "Your goal",
      title: "WHAT DO YOU WANT TO BUILD?"
    },
    levelSection: {
      label: "Your level",
      title: "WHERE ARE YOU TODAY?"
    },
    projectSection: {
      label: "Your project",
      title: "DO YOU ALREADY HAVE A CLEAR IDEA?",
      ideaLabel: "Describe your project in a few words",
      ideaPlaceholder: "E.g.: build a website for my restaurant, automate WhatsApp, launch a YouTube channel",
      ideaHint: "Add a bit more context for a more precise plan.",
      nameLabel: "Give your project a name",
      nameHint: "(editable later)",
      namePlaceholder: "E.g.: Marco's Table, AutoWhats, My History Channel",
      monetizationLabel: "How do you want to monetize it someday?",
      monetizationHint: "On TakaCode, a project aims for the first euro. Pick a path — you can change your mind.",
      noIdea: "I don't know yet"
    },
    toolsSection: {
      label: "Your tools",
      title: "WHAT TOOLS INTEREST YOU?",
      subtitle: "Optional step. You can continue without selecting."
    },
    rhythmSection: {
      label: "Your rhythm",
      title: "HOW MUCH TIME CAN YOU DEDICATE EACH WEEK?"
    },
    resultSection: {
      label: "Result",
      title: "YOUR SPACE IS READY",
      desc: "We've prepared a first trajectory based on your goal: ",
      recommendedTrack: "Recommended track",
      firstResources: "First resources",
      objective: "Objective",
      yourProfile: "Your profile",
      nextSession: "Next live session",
      nextSteps: "Next steps",
      profileTitle: "My {goal}",
      step: "Step",
      back: "Back",
      start: "Start",
      continue: "Continue",
      saveLoading: "Loading...",
      explorePlatform: "Explore the platform",
      startTrack: "Start my journey",
      draftSaveError: "Could not save the draft"
    }
  },
  nextAction: {
    label: "Next action",
    noOnboardingTitle: "Complete your onboarding",
    noOnboardingDesc: "Answer a few questions so we can personalize your experience.",
    noOnboardingLabel: "Continue onboarding",
    noTrackTitle: "Choose your first track",
    noTrackDesc: "Select a track suited to your goal to start building.",
    noTrackLabel: "View tracks",
    noProjectTitle: "Create your main project",
    noProjectDesc: "Define the project you want to build. It will serve as your guiding thread.",
    noProjectLabel: "Create my project",
    ideaTitle: "Finalize your project details",
    ideaDesc: "Add a description, status and deadline to launch your project.",
    ideaLabel: "Edit my project",
    noRepoTitle: "Connect your GitHub repo",
    noRepoDesc: "Host your code on GitHub to deploy easily and track versions.",
    noRepoLabel: "Add repository",
    noLiveTitle: "Deploy your project online",
    noLiveDesc: "Publish your project with Vercel or Netlify to make it accessible worldwide.",
    noLiveLabel: "Deploy my project",
    doneTitle: "Share your project",
    doneDesc: "Your project is live! Show it to the community and add it to your portfolio.",
    doneLabel: "Share my project"
  },
  communityContent: {
    title: "Community",
    heading: "Build together",
    subtitle: "Members, their projects, and upcoming live sessions.",
    loading: "Loading...",
    statsMembers: "Members",
    statsLessons: "Lessons completed",
    statsProjects: "Projects",
    statsLikes: "Likes",
    activityFeed: "RECENT ACTIVITY",
    noActivity: "No recent activity. Publish your first project!",
    projectsTitle: "COMMUNITY PROJECTS",
    filterPublished: "Published",
    filterInProgress: "In progress",
    filterAll: "All",
    viewAll: "View all",
    statusOnline: "Live",
    statusInProgress: "In progress",
    firstEuro: "1st euro",
    viewOnline: "View live",
    code: "Code",
    commentsShow: "Show",
    commentsHide: "Hide",
    commentsEmpty: "No comments yet.",
    commentsPlaceholder: "Add a comment...",
    commentsSend: "Send",
    noProjectsFilter: "No projects for this filter. Change the filter or create your project!",
    topMembers: "TOP MEMBERS",
    leaderboardLink: "Leaderboard",
    noMembers: "The leaderboard will fill up soon.",
    upcomingSessions: "UPCOMING SESSIONS",
    noSessions: "No upcoming sessions scheduled.",
    dateToConfirm: "Date to be confirmed"
  },
  appShell: {
    closeMenu: "Close menu",
    openMenu: "Open menu",
    myProfile: "My profile",
    startGuide: "Getting started guide",
    documentation: "Documentation",
    adminCenter: "Admin center",
    signOut: "Sign out",
    signOutSidebar: "Sign out",
    memberArea: "Member area",
    roleLabel: "Role",
    member: "Member",
    memberEmail: "member@takacode.app",
    live: "Live"
  },
  cookieNotice: {
    label: "Cookie consent",
    description: "TakaCode uses essential cookies (session, preferences) to function. No ads, no third-party trackers.",
    learnMore: "Learn more",
    essentialOnly: "Essential only",
    accept: "Got it"
  },
  parcoursSection: {
    sectionLabel: "CATALOG",
    title: "AVAILABLE TRACKS",
    viewAll: "All tracks",
    discover: "Discover",
    weeks: "weeks",
    shortWeeks: "wks",
    empty: "The track catalog will appear here once database data is active."
  },
  ressources: {
    sectionLabel: "LIBRARY",
    title: "RESOURCES TO MOVE FORWARD",
    description: "Guides, tutorials, templates, prompts, recommended tools and more. Everything you need to build your project.",
    tags: "Guides, Tutorials, Videos, Templates, AI Prompts, Tools, Cheat Sheets, AI Library",
    cta: "Explore resources",
    cards: {
      guides: {
        title: "GUIDES",
        desc: "Simple, structured explanations for each key concept.",
        count: "124 guides available"
      },
      videos: {
        title: "VIDEOS",
        desc: "Practical video demonstrations and tutorials.",
        count: "89 videos"
      },
      templates: {
        title: "TEMPLATES & MODELS",
        desc: "Prompt templates, documents, and reusable models.",
        count: "67 templates"
      },
      tools: {
        title: "TOOLS",
        desc: "A selection of tools to go further, faster.",
        count: "200+ tools listed"
      }
    }
  },
  sessions: {
    sectionLabel: "Live",
    title: "Learn together",
    viewAll: "View all sessions",
    description: "Join live practice sessions with the community. Ask questions, build with others, move faster.",
    features: {
      workshops: "Hands-on workshops",
      qanda: "Q&A sessions",
      collaborative: "Collaborative building",
      debugging: "Live debugging",
      masterclass: "Masterclass & Demos"
    },
    upcoming: "Upcoming",
    registered: "registered",
    live: "Live"
  },
  projectsSection: {
    sectionLabel: "Gallery",
    title1: "Published projects.",
    title2: "Not just exercises.",
    viewAll: "View all projects",
    emptyTitle: "The gallery starts with you",
    emptyDesc: "No projects published yet. Build your project, publish it, and inspire the community.",
    startProject: "Start a project",
    joinAndPublish: "Join and publish my project",
    emptyLabel: "Published member projects will appear here.",
    projectLabel: "Project",
    firstEuro: "1st euro",
    revenueModel: "Model:",
    publishedOn: "Published on"
  },
  finalCta: {
    sectionLabel: "START NOW",
    title1: "YOUR PROJECT",
    title2: "STARTS HERE",
    desc1: "You don't need to be an expert. You need a plan and execution.",
    desc2: "TakaCode guides you to create your project, publish it, and make money.",
    ctaPrimary: "Start a project",
    ctaSecondary: "Explore tracks"
  },
  globe: {
    sectionLabel: "Global community",
    title: "Builders all around the world",
    subtitle: "countries represented — explore the globe to see where members are."
  },
  projetsPage: {
    sectionLabel: "Projects",
    title: "Community projects",
    description: "Discover digital projects built, published, and sometimes monetized by TakaCode members. Get inspired, explore the stacks, and launch yours.",
    stats: {
      library: { label: "Library", desc: "Public projects by members." },
      goal: { label: "Goal", value: "Publish", desc: "Every project is live and accessible." },
      next: { label: "Next step", value: "Monetize", desc: "Turn a project into revenue." }
    },
    projectCard: { label: "Project", objective: "Goal", track: "Track", deadline: "Deadline", publishedOn: "Published on" },
    empty: {
      title: "Be the first to publish",
      desc: "No projects published yet. The community is waiting for your work.",
      cta: "Join and create my project"
    }
  },
  classementPage: {
    sectionLabel: "LEADERBOARD",
    title: "MOST ACTIVE MEMBERS",
    description: "Earn points by completing lessons and micro-projects.",
    xp: "XP",
    empty: "The leaderboard fills up as points are earned. Be the first!",
    schemaPending: "Leaderboard coming soon (run supabase/sql/012_profile_public.sql)."
  },
  communautePage: {
    sectionLabel: "COMMUNITY",
    title: "JOIN THE COMMUNITY",
    description: "Sign in or create an account to discover projects, the leaderboard, and upcoming live sessions.",
    signIn: "Sign in",
    signUp: "Create account"
  },
  tarifsPage: {
    sectionLabel: "PRICING",
    title: "BUILD, LAUNCH, EARN",
    description: "Pricing plans will be published here. In the meantime, start for free and build your first project. The goal is to help you build digital projects that can one day generate income.",
    ctaTracks: "View tracks",
    ctaProject: "Start a project"
  },
  tracksPage: {
    sectionLabel: "CATALOG",
    title: "ALL TRACKS",
    description: "This page shows only the list of tracks. Click a track to open its detailed page.",
    guestCTA: {
      sectionLabel: "TRACKS",
      title: "ACCESS THE TRACKS",
      description: "Sign in or create an account to discover the full list of tracks and start learning.",
      signIn: "Sign in",
      signUp: "Create account"
    },
    schemaNotReady: "Track tables not detected.",
    loadError: "Cannot load track catalog now.",
    availableTitle: "AVAILABLE TRACKS",
    activeCount: "{n} active tracks",
    orderHint: "Recommended order: tracks are sorted from most fundamental to most advanced.",
    stepLabel: "Step {n}",
    viewDetails: "View details",
    empty: "No published tracks yet."
  },
  trackDetail: {
    back: "Back",
    notFound: {
      title: "Track not found - TakaCode",
      description: "This track doesn't exist or isn't published yet."
    },
    defaultDescription: "Discover this TakaCode track: skills, progression plan, goal and resources.",
    schemaNotReady: "Track tables not detected. Run `supabase/sql/003_learning_tracks.sql` to enable the database catalog.",
    loadError: "Cannot load this track now.",
    myTrack: "My track",
    project: "Project",
    sprintCount: "{cleared}/{total} sprints",
    orderAdvice: {
      title: "Order advice",
      description: "To get the most out of this track, we recommend you first follow:",
      note: "This is just advice: you can start this track whenever you want."
    },
    competenciesTitle: "Skills provided",
    objectiveTitle: "Track objective",
    myProject: {
      title: "MY PROJECT",
      edit: "Edit",
      noDescription: "No description",
      statusPublished: "Published",
      statusInProgress: "In progress",
      noProject: "You haven't created a project for this track yet.",
      viewProject: "View my project",
      createProject: "Create my project"
    },
    progressionPlan: "Progression plan",
    stepLabel: "Step {n}",
    resourcesTitle: "Included resources",
    resourcesPreparing: "Resources in preparation",
    partnersTitle: "Partner platforms",
    partnersAffiliateNotice: "Affiliate links: they support TakaCode at no cost to you.",
    sprints: {
      title: "PROJECT SPRINTS",
      description: "Each sprint delivers a functional version of your project",
      accomplished: "{cleared}/{total} sprints completed",
      sprint: "SPRINT {n}",
      deliverable: "Deliverable: {deliverable}",
      lessonCount: "{completed}/{total} lessons",
      continue: "Continue",
      locked: "Locked",
      completed: "Delivered"
    },
    cta: {
      continueProject: "Continue my project",
      startProject: "Start my project",
      manageProject: "Manage my project",
      createProject: "Create my project",
      startTrack: "Start this track",
      haveAccount: "I already have an account"
    },
    guest: {
      sectionLabel: "Track",
      title: "Access this track",
      description: "Sign in or create an account to access the details of this track and start learning.",
      signIn: "Sign in",
      signUp: "Create account"
    }
  },
  lessonPage: {
    metadata: {
      title: "Lesson",
      description: "TakaCode lesson: selected resources, validation quiz and hands-on micro project."
    },
    backToTrack: "Back to track",
    lessonPosition: "Lesson {position}/{total}",
    lessonCompleted: "Lesson completed",
    lessonInProgress: "In progress",
    lessonCount: "{completed}/{total} lessons ({progress}%)",
    guest: {
      sectionLabel: "LESSON",
      title: "ACCESS LESSONS",
      description: "Sign in or create an account to access lesson content and progress through your tracks.",
      signIn: "Sign in",
      signUp: "Create account"
    }
  },
  cookiesPage: {
    sectionLabel: "POLICY",
    title: "COOKIES",
    description: "TakaCode uses the strict minimum: essential cookies for the site to function.",
    sections: {
      essential: {
        title: "Essential cookies",
        body: "They are necessary for the site to function: keeping your session open after login and remembering your preferences (e.g. cookie consent, avatar). Without them, you would not be able to stay logged in."
      },
      noAds: {
        title: "No advertising, no third-party trackers",
        body: "TakaCode does not use advertising cookies or third-party marketing trackers. We do not sell your data."
      },
      localStorage: {
        title: "Local storage",
        body: "Some preferences (consent, guide seen, sound on/off) are stored in your browser's local storage, not in a cookie sent to the server."
      },
      affiliate: {
        title: "Affiliate links",
        body: "Some links to recommended tools are affiliate links: if you use them, TakaCode may receive a commission at no extra cost to you. These links may set their own cookies on the partner's site, according to their own policy."
      },
      manage: {
        title: "Manage your choices",
        body: "You can delete cookies and local storage at any time from your browser settings. The consent banner will reappear after deletion."
      }
    }
  },
  privacyPage: {
    sectionLabel: "LEGAL",
    title: "PRIVACY POLICY",
    description: "This page explains what data TakaCode collects, how it is used, and what options you have to manage it. By using the platform, you accept the practices described here.",
    sections: {
      dataCollected: {
        title: "1. Data collected",
        body: "We may collect account information (name, email), usage data (pages visited, progress), and technical data (browser, device, security logs)."
      },
      dataUsage: {
        title: "2. Data usage",
        body: "This data is used to provide the service, improve the experience, personalize content, ensure platform security, and communicate important information."
      },
      storage: {
        title: "3. Storage and protection",
        body: "Data is kept for as long as necessary to operate the service and is protected by appropriate technical and organizational measures."
      },
      rights: {
        title: "4. Your rights",
        body: "You can request access, correction or deletion of your data, in accordance with applicable regulations. For any request, use the community/contact page."
      }
    },
    cta: {
      terms: "View terms",
      contact: "Contact TakaCode"
    }
  },
  termsPage: {
    sectionLabel: "LEGAL",
    title: "TERMS OF SERVICE",
    description: "These terms define the rules for using TakaCode. By using the platform, you accept the terms below.",
    sections: {
      purpose: {
        title: "1. Purpose of the service",
        body: "TakaCode provides tracks, resources and tools for creating digital projects for educational purposes."
      },
      account: {
        title: "2. User account",
        body: "You are responsible for your account information and the confidentiality of your access credentials. Any activity from your account is presumed to be attributable to you."
      },
      acceptableUse: {
        title: "3. Acceptable use",
        body: "It is prohibited to use the platform for illegal, malicious, fraudulent activities, or activities that harm other users or infrastructure."
      },
      intellectualProperty: {
        title: "4. Intellectual property",
        body: "The content, trademarks and elements of the platform remain the property of TakaCode or its rights holders, unless explicitly stated otherwise."
      },
      modifications: {
        title: "5. Changes to terms",
        body: "TakaCode may update these terms at any time. The online version prevails."
      }
    },
    cta: {
      privacy: "View privacy policy",
      contact: "Contact TakaCode"
    }
  },
  admin: {
    centreTitle: "ADMIN CENTER",
    centreSubtitle: "Platform Management",
    backAdmin: "Admin center",
    backAdminShort: "Admin",
    backTracks: "Tracks",
    backSessions: "Sessions",
    backAffiliations: "Affiliations",
    northStar: "North Star",
    members: "members",
    member: "Member",
    save: "Save",
    saving: "Saving...",
    saved: "Saved",
    cancel: "Cancel",
    delete: "Delete",
    create: "Create",
    publishedLabel: "Published",
    draftLabel: "Draft",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    hiddenLabel: "Hidden",
    publishedLabelF: "Published",
    seePublic: "View public",
    loading: "Loading...",
    error: "Error",
    confirmDelete: "Confirm deletion?",
    noResults: "No results",
    tableMissing: "Missing {table} table.",
    runSql: "Run {sql}.",
    view: "View",
    search: "Search"
  },
  adminOverview: {
    metaTitle: "Admin",
    metaDesc: "TakaCode Admin Center.",
    users: "Users",
    admins: "Admins",
    activeTracks: "Active tracks",
    published: "Published",
    modules: "Modules",
    lessons: "Lessons",
    lessonsCompleted: "Lessons completed",
    submittedProjects: "Submitted projects",
    actionRequired: "Action required",
    leaderboard: "Leaderboard (top 5 XP)",
    management: "Management",
    manageUsers: "Manage users",
    manageTracks: "Manage tracks and lessons",
    reviewHistory: "Review history",
    starter: "Starter",
    membersOnline: "Members with a live project",
    membersEuro: "Members with first euro",
    membersWithLive: "{n} member{s} with a live link or published project",
    membersWithEuro: "{n} member{s} with a first euro declared",
    noTracks: "No tracks in database. Check seeds and admin RLS policies.",
    tableUserProfiles: "Missing user_profiles table. Run supabase/sql/001_roles_points_referrals.sql.",
    tableLearningTracks: "Missing learning_tracks table. Run supabase/sql/003_learning_tracks.sql."
  },
  adminUsers: {
    metaTitle: "Admin - Users",
    metaDesc: "TakaCode user management.",
    title: "USERS",
    subtitle: "{n} user{s}",
    tableMissing: "Missing user_profiles table. Run the initialization SQL scripts first.",
    loadError: "Error loading users.",
    user: "User",
    role: "Role",
    points: "Points",
    grade: "Grade",
    registration: "Registration",
    emailNotAvailable: "Email not available",
    yourself: "you",
    pointsUpdated: "Points updated.",
    roleChangeFailed: "Unable to change role."
  },
  adminTracks: {
    metaTitle: "Admin - Tracks",
    metaDesc: "Manage tracks and their lessons.",
    title: "TRACKS",
    subtitle: "{n} track{s}",
    newTrack: "New track",
    createFirst: "Create the first track",
    tableMissing: "Missing track tables. Run supabase/sql/003_learning_tracks.sql and 004_track_curriculum.sql.",
    loadError: "Loading error.",
    empty: "No tracks yet.",
    pendingTitle: "PENDING PROPOSALS ({n})",
    proposedBy: "proposed by a mentor",
    reject: "Reject",
    validate: "Approve"
  },
  adminTrackDetail: {
    metaTitle: "Admin - Track",
    metaDesc: "Manage a track and its lessons.",
    tableMissing: "Missing track tables. Run SQL migrations 003 and 004.",
    trackInfo: "TRACK INFORMATION"
  },
  adminLessonEdit: {
    metaTitle: "Admin - Edit lesson",
    metaDesc: "Edit a lesson.",
    title: "EDIT LESSON",
    backToTrack: "Back to track"
  },
  adminLessonNew: {
    metaTitle: "Admin - New lesson",
    metaDesc: "Create a lesson.",
    title: "NEW LESSON",
    backToTrack: "Back to track",
    createModuleFirst: "Create a module in this track first before adding a lesson."
  },
  adminTrackNew: {
    metaTitle: "Admin - New track",
    metaDesc: "Create a track.",
    title: "NEW TRACK",
    subtitle: "Create a track"
  },
  adminSessions: {
    metaTitle: "Admin - Live sessions",
    metaDesc: "Live session management.",
    title: "LIVE SESSIONS",
    subtitle: "{n} session{s}",
    newSession: "New session",
    createFirst: "Create the first session",
    tableMissing: "Missing sessions table. Run supabase/sql/010_live_sessions.sql.",
    loadError: "Error",
    empty: "No sessions yet.",
    dateToConfirm: "Date to be confirmed",
    sessionSaved: "Session saved."
  },
  adminSessionNew: {
    metaTitle: "Admin - New session",
    metaDesc: "Create a live session.",
    title: "NEW SESSION",
    subtitle: "Schedule a live session"
  },
  adminReviews: {
    metaTitle: "Review history",
    metaDesc: "Micro-project review history (AI, peer, mentor, heuristic).",
    title: "REVIEW HISTORY",
    subtitle: "Micro-projects reviewed: AI, peer, mentor or heuristic",
    empty: "No reviews yet.",
    notAvailable: "Cannot load history. Run supabase/sql/021_ai_review_support.sql to enable this feature.",
    examiner: "Examiner"
  },
  adminAi: {
    metaTitle: "AI Configuration",
    metaDesc: "AI auto-review configuration for micro-projects.",
    title: "AI CONFIGURATION",
    subtitle: "Auto-review of micro-projects by AI",
    statusTitle: "Configuration Status",
    providerLabel: "Provider",
    modelLabel: "Model",
    defaultModel: "(provider default)",
    notConfigured: "Not configured",
    enabled: "AI review active",
    disabled: "AI review not configured",
    enabledDesc: "Micro-projects in 'ai' mode will be automatically reviewed by AI.",
    disabledDesc: "Add an API key and provider to enable auto-review.",
    envConfig: "Configuration via environment variables",
    envDesc: "Add these variables to your {dev} file (development) or in Vercel {prod} (production).",
    envDev: ".env.local",
    envProd: "Environment Variables",
    stepChooseProvider: "1. Choose a free provider",
    stepQuickChoice: "2. Quick choice based on your need",
    optionA: "Option A: OpenRouter (recommended)",
    optionAKey: "Get an OpenRouter key for free →",
    optionB: "Option B: Hugging Face (no API key)",
    optionBDesc: "No key required. Free hosted model.",
    optionC: "Option C: Google Gemini (if you already have a key)",
    stepGetKey: "3. Get an API key (optional for Hugging Face)",
    getApiKey: "{name} — Get an API key",
    hfNoKey: "Hugging Face: no key required! ready to use.",
    availableModels: "Available models",
    activeLabel: "(active)",
    privacy: "Privacy:",
    privacyDesc: "Free providers (Gemini, OpenRouter) may use sent data to improve their models. Do not configure AI review if you work on sensitive or confidential code.",
    fallbackTitle: "Automatic fallback",
    fallbackDesc: "If the first provider fails (quota exhausted 429, timeout...), the next one is tried automatically.",
    fallbackConfigTitle: "Fallback configuration",
    fallbackPrimary: "# Primary provider (tried first)",
    fallbackKey: "# {provider} specific key (auto-detected)",
    fallbackChain: "# Fallback: if {provider} fails, try {fallbacks}",
    fallbackGeminiKey: "# Gemini fallback key (optional)",
    fallbackActive: "Active fallback chain:",
    fallbackNone: "No fallback configured. Add {var}",
    testTitle: "Test the connection",
    testDesc: "Verify your API key is valid and the AI provider responds correctly.",
    testInfo: "This test sends a minimal prompt (\"Reply OK\") to the configured provider. No sensitive data is transmitted. The result appears above."
  },
  adminAffiliates: {
    metaTitle: "Admin - Affiliates",
    metaDesc: "Affiliate link management.",
    title: "AFFILIATES",
    subtitle: "{n} link{s}",
    newLink: "New link",
    addFirst: "Add the first link",
    tableMissing: "Missing table. Run supabase/sql/015_affiliate_links.sql.",
    empty: "No affiliate links."
  },
  adminAffiliateDetail: {
    metaTitle: "Admin - Affiliate link",
    metaDesc: "Edit an affiliate link.",
    subtitle: "Edit the link"
  },
  adminAffiliateNew: {
    metaTitle: "Admin - New link",
    metaDesc: "Add an affiliate link.",
    title: "NEW LINK",
    subtitle: "Add an affiliate link"
  },
  adminQuestions: {
    completePromptAndChoices: "Complete the prompt and all choices before saving.",
    choicesMustBeDifferent: "Question choices must be different."
  },
  trackForm: {
    tabsIdentite: "Identity",
    tabsCible: "Target",
    tabsPromesse: "Promise",
    tabsStructure: "Structure",
    tabsPublication: "Publication",
    completeness: "Completeness: {n}/{total}",
    fieldRequired: "This field is required.",
    slugRequired: "The slug is required.",
    slugInvalid: "Lowercase letters, numbers and hyphens only.",
    fieldSlug: "Slug (url)",
    fieldSlugPlaceholder: "e.g.: ai-automation",
    fieldTitle: "Title",
    fieldIcon: "Icon",
    fieldSummary: "Summary",
    fieldObjective: "Objective",
    fieldGoalKey: "goal_key",
    fieldLevel: "Level",
    fieldNextSession: "Next session",
    fieldResources: "Resources (comma separated)",
    promiseHint: "Explain why this track exists and what the learner will build.",
    promisePublic: "This promise will be displayed on the track card in the catalog.",
    fieldDuration: "Duration (wks)",
    fieldOrder: "Order",
    fieldColor: "Color",
    proposalNote: "This proposal will be validated by an admin before being published.",
    publishedLabel: "Published",
    activeLabel: "Active",
    previewShow: "Public preview — show",
    previewHide: "Public preview — hide",
    previewCatalog: "As displayed in the catalog",
    createVersion: "Create manual version",
    versionLabel: "Label (e.g.: Before redesign)",
    versionCreate: "Create",
    versionCreated: "Version created successfully",
    compareTitle: "Comparison with current version",
    autosaving: "Auto-saving...",
    autosaved: "Draft saved",
    unsaved: "Unsaved changes",
    submitCreate: "Create track",
    submitSave: "Save",
    updated: "Track updated.",
    saving: "Saving...",
    closeComparison: "Close comparison",
    trackDefault: "Track"
  },
  trackEl: {
    sectionTitle: "MODULES AND LESSONS",
    moduleCount: "{n} module(s)",
    publishedTooltip: "Published - click to draft",
    draftTooltip: "Draft - click to publish",
    editModule: "Edit module",
    duplicateModule: "Duplicate module",
    deleteModule: "Delete module",
    editLesson: "Edit lesson",
    duplicateLesson: "Duplicate lesson",
    deleteLesson: "Delete lesson",
    addLesson: "Add lesson",
    newModule: "New module",
    fieldTitle: "Title",
    fieldTitleModule: "Module title",
    fieldSlug: "slug (e.g.: html-basics)",
    fieldSlugDisabled: "slug",
    fieldOrder: "order",
    fieldSummary: "Summary (optional)",
    addModule: "Add module",
    save: "Save",
    cancel: "Cancel",
    confirmDeleteModule: "Delete this module and all its lessons? This action is irreversible.",
    confirmDeleteLesson: "Delete this lesson? This action is irreversible.",
    slugInvalid: "Invalid module slug (lowercase, numbers, hyphens).",
    titleRequired: "Module title is required.",
    duplicateError: "Error duplicating module",
    lessonDuration: "{duration} min · {xp} XP",
    module: "Module"
  },
  lessonForm: {
    module: "Module",
    fieldSlug: "Slug",
    fieldSlugNew: "Slug (url)",
    fieldSlugPlaceholder: "e.g.: html-basics",
    fieldTitle: "Title",
    fieldIntro: "Introduction",
    fieldWhyImportant: "Why it's important",
    fieldHowToUse: "How to work on this lesson",
    fieldObjectives: "Objectives",
    objectivesHint: "One objective per line",
    quizLabel: "Quiz (JSON)",
    quizHint: "answer = index of correct answer (starts at 0)",
    quizQuality: "QUIZ QUALITY",
    quizQuestionCount: "{n} question{s}",
    quizPosition: "Position {n}: {count}",
    quizError: "To fix",
    quizAdvice: "Advice",
    quizValid: "Valid structure. Correct answers will be distributed automatically across positions.",
    fieldXp: "XP",
    fieldDuration: "Duration (min)",
    fieldOrder: "Order",
    publishedLabel: "Published",
    submitCreate: "Create lesson",
    submitSave: "Save lesson",
    saving: "Saving...",
    saved: "Lesson saved.",
    chooseModule: "Choose a module.",
    titleRequired: "Title is required.",
    slugInvalid: "Invalid lesson slug (lowercase, numbers, hyphens).",
    lessonDefault: "Lesson",
    invalidSlug: "Invalid lesson slug (lowercase, numbers, hyphens).",
    issueError: "To fix",
    issueTip: "Advice",
    structureValid: "Valid structure. Correct answers will be distributed automatically across positions.",
    questionCount: "{n} question{s}",
    slug: "Slug",
    title: "Title",
    introduction: "Introduction",
    whyImportant: "Why it's important",
    howToUse: "How to work on this lesson",
    objectives: "Objectives",
    quiz: "Quiz (JSON)",
    xp: "XP",
    duration: "Duration (min)",
    order: "Order",
    published: "Published"
  },
  affiliateForm: {
    provider: "Provider",
    providerPlaceholder: "E.g.: Hostinger",
    category: "Category",
    title: "Title",
    titlePlaceholder: "E.g.: Hostinger web hosting",
    description: "Description",
    url: "Affiliate link",
    urlPlaceholder: "https://...",
    logoUrl: "Logo (URL, optional)",
    logoUrlPlaceholder: "https://.../logo.png",
    trackSlug: "Associated track (slug, optional)",
    trackSlugPlaceholder: "E.g.: media-buyer, digital-products",
    order: "Order",
    publishedLabel: "Published",
    providerRequired: "Provider is required.",
    tableMissing: "Missing table. Run supabase/sql/015_affiliate_links.sql.",
    saved: "Link saved.",
    submitAdd: "Add link",
    submitSave: "Save",
    saving: "Saving...",
    deleting: "Deleting...",
    delete: "Delete",
    confirmDelete: "Delete this affiliate link?",
    deleteConfirm: "Delete this affiliate link?",
    fieldProvider: "Provider",
    placeholderProvider: "E.g.: Hostinger",
    fieldCategory: "Category",
    fieldTitle: "Title",
    placeholderTitle: "E.g.: Hostinger web hosting",
    fieldDescription: "Description",
    fieldUrl: "Affiliate link",
    fieldLogo: "Logo (URL, optional)",
    fieldTrackSlug: "Associated track (slug, optional)",
    placeholderTrackSlug: "E.g.: media-buyer, digital-products",
    fieldOrder: "Order",
    published: "Published",
    offer: "Offer"
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
