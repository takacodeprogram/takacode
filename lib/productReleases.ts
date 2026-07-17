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
    version: "1.4",
    date: "17 juillet 2026",
    title: "Tracking et monitoring projet",
    summary: "Suis l'avancement de ton projet, tes sessions et ta progression dans la communaute.",
    status: "livree",
    highlights: [
      "Drapeau pays affiche dans le classement, selectionnable depuis le profil",
      "Derniere connexion et appareils connectes visibles dans la page profil",
      "Suppression ou desactivation de compte depuis la zone securite du profil",
      "Son et animations sur les notifications, la creation de projet et les sauvegardes",
      "Bandeau d'annonce automatique a chaque nouvelle version majeure",
      "Pagination sur les listes de projets et parcours",
      "Globe 3D interactif : vois ou sont les builders dans le monde"
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
  }
];

export const LATEST_PRODUCT_VERSION = PRODUCT_RELEASES[0].version;
