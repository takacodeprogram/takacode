"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import logoLight4 from "../assets/logos-light-png/logo-light-4.png";
import { createClient } from "../utils/supabase/client";

const navLinks = [
  { href: "/", id: "nav-accueil-link", label: "Accueil", match: ["/"] },
  { href: "/parcours", id: "nav-parcours-link", label: "Parcours", match: ["/parcours"] },
  { href: "/competences", id: "nav-competences-link", label: "Competences", match: ["/competences"] },
  { href: "/projets", id: "nav-projets-link", label: "Projets", match: ["/projets"] },
  { href: "/ressources", id: "nav-ressources-link", label: "Ressources", match: ["/ressources"] },
  { href: "/communaute", id: "nav-communaute-link", label: "Communaute", match: ["/communaute"] },
  { href: "/tarifs", id: "nav-tarifs-link", label: "Tarifs", match: ["/tarifs"] }
];

function isLinkActive(pathname, link) {
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

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [authState, setAuthState] = useState("loading");

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session?.user ? "authenticated" : "anonymous");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const toggleMobileMenu = () => setIsMobileOpen((current) => !current);
  const closeMobileMenu = () => setIsMobileOpen(false);

  const isAuthLoading = authState === "loading";
  const isAuthenticated = authState === "authenticated";

  const authHref = isAuthenticated ? "/dashboard" : "/signin";
  const authLabel = isAuthenticated ? "Dashboard" : "Connexion";
  const ctaHref = isAuthenticated ? "/dashboard" : "/signup";
  const ctaLabel = isAuthenticated ? "Dashboard" : "Commencer";

  return (
    <nav
      className={`nav-surface fixed top-0 left-0 right-0 z-50${hasScrolled || isMobileOpen ? " scrolled" : ""}`}
      style={{
        "--nav-blur": `${Math.round(14 + scrollProgress * 22)}px`,
        "--nav-bg-alpha": (0.06 + scrollProgress * 0.16).toFixed(2),
        "--nav-sat": `${Math.round(130 + scrollProgress * 35)}%`
      }}
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
          {isAuthLoading ? (
            <div className="h-10 w-[168px]" aria-hidden="true" />
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
            {isAuthLoading ? null : (
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