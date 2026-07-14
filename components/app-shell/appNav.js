// Configuration des liens de l'espace applicatif (dashboard membre + admin).
// Tous les liens sont INTERNES (aucun renvoi vers le site public).

export const MEMBER_LINKS = [
  { href: "/dashboard", icon: "lucide:layout-grid", label: "Dashboard", exact: true },
  { href: "/dashboard/parcours", icon: "lucide:map", label: "Mes parcours" },
  { href: "/dashboard/projets", icon: "lucide:folder-code", label: "Mes projets" },
  { href: "/dashboard/ressources", icon: "lucide:book-open", label: "Ressources" },
  { href: "/dashboard/sessions", icon: "lucide:video", label: "Sessions live", live: true },
  { href: "/dashboard/communaute", icon: "lucide:users", label: "Communaute" },
  { href: "/dashboard/profil", icon: "lucide:user", label: "Profil" }
];

export const ADMIN_LINKS = [
  { href: "/admin", icon: "lucide:shield-check", label: "Centre admin", exact: true }
];

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
