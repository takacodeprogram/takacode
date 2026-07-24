import { redirect } from "next/navigation";
import { getServerLocale } from "./serverLocale";
import { DEFAULT_LOCALE } from "./i18n";

/**
 * Redirige vers un chemin en préservant la locale dans l'URL.
 *
 * - Si la locale est celle par défaut (en) : pas de préfixe → redirect(path)
 * - Si la locale est fr : préfixe /fr + gère le param `next` s'il existe
 *
 * Usage (remplace redirect() dans les composants serveur) :
 *   await redirectLocale("/signin?next=/dashboard");
 */
export async function redirectLocale(href: string): Promise<never> {
  const locale = await getServerLocale();

  // Locale par défaut → pas de préfixe, comportement identique à redirect()
  if (locale === DEFAULT_LOCALE) {
    redirect(href);
  }

  const [path, qs] = href.split("?");
  const prefixed = `/${locale}${path}`;

  if (!qs) {
    redirect(prefixed);
  }

  // Si y'a des query params, préfixer aussi le param `next` (auth redirects)
  const params = new URLSearchParams(qs);
  const next = params.get("next");
  if (next) {
    params.set("next", `/${locale}${next.startsWith("/") ? next : `/${next}`}`);
  }
  redirect(`${prefixed}?${params.toString()}`);
}
