"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logoLight4 from "../../assets/logos-light-png/logo-light-4.png";
import { ADMIN_AREA_LINKS, ADMIN_ENTRY_LINK, MEMBER_LINKS, MENTOR_LINK, isAdminAreaPath, isSidebarLinkActive } from "./appNav";

function getInitials(value) {
  const tokens = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) {
    return "ME";
  }
  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }
  return `${tokens[0][0]}${tokens[tokens.length - 1][0]}`.toUpperCase();
}

function SidebarLink({ link, pathname, onNavigate }) {
  const active = isSidebarLinkActive(pathname, link);
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={[
        "flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium transition-all",
        active
          ? "bg-blue-500/10 text-[#4F8EF7] border border-blue-500/15"
          : "text-[#888] hover:text-white hover:bg-white/[0.04]"
      ].join(" ")}
    >
      <span className="flex items-center gap-3">
        <iconify-icon icon={link.icon} />
        {link.label}
      </span>
      {link.live ? <span className="h-2 w-2 rounded-full bg-red-500" /> : null}
    </Link>
  );
}

export default function AppShell({ user, children }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.displayName || "Membre";
  const email = user?.email || "membre@takacode.app";
  const role = (user?.role || "user").toLowerCase();
  const roleLabel = role.toUpperCase();
  const isAdmin = role === "admin";
  const initials = getInitials(displayName);
  const avatarUrl = typeof user?.avatarUrl === "string" ? user.avatarUrl : "";

  const adminArea = isAdmin && isAdminAreaPath(pathname);
  const links = adminArea
    ? ADMIN_AREA_LINKS
    : isAdmin
      ? [...MEMBER_LINKS, ADMIN_ENTRY_LINK]
      : role === "mentor"
        ? [...MEMBER_LINKS, MENTOR_LINK]
        : MEMBER_LINKS;

  // Ferme le drawer + le menu a chaque changement de route.
  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Ferme le menu au clic exterieur.
  useEffect(() => {
    if (!menuOpen) return undefined;
    function onDocClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  function sidebarInner(onNavigate) {
    return (
      <>
        <div className="mb-10 pl-2">
          <Link href="/dashboard" onClick={onNavigate}>
            <img src={logoLight4.src} alt="TakaCode" className="nav-logo-image" />
          </Link>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {links.map((link) => (
            <SidebarLink key={link.href} link={link} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </nav>

        <div className="pt-6 border-t border-white/[0.05] space-y-2">
          {adminArea ? (
            <Link
              href="/dashboard"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-[#888] hover:text-white hover:bg-white/[0.04] transition-all"
            >
              <iconify-icon icon="lucide:arrow-left" />
              Espace membre
            </Link>
          ) : null}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all"
            >
              <iconify-icon icon="lucide:log-out" />
              Deconnexion
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white">
      {/* Sidebar desktop */}
      <aside className="w-[280px] border-r border-white/[0.05] bg-[#0A0A0A] sticky top-0 h-screen z-40 p-6 hidden lg:flex lg:flex-col">
        {sidebarInner()}
      </aside>

      {/* Sidebar mobile (drawer) */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setDrawerOpen(false)} />
          <aside className="drawer-in absolute left-0 top-0 h-full w-[280px] max-w-[82%] border-r border-white/[0.05] bg-[#0A0A0A] p-6 flex flex-col">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 text-[#888] hover:text-white p-1"
              aria-label="Fermer le menu"
            >
              <iconify-icon icon="lucide:x" style={{ fontSize: "18px" }} />
            </button>
            {sidebarInner(() => setDrawerOpen(false))}
          </aside>
        </div>
      ) : null}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-3 px-6 md:px-8 pt-6 md:pt-7">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white"
            aria-label="Ouvrir le menu"
          >
            <iconify-icon icon="lucide:menu" style={{ fontSize: "18px" }} />
          </button>
          <div className="hidden lg:block" />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors px-2 py-1.5"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <div className="text-right hidden sm:block pl-1">
                <div className="text-[13px] font-semibold leading-tight">{displayName}</div>
                <div className="text-[10px] text-[#4ADE80] leading-tight">Role {roleLabel}</div>
              </div>
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-9 h-9 rounded-full border border-white/10 object-cover bg-white/[0.03]" />
              ) : (
                <div className="w-9 h-9 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[11px] font-semibold">
                  {initials}
                </div>
              )}
              <iconify-icon icon="lucide:chevron-down" style={{ fontSize: "14px", color: "#888" }} />
            </button>

            {menuOpen ? (
              <div className="menu-in absolute right-0 mt-2 w-60 rounded-xl border border-white/[0.1] bg-[#111] p-1.5 z-[70]" style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }} role="menu">
                <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                  <div className="text-[12px] text-white font-semibold truncate">{displayName}</div>
                  <div className="text-[10px] text-[#777] truncate">{email}</div>
                </div>
                <Link
                  href="/dashboard/profil"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-[#d1d1d1] hover:bg-white/[0.05] transition-colors"
                  role="menuitem"
                >
                  <iconify-icon icon="lucide:user" style={{ fontSize: "15px", color: "#89c7ff" }} />
                  Mon profil
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-[#d1d1d1] hover:bg-white/[0.05] transition-colors"
                    role="menuitem"
                  >
                    <iconify-icon icon="lucide:shield-check" style={{ fontSize: "15px", color: "#89c7ff" }} />
                    Centre admin
                  </Link>
                ) : null}
                <form action="/auth/signout" method="post" className="mt-1 pt-1 border-t border-white/[0.06]">
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                    role="menuitem"
                  >
                    <iconify-icon icon="lucide:log-out" style={{ fontSize: "15px" }} />
                    Se deconnecter
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 pt-6 md:pt-7">{children}</main>
      </div>
    </div>
  );
}
