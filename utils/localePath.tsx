"use client";

import Link from "next/link";
import type { Locale } from "../lib/i18n";
import type { ComponentProps } from "react";
import { localePath, stripLocale, switchLocalePath } from "../lib/localeHelpers";

export { localePath, stripLocale, switchLocalePath };

/**
 * Composant Link qui préfixe automatiquement le href avec la locale.
 * À utiliser dans les composants où useI18n est disponible.
 *
 * Usage : <LinkLocale href="/projects" locale="en">Projects</LinkLocale>
 */
export function LinkLocale({
  href,
  locale,
  children,
  ...props
}: ComponentProps<typeof Link> & { locale: Locale }) {
  return (
    <Link href={localePath(href as string, locale)} {...props}>
      {children}
    </Link>
  );
}
