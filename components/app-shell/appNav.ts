import { PRODUCT_RELEASES } from "../../lib/productReleases";

export interface NavLink {
  href: string;
  icon: string;
  label: string;
  exact?: boolean;
  tour?: string;
  live?: boolean;
  badge?: string;
}

function getLatestReleaseVersion(): string {
  const latest = PRODUCT_RELEASES[0];
  if (!latest) return "1.0";
  return latest.version;
}

export const MEMBER_LINKS: NavLink[] = [
  { href: "/dashboard", icon: "lucide:layout-grid", label: "Dashboard", exact: true, tour: "dashboard" },
  { href: "/dashboard/parcours", icon: "lucide:map", label: "Mes parcours", tour: "parcours" },
  { href: "/dashboard/projets", icon: "lucide:folder-code", label: "Mes projets", tour: "projets" },
  { href: "/dashboard/prochaine-action", icon: "lucide:sparkles", label: "Prochaine action", tour: "prochaine-action" },
  { href: "/dashboard/reviews", icon: "lucide:git-pull-request", label: "Revues", tour: "reviews" },
  { href: "/dashboard/ressources", icon: "lucide:book-open", label: "Ressources", tour: "ressources" },
  { href: "/dashboard/sessions", icon: "lucide:video", label: "Sessions live", live: true, tour: "sessions" },
  { href: "/dashboard/communaute", icon: "lucide:users", label: "Communaute", tour: "communaute" },
  { href: "/dashboard/outils", icon: "lucide:wrench", label: "Outils", tour: "outils" },
  { href: "/dashboard/nouveautes", icon: "lucide:sparkles", label: "Nouveautes", badge: `V${getLatestReleaseVersion()}` },
  { href: "/dashboard/documentation", icon: "lucide:book-open", label: "Documentation", exact: true },
  { href: "/dashboard/profil", icon: "lucide:user", label: "Profil", tour: "profil" }
];

export const ADMIN_AFFILIATIONS_LINK: NavLink = { href: "/admin/affiliations", icon: "lucide:link", label: "Affiliations" };

export const ADMIN_ENTRY_LINK: NavLink = { href: "/admin", icon: "lucide:shield-check", label: "Centre admin", exact: true };

export const MENTOR_LINK: NavLink = { href: "/dashboard/mentor", icon: "lucide:book-plus", label: "Proposer un parcours" };

export const ADMIN_AREA_LINKS: NavLink[] = [
  { href: "/admin", icon: "lucide:layout-dashboard", label: "Vue globale", exact: true },
  { href: "/admin/utilisateurs", icon: "lucide:users", label: "Utilisateurs" },
  { href: "/admin/parcours", icon: "lucide:route", label: "Parcours" },
  { href: "/admin/sessions", icon: "lucide:video", label: "Sessions live" },
  { href: "/admin/revues", icon: "lucide:git-pull-request", label: "Historique des revues" },
  { href: "/admin/affiliations", icon: "lucide:link", label: "Affiliations" },
  { href: "/admin/ia", icon: "lucide:bot", label: "Review IA" }
];

export function isAdminAreaPath(pathname: string): boolean {
  const clean = String(pathname || "").split("?")[0].split("#")[0];
  return clean === "/admin" || clean.startsWith("/admin/");
}

export function isSidebarLinkActive(pathname: string, link: NavLink): boolean {
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