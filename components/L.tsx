"use client";

import Link from "next/link";
import { useI18n } from "./I18nProvider";
import { localePath } from "../lib/localeHelpers";
import type { Locale } from "../lib/i18n";

/**
 * Locale-aware Link — préfixe automatiquement le href avec la locale.
 *
 * Usage côté client :
 *   <L href="/tracks">Parcours</L>
 *   → locale depuis useI18n() (context client)
 *
 * Usage côté serveur (passer la locale explicitement) :
 *   const locale = await getServerLocale();
 *   <L href="/tracks" locale={locale}>Parcours</L>
 *
 * Le composant est "use client" mais peut être rendu depuis un serveur
 * component tant que la prop locale est fournie.
 */
export default function L({
  href,
  locale: forcedLocale,
  children,
  ...props
}: React.ComponentProps<typeof Link> & { locale?: Locale }) {
  const { locale } = useI18n();
  const activeLocale = forcedLocale || locale;
  return (
    <Link href={localePath(href as string, activeLocale)} {...props}>
      {children}
    </Link>
  );
}
