"use client";

import { useMemo, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useToast } from "./Toast";

interface User {
  id: string;
  display_name?: string;
  email?: string;
  role?: string;
  points?: number;
  grade?: string;
  referral_code?: string;
  created_at?: string;
}

interface AdminUsersManagerProps {
  initialUsers?: User[];
  currentUserId?: string;
}

const ROLE_OPTIONS = ["user", "mentor", "admin"];

const ROLE_INFO: Record<string, { label: string; desc: string }> = {
  user: { label: "Membre", desc: "Apprend, suit les parcours, publie ses projets." },
  mentor: { label: "Mentor", desc: "Membre + anime des sessions live et accompagne les autres." },
  admin: { label: "Admin", desc: "Accès complet : utilisateurs, parcours, leçons, sessions, paramètres." }
};

const ROLE_ERROR: Record<string, string> = {
  not_authenticated: "Session expiree, reconnecte-toi.",
  forbidden: "Action réservée aux admins.",
  invalid_role: "Rôle invalide.",
  cannot_change_self: "Tu ne peux pas modifier ton propre rôle.",
  user_not_found: "Utilisateur introuvable.",
  last_admin: "Impossible : il doit rester au moins un admin.",
  rpc_missing: "Fonction de role absente. Lance supabase/sql/011_role_management.sql."
};

