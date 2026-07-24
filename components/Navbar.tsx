"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { StaticImageData } from "next/image";
import logoLight4 from "../assets/logos-light-png/logo-light-4.png";
import NavUserMenu from "./NavUserMenu";
import NotificationBell from "./NotificationBell";
import SignOutButton from "./SignOutButton";
import { createClient } from "../utils/supabase/client";
import { useI18n } from "./I18nProvider";
import type { Locale } from "../lib/i18n";
import { DEFAULT_LOCALE } from "../lib/i18n";
import { localePath, switchLocalePath } from "../utils/localePath";

interface NavLink {
  href: string;
  id: string;
  label: string;
  match: string[];
}

interface SessionUser {
  role: string;
  displayName: string;
  email: string;
  avatarUrl: string;
}

const NAV_LINK_DEFS: Array<{ href: string; id: string; labelKey: string; match: string[] }> = [
  { href: "/", id: "nav-accueil-link", labelKey: "navbar.accueil", match: ["/"] },
  { href: "/tracks", id: "nav-tracks-link", labelKey: "navbar.parcours", match: ["/tracks"] },
  { href: "/skills", id: "nav-skills-link", labelKey: "navbar.competences", match: ["/skills"] },
  { href: "/projects", id: "nav-projects-link", labelKey: "navbar.projets", match: ["/projects"] },
  { href: "/community", id: "nav-community-link", labelKey: "navbar.communaute", match: ["/community"] },
  { href: "/leaderboard", id: "nav-leaderboard-link", labelKey: "navbar.classement", match: ["/leaderboard"] }
];

// Construit les liens Nav avec locale appliquée aux href et labels traduits
function buildNavLinks(locale: Locale, t: (key: string, fallback?: string) => string): NavLink[] {
  return NAV_LINK_DEFS.map((def) => ({
    href: localePath(def.href, locale),
    id: def.id,
    label: t(def.labelKey),
    match: def.match
  }));
}

