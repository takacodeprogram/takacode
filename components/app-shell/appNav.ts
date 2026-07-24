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
      { href: "/dashboard/tracks", icon: "lucide:map", label: "My tracks", tour: "tracks" },
      { href: "/dashboard/projects", icon: "lucide:folder-code", label: "My projects", tour: "projects" },
      { href: "/dashboard/reviews", icon: "lucide:git-pull-request", label: "Reviews", tour: "reviews" },
      { href: "/dashboard/resources", icon: "lucide:book-open", label: "Resources", tour: "resources" },
    ],
  },
  {
    label: "Communaute",
    icon: "lucide:globe",
    tour: "communaute-group",
    children: [
      { href: "/dashboard/sessions", icon: "lucide:video", label: "Live sessions", live: true, tour: "sessions" },
      { href: "/dashboard/community", icon: "lucide:users", label: "Community", tour: "community" },
    ],
  },
  {
    label: "Espace personnel",
    icon: "lucide:settings",
    tour: "personnel",
    children: [
      { href: "/dashboard/tools", icon: "lucide:wrench", label: "Outils", tour: "tools" },
      { href: "/dashboard/changelog", icon: "lucide:sparkles", label: "Nouveautes", badge: v },
      { href: "/dashboard/docs", icon: "lucide:book-open", label: "Documentation", exact: true },
      { href: "/dashboard/profile", icon: "lucide:user", label: "Profil", tour: "profile" },
    ],
  },
];

export const ADMIN_ENTRY_LINK: NavLink = { href: "/admin", icon: "lucide:shield-check", label: "Centre admin", exact: true };

export const MENTOR_LINK: NavLink = { href: "/dashboard/mentor", icon: "lucide:book-plus", label: "Proposer un parcours" };

export const ADMIN_AREA_LINKS: NavLink[] = [
  { href: "/admin", icon: "lucide:layout-dashboard", label: "Vue globale", exact: true },
  { href: "/admin/users", icon: "lucide:users", label: "Utilisateurs" },
  { href: "/admin/tracks", icon: "lucide:route", label: "Parcours" },
  { href: "/admin/sessions", icon: "lucide:video", label: "Sessions live" },
  { href: "/admin/reviews", icon: "lucide:git-pull-request", label: "Historique des revues" },
  { href: "/admin/affiliates", icon: "lucide:link", label: "Affiliations" },
  { href: "/admin/ai", icon: "lucide:bot", label: "Review IA" }
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