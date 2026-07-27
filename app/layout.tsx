import "./globals.css";
import Script from "next/script";
import { cookies } from "next/headers";
import logoLight2 from "../assets/logos-light-png/logo-light-2.png";
import logoDark2 from "../assets/logos-dark-png/logo-dark-2.png";
import CookieNotice from "../components/CookieNotice";
import GlobalAssistantMount from "../components/GlobalAssistantMount";
import OAuthCodeRelay from "../components/OAuthCodeRelay";
import LiveRefreshWrapper from "../components/LiveRefreshWrapper";
import { I18nProvider } from "../components/I18nProvider";
import { ThemeProvider, type Theme } from "../components/ThemeProvider";
import { createClient } from "../utils/supabase/server";
import { SEO_DEFAULTS, buildHreflang } from "../lib/seo";
import type { Locale } from "../lib/i18n";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "../lib/i18n";

const COOKIE_NAME = "takacode_locale";
const THEME_COOKIE_NAME = "takacode_theme";

async function detectThemeFromCookie(): Promise<Theme> {
  try {
    const cookieStore = await cookies();
    const stored = cookieStore.get(THEME_COOKIE_NAME)?.value;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // cookies() unavailable in some contexts
  }
  return "dark";
}

const THEME_NO_FLASH_SCRIPT = `
(function(){try{var m=document.cookie.match(/(?:^|;\\s*)takacode_theme=(dark|light)/);var t=m?m[1]:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`.trim();

/**
 * Lit la locale depuis le cookie posé par le middleware proxy.
 * Fallback vers fr si pas de cookie ou valeur invalide.
 */
async function detectLocaleFromCookie(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const stored = cookieStore.get(COOKIE_NAME)?.value;
    if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch {
    // cookies() peut être indisponible dans certains contextes
  }
  return DEFAULT_LOCALE;
}

export async function generateMetadata() {
  const locale = await detectLocaleFromCookie();
  const ogLocale = locale === "en" ? "en_US" : "fr_FR";
  const hreflang = buildHreflang("/");

  return {
    metadataBase: new URL(SEO_DEFAULTS.siteUrl),
    applicationName: SEO_DEFAULTS.siteName,
    title: {
      default: SEO_DEFAULTS.defaultTitle,
      template: "%s | TakaCode"
    },
    description: SEO_DEFAULTS.defaultDescription,
    alternates: {
      canonical: locale === DEFAULT_LOCALE ? "/" : `/${locale}`,
      languages: Object.fromEntries(
        hreflang.map(({ hrefLang, href }) => [hrefLang, href])
      )
    },
    openGraph: {
      title: SEO_DEFAULTS.defaultTitle,
      description: SEO_DEFAULTS.defaultDescription,
      url: locale === DEFAULT_LOCALE ? "/" : `/${locale}`,
      siteName: SEO_DEFAULTS.siteName,
      locale: ogLocale,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: SEO_DEFAULTS.defaultTitle,
      description: SEO_DEFAULTS.defaultDescription
    },
    icons: {
      icon: [
        { url: logoLight2.src, media: "(prefers-color-scheme: dark)" },
        { url: logoDark2.src, media: "(prefers-color-scheme: light)" }
      ],
      shortcut: logoLight2.src,
      apple: logoLight2.src
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : undefined
    }
  };
}

async function detectAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data } = await supabase.auth.getUser();
    return Boolean(data?.user);
  } catch {
    return false;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, theme, authenticated] = await Promise.all([
    detectLocaleFromCookie(),
    detectThemeFromCookie(),
    detectAuthenticated()
  ]);

  return (
    // Browser extensions can inject attributes into <html>/<body> before hydration.
    // Keep hydration warnings muted for those external mutations.
    <html lang={locale} data-theme={theme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_NO_FLASH_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
      </head>
      <body suppressHydrationWarning>
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="beforeInteractive" />
        <ThemeProvider initialTheme={theme}>
          <I18nProvider>
            <OAuthCodeRelay />
            <LiveRefreshWrapper>{children}</LiveRefreshWrapper>
            <CookieNotice />
            <GlobalAssistantMount initialAuthenticated={authenticated} />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
