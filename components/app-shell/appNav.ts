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

export interface NavGroup {
  label: string;
  icon: string;
  tour?: string;
  children: NavLink[];
}

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

function getLatestReleaseVersion(): string {
  const latest = PRODUCT_RELEASES[0];
  if (!latest) return "1.0";
  return latest.version;
}

const v = `V${getLatestReleaseVersion()}`;

export const MEMBER_NAV: NavItem[] = [
  { href: "/dashboard", icon: "lucide:layout-grid", label: "Dashboard", exact: true, tour: "dashboard" },
  {
    label: "Formation",
    icon: "lucide:graduation-cap",
    tour: "formation",
    children: [
      { href: "/dashboard/parcours", icon: "lucide:map", label: "Mes parcours", tour: "parcours" },
      { href: "/dashboard/projets", icon: "lucide:folder-code", label: "Mes projets", tour: "projets" },
      { href: "/dashboard/reviews", icon: "lucide:git-pull-request", label: "Revues", tour: "reviews" },
      { href: "/dashboard/ressources", icon: "lucide:book-open", label: "Ressources", tour: "ressources" },
    ],
  },
  {
    label: "Communaute",
    icon: "lucide:globe",
    tour: "communaute-group",
    children: [
      { href: "/dashboard/sessions", icon: "lucide:video", label: "Sessions live", live: true, tour: "sessions" },
      { href: "/dashboard/communaute", icon: "lucide:users", label: "Communaute", tour: "communaute" },
    ],
  },
  {
    label: "Espace personnel",
    icon: "lucide:settings",
    tour: "personnel",
    children: [
      { href: "/dashboard/outils", icon: "lucide:wrench", label: "Outils", tour: "outils" },
      { href: "/dashboard/nouveautes", icon: "lucide:sparkles", label: "Nouveautes", badge: v },
      { href: "/dashboard/documentation", icon: "lucide:book-open", label: "Documentation", exact: true },
      { href: "/dashboard/profil", icon: "lucide:user", label: "Profil", tour: "profil" },
    ],
  },
];

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