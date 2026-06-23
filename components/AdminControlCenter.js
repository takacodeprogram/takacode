"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminTracksManager from "./AdminTracksManager";
import AdminUsersManager from "./AdminUsersManager";

const TABS = [
  { id: "overview", label: "Vue globale", icon: "lucide:layout-dashboard" },
  { id: "users", label: "Utilisateurs", icon: "lucide:users" },
  { id: "tracks", label: "Parcours", icon: "lucide:route" }
];

function isRoleAdmin(role) {
  return String(role || "").trim().toLowerCase() === "admin";
}

export default function AdminControlCenter({
  users = [],
  tracks = [],
  usersSchemaReady = true,
  tracksSchemaReady = true,
  usersError = "",
  tracksError = "",
  appUrl = "https://takacode.vercel.app",
  showPitchDeck = true
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const metrics = useMemo(() => {
    const listUsers = Array.isArray(users) ? users : [];
    const listTracks = Array.isArray(tracks) ? tracks : [];

    return {
      users: listUsers.length,
      admins: listUsers.filter((entry) => isRoleAdmin(entry?.role)).length,
      activeTracks: listTracks.filter((entry) => entry?.is_active !== false && entry?.isActive !== false).length,
      publishedTracks: listTracks.filter((entry) => entry?.is_published === true || entry?.isPublished === true).length
    };
  }, [users, tracks]);

  const systemIssues = useMemo(() => {
    const issues = [];

    if (!usersSchemaReady) {
      issues.push("Table user_profiles manquante. Lance supabase/sql/001_roles_points_referrals.sql puis supabase/sql/002_bootstrap_admin.sql.");
    }

    if (!tracksSchemaReady) {
      issues.push("Table learning_tracks manquante. Lance supabase/sql/003_learning_tracks.sql.");
    }

    if (usersError) {
      issues.push(`Erreur users: ${usersError}`);
    }

    if (tracksError) {
      issues.push(`Erreur parcours: ${tracksError}`);
    }

    if (tracksSchemaReady && !tracksError && (!Array.isArray(tracks) || tracks.length === 0)) {
      issues.push("Aucun parcours visible. Verifie les donnees learning_tracks et les policies RLS admin.");
    }

    return issues;
  }, [usersSchemaReady, tracksSchemaReady, usersError, tracksError, tracks]);

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6 space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12px] font-semibold transition-colors",
              activeTab === tab.id
                ? "border-blue-500/35 bg-blue-500/15 text-blue-100"
                : "border-white/[0.1] bg-white/[0.02] text-[#bcbcbc] hover:bg-white/[0.05]"
            ].join(" ")}
          >
            <iconify-icon icon={tab.icon} style={{ fontSize: "13px" }} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
              <div className="text-[10px] text-[#666] uppercase tracking-widest">Utilisateurs</div>
              <div className="text-[20px] text-white font-semibold mt-1">{metrics.users}</div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
              <div className="text-[10px] text-[#666] uppercase tracking-widest">Admins</div>
              <div className="text-[20px] text-white font-semibold mt-1">{metrics.admins}</div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
              <div className="text-[10px] text-[#666] uppercase tracking-widest">Parcours actifs</div>
              <div className="text-[20px] text-white font-semibold mt-1">{metrics.activeTracks}</div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
              <div className="text-[10px] text-[#666] uppercase tracking-widest">Publies</div>
              <div className="text-[20px] text-white font-semibold mt-1">{metrics.publishedTracks}</div>
            </div>
          </div>

          {systemIssues.length ? (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
              <div className="text-[12px] text-amber-100 font-semibold mb-1">Action requise</div>
              <div className="space-y-1.5">
                {systemIssues.map((issue) => (
                  <p key={issue} className="text-[12px] text-amber-100/90 font-body-readable">
                    {issue}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200 font-body-readable">
              Systeme pret. Tu peux tout piloter depuis ce dashboard.
            </div>
          )}

          <div className="flex flex-wrap gap-2.5">
            {showPitchDeck ? (
              <a href="/api/admin/pitch-deck" className="btn-primary">
                Telecharger le pitch
              </a>
            ) : null}
            <a href={appUrl} target="_blank" rel="noreferrer" className="btn-secondary">
              Ouvrir l'app deployee
            </a>
            <Link href="/admin" className="btn-secondary">
              Ouvrir la page /admin
            </Link>
          </div>
        </div>
      ) : null}

      {activeTab === "users" ? (
        <div className="space-y-3">
          {!usersSchemaReady ? (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
              Table user_profiles manquante. Lance d'abord les scripts SQL d'initialisation.
            </div>
          ) : null}

          {usersError ? (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200 font-body-readable">
              {usersError}
            </div>
          ) : null}

          {usersSchemaReady && !usersError ? <AdminUsersManager initialUsers={users} /> : null}
        </div>
      ) : null}

      {activeTab === "tracks" ? (
        <div className="space-y-3">
          {!tracksSchemaReady ? (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
              Table learning_tracks manquante. Lance supabase/sql/003_learning_tracks.sql.
            </div>
          ) : null}

          {tracksError ? (
            <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200 font-body-readable">
              {tracksError}
            </div>
          ) : null}

          {tracksSchemaReady && !tracksError ? <AdminTracksManager initialTracks={tracks} /> : null}
        </div>
      ) : null}
    </section>
  );
}

