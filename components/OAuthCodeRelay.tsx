"use client";

import { useEffect } from "react";

// Certains providers OAuth (ou une config Supabase incomplète) redirigent
// vers Site URL au lieu de /auth/callback quand redirectTo n'est pas dans
// la whitelist. Ce relay détecte un `?code=` ou `?error=` OAuth sur
// n'importe quelle page (sauf /auth/callback lui-même) et forward vers
// /auth/callback où le code est échangé contre une session.
//
// Garde-fous anti-boucle :
//  - sessionStorage marqueur "oauth_relay_fired" : un seul forward par onglet.
//  - stripping des params ?code / ?error de l'URL avant navigation, pour que
//    revenir en arrière ou un reload n'active pas à nouveau la logique.

const SESSION_FLAG = "takacode_oauth_relay_fired";

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

    // Anti-boucle : une seule redirection par onglet.
    try {
      if (window.sessionStorage.getItem(SESSION_FLAG) === "1") {
        // Nettoie l'URL sans re-déclencher (le callback a déjà été appelé,
        // on ne veut pas relancer un exchange qui va échouer).
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("code");
        cleanUrl.searchParams.delete("error");
        window.history.replaceState({}, "", cleanUrl.toString());
        return;
      }
      window.sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      // sessionStorage indisponible (private browsing) → tant pis, on continue
    }

    const target = new URL("/auth/callback", window.location.origin);
    if (code) target.searchParams.set("code", code);
    if (oauthError) target.searchParams.set("error", oauthError);
    const nextParam = params.get("next");
    if (nextParam) target.searchParams.set("next", nextParam);
    else if (pathname !== "/") target.searchParams.set("next", pathname);

    window.location.replace(target.toString());
  }, []);

  return null;
}
