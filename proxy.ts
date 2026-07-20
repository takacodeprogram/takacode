import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

// Next 16 n'accepte qu'un seul point d'entree : proxy.ts (middleware.ts est
// refuse au build). On y combine donc les deux responsabilites :
//   1. i18n : locale dans l'URL (/en/...) -> rewrite interne + cookie
//   2. Supabase : rafraichissement de la session sur chaque requete

const SUPPORTED_LOCALES = ["fr", "en"];
const DEFAULT_LOCALE = "fr";
const COOKIE_NAME = "takacode_locale";
const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 an
  sameSite: "lax" as const
};

export async function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // Locale explicite dans l'URL : on reecrit vers la route sans prefixe et on
  // memorise le choix. Les pages serveur lisent ce cookie (lib/serverLocale)
  // pour servir le CONTENU des parcours dans la bonne langue.
  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment)) {
    const rewritten = NextResponse.rewrite(new URL("/" + segments.slice(1).join("/"), request.url));
    rewritten.cookies.set(COOKIE_NAME, firstSegment, COOKIE_OPTIONS);
    return rewritten;
  }

  // Sinon : session Supabase rafraichie, puis cookie de langue par defaut si
  // l'utilisateur n'a encore jamais choisi.
  const response = await updateSession(request);
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
