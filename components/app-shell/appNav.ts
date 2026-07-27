import { PRODUCT_RELEASES } from "../../lib/productReleases";

export interface NavLink {
  href: string;
  icon: string;
  labelKey: string;   // clé i18n résolue via t() dans AppShell
  label?: string;     // résolu à l'usage (rétrocompatibilité)
  exact?: boolean;
  tour?: string;
  live?: boolean;
  badge?: string;
}

export interface NavGroup {
  labelKey: string;
  label?: string;
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
  { href: "/dashboard", icon: "lucide:layout-grid", labelKey: "sidebar.dashboard", exact: true, tour: "dashboard" },
  {
    labelKey: "sidebar.formation",
    icon: "lucide:graduation-cap",
    tour: "formation",
    children: [
      { href: "/dashboard/tracks", icon: "lucide:map", labelKey: "sidebar.myTracks", tour: "tracks" },
      { href: "/dashboard/projects", icon: "lucide:folder-code", labelKey: "sidebar.myProjects", tour: "projects" },
      { href: "/dashboard/reviews", icon: "lucide:git-pull-request", labelKey: "sidebar.reviews", tour: "reviews" },
      { href: "/dashboard/resources", icon: "lucide:book-open", labelKey: "sidebar.resources", tour: "resources" }
    ]
  },
  {
    labelKey: "sidebar.community",
    icon: "lucide:globe",
    tour: "communaute-group",
    children: [
      { href: "/dashboard/sessions", icon: "lucide:video", labelKey: "sidebar.liveSessions", live: true, tour: "sessions" },
      { href: "/dashboard/community", icon: "lucide:users", labelKey: "sidebar.communityFeed", tour: "community" }
    ]
  },
  {
    labelKey: "sidebar.personalSpace",
    icon: "lucide:settings",
    tour: "personnel",
    children: [
      { href: "/dashboard/tools", icon: "lucide:wrench", labelKey: "sidebar.tools", tour: "tools" },
      { href: "/dashboard/changelog", icon: "lucide:sparkles", labelKey: "sidebar.changelog", badge: v },
      { href: "/dashboard/docs", icon: "lucide:book-open", labelKey: "sidebar.documentation", exact: true },
      { href: "/dashboard/profile", icon: "lucide:user", labelKey: "sidebar.profile", tour: "profile" }
    ]
  }
];

export const ADMIN_ENTRY_LINK: NavLink = { href: "/admin", icon: "lucide:shield-check", labelKey: "sidebar.adminCenter", exact: true };

export const MENTOR_LINK: NavLink = { href: "/dashboard/mentor", icon: "lucide:book-plus", labelKey: "sidebar.proposeTrack" };

export const ADMIN_AREA_LINKS: NavLink[] = [
  { href: "/admin", icon: "lucide:layout-dashboard", labelKey: "sidebar.adminOverview", exact: true },
  { href: "/admin/users", icon: "lucide:users", labelKey: "sidebar.adminUsers" },
  { href: "/admin/tracks", icon: "lucide:route", labelKey: "sidebar.adminTracks" },
  { href: "/admin/sessions", icon: "lucide:video", labelKey: "sidebar.adminSessions" },
  { href: "/admin/reviews", icon: "lucide:git-pull-request", labelKey: "sidebar.adminReviews" },
  { href: "/admin/affiliates", icon: "lucide:link", labelKey: "sidebar.adminAffiliates" },
  { href: "/admin/ai", icon: "lucide:bot", labelKey: "sidebar.adminAi" }
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
