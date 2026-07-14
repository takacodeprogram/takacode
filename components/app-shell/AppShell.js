"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import logoLight4 from "../../assets/logos-light-png/logo-light-4.png";
import { ADMIN_LINKS, MEMBER_LINKS, isSidebarLinkActive } from "./appNav";

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

  const displayName = user?.displayName || "Membre";
  const email = user?.email || "membre@takacode.app";
  const role = (user?.role || "user").toLowerCase();
  const roleLabel = role.toUpperCase();
  const isAdmin = role === "admin";
  const initials = getInitials(displayName);

  const links = isAdmin ? [...MEMBER_LINKS, ...ADMIN_LINKS] : MEMBER_LINKS;
  const mobileLinks = links.filter((link) => link.href !== "/dashboard/profil");

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white">
      <aside className="w-[280px] border-r border-white/[0.05] bg-[#0A0A0A] sticky top-0 h-screen z-40 p-6 hidden lg:flex lg:flex-col">
        <div className="mb-10 pl-2">
          <Link href="/dashboard">
            <img src={logoLight4.src} alt="TakaCode" className="nav-logo-image" />
          </Link>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {links.map((link) => (
            <SidebarLink key={link.href} link={link} pathname={pathname} />
          ))}
        </nav>

        <div className="pt-6 border-t border-white/[0.05]">
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
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-3 px-6 md:px-8 pt-6 md:pt-7">
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            {mobileLinks.map((link) => {
              const active = isSidebarLinkActive(pathname, link);

              return (
                <Link
                  key={`${link.href}-mobile`}
                  href={link.href}
                  className={[
                    "shrink-0 rounded-lg px-3 py-2 text-[11px] font-semibold border",
                    active
                      ? "border-blue-500/20 bg-blue-500/10 text-[#4F8EF7]"
                      : "border-white/[0.08] bg-white/[0.03] text-[#bbb]"
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-[13px] font-semibold leading-tight">{displayName}</div>
              <div className="text-[11px] text-[#4ADE80] leading-tight">Role {roleLabel}</div>
              <div className="text-[10px] text-[#555] leading-tight">{email}</div>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[11px] font-semibold">
              {initials}
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 pt-6 md:pt-7">{children}</main>
      </div>
    </div>
  );
}
