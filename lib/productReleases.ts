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
    version: "1.1",
    date: "16 juillet 2026",
    title: "Fondations de l'evolution",
    summary: "Une base plus fiable pour faire evoluer TakaCode version apres version.",
    status: "en_cours",
    highlights: [
      "Migration complete vers TypeScript strict",
      "Journal des nouveautes accessible depuis l'espace membre",
      "Loader de marque reserve a la homepage et skeletons adaptes a chaque type de page",
      "Choix des quiz melanges par utilisateur avec correction preservee cote serveur",
      "Controle qualite admin et equilibrage automatique des bonnes reponses",
      "Feuille de route des quiz, du studio admin, du projet principal et de l'IA"
    ]
  },
  {
    version: "1.0",
    date: "14 juillet 2026",
    title: "MVP pedagogique",
    summary: "Le premier parcours complet, de la lecon au micro-projet valide.",
    status: "livree",
    highlights: [
      "Parcours, modules, lecons, ressources et quiz",
      "Micro-projets avec validation auto, IA, pair ou mentor",
      "Progression, XP, grades et classement",
      "Dashboard membre, administration, sessions et affiliations"
    ]
  }
];

export const LATEST_PRODUCT_VERSION = PRODUCT_RELEASES[0].version;
