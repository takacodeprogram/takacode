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
    version: "1.3",
    date: "17 juillet 2026",
    title: "Studio de creation de parcours",
    summary: "Cree et edite tes parcours sans toucher au JSON : les micro-projets, ressources et quiz ont leur propre constructeur visuel.",
    status: "livree",
    highlights: [
      "Micro-projet : titre, consigne, etapes, livrable et mode de validation (auto/IA/pair/mentor) dans un formulaire dedie",
      "Ressources : ajoute et supprime des lignes label/URL/type avec pourquoi et comment",
      "Quiz : la banque de questions est maintenant accessible directement depuis l'editeur de lecon"
    ]
  },
  {
    version: "1.2",
    date: "17 juillet 2026",
    title: "Quiz moins previsibles",
    summary: "Les questions des quiz sont desormais tirees au sort dans une banque, differentes a chaque tentative, sans repetition.",
    status: "livree",
    highlights: [
      "Chaque tentative te propose un sous-ensemble different de questions",
      "Les questions deja vues sont mises de cote, les nouvelles sont privilegiees",
      "Seul le texte de la question et les choix sont affiches : la correction reste privee cote serveur",
      "Un badge Banque de questions apparait dans les lecons concernees"
    ]
  },
  {
    version: "1.1",
    date: "16 juillet 2026",
    title: "Fondations et securite",
    summary: "Mots de passe renforces, documentation, performances et acces mieux proteges.",
    status: "livree",
    highlights: [
      "Mots de passe : 8 caracteres minimum avec minuscules, majuscules, chiffres et symboles",
      "Documentation utilisateur, mentor et admin accessible depuis le menu",
      "Diagnostics et verdicts IA reserves aux administrateurs",
      "Notifications visibles uniquement par leur destinataire",
      "Quiz melange par utilisateur avec correction preservee cote serveur",
      "Banque de 282 questions liees aux objectifs, editable par les auteurs",
      "Controle qualite admin et equilibrage automatique des bonnes reponses"
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
