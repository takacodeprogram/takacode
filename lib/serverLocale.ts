import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, detectLocale } from "./i18n";
import type { Locale } from "./i18n";

const STORAGE_KEY = "takacode_locale";

/**
 * Locale côté serveur, pour filtrer le CONTENU (parcours) par langue.
 *
 * Ordre de résolution :
 *   1. cookie takacode_locale (posé par I18nProvider quand l'utilisateur choisit)
 *   2. en-tête Accept-Language du navigateur
 *   3. français par défaut
 *
 * Les parcours ne sont pas des traductions : un membre en anglais voit les
 * parcours écrits en anglais, avec leurs propres ressources.
 */
export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const stored = cookieStore.get(STORAGE_KEY)?.value;
    if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch {
    // cookies() indisponible dans ce contexte de rendu
  }

  try {
    const headerStore = await headers();
    return detectLocale(headerStore.get("accept-language") || undefined);
  } catch {
    return DEFAULT_LOCALE;
  }
}
