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
    summary: "Les editeurs JSON de micro-projets et ressources sont remplaces par des constructeurs visuels dans l'interface d'edition.",
    status: "livree",
    highlights: [
      "Constructeur de micro-projet visuel : titre, consigne, etapes, livrable, mode de validation et lien obligatoire",
      "Editeur de ressources visuel : lignes label/URL/type/pourquoi/comment avec ajout et suppression",
      "Banque de questions integree comme editeur principal des quiz dans le formulaire de lecon",
      "Constructeur de quiz visuel existant (QuestionBankEditor) desormais pleinement accessible depuis l'editeur de lecon",
      "Plus aucun JSON a ecrire a la main pour les micro-projets et les ressources"
    ]
  },
  {
    version: "1.2",
    date: "17 juillet 2026",
    title: "Quiz dynamiques et banque active",
    summary: "Les questions des quiz sont tirees de la banque, melangees par utilisateur et suivies pour eviter la repetition.",
    status: "livree",
    highlights: [
      "Tirage d'un sous-ensemble different par utilisateur et par tentative depuis la banque de questions",
      "Historique anti-repetition : les questions deja vues sont evitees, les moins vues sont privilegiees",
      "Separation stricte entre la vue publique (prompt + choix) et les corrections privees (reponse + explication)",
      "Correction cote serveur via la nouvelle RPC submit_lesson_quiz_from_bank",
      "Table user_seen_questions avec RLS pour le suivi individuel par apprenant",
      "Badge Banque de questions visible dans l'interface lecon"
    ]
  },
  {
    version: "1.1.2",
    date: "17 juillet 2026",
    title: "Securite et documentation",
    summary: "Mots de passe renforces, documentation utilisateur et mentor, et chaine d'integration continue.",
    status: "livree",
    highlights: [
      "Mots de passe : 8 caracteres minimum avec minuscules, majuscules, chiffres et symboles",
      "Protection contre les mots de passe compromis documentee (activation manuelle en production)",
      "Documentation utilisateur : parcours, quiz, projets, progression et mentorat",
      "Documentation mentor : creation de parcours, edition de contenu, banque de questions et revues",
      "Documentation administrateur : utilisateurs, affiliations et sessions live",
      "Integration continue (CI) : typecheck, build, lint et audit des dependances via GitHub Actions"
    ]
  },
  {
    version: "1.1.1",
    date: "17 juillet 2026",
    title: "Acces sensibles verrouilles",
    summary: "Les diagnostics et verdicts IA sont maintenant reserves aux roles et services autorises.",
    status: "livree",
    highlights: [
      "Routes de diagnostic IA accessibles uniquement aux administrateurs",
      "Fonctions Supabase privees rendues inaccessibles aux visiteurs anonymes",
      "Verdicts IA enregistrables uniquement depuis le serveur securise",
      "Notifications limitees a leur destinataire ou aux administrateurs",
      "Permissions distantes, TypeScript strict et build de production verifies"
    ]
  },
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
      "Banque de 282 questions rattachees aux objectifs et ressources, editable par les auteurs autorises",
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