function shortId(value: string | undefined): string {
  if (typeof value !== "string" || value.length < 10) {
    return value || "-";
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function resolveUserDisplayName(user: User): string {
  const directName = typeof user?.display_name === "string" ? user.display_name.trim() : "";
  if (directName) return directName;
  const email = typeof user?.email === "string" ? user.email.trim() : "";
  if (email && email.includes("@")) return email.split("@")[0];
  return shortId(user?.id);
}

function formatDate(value: string | undefined): string {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AdminUsersManager({ initialUsers = [], currentUserId = "" }: AdminUsersManagerProps) {
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(Array.isArray(initialUsers) ? initialUsers : []);
  const [pointsDraft, setPointsDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries((initialUsers || []).map((u: User) => [u.id, String(Number(u.points ?? 0))]))
  );
  const [roleDraft, setRoleDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries((initialUsers || []).map((u: User) => [u.id, typeof u.role === "string" ? u.role : "user"]))
  );
  const [savingPointsId, setSavingPointsId] = useState<string>("");
  const [applyingRoleId, setApplyingRoleId] = useState<string>("");
  const [confirm, setConfirm] = useState<{ user: User; oldRole: string; newRole: string } | null>(null);

  async function handleSavePoints(userId: string) {
    const points = Math.max(0, Number.parseInt(String(pointsDraft[userId]), 10) || 0);
    setSavingPointsId(userId);

    const { data, error } = await supabase
      .from("user_profiles")
      .update({ points })
      .eq("id", userId)
      .select("id, role, points, grade, referral_code, referred_by, created_at, updated_at")
      .single();

    if (error) {
      toast(error.message, "error");
      setSavingPointsId("");
      return;
    }

    setUsers((current) => current.map((u) => (u.id === userId ? { ...u, ...(data as object) } : u)));
    setPointsDraft((current) => ({ ...current, [userId]: String((data as { points: number }).points) }));
    toast("Points mis à jour.", "success");
    setSavingPointsId("");
  }

  function requestRoleChange(user: User) {
    const newRole = roleDraft[user.id];
    if (!ROLE_OPTIONS.includes(newRole) || newRole === user.role) {
      return;
    }
    setConfirm({ user, oldRole: user.role || "user", newRole });
  }

  async function confirmRoleChange() {
    if (!confirm) return;
    const { user, newRole } = confirm;
    setApplyingRoleId(user.id);

    const { data, error } = await supabase.rpc("admin_set_user_role", { p_target: user.id, p_role: newRole });

    if (error || (data && typeof data === "object" && "error" in data && data.error)) {
      const code = (data && typeof data === "object" && "error" in data ? (data as { error: string }).error : "") || (error?.message?.includes("function") ? "rpc_missing" : "");
      toast(ROLE_ERROR[code] || error?.message || "Impossible de changer le rôle.", "error");
      setApplyingRoleId("");
      setConfirm(null);
      setRoleDraft((current) => ({ ...current, [user.id]: user.role || "user" }));
      return;
    }

    setUsers((current) => current.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    toast(`Role de ${resolveUserDisplayName(user)} : ${ROLE_INFO[newRole].label}.`, "success");
    setApplyingRoleId("");
    setConfirm(null);
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="font-valorax text-xl">UTILISATEURS ET ROLES</h2>
          <p className="text-[12px] text-[#777] font-body-readable mt-1">
            Change les points directement. Les changements de rôle demandent une confirmation et sont journalises.
          </p>
        </div>
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[11px] text-[#bbb]">{users.length} utilisateur(s)</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-5">
        {ROLE_OPTIONS.map((role) => (
          <div key={role} className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
            <div className="text-[11px] font-semibold text-white mb-0.5">{ROLE_INFO[role].label}</div>
            <div className="text-[10px] text-[#888] font-body-readable leading-snug">{ROLE_INFO[role].desc}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-widest text-[#666] border-b border-white/[0.06]">
              <th className="py-3 pr-4">Utilisateur</th>
              <th className="py-3 pr-4">Rôle</th>
              <th className="py-3 pr-4">Points</th>
              <th className="py-3 pr-4">Grade</th>
              <th className="py-3 pr-4">Inscription</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = currentUserId && user.id === currentUserId;
              const selectedRole = roleDraft[user.id] || user.role || "user";
              const roleChanged = selectedRole !== user.role;

              return (
                <tr key={user.id} className="border-b border-white/[0.04] text-[13px] text-[#d5d5d5]">
                  <td className="py-3 pr-4 font-body-readable">
                    <div className="font-semibold text-white flex items-center gap-2">
                      {resolveUserDisplayName(user)}
                      {isSelf ? <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200">toi</span> : null}
                    </div>
                    <div className="text-[11px] text-[#8b8b8b]">{user.email || "Email non disponible"}</div>
                    <div className="text-[10px] text-[#575757] font-mono mt-0.5">{user.referral_code || shortId(user.id)}</div>
                  </td>
                  <td className="py-3 pr-4">
                    {isSelf ? (
                      <span className="text-[11px] text-[#888]">{ROLE_INFO[user.role || ""]?.label || user.role}</span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <select
                          className="auth-input h-[34px] py-1 px-2 text-[12px]"
                          value={selectedRole}
                          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setRoleDraft((c) => ({ ...c, [user.id]: event.target.value }))}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{ROLE_INFO[r].label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!roleChanged || applyingRoleId === user.id}
                          onClick={() => requestRoleChange(user)}
                          className={`text-[11px] h-[34px] px-2.5 rounded-lg border ${
                            roleChanged ? "border-blue-500/35 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25" : "border-white/[0.08] text-[#555] cursor-not-allowed"
                          }`}
                        >
                          Appliquer
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        className="auth-input h-[34px] py-1 px-2 text-[12px] w-[100px]"
                        value={pointsDraft[user.id] ?? "0"}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPointsDraft((c) => ({ ...c, [user.id]: event.target.value }))}
                      />
                      <button
                        type="button"
                        className="btn-secondary h-[34px] px-2.5 text-[11px]"
                        onClick={() => handleSavePoints(user.id)}
                        disabled={savingPointsId === user.id}
                      >
                        {savingPointsId === user.id ? "..." : "OK"}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-2 py-1 text-[11px] text-blue-200">{user.grade || "Starter"}</span>
                  </td>
                  <td className="py-3 pr-4 text-[#999]">{formatDate(user.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {confirm ? (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-5" style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(4px)" } as React.CSSProperties} onClick={() => setConfirm(null)}>
          <div className="celebrate-pop w-full max-w-[400px] rounded-2xl border border-white/[0.1] bg-[#111] p-6" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="flex items-center gap-2.5 mb-3">
              <iconify-icon icon="lucide:shield-alert" style={{ fontSize: "20px", color: confirm.newRole === "admin" ? "#F59E0B" : "#4F8EF7" }} />
              <h3 className="font-venite text-[14px] tracking-wide text-white">CONFIRMER LE CHANGEMENT DE ROLE</h3>
            </div>
            <p className="font-body-readable text-[13px] text-[#a5a5a5] leading-relaxed mb-2">
              {resolveUserDisplayName(confirm.user)} : <span className="text-white font-semibold">{ROLE_INFO[confirm.oldRole]?.label || confirm.oldRole}</span> → <span className="text-white font-semibold">{ROLE_INFO[confirm.newRole]?.label || confirm.newRole}</span>
            </p>
            {confirm.newRole === "admin" ? (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3.5 py-2.5 text-[12px] text-amber-100 font-body-readable mb-4">
                Attention : le role Admin donne un acces complet a la plateforme (utilisateurs, parcours, sessions, parametres).
              </div>
            ) : (
              <p className="font-body-readable text-[12px] text-[#888] mb-4">{ROLE_INFO[confirm.newRole]?.desc}</p>
            )}
            <div className="flex items-center justify-end gap-2.5">
              <button type="button" onClick={() => setConfirm(null)} className="text-[12px] text-[#888] hover:text-white px-3 py-2">Annuler</button>
              <button type="button" onClick={confirmRoleChange} disabled={applyingRoleId === confirm.user.id} className="btn-primary inline-flex items-center gap-2 text-[12px]" style={{ padding: "9px 16px" }}>
                {applyingRoleId === confirm.user.id ? "Application..." : "Confirmer"}
                <iconify-icon icon="lucide:check" style={{ fontSize: "13px" }} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
