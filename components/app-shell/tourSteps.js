// Etapes du guide (partagees entre le tour interactif desktop et la page guide dediee).

export const TOUR_STEPS = [
  {
    id: "welcome",
    icon: "lucide:sparkles",
    title: "Bienvenue dans ton espace !",
    body: "Faisons un petit tour des sections cles pour que tu puisses profiter pleinement de TakaCode. 🚀",
    center: true
  },
  {
    id: "dashboard",
    icon: "lucide:layout-grid",
    title: "Tableau de bord",
    body: "Ta vue d'ensemble : progression dans tes parcours, statistiques (points, grade) et accès rapide vers l'essentiel."
  },
  {
    id: "parcours",
    icon: "lucide:map",
    title: "Mes parcours",
    body: "Les parcours que tu suis, avec leurs modules, leçons, quiz et micro-projets à valider pour progresser."
  },
  {
    id: "projets",
    icon: "lucide:folder-code",
    title: "Mes projets",
    body: "Crée tes projets personnels et partage-les avec la communauté pour montrer ton travail."
  },
  {
    id: "reviews",
    icon: "lucide:git-pull-request",
    title: "Revues",
    body: "Soumets tes micro-projets pour validation et review ceux des autres membres (pairs ou mentors)."
  },
  {
    id: "ressources",
    icon: "lucide:book-open",
    title: "Ressources",
    body: "Bibliothèque de ressources externes recommandées pour approfondir chaque sujet."
  },
  {
    id: "sessions",
    icon: "lucide:video",
    title: "Sessions live",
    body: "Rejoins les sessions en direct : coding sessions, Q&A, ateliers avec la communauté.",
    live: true
  },
  {
    id: "communaute",
    icon: "lucide:users",
    title: "Communaute",
    body: "Échange avec les autres créateurs, découvre leurs projets et partage les tiens."
  },
  {
    id: "outils",
    icon: "lucide:wrench",
    title: "Outils",
    body: "Les services et outils recommandés par TakaCode : hébergement, IA, noms de domaine, déploiement..."
  },
  {
    id: "profil",
    icon: "lucide:user",
    title: "Profil",
    body: "Gère ton identité, ton avatar DiceBear, tes informations et tes préférences."
  },
  {
    id: "done",
    icon: "lucide:rocket",
    title: "Pret a creer ! 💪",
    body: "Tu connais maintenant toutes les sections. Explore, apprends et construis ton projet. Ce guide reste accessible depuis ton Tableau de bord si besoin.",
    center: true
  }
];
