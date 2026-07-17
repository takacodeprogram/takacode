import "./globals.css";
import Script from "next/script";
import logoLight2 from "../assets/logos-light-png/logo-light-2.png";
import CookieNotice from "../components/CookieNotice";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Browser extensions can inject attributes into <html>/<body> before hydration.
    // Keep hydration warnings muted for those external mutations.
    <html lang="fr" suppressHydrationWarning>
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
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
