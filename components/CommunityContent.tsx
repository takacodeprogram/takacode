"use client";

import { useEffect, useState } from "react";
import L from "./L";
import { createClient } from "../utils/supabase/client";
import { getPlatformStats, PlatformStatsData } from "../lib/platformStats";
import { getCommunityProjects, CommunityProject, getProjectComments, ProjectComment } from "../lib/community";
import { getPublicLeaderboard, LeaderboardEntry } from "../lib/leaderboard";
import { getMemberSessions, LiveSession } from "../lib/liveSessions";

const EMPTY_STATS: PlatformStatsData = {
  members: null, publishedTracks: null, totalModules: null,
  totalLessons: null, completedLessons: null, submittedProjects: null,
  totalLikes: null, ready: false
};

type ProjectFilter = "all" | "published" | "in_progress";

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

function formatRelative(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "a l'instant";
  if (diffMins < 60) return `il y a ${diffMins} min`;
  if (diffHours < 24) return `il y a ${diffHours} h`;
  if (diffDays < 7) return `il y a ${diffDays} j`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

interface ActivityItem {
  id: string;
  type: "project_published" | "first_euro" | "lesson_completed" | "project_created";
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  authorId: string;
  projectId?: string;
  projectTitle?: string;
  createdAt: string;
}

export default function CommunityContent() {
  const [stats, setStats] = useState<PlatformStatsData>(EMPTY_STATS);
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [topMembers, setTopMembers] = useState<LeaderboardEntry[]>([]);
  const [upcoming, setUpcoming] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectFilter>("published");
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, ProjectComment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();

    Promise.all([
      getPlatformStats(supabase),
      getCommunityProjects(supabase, 20),
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

  const loadComments = async (projectId: string) => {
    if (comments[projectId] || showComments[projectId]) return;
    const supabase = createClient();
    const { comments: loaded } = await getProjectComments(supabase, projectId);
    setComments(prev => ({ ...prev, [projectId]: loaded }));
    setShowComments(prev => ({ ...prev, [projectId]: true }));
  };

  const handleSubmitComment = async (projectId: string, e: React.FormEvent) => {
    e.preventDefault();
    const content = newComment[projectId]?.trim();
    if (!content) return;
    const supabase = createClient();
    const { data: comment, error } = await supabase.rpc("create_project_comment", { p_project_id: projectId, p_content: content });
    if (!error && comment) {
      setComments(prev => ({ ...prev, [projectId]: [...(prev[projectId] || []), comment] }));
      setNewComment(prev => ({ ...prev, [projectId]: "" }));
    }
  };

  const filteredProjects = projects.filter(p => {
    if (filter === "published") return p.liveUrl && p.liveUrl.length > 0;
    if (filter === "in_progress") return !p.liveUrl || p.liveUrl.length === 0;
    return true;
  });

  const statCards = [
    { label: "Membres", value: stats.members, icon: "lucide:users" },
    { label: "Leçons validées", value: stats.completedLessons, icon: "lucide:check-circle" },
    { label: "Projets", value: stats.submittedProjects, icon: "lucide:folder-code" },
    { label: "Likes", value: stats.totalLikes, icon: "lucide:heart", accent: "#f43f5e" }
  ];

  return (
    <main className="pt-[64px]">
      <section className="py-24 md:py-28 px-8">
        <div className="max-w-[1180px] mx-auto space-y-10">
          <div className="text-center">
            <div className="section-label mb-3">Communauté</div>
            <h1 className="font-valorax gradient-text" style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}>
              Construire ensemble
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

              {/* Activity Feed */}
              <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
                <div className="font-venite text-[13px] tracking-widest text-[#888] mb-4">ACTIVITE RECENTE</div>
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project, i) => (
                    <L key={project.id} href={`/projects/${project.id}`} className="flex items-center gap-3 rounded-lg p-3 hover:bg-white/[0.02] transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
                        <iconify-icon icon={project.liveUrl ? "lucide:globe" : "lucide:hammer"} className="text-[#4F8EF7]" style={{ fontSize: "18px" }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] text-white font-semibold truncate">{project.title}</div>
                        <div className="text-[10px] text-[#666] flex items-center gap-2">
                          <span>{project.author}</span>
                          <span>·</span>
                          <span>{formatRelative(project.firstEuroAt)}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${project.liveUrl ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-white/[0.12] bg-white/[0.03] text-[#888]"}`}>
                        {project.liveUrl ? "En ligne" : "En cours"}
                      </span>
                    </L>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center text-[12px] text-[#666] py-4">Aucune activité récente. Publie ton premier projet !</div>
                  )}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-venite text-[13px] tracking-widest text-[#888]">PROJETS COMMUNAUTAIRES</h2>
                    <div className="flex items-center gap-2">
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as ProjectFilter)}
                        className="auth-input text-[12px] bg-[#111] border-white/[0.08] px-3 py-1.5 rounded-lg"
                      >
                        <option value="published">Publiés</option>
                        <option value="in_progress">En cours</option>
                        <option value="all">Tous</option>
                      </select>
                      <L href="/projects" className="text-[11px] text-[#4F8EF7] hover:underline">Voir tout</L>
                    </div>
                  </div>

                  {filteredProjects.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredProjects.map((project) => {
                        const projectComments = comments[project.id] || [];
                        const isOpen = showComments[project.id];
                        return (
                          <article key={project.id} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 card-hover">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="text-[13px] text-white font-semibold leading-tight">{project.title}</div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {project.liveUrl && project.liveUrl.length > 0 && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                                    <iconify-icon icon="lucide:globe" style={{ fontSize: "8px" }} />
                                    En ligne
                                  </span>
                                )}
                                {project.hasDeclaredFirstEuro ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shrink-0">
                                    <iconify-icon icon="lucide:badge-check" style={{ fontSize: "8px" }} />
                                    1er euro
                                  </span>
                                ) : null}
                                {!project.liveUrl && !project.hasDeclaredFirstEuro && (
                                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-white/[0.12] bg-white/[0.03] text-[#888]">
                                    En cours
                                  </span>
                                )}
                              </div>
                            </div>
                            {project.objective ? <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-snug mb-3">{project.objective}</p> : null}

                            <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.05] mb-3">
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

                            {/* Comments section */}
                            <div className="border-t border-white/[0.05] pt-3">
                              <button
                                onClick={() => loadComments(project.id)}
                                className="flex items-center gap-1.5 text-[11px] text-[#4F8EF7] hover:underline mb-2"
                              >
                                <iconify-icon icon="lucide:message-square" style={{ fontSize: "13px" }} />
                                {isOpen ? "Masquer" : "Afficher"} les commentaires ({projectComments.length})
                              </button>

                              {isOpen && (
                                <div className="space-y-2.5">
                                  {projectComments.map((comment) => (
                                    <div key={comment.id} className="rounded-lg bg-white/[0.02] p-3">
                                      <div className="flex items-start gap-2 mb-1">
                                        <Avatar url={comment.authorAvatar} name={comment.author} size={24} />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 text-[11px] mb-1">
                                            <span className="font-semibold text-white">{comment.author}</span>
                                            <span className="text-[#666]">{formatRelative(comment.createdAt)}</span>
                                          </div>
                                          <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-snug">{comment.content}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {projectComments.length === 0 && (
                                    <p className="text-[11px] text-[#666] font-body-readable text-center py-2">Aucun commentaire pour l'instant.</p>
                                  )}
                                  <form onSubmit={(e) => handleSubmitComment(project.id, e)} className="flex gap-2 mt-2">
                                    <input
                                      type="text"
                                      value={newComment[project.id] || ""}
                                      onChange={(e) => setNewComment(prev => ({ ...prev, [project.id]: e.target.value }))}
                                      placeholder="Ajouter un commentaire..."
                                      className="auth-input text-[12px] flex-1"
                                      maxLength={500}
                                    />
                                    <button type="submit" className="btn-primary text-[11px] px-3" style={{ padding: "8px 12px" }}>
                                      Envoyer
                                    </button>
                                  </form>
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center font-body-readable text-[13px] text-[#777]">
                      Aucun projet pour ce filtre. Change le filtre ou cree ton projet !
                    </div>
                  )}
                </section>

                <section className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-venite text-[13px] tracking-widest text-[#888]">TOP MEMBRES</h2>
                      <L href="/leaderboard" className="text-[11px] text-[#4F8EF7] hover:underline">Classement</L>
                    </div>
                    <div className="rounded-2xl border border-white/[0.08] bg-[#111] divide-y divide-white/[0.05]">
                      {topMembers.length ? (
                        topMembers.map((entry) => (
                          <L key={entry.rank} href={`/profile/${entry.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                            <span className="w-5 text-center text-[12px] text-[#888] font-semibold">{entry.rank}</span>
                            <Avatar url={entry.avatarUrl} name={entry.publicName} size={30} />
                            <span className="flex-1 min-w-0 text-[12px] text-white font-semibold truncate">{entry.publicName}</span>
                            <span className="text-[11px] text-[#6ec3ff] font-semibold shrink-0">{entry.points} XP</span>
                          </L>
                        ))
                      ) : (
                        <div className="px-4 py-4 text-[12px] text-[#777] font-body-readable">Le classement se remplira bientôt.</div>
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