"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { StaticImageData } from "next/image";
import logoLight4 from "../assets/logos-light-png/logo-light-4.png";
import NavUserMenu from "./NavUserMenu";
import NotificationBell from "./NotificationBell";
import { createClient } from "../utils/supabase/client";

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

const navLinks: NavLink[] = [
  { href: "/", id: "nav-accueil-link", label: "Accueil", match: ["/"] },
  { href: "/parcours", id: "nav-parcours-link", label: "Parcours", match: ["/parcours"] },
  { href: "/competences", id: "nav-competences-link", label: "Competences", match: ["/competences"] },
  { href: "/projets", id: "nav-projets-link", label: "Projets", match: ["/projets"] },
  { href: "/communaute", id: "nav-communaute-link", label: "Communaute", match: ["/communaute"] },
  { href: "/classement", id: "nav-classement-link", label: "Classement", match: ["/classement"] },
  { href: "/tarifs", id: "nav-tarifs-link", label: "Tarifs", match: ["/tarifs"] }
];

function isLinkActive(pathname: string, link: NavLink): boolean {
  return link.match.some((prefix) => {
    if (prefix === "/") {
      return pathname === "/";
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
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
            displayName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Membre",
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

  const authHref = "/signin";
  const authLabel = "Connexion";
  const ctaHref = isAuthenticated ? "/dashboard" : "/signup";
  const ctaLabel = isAuthenticated ? "Dashboard" : "Commencer";

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
           <img src={logoLight4} alt="TakaCode" width="130" height="130" className="nav-logo-image" />
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
              <Link href="/signup" id="nav-cta-link" className="btn-primary glow-btn">Commencer</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={`nav-menu-toggle${isMobileOpen ? " open" : ""}`}
          id="nav-menu-toggle"
          aria-controls="nav-mobile-panel"
          aria-expanded={isMobileOpen}
          aria-label="Ouvrir le menu"
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
            {isAuthLoading ? null : isAuthenticated ? (
              <>
                <Link href="/dashboard" id="nav-dashboard-mobile-link" className="btn-primary glow-btn nav-mobile-cta" onClick={closeMobileMenu}>
                  Dashboard
                </Link>
                <Link href="/dashboard/profil" className="nav-link nav-mobile-link" onClick={closeMobileMenu}>
                  Mon profil
                </Link>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="nav-link nav-mobile-link text-red-400/80" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                    Se deconnecter
                  </button>
                </form>
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
