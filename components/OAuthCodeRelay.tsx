"use client";

import { useEffect } from "react";

// Certains providers OAuth (ou une config Supabase incomplète) redirigent
// vers Site URL au lieu de /auth/callback quand redirectTo n'est pas dans
// la whitelist. Ce petit relay détecte un `?code=` ou `?error=` OAuth sur
// n'importe quelle page (sauf /auth/callback lui-même) et forward vers
// /auth/callback où le code est échangé contre une session.
//
// Sans ça, le user reste bloqué sur la page d'atterrissage jusqu'à recharger.

export default function OAuthCodeRelay() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { pathname, search } = window.location;
    if (!search) return;
    if (pathname === "/auth/callback") return;

    const params = new URLSearchParams(search);
    const code = params.get("code");
    const oauthError = params.get("error");

    if (!code && !oauthError) return;

    // Forward vers /auth/callback en conservant les params utiles.
    const target = new URL("/auth/callback", window.location.origin);
    if (code) target.searchParams.set("code", code);
    if (oauthError) target.searchParams.set("error", oauthError);
    const nextParam = params.get("next");
    if (nextParam) target.searchParams.set("next", nextParam);
    else if (pathname !== "/") {
      // Si l'user devait aller ailleurs après l'auth (ex. Supabase renvoie sur
      // une page profonde), on préserve cette destination via ?next.
      target.searchParams.set("next", pathname);
    }

    // window.location.replace pour éviter d'entrer l'URL avec ?code=
    // dans l'historique, ce qui pourrait re-déclencher l'échange au back.
    window.location.replace(target.toString());
  }, []);

  return null;
}
