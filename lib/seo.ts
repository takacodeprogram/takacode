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
  locale: "fr_FR",
  defaultTitle: "Apprends en construisant des projets réels",
  defaultDescription:
    "TakaCode aide les créateurs à apprendre le numérique en construisant des projets réels : web, IA, data, web3, 3D, mobile et business digital."
};

interface BuildMetadataOptions {
  title: string;
  description?: string;
  path?: string;
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
  noIndex = false,
  openGraph,
  twitter
}: BuildMetadataOptions): Record<string, unknown> {
  const canonicalPath = normalizePath(path);

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

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false
    };
  }

  return metadata;
}
