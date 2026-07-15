// Configuration des liens de l'espace applicatif (dashboard membre + admin).
// Tous les liens sont INTERNES (aucun renvoi vers le site public).

// Identifiants pour le guide interactif (GuidedTour).
// Chaque lien peut avoir un champ `tour` correspondant a un step du tour.
export const MEMBER_LINKS = [
  { href: "/dashboard", icon: "lucide:layout-grid", label: "Dashboard", exact: true, tour: "dashboard" },
  { href: "/dashboard/parcours", icon: "lucide:map", label: "Mes parcours", tour: "parcours" },
  { href: "/dashboard/projets", icon: "lucide:folder-code", label: "Mes projets", tour: "projets" },
  { href: "/dashboard/reviews", icon: "lucide:git-pull-request", label: "Revues", tour: "reviews" },
  { href: "/dashboard/ressources", icon: "lucide:book-open", label: "Ressources", tour: "ressources" },
  { href: "/dashboard/sessions", icon: "lucide:video", label: "Sessions live", live: true, tour: "sessions" },
  { href: "/dashboard/communaute", icon: "lucide:users", label: "Communaute", tour: "communaute" },
  { href: "/dashboard/outils", icon: "lucide:wrench", label: "Outils", tour: "outils" },
  { href: "/dashboard/profil", icon: "lucide:user", label: "Profil", tour: "profil" }
];

export const ADMIN_AFFILIATIONS_LINK = { href: "/admin/affiliations", icon: "lucide:link", label: "Affiliations" };

// Lien vers l'espace admin, ajoute a la sidebar membre pour les admins.
export const ADMIN_ENTRY_LINK = { href: "/admin", icon: "lucide:shield-check", label: "Centre admin", exact: true };

// Lien mentor (proposer des parcours), ajoute a la sidebar membre pour les mentors.
export const MENTOR_LINK = { href: "/dashboard/mentor", icon: "lucide:book-plus", label: "Proposer un parcours" };

// Liens propres a l'espace admin (affiches quand on est sous /admin/*).
export const ADMIN_AREA_LINKS = [
  { href: "/admin", icon: "lucide:layout-dashboard", label: "Vue globale", exact: true },
  { href: "/admin/utilisateurs", icon: "lucide:users", label: "Utilisateurs" },
  { href: "/admin/parcours", icon: "lucide:route", label: "Parcours" },
  { href: "/admin/sessions", icon: "lucide:video", label: "Sessions live" },
  { href: "/admin/affiliations", icon: "lucide:link", label: "Affiliations" },
  { href: "/admin/ia", icon: "lucide:brain-circuit", label: "Review IA" }
];

export function isAdminAreaPath(pathname) {
  const clean = String(pathname || "").split("?")[0].split("#")[0];
  return clean === "/admin" || clean.startsWith("/admin/");
}

export function isSidebarLinkActive(pathname, link) {
  const target = String(link?.href || "").split("#")[0].trim();
  if (!target) {
    return false;
  }

  const current = String(pathname || "").split("?")[0].split("#")[0] || "/";

  if (link?.exact) {
    return current === target;
  }

  return current === target || current.startsWith(target + "/");
}
