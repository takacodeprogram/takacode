"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { getCountryFlag } from "../lib/leaderboard";

interface Session {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  countryCode: string;
  isCurrent: boolean;
  lastActiveAt: string;
  createdAt: string;
}

function iconify(icon: string) {
  return <iconify-icon icon={icon} style={{ fontSize: "16px" }} />;
}

function deviceIcon(type: string): string {
  if (type === "mobile") return "lucide:smartphone";
  if (type === "tablet") return "lucide:tablet";
  return "lucide:monitor";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AccountSecurity({ userId, lastSignInAt }: { userId: string; lastSignInAt: string | null }) {
  const supabase = createClient();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.rpc("list_my_sessions").then(({ data, error }) => {
      if (!error && Array.isArray(data)) {
        setSessions(data.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          deviceName: (s.device_name as string) || "",
          deviceType: (s.device_type as string) || "",
          browser: (s.browser as string) || "",
          os: (s.os as string) || "",
          ipAddress: (s.ip_address as string) || "",
          countryCode: (s.country_code as string) || "",
          isCurrent: Boolean(s.is_current),
          lastActiveAt: (s.last_active_at as string) || "",
          createdAt: (s.created_at as string) || ""
        })));
      }
    });
  }, [supabase]);

  async function handleDeactivate() {
    if (!window.confirm("Desactiver ton compte ? Tu pourras le reactiver en contactant l'équipe.")) return;
    setDeleting(true);
    await supabase.rpc("deactivate_my_account");
    setMessage("Compte désactive. A bientôt !");
    setDeleting(false);
  }

  async function handleDelete() {
    if (!window.confirm("Supprimer definitivement ton compte ? Toutes tes données seront perdues.")) return;
    if (!window.confirm("Confirmation : es-tu sur de vouloir supprimer ton compte ?")) return;
    setDeleting(true);
    await supabase.rpc("delete_my_account");
    setMessage("Compte supprime. Redirection...");
    setTimeout(() => { window.location.href = "/"; }, 2000);
    setDeleting(false);
  }

  return (
    <div className="space-y-4">
      <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg border border-[#22D3EE]/30 bg-[#22D3EE]/10 inline-flex items-center justify-center">
            <iconify-icon icon="lucide:clock" style={{ color: "#22D3EE", fontSize: "15px" }} />
          </div>
          <div>
            <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">Securite</div>
            <h3 className="font-venite-italic text-[14px] text-white">Connexion et appareils</h3>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 mb-4">
          <div className="text-[10px] text-[#777] uppercase tracking-widest mb-0.5">Dernière connexion</div>
          <div className="text-[13px] text-white font-semibold">
            {lastSignInAt ? formatDate(lastSignInAt) : "Non disponible"}
          </div>
        </div>

        {sessions.length > 0 ? (
          <div className="space-y-2 mb-4">
            <div className="text-[10px] text-[#777] uppercase tracking-widest mb-1">
              Appareils connectes ({sessions.length})
            </div>
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.01] px-3.5 py-2.5 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] inline-flex items-center justify-center shrink-0">
                  {iconify(deviceIcon(session.deviceType))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-white font-semibold leading-tight truncate flex items-center gap-1.5">
                    {session.deviceName || session.browser || "Appareil inconnu"}
                    {session.isCurrent ? (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                        Actuel
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[10px] text-[#888] font-body-readable">
                    {[session.browser, session.os, session.ipAddress].filter(Boolean).join(" · ")}
                    {session.countryCode ? ` ${getCountryFlag(session.countryCode)}` : ""}
                  </div>
                </div>
                <div className="text-[10px] text-[#666] shrink-0">
                  {formatDate(session.lastActiveAt)}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </article>

      <article className="rounded-2xl border border-red-500/20 bg-[#111] p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg border border-red-500/30 bg-red-500/10 inline-flex items-center justify-center">
            <iconify-icon icon="lucide:trash-2" style={{ color: "#EF4444", fontSize: "15px" }} />
          </div>
          <div>
            <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">Zone dangereuse</div>
            <h3 className="font-venite-italic text-[14px] text-white">Desactivation ou suppression</h3>
          </div>
        </div>
        <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">
          Desactiver cache ton profil et désactive les notifications. Supprimer efface toutes tes données de manière irreversible.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={deleting}
            className="text-[12px] font-semibold px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 transition-all inline-flex items-center gap-2"
          >
            <iconify-icon icon="lucide:power" style={{ fontSize: "13px" }} />
            Desactiver mon compte
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-[12px] font-semibold px-4 py-2.5 rounded-xl border border-red-500/50 bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all inline-flex items-center gap-2"
          >
            <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px" }} />
            Supprimer mon compte
          </button>
        </div>
        {message ? (
          <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">
            {message}
          </div>
        ) : null}
      </article>
    </div>
  );
}