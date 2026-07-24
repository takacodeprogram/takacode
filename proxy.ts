import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import type { Locale } from "./lib/i18n";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./lib/i18n";

// Next 16 n'accepte qu'un seul point d'entree : proxy.ts (middleware.ts est
// refuse au build). On y combine donc les deux responsabilites :
//   1. i18n : locale dans l'URL (/fr/...) -> rewrite interne + cookie
//   2. Supabase : rafraichissement de la session sur chaque requete
//
// Ordre :
//   a) Normaliser la casse de la locale (EN -> en)
//   b) Si locale dans l'URL : mémoriser, retirer le préfixe du pathname interne
//   c) Exécuter updateSession sur le pathname interne (auth, redirects)
//   d) Si updateSession a fait un redirect : y ajouter le préfixe locale + cookies
//   e) Si locale était dans l'URL : rewriter vers le pathname interne
//   f) Sinon : poser le cookie de locale par défaut si jamais choisi
const COOKIE_NAME = "takacode_locale";
const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 an
  sameSite: "lax" as const
};

/**
 * Ajoute le préfixe locale à un chemin si nécessaire.
 * Exemple localePrefix("/dashboard", "fr") → "/fr/dashboard"
 *         localePrefix("/dashboard", "en") → "/dashboard" (en = d├⌐faut)
 */
function localePrefix(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return path;
  // Évite le double préfixe
  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) return path;
  return `/${locale}${path}`;
}

/**
 * Intercepte une redirection venant d'updateSession pour y ajouter le
 * préfixe locale. Retourne null si ce n'est pas une redirection interne.
 *
 * Gère aussi le paramètre `next` dans l'URL de redirection (utilisé par les
 * redirects auth) pour que l'utilisateur revienne sur la bonne URL localisée.
 */
function interceptRedirect(response: NextResponse, originalUrl: string, locale: Locale): NextResponse | null {
  if (response.status < 300 || response.status >= 400) return null;
  const location = response.headers.get("location");
  if (!location) return null;

  try {
    const url = new URL(location, originalUrl);
    // Ne toucher qu'aux redirections internes (même origin)
    if (url.origin !== new URL(originalUrl).origin) return null;

    // Préfixer le pathname de la redirection avec la locale
    if (locale !== DEFAULT_LOCALE) {
      url.pathname = localePrefix(url.pathname, locale);
    }

    // Préfixer aussi le paramètre `next` s'il existe (auth redirects)
    const nextParam = url.searchParams.get("next");
    if (nextParam && locale !== DEFAULT_LOCALE) {
      url.searchParams.set("next", localePrefix(nextParam, locale));
    }

    if (locale !== DEFAULT_LOCALE) {
      return NextResponse.redirect(url);
    }
  } catch {
    return null;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = (segments[0] || "").toLowerCase();

  // a) Détection de la locale
  const isLocaleInUrl = SUPPORTED_LOCALES.includes(firstSegment as Locale);
  const locale: Locale = isLocaleInUrl
    ? (firstSegment as Locale)
    : (request.cookies.get(COOKIE_NAME)?.value as Locale) || DEFAULT_LOCALE;

  // b') Redirection des anciennes routes françaises vers les nouvelles routes anglaises
  const checkPath = isLocaleInUrl ? "/" + segments.slice(1).join("/") : pathname;
  const OLD_ROUTE_MAP: Record<string, string> = {
    "/tarifs": "/pricing",
    "/projets": "/projects",
    "/profil": "/profile",
    "/parcours": "/tracks",
    "/classement": "/leaderboard",
    "/connexion": "/login",
    "/communaute": "/community",
    "/competences": "/skills",
    "/ressources": "/resources",
    "/nouveautes": "/changelog",
    "/nouveau": "/new",
    "/outils": "/tools",
    "/utilisateurs": "/users",
    "/revues": "/reviews",
    "/ia": "/ai",
    "/affiliations": "/affiliates",
    "/documentation": "/docs",
    "/progression": "/progress",
    "/mentorat": "/mentoring",
    "/edition": "/editing",
    "/lecon": "/lesson"
  };
  // Replace all French route segments in one pass (e.g., /parcours/.../lecon → /tracks/.../lesson)
  let newPath = checkPath;
  let hasChanges = false;
  for (const [oldSeg, newSeg] of Object.entries(OLD_ROUTE_MAP)) {
    const regex = new RegExp("\\b" + oldSeg.replace(/\//g, "\\/") + "\\b", "g");
    const replaced = newPath.replace(regex, newSeg);
    if (replaced !== newPath) hasChanges = true;
    newPath = replaced;
  }
  if (hasChanges && newPath !== checkPath) {
    const redirectUrl = isLocaleInUrl ? `/${locale}${newPath}` : newPath;
    return NextResponse.redirect(new URL(redirectUrl + search, request.url));
  }

  // b) Pathname interne sans le préfixe locale
  const internalPath = isLocaleInUrl ? "/" + segments.slice(1).join("/") : pathname;
  request.nextUrl.pathname = internalPath;

  // c) Session/auth sur le pathname interne
  let response = await updateSession(request);

  // d) Intercepter les redirects pour y ajouter la locale
  const intercepted = interceptRedirect(response, request.url, locale);
  if (intercepted) {
    // Copier les cookies de session (Set-Cookie de l'auth Supabase)
    for (const cookie of response.headers.getSetCookie()) {
      intercepted.headers.append("Set-Cookie", cookie);
    }
    intercepted.cookies.set(COOKIE_NAME, locale, COOKIE_OPTIONS);
    return intercepted;
  }

  // e) Si locale dans l'URL : rewriter + cookie
  if (isLocaleInUrl) {
    const rewritten = NextResponse.rewrite(new URL(internalPath + search, request.url));
    // Copier les cookies de la session (Set-Cookie de l'auth Supabase)
    for (const cookie of response.headers.getSetCookie()) {
      rewritten.headers.append("Set-Cookie", cookie);
    }
    rewritten.cookies.set(COOKIE_NAME, locale, COOKIE_OPTIONS);
    return rewritten;
  }

  // f) Cookie de locale par défaut si jamais choisi
  if (!request.cookies.get(COOKIE_NAME)) {
    response.cookies.set(COOKIE_NAME, DEFAULT_LOCALE, COOKIE_OPTIONS);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
