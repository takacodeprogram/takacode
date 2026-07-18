export interface ProductRelease {
  version: string;
  date: string;
  title: string;
  summary: string;
  status: "livree" | "en_cours" | "planifiee";
  highlights: string[];
}

export const PRODUCT_RELEASES: ProductRelease[] = [
  {
    version: "1.5",
    date: "18 juillet 2026",
    title: "Projet first — micro-projets, livrables, premier euro",
    summary: "Les micro-projets sont lies a ton projet reel. Suis tes livrables, declare ton premier euro et presente-toi sur ta page profil public.",
    status: "livree",
    highlights: [
      "Micro-projets lies au projet du membre : le livrable parle de TON projet",
      "Projets publies affiches en dynamique sur la homepage (vitrine)",
      "Suggestion de parcours pertinents selon le template et le modele de revenu",
      "Colonne template_id + template applique persistee dans le formulaire projet",
      "Declaration du premier euro depuis le cockpit projet avec badge 1er euro",
      "Badge 1er euro affiche sur la homepage, la galerie, le dashboard et les cards projets",
      "Notifications liees aux lecons : correction du lien 404 (slug vs UUID)",
      "Lien WhatsApp ajoute dans le footer",
      "Page profil public (/profil/[id]) avec avatar, bio, competences, grade, XP, pays",
      "Classement et page communaute : les membres sont cliquables vers leur profil public",
      "Projet detail : section livrables montrant les micro-projets realises lies au projet",
      "Migration project_id sur user_lesson_progress pour lier soumissions et projets"
    ]
  },
  {
    version: "1.4",
    date: "17 juillet 2026",
    title: "Tracking et monitoring projet",
    summary: "Suis l'avancement de ton projet, tes sessions et ta progression dans la communaute.",
    status: "livree",
    highlights: [
      "Globe 3D : pins toujours visibles, zoom, etoiles filantes, particules flottantes",
      "Parcours refondu en sprints projet : chaque module livre une version du projet",
      "Editeur de code avec coloration syntaxique pour les micro-projets",
      "Soumission de lien et de fichier joints aux micro-projets",
      "Drapeau pays affiche dans le classement, selectionnable depuis le profil",
      "Derniere connexion et appareils connectes visibles dans la page profil",
      "Suppression ou desactivation de compte depuis la zone securite du profil",
      "Son et animations sur les notifications, la creation de projet et les sauvegardes",
      "Bandeau d'annonce automatique a chaque nouvelle version majeure",
      "Pagination sur les listes de projets et parcours"
    ]
  },
  {
    version: "1.3",
    date: "17 juillet 2026",
    title: "Studio de creation de parcours projets",
    summary: "Cree et edite des parcours lies a des archetypes de projet sans toucher au JSON.",
    status: "livree",
    highlights: [
      "Formulaire parcours en 5 sections (identite, cible, promesse, structure, publication) avec barre de completude",
      "Glisser-deposer des modules et lecons, duplication et etat brouillon",
      "Validation inline et avertissement avant de quitter",
      "Autosave et historique des versions (restauration possible)",
      "Apercu public en direct du parcours"
    ]
  },
  {
    version: "1.2",
    date: "17 juillet 2026",
    title: "Parcours projets par archetype",
    summary: "Parcours reorganises par type de projet (site vitrine, SaaS, e-commerce...), chaque lecon te rapproche de la mise en ligne.",
    status: "livree",
    highlights: [
      "Parcours classes par archetype de projet : trouve celui qui correspond a ton idee",
      "Contenu oriente livraison : chaque module aboutit a un livrable concret",
      "Quiz non predictibles avec banque de questions liees aux objectifs projet",
      "Editeur parcours visuel pour les createurs de contenu"
    ]
  },
  {
    version: "1.1",
    date: "16 juillet 2026",
    title: "Selection et deploiement de projet",
    summary: "Choisis un starter kit adapte a ton idee et deploie ton projet en quelques clics.",
    status: "livree",
    highlights: [
      "8 Starter kits prets a deployer : site vitrine, SaaS, dashboard KPI, IA chatbot, e-commerce...",
      "Publication guidee : GitHub → Vercel/Netlify → domaine personnalise",
      "Bloc Prochaine action intelligent sur le dashboard (s'adapte a ton avancement)",
      "Documentation projet : guides deploiement, templates et publication",
      "Mots de passe renforces (8 car, minuscules, majuscules, chiffres, symboles)",
      "Notifications visibles uniquement par leur destinataire"
    ]
  },
  {
    version: "1.0",
    date: "14 juillet 2026",
    title: "Fondations projet",
    summary: "Cree ton projet digital, suis des parcours pour le construire et valide tes livrables.",
    status: "livree",
    highlights: [
      "Premier projet cree automatiquement a la fin de l'onboarding",
      "Parcours, modules, lecons et quiz pour t'aider a construire ton projet",
      "Micro-projets : soumets tes livrables et recois du feedback",
      "Progression, XP, grades et classement",
      "Dashboard membre, administration, sessions et affiliations"
    ]
  },
  {
    version: "1.6",
    date: "Aout 2026",
    title: "Monetisation et Stripe",
    summary: "Connecte Stripe, cree des offres Premium/Launch, facture et suis tes revenus depuis le cockpit.",
    status: "en_cours",
    highlights: [
      "Integration Stripe Connect pour les paiements",
      "Offres Premium et Launch avec abonnement",
      "Page tarifs dynamique",
      "Suivi des revenus dans le cockpit projet",
      "Badges et mise en avant des projets monetises",
      "Guide de monetisation integre aux parcours"
    ]
  }
];

export const LATEST_PRODUCT_VERSION = PRODUCT_RELEASES[0].version;
