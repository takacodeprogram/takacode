import "./globals.css";
import Script from "next/script";
import logoLight2 from "../assets/logos-light-png/logo-light-2.png";
import StartupLoader from "../components/StartupLoader";

export const metadata = {
  title: "TakaCode - Homepage",
  description: "Homepage TakaCode",
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