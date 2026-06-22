import "./globals.css";
import Script from "next/script";
import logoLight2 from "../assets/logos-light-png/logo-light-2.png";
import StartupLoader from "../components/StartupLoader";
import { SEO_DEFAULTS } from "../lib/seo";

export const metadata = {
  metadataBase: new URL(SEO_DEFAULTS.siteUrl),
  applicationName: SEO_DEFAULTS.siteName,
  title: {
    default: SEO_DEFAULTS.defaultTitle,
    template: "%s | TakaCode"
  },
  description: SEO_DEFAULTS.defaultDescription,
  openGraph: {
    title: SEO_DEFAULTS.defaultTitle,
    description: SEO_DEFAULTS.defaultDescription,
    url: "/",
    siteName: SEO_DEFAULTS.siteName,
    locale: SEO_DEFAULTS.locale,
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

export default function RootLayout({ children }) {
  return (
    // Browser extensions can inject attributes into <html>/<body> before hydration.
    // Keep hydration warnings muted for those external mutations.
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Preload the same image used for startup loader and favicon. */}
        <link rel="preload" as="image" href={logoLight2.src} />
      </head>
      <body suppressHydrationWarning>
        <StartupLoader />
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}