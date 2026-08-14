const LEGACY_ROUTE_SEGMENTS: Readonly<Record<string, string>> = {
  tarifs: "pricing",
  projets: "projects",
  profil: "profile",
  parcours: "tracks",
  classement: "leaderboard",
  connexion: "login",
  communaute: "community",
  competences: "skills",
  ressources: "resources",
  nouveautes: "changelog",
  nouveau: "new",
  outils: "tools",
  utilisateurs: "users",
  revues: "reviews",
  ia: "ai",
  affiliations: "affiliates",
  documentation: "docs",
  progression: "progress",
  mentorat: "mentoring",
  edition: "editing",
  lecon: "lesson"
};

/**
 * Traduit uniquement les segments correspondant exactement a une ancienne
 * route. Un slug tel que `ia-fondamentaux` doit rester opaque.
 */
export function translateLegacyRoutePath(pathname: string): string {
  return pathname
    .split("/")
    .map((segment) => LEGACY_ROUTE_SEGMENTS[segment] ?? segment)
    .join("/");
}
