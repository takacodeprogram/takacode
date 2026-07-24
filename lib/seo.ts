import type { Locale } from "./i18n";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./i18n";

const FALLBACK_SITE_URL = "https://takacode.vercel.app";

function normalizeSiteUrl(rawValue: unknown): string {
  const value = typeof rawValue === "string" ? rawValue.trim() : "";
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  return value.replace(/\/$/, "");
}

function normalizePath(path: unknown): string {
  const value = typeof path === "string" ? path.trim() : "";
  if (!value || value === "/") {
    return "/";
  }

  return value.startsWith("/") ? value : `/${value}`;
}

interface SEOConfig {
  siteName: string;
  siteUrl: string;
  locale: string;
  defaultTitle: string;
  defaultDescription: string;
}

export const SEO_DEFAULTS: SEOConfig = {
  siteName: "TakaCode",
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL),
  locale: "en_US",
  defaultTitle: "Learn by building real projects",
  defaultDescription:
    "TakaCode helps creators learn to code by building real digital projects: web, AI, data, web3, 3D, mobile and digital business."
};

/**
 * Construit les URLs hreflang pour une page donnée.
 * La locale par défaut (fr) n'a pas de préfixe.
 */
export function buildHreflang(path: string): Array<{ hrefLang: string; href: string }> {
  const siteUrl = SEO_DEFAULTS.siteUrl.replace(/\/$/, "");
  const clean = path === "/" ? "" : normalizePath(path);

  return SUPPORTED_LOCALES.map((locale) => ({
    hrefLang: locale === "fr" ? "fr" : "en",
    href: `${siteUrl}${locale === DEFAULT_LOCALE ? clean : `/${locale}${clean}`}`
  }));
}

interface BuildMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  locale?: Locale;
  noIndex?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    type?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
  };
}

export function buildPageMetadata({
  title,
  description = SEO_DEFAULTS.defaultDescription,
  path = "/",
  locale,
  noIndex = false,
  openGraph,
  twitter
}: BuildMetadataOptions): Record<string, unknown> {
  // Si locale fournie et non défaut, le canonique doit inclure le préfixe
  // pour que les moteurs voient l'URL correcte (ex: /en/tracks pas /tracks)
  const canonicalPath = locale !== undefined && locale !== DEFAULT_LOCALE
    ? `/${locale}${normalizePath(path)}`
    : normalizePath(path);

  const metadata: Record<string, unknown> = {
    title,
    description,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      url: openGraph?.url || canonicalPath,
      siteName: openGraph?.siteName || SEO_DEFAULTS.siteName,
      locale: openGraph?.locale || SEO_DEFAULTS.locale,
      type: openGraph?.type || "website",
      images: openGraph?.images
    },
    twitter: {
      card: twitter?.card || "summary_large_image",
      title: twitter?.title || title,
      description: twitter?.description || description,
      images: twitter?.images
    }
  };

  // Ajouter les hreflang alternates si une locale est fournie
  if (!noIndex && path) {
    metadata.alternates = {
      ...(metadata.alternates as Record<string, unknown>),
      languages: Object.fromEntries(
        buildHreflang(path).map(({ hrefLang, href }) => [hrefLang, href])
      )
    };
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false
    };
  }

  return metadata;
}
