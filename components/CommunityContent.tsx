"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import { getPlatformStats, PlatformStatsData } from "../lib/platformStats";
import { getCommunityProjects, CommunityProject } from "../lib/community";
import { getPublicLeaderboard, LeaderboardEntry, getCountryFlag } from "../lib/leaderboard";
import { getMemberSessions, LiveSession } from "../lib/liveSessions";

const EMPTY_STATS: PlatformStatsData = {
  members: null, publishedTracks: null, totalModules: null,
  totalLessons: null, completedLessons: null, submittedProjects: null,
  totalLikes: null, ready: false
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function Avatar({ url, name, size = 36 }: { url: string; name: string; size?: number }) {
  if (url) {
    return <img src={url} alt="" className="rounded-full border border-white/10 object-cover bg-white/[0.03]" style={{ width: size, height: size }} />;
  }
  return (
    <div className="rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center font-semibold text-white" style={{ width: size, height: size, fontSize: size * 0.32 }}>
      {getInitials(name)}
    </div>
  );
}

function formatWhen(value: string | null) {
  if (!value) return "Date a confirmer";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date a confirmer";
  return parsed.toLocaleString("fr-FR", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
}

export default function CommunityContent() {
  const [stats, setStats] = useState<PlatformStatsData>(EMPTY_STATS);
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [topMembers, setTopMembers] = useState<LeaderboardEntry[]>([]);
  const [upcoming, setUpcoming] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      getPlatformStats(supabase),
      getCommunityProjects(supabase, 12),
      getPublicLeaderboard(supabase, 5),
      getMemberSessions(supabase)
    ]).then(([s, p, l, ses]) => {
      setStats(s);
      setProjects(p.projects);
      setTopMembers(l.entries);
      setUpcoming(ses.upcoming.slice(0, 3));
    }).catch(() => {
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: "Membres", value: stats.members, icon: "lucide:users" },
    { label: "Lecons validees", value: stats.completedLessons, icon: "lucide:check-circle" },
    { label: "Projets", value: stats.submittedProjects, icon: "lucide:folder-code" },
    { label: "Likes", value: stats.totalLikes, icon: "lucide:heart", accent: "#f43f5e" }
  ];

  return (
    <main className="pt-[64px]">
      <section className="py-24 md:py-28 px-8">
        <div className="max-w-[1180px] mx-auto space-y-10">
          <div className="text-center">
            <div className="section-label mb-3">COMMUNAUTE</div>
            <h1 className="font-valorax gradient-text" style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}>
              CONSTRUIRE ENSEMBLE
            </h1>
            <p className="font-body-readable text-[14px] text-[#888] mt-3">Les membres, leurs projets et les prochaines sessions live.</p>
          </div>

          {loading ? (
            <div className="text-center text-[13px] text-[#666] font-body-readable py-12">Chargement...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {statCards.map((tile) => (
                  <div key={tile.label} className="rounded-2xl border border-white/[0.08] bg-[#111] px-4 py-4 text-center">
                    <iconify-icon icon={tile.icon} style={{ fontSize: "20px", color: tile.accent || "#4F8EF7" }} />
                    <div className="text-[24px] text-white font-semibold mt-1">{tile.value !== null && Number.isFinite(Number(tile.value)) ? tile.value : "—"}</div>
                    <div className="text-[11px] text-[#666] font-body-readable">{tile.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-venite text-[13px] tracking-widest text-[#888]">PROJETS PUBLIES</h2>
                    <Link href="/projets" className="text-[11px] text-[#4F8EF7] hover:underline">Voir tout</Link>
                  </div>

                  {projects.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((project) => (
                        <Link key={project.id} href={`/projets/${project.id}`} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 card-hover block">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="text-[13px] text-white font-semibold leading-tight">{project.title}</div>
                            {project.hasDeclaredFirstEuro ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shrink-0">
                                <iconify-icon icon="lucide:badge-check" style={{ fontSize: "9px" }} />
                                1er euro
                              </span>
                            ) : null}
                          </div>
                          {project.objective ? <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-snug mb-3">{project.objective}</p> : null}
                          <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.05]">
                            <div className="flex items-center gap-2 min-w-0">
                              <Avatar url={project.avatarUrl} name={project.author} size={26} />
                              <span className="text-[11px] text-[#888] truncate">{project.author}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {project.likeCount > 0 ? (
                                <span className="text-[11px] text-[#888] inline-flex items-center gap-1">
                                  <iconify-icon icon="lucide:heart" style={{ fontSize: "12px" }} />
                                  {project.likeCount}
                                </span>
                              ) : null}
                              {project.liveUrl ? (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#89c7ff] hover:text-white" title="Voir en ligne" onClick={(e) => e.stopPropagation()}>
                                  <iconify-icon icon="lucide:external-link" style={{ fontSize: "14px" }} />
                                </a>
                              ) : null}
                              {project.repoUrl ? (
                                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-[#89c7ff] hover:text-white" title="Code" onClick={(e) => e.stopPropagation()}>
                                  <iconify-icon icon="lucide:github" style={{ fontSize: "14px" }} />
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center font-body-readable text-[13px] text-[#777]">
                      Aucun projet publie pour l instant. Termine un parcours et publie ton projet pour ouvrir le bal.
                    </div>
                  )}
                </section>

                <section className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-venite text-[13px] tracking-widest text-[#888]">TOP MEMBRES</h2>
                      <Link href="/classement" className="text-[11px] text-[#4F8EF7] hover:underline">Classement</Link>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-[#111] divide-y divide-white/[0.05]">
                      {topMembers.length ? (
                        topMembers.map((entry) => (
                          <Link key={entry.rank} href={`/profil/${entry.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                            <span className="w-5 text-center text-[12px] text-[#888] font-semibold">{entry.rank}</span>
                            <Avatar url={entry.avatarUrl} name={entry.publicName} size={30} />
                            <span className="flex-1 min-w-0 text-[12px] text-white font-semibold truncate">{entry.publicName}</span>
                            <span className="text-[11px] text-[#6ec3ff] font-semibold shrink-0">{entry.points} XP</span>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-4 text-[12px] text-[#777] font-body-readable">Le classement se remplira bientot.</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-venite text-[13px] tracking-widest text-[#888] mb-3">SESSIONS A VENIR</h2>
                    <div className="space-y-2.5">
                      {upcoming.length ? (
                        upcoming.map((session) => (
                          <article key={session.id} className="rounded-2xl border border-white/[0.08] bg-[#111] p-4">
                            <div className="text-[13px] text-white font-semibold leading-tight">{session.title}</div>
                            <div className="text-[11px] text-[#89c7ff] font-body-readable inline-flex items-center gap-1.5 mt-1">
                              <iconify-icon icon="lucide:calendar-clock" style={{ fontSize: "12px" }} />
                              {formatWhen(session.scheduledAt)}
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-white/[0.08] bg-[#111] px-4 py-4 text-[12px] text-[#777] font-body-readable">
                          Pas de session programmee pour le moment.
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
