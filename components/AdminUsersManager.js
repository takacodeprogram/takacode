"use client";

import { useMemo, useState } from "react";
import { createClient } from "../utils/supabase/client";

const ROLE_OPTIONS = ["user", "mentor", "admin"];

function shortId(value) {
  if (typeof value !== "string" || value.length < 10) {
    return value || "-";
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function buildInitialDrafts(users) {
  const entries = users.map((user) => [
    user.id,
    {
      role: typeof user.role === "string" ? user.role : "user",
      points: String(Number(user.points ?? 0))
    }
  ]);

  return Object.fromEntries(entries);
}

export default function AdminUsersManager({ initialUsers = [] }) {
  const supabase = useMemo(() => createClient(), []);
  const [users, setUsers] = useState(Array.isArray(initialUsers) ? initialUsers : []);
  const [drafts, setDrafts] = useState(() => buildInitialDrafts(Array.isArray(initialUsers) ? initialUsers : []));
  const [savingId, setSavingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSave(userId) {
    const draft = drafts[userId];

    if (!draft) {
      return;
    }

    const role = ROLE_OPTIONS.includes(draft.role) ? draft.role : "user";
    const points = Math.max(0, Number.parseInt(String(draft.points), 10) || 0);

    setSavingId(userId);
    setErrorMessage("");
    setSuccessMessage("");

    const { data, error } = await supabase
      .from("user_profiles")
      .update({ role, points })
      .eq("id", userId)
      .select("id, role, points, grade, referral_code, referred_by, created_at, updated_at")
      .single();

    if (error) {
      setErrorMessage(error.message);
      setSavingId("");
      return;
    }

    setUsers((currentUsers) => currentUsers.map((user) => (user.id === userId ? { ...user, ...data } : user)));
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [userId]: {
        role: data.role,
        points: String(data.points)
      }
    }));

    setSuccessMessage("Profil mis a jour.");
    setSavingId("");
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-valorax text-xl">ADMINISTRER LES UTILISATEURS</h2>
          <p className="text-[12px] text-[#777] font-body-readable mt-1">
            Ajuste les roles et les points. Le grade se met a jour automatiquement.
          </p>
        </div>
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[11px] text-[#bbb]">
          {users.length} utilisateur(s)
        </div>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">
          {successMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-widest text-[#666] border-b border-white/[0.06]">
              <th className="py-3 pr-4">Utilisateur</th>
              <th className="py-3 pr-4">Code referral</th>
              <th className="py-3 pr-4">Role</th>
              <th className="py-3 pr-4">Points</th>
              <th className="py-3 pr-4">Grade</th>
              <th className="py-3 pr-4">Inscription</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const draft = drafts[user.id] || { role: "user", points: "0" };
              const isSaving = savingId === user.id;

              return (
                <tr key={user.id} className="border-b border-white/[0.04] text-[13px] text-[#d5d5d5]">
                  <td className="py-3 pr-4 font-body-readable">
                    <div className="font-semibold text-white">{shortId(user.id)}</div>
                    <div className="text-[11px] text-[#666]">{user.id}</div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-[12px]">{user.referral_code || "-"}</td>
                  <td className="py-3 pr-4">
                    <select
                      className="auth-input h-[36px] py-1 px-2 text-[12px]"
                      value={draft.role}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDrafts((currentDrafts) => ({
                          ...currentDrafts,
                          [user.id]: {
                            ...currentDrafts[user.id],
                            role: value
                          }
                        }));
                      }}
                    >
                      {ROLE_OPTIONS.map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                          {roleOption}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      type="number"
                      min="0"
                      className="auth-input h-[36px] py-1 px-2 text-[12px] w-[120px]"
                      value={draft.points}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDrafts((currentDrafts) => ({
                          ...currentDrafts,
                          [user.id]: {
                            ...currentDrafts[user.id],
                            points: value
                          }
                        }));
                      }}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-2 py-1 text-[11px] text-blue-200">
                      {user.grade || "Starter"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[#999]">{formatDate(user.created_at)}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="btn-secondary h-[36px] px-3 text-[11px]"
                      onClick={() => handleSave(user.id)}
                      disabled={isSaving}
                    >
                      {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
