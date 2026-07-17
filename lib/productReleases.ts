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
    date: "en cours",
    title: "Monetisation et valeur",
    summary: "Construis un projet qui peut te rapporter. Kits de demarrage, revisions illimitees, mentorat et guides monetisation.",
    status: "planifiee",
    highlights: [
      "Offre Premium : revisions IA illimitees, kits de demarrage premium, guides deploiement et monetisation",
      "Offre Launch : mentorat 1:1, portfolio, mise en relation freelance",
      "Parcours « Build to Earn » : creer un produit digital rentable de A a Z",
      "Paiements Stripe recurrents et gestion d'abonnement"
    ]
  },
  {
    version: "1.4",
    date: "en cours",
    title: "Constructeur de projet et deploiement",
    summary: "Du code a la publication : templates, deploiement guide, GitHub et domaine.",
    status: "planifiee",
    highlights: [
      "Creation automatique du projet principal apres l'onboarding",
      "Selection de templates et starter kits (gratuits et premium)",
      "Publication guidee : GitHub -> Vercel/Netlify -> domaine",
      "Bloc Prochaine action intelligent sur le dashboard"
    ]
  },
  {
    version: "1.3",
    date: "17 juillet 2026",
    title: "Studio de creation de parcours",
    summary: "Cree et edite tes parcours sans toucher au JSON. Interface editoriale complete avec sections, glisser-deposer et autosave.",
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
