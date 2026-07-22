import "./globals.css";
import Script from "next/script";
import { cookies } from "next/headers";
import logoLight2 from "../assets/logos-light-png/logo-light-2.png";
import CookieNotice from "../components/CookieNotice";
import LiveRefreshWrapper from "../components/LiveRefreshWrapper";
import { I18nProvider } from "../components/I18nProvider";
import { SEO_DEFAULTS, buildHreflang } from "../lib/seo";
import type { Locale } from "../lib/i18n";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "../lib/i18n";

const COOKIE_NAME = "takacode_locale";

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
      icon: logoLight2.src,
      shortcut: logoLight2.src,
      apple: logoLight2.src
    }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await detectLocaleFromCookie();

  return (
    // Browser extensions can inject attributes into <html>/<body> before hydration.
    // Keep hydration warnings muted for those external mutations.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
        <link rel="preload" as="image" href={logoLight2.src} />
      </head>
      <body suppressHydrationWarning>
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="beforeInteractive" />
        <I18nProvider>
          <LiveRefreshWrapper>{children}</LiveRefreshWrapper>
          <CookieNotice />
        </I18nProvider>
      </body>
    </html>
  );
}
