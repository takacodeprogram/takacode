const FALLBACK_SITE_URL = "https://takacode.vercel.app";

function normalizeSiteUrl(rawValue) {
  const value = typeof rawValue === "string" ? rawValue.trim() : "";
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  return value.replace(/\/$/, "");
}

function normalizePath(path) {
  const value = typeof path === "string" ? path.trim() : "";
  if (!value || value === "/") {
    return "/";
  }

  return value.startsWith("/") ? value : `/${value}`;
}

export const SEO_DEFAULTS = {
  siteName: "TakaCode",
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL),
  locale: "fr_FR",
  defaultTitle: "Apprends en construisant des projets reels",
  defaultDescription:
    "TakaCode aide les createurs a apprendre le numerique en construisant des projets reels: web, IA, data, web3, 3D, mobile et business digital."
};

export function buildPageMetadata({ title, description = SEO_DEFAULTS.defaultDescription, path = "/", noIndex = false }) {
  const canonicalPath = normalizePath(path);

  const metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: SEO_DEFAULTS.siteName,
      locale: SEO_DEFAULTS.locale,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
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