function isLinkActive(pathname: string, link: NavLink): boolean {
  return link.match.some((prefix) => {
    if (prefix === "/") {
      return pathname === "/" || pathname === "/en";
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname === `/en${prefix}` || pathname.startsWith(`/en${prefix}/`);
  });
}

function LangSwitch() {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next: Locale = locale === "fr" ? "en" : "fr";
    const nextPath = switchLocalePath(pathname, locale, next);
    setLocale(next);
    // Navigation client-side - le middleware intercepte et réécrit
    router.push(nextPath);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/[0.12] bg-white/[0.03] text-[#aaa] hover:text-white hover:border-white/[0.25] transition-all min-w-[44px]"
      aria-label={locale === "fr" ? t("navbar.switchToEnglish") : t("navbar.switchToFrench")}
    >
      <span className={`${locale === "fr" ? "text-white" : "text-[#666]"}`}>FR</span>
      <span className="text-[#444]">/</span>
      <span className={`${locale === "en" ? "text-white" : "text-[#666]"}`}>EN</span>
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [authState, setAuthState] = useState<string>("loading");
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 1100) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  useEffect(() => {
    const updateScrolledState = () => {
      const y = window.scrollY || 0;
      setHasScrolled(y > 12);
      setScrollProgress(Math.min(y / 180, 1));
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function syncAuthState() {
      try {
        const response = await fetch("/auth/session", {
          method: "GET",
          credentials: "include",
          cache: "no-store"
        });

        if (response.ok) {
          const payload = await response.json();

          if (!isMounted) {
            return;
          }

          setAuthState(payload?.authenticated ? "authenticated" : "anonymous");
          setSessionUser(
            payload?.authenticated
              ? { role: payload.role, displayName: payload.displayName, email: payload.email, avatarUrl: payload.avatarUrl }
              : null
          );
          return;
        }
      } catch {
        // Fallback to browser session lookup below.
      }

      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        setAuthState(session?.user ? "authenticated" : "anonymous");
      } catch {
        if (isMounted) {
          setAuthState("anonymous");
        }
      }
    }

    syncAuthState();

    return () => {
      isMounted = false;
    };
  }, [pathname, supabase]);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event: string, session) => {
      if (session?.user) {
        setAuthState("authenticated");
        setSessionUser((prev) =>
          prev || {
            role: "user",
            displayName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || t("navbar.member"),
            email: session.user.email || "",
            avatarUrl: session.user.user_metadata?.avatar_url || ""
          }
        );
      } else {
        setAuthState("anonymous");
        setSessionUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const toggleMobileMenu = () => setIsMobileOpen((current) => !current);
  const closeMobileMenu = () => setIsMobileOpen(false);

  const isAuthLoading = authState === "loading";
  const isAuthenticated = authState === "authenticated";

  const { t, locale } = useI18n();
  const navLinks = buildNavLinks(locale, t);

  const authHref = localePath("/signin", locale);
  const authLabel = t("navbar.connexion");
  const ctaHref = localePath(isAuthenticated ? "/dashboard" : "/signup", locale);
  const ctaLabel = isAuthenticated ? t("navbar.tableauDeBord") : t("navbar.commencer");

  return (
    <nav
      className={`nav-surface fixed top-0 left-0 right-0 z-50${hasScrolled || isMobileOpen ? " scrolled" : ""}`}
      style={{
        "--nav-blur": `${Math.round(14 + scrollProgress * 22)}px`,
        "--nav-bg-alpha": (0.06 + scrollProgress * 0.16).toFixed(2),
        "--nav-sat": `${Math.round(130 + scrollProgress * 35)}%`
      } as React.CSSProperties}
    >
      <div className="max-w-[1320px] mx-auto px-8 nav-shell flex items-center justify-between">
        <Link href="/" id="nav-logo-link" className="flex items-center gap-2 flex-shrink-0" onClick={closeMobileMenu}>
           <img src={logoLight4.src} alt="TakaCode" width="130" height="130" className="nav-logo-image" />
        </Link>

        <div className="nav-desktop-links flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              id={link.id}
              className={`nav-link${isLinkActive(pathname, link) ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-desktop-actions flex items-center gap-3">
          <LangSwitch />
          {isAuthLoading ? (
            <div className="h-10 w-[120px]" aria-hidden="true" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-1">
              <NotificationBell />
              <NavUserMenu user={sessionUser} />
            </div>
          ) : (
            <>
              <Link href={authHref} id="nav-connexion-link" className="nav-link">{authLabel}</Link>
              <Link href={ctaHref} id="nav-cta-link" className="btn-primary glow-btn">{ctaLabel}</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={`nav-menu-toggle${isMobileOpen ? " open" : ""}`}
          id="nav-menu-toggle"
          aria-controls="nav-mobile-panel"
          aria-expanded={isMobileOpen}
           aria-label={t("navbar.ouvrirMenu")}
          onClick={toggleMobileMenu}
        >
          <span className="nav-menu-icon" aria-hidden="true">
            <span className="nav-menu-line" />
            <span className="nav-menu-line" />
            <span className="nav-menu-line" />
          </span>
        </button>
      </div>

      <div id="nav-mobile-panel" className={`nav-mobile-panel${isMobileOpen ? " open" : ""}`}>
        <div className="max-w-[1320px] mx-auto px-4 pt-3 pb-5">
          <div className="nav-mobile-links">
            {navLinks.map((link) => (
              <Link
                key={`${link.id}-mobile`}
                href={link.href}
                id={`${link.id}-mobile`}
                className={`nav-link nav-mobile-link${isLinkActive(pathname, link) ? " active" : ""}`}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-mobile-actions">
            <div className="flex justify-center mb-2">
              <LangSwitch />
            </div>
            {isAuthLoading ? null : isAuthenticated ? (
              <>
                <Link href={localePath("/dashboard", locale)} id="nav-dashboard-mobile-link" className="btn-primary glow-btn nav-mobile-cta" onClick={closeMobileMenu}>
                  {t("navbar.tableauDeBord")}
                </Link>
                <Link href={localePath("/dashboard/profile", locale)} className="nav-link nav-mobile-link" onClick={closeMobileMenu}>
                  {t("navbar.monProfil")}
                </Link>
                <SignOutButton className="nav-link nav-mobile-link text-red-400/80" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                  {t("navbar.seDeconnecter")}
                </SignOutButton>
              </>
            ) : (
              <>
                <Link
                  href={authHref}
                  id="nav-connexion-mobile-link"
                  className="nav-link nav-mobile-link"
                  onClick={closeMobileMenu}
                >
                  {authLabel}
                </Link>
                <Link
                  href={ctaHref}
                  id="nav-cta-mobile-link"
                  className="btn-primary glow-btn nav-mobile-cta"
                  onClick={closeMobileMenu}
                >
                  {ctaLabel}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
