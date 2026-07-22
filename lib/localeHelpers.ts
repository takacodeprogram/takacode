/**
 * Helpers de localisation de chemins (pure functions, server-safe).
 *
 * Ces fonctions sont utilisables à la fois côté serveur et côté client.
 * Elles ne nécessitent pas de hook React ni de "use client".
 */
import type { Locale } from "./i18n";
import { DEFAULT_LOCALE } from "./i18n";

/**
 * Préfixe un chemin avec la locale si elle n'est pas la locale par défaut.
 * La locale par défaut est "en" (pas de préfixe).
 * Exemple : localePath("/dashboard", "fr") → "/fr/dashboard"
 *           localePath("/dashboard", "en") → "/dashboard"
 */
export function localePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE || path.startsWith("http")) return path;
  // Évite le double préfixe si le chemin commence déjà par /fr/
  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) return path;
  return `/${locale}${path}`;
}

/**
 * Supprime le préfixe de locale d'un chemin.
 * Exemple : stripLocale("/fr/projects") → "/projects"
 *           stripLocale("/projects") → "/projects"
 */
export function stripLocale(path: string, locales: readonly string[]): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    return "/" + segments.slice(1).join("/");
  }
  return path;
}

/**
 * Retourne l'URL de redirection pour le switch de langue.
 * Si on est sur /fr/projects et qu'on passe en en : → /projects
 * Si on est sur /projects et qu'on passe en fr : → /fr/projects
 */
export function switchLocalePath(currentPath: string, from: Locale, to: Locale): string {
  const locales: readonly string[] = ["fr", "en"];
  const clean = stripLocale(currentPath, locales) || "/";
  return localePath(clean, to);
}
