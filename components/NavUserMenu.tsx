"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getInitials } from "../lib/avatar";
import L from "./L";
import SignOutButton from "./SignOutButton";

interface User {
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
}

interface Props {
  user?: User | null;
  onNavigate?: () => void;
}

export default function NavUserMenu({ user, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = user?.displayName || "Membre";
  const email = user?.email || "";
  const avatarUrl = typeof user?.avatarUrl === "string" ? user.avatarUrl : "";
  const role = (user?.role || "user").toLowerCase();
  const isAdmin = role === "admin";
  const isMentor = role === "mentor";

  useEffect(() => {
    if (!open) return undefined;
    function onDocClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function handleNavigate() {
    setOpen(false);
    if (typeof onNavigate === "function") onNavigate();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.07] transition-colors pl-2 pr-2.5 py-1.5"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu du profil"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full border border-white/10 object-cover bg-white/[0.03]" />
        ) : (
          <div className="w-8 h-8 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[11px] font-semibold text-white">
            {getInitials(displayName)}
          </div>
        )}
        <iconify-icon icon="lucide:chevron-down" style={{ fontSize: "14px", color: "#888" }} />
      </button>

      {open ? (
        <div className="menu-in absolute right-0 mt-2 w-60 rounded-xl border border-white/[0.1] bg-[#111] p-1.5 z-[80]" style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }} role="menu">
          <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
            <div className="text-[12px] text-white font-semibold truncate">{displayName}</div>
            {email ? <div className="text-[10px] text-[#777] truncate">{email}</div> : null}
          </div>
          <L href="/dashboard" onClick={handleNavigate} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-[#d1d1d1] hover:bg-white/[0.05] transition-colors" role="menuitem">
            <iconify-icon icon="lucide:layout-grid" style={{ fontSize: "15px", color: "#89c7ff" }} />
            Tableau de bord
          </L>
          <L href="/dashboard/profile" onClick={handleNavigate} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-[#d1d1d1] hover:bg-white/[0.05] transition-colors" role="menuitem">
            <iconify-icon icon="lucide:user" style={{ fontSize: "15px", color: "#89c7ff" }} />
            Mon profil
          </L>
          {isMentor ? (
            <L href="/dashboard/mentor" onClick={handleNavigate} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-[#d1d1d1] hover:bg-white/[0.05] transition-colors" role="menuitem">
              <iconify-icon icon="lucide:book-plus" style={{ fontSize: "15px", color: "#89c7ff" }} />
              Proposer un parcours
            </L>
          ) : null}
          {isAdmin ? (
            <L href="/admin" onClick={handleNavigate} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-[#d1d1d1] hover:bg-white/[0.05] transition-colors" role="menuitem">
              <iconify-icon icon="lucide:shield-check" style={{ fontSize: "15px", color: "#89c7ff" }} />
              Centre d'administration
            </L>
          ) : null}
          <SignOutButton className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-colors mt-1 pt-1 border-t border-white/[0.06]">
            <iconify-icon icon="lucide:log-out" style={{ fontSize: "15px" }} />
            Se déconnecter
          </SignOutButton>
        </div>
      ) : null}
    </div>
  );
}
