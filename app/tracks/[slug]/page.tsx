import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import FooterSection from "../../../components/FooterSection";
import Navbar from "../../../components/Navbar";
import PublicTour from "../../../components/public-tour/PublicTour";
import {
  buildStepRows,
  buildTrackCompetencies,
  getLevelChipClass,
  getStepUi,
  toProgress,
  toTextList
} from "../../../lib/track-helpers";
import { getTrackCurriculum } from "../../../lib/curriculum";
import { buildPageMetadata } from "../../../lib/seo";
import { getServerLocale } from "../../../lib/serverLocale";
import { localePath } from "../../../lib/localeHelpers";
import { getLocale, type Locale } from "../../../lib/i18n";
import { formatTrackMeta, listPublishedTracks, listUserTrackEnrollments } from "../../../lib/tracks";
import { listOwnProjects } from "../../../lib/userProjects";
import { missingPrerequisites } from "../../../lib/trackGuidance";
import { createClient } from "../../../utils/supabase/server";
import { buildSprintMilestones, computeProjectProgress, getSprintStatusChip, getSprintStatusLabel } from "../../../lib/milestones";
import { listAffiliatesByTrack, categoryLabel } from "../../../lib/affiliate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ParcoursPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchTrackData(slug: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const allTracksResult = await listPublishedTracks(supabase);
  const allTracks = allTracksResult.tracks;
  const track = allTracks.find((item) => String(item.slug || "").trim().toLowerCase() === slug) || null;
  return { track, supabase };
}

export async function generateMetadata({ params }: ParcoursPageProps) {
  const resolvedParams = await params;
  const slug = String(resolvedParams?.slug || "").trim().toLowerCase();
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const { track } = await fetchTrackData(slug);

  if (!track) {
    return buildPageMetadata({
      title: t("trackDetail.notFound.title"),
      description: t("trackDetail.notFound.description"),
      path: `/tracks/${slug}`,
      noIndex: true
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://takacode.vercel.app";
  const ogImage = track.accentColor
    ? `${siteUrl}/api/og?title=${encodeURIComponent(track.title)}&color=${encodeURIComponent(track.accentColor)}`
    : `${siteUrl}/og-default.png`;
  const metaDesc = track.description || track.summary || t("trackDetail.defaultDescription");

  return buildPageMetadata({
    title: `${track.title} — TakaCode`,
    description: metaDesc,
    path: `/tracks/${slug}`,
    openGraph: {
      title: track.title,
      description: metaDesc,
      url: `${siteUrl}/tracks/${slug}`,
      siteName: "TakaCode",
      locale: locale === "en" ? "en_US" : "fr_FR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: track.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: track.title,
      description: metaDesc,
      images: [ogImage]
    }
  });
}

export default async function ParcoursDetailPage({ params }: ParcoursPageProps) {
  const resolvedParams = await params;
  const slug = String(resolvedParams?.slug || "").trim().toLowerCase();

  if (!slug) {
    notFound();
  }

  let user;
  let supabase;

  try {
    const cookieStore = await cookies();
    supabase = await createClient(cookieStore);
    const { data: { user: u } } = await supabase.auth.getUser();
    user = u;
  } catch {
    return <GuestCTA />;
  }

  if (!user) return <GuestCTA />;

  const localeP = await getServerLocale();
  const locale = localeP;
  const { t } = getLocale(locale);

  const allTracksResult = await listPublishedTracks(supabase);
  const allTracks = allTracksResult.tracks;
  const track = allTracks.find((item) => String(item.slug || "").trim().toLowerCase() === slug) || null;

  if (!track && allTracksResult.schemaReady && !allTracksResult.error) {
    notFound();
  }

  const myEnrollmentsResult = user
    ? await listUserTrackEnrollments(supabase, user.id, { limit: 32 })
    : { enrollments: [], schemaReady: allTracksResult.schemaReady, error: null };

  const schemaReady = allTracksResult.schemaReady && myEnrollmentsResult.schemaReady;
  const hasError = Boolean(allTracksResult.error || myEnrollmentsResult.error);

  const enrollment = track
    ? myEnrollmentsResult.enrollments.find((entry) => entry.trackId === track.id) || null
    : null;

  const startedSlugs = new Set(myEnrollmentsResult.enrollments.map((entry) => entry.track?.slug).filter(Boolean));
  const trackTitleBySlug = Object.fromEntries(allTracks.map((item) => [item.slug, item.title]));
  const missingPrereqs = track ? missingPrerequisites(track.slug, startedSlugs, trackTitleBySlug) : [];

  const curriculum = track ? await getTrackCurriculum(supabase, track.id, user?.id || "") : null;
  const hasCurriculum = Boolean(curriculum?.hasCurriculum);

  const progress = user && hasCurriculum ? toProgress(curriculum!.progressPercent) : toProgress(enrollment?.progress);
  const isMine = Boolean(enrollment);

  const continueHref = track && curriculum?.nextLesson
    ? `/tracks/${track.slug}/lesson/${curriculum.nextLesson.lessonSlug}`
    : "/dashboard";

  const competencies = track ? buildTrackCompetencies(track) : [];
  const stepRows = track ? buildStepRows(track) : [];
  const resources = track ? toTextList(track.resources, 4) : [];
  const description = track ? String(track.description || track.summary || "").trim() : "";

  const trackAffiliates = track ? (await listAffiliatesByTrack(supabase, track.slug)).links : [];

  const myProjects = user ? (await listOwnProjects(supabase, user.id, { limit: 10 })).projects : [];
  const trackProject = myProjects.find((p) => p.trackId === track?.id) || null;
  const hasProject = Boolean(trackProject);

  const sprints = curriculum ? buildSprintMilestones(curriculum.modules, trackProject) : [];
  const projectProgress = computeProjectProgress(sprints);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[1320px] mx-auto space-y-8">
            <div className="flex items-center gap-3 flex-wrap">
              <Link href={localePath("/tracks", localeP)} className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "9px 14px" }}>
                <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "13px" }} />
                {t("trackDetail.back")}
              </Link>
              {track ? (
                <span className="text-[11px] text-[#7d7d7d] font-body-readable">/{track.slug}</span>
              ) : null}
            </div>

            {!schemaReady ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100">
                {t("trackDetail.schemaNotReady")}
              </div>
            ) : null}

            {hasError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">
                {t("trackDetail.loadError")}
              </div>
            ) : null}

            {track ? (
              <article className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 md:p-7 card-hover project-card">
                <div className="flex items-start justify-between gap-5 flex-wrap mb-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl border flex items-center justify-center"
                      style={{
                        borderColor: `${track.accentColor}55`,
                        background: `${track.accentColor}1f`
                      }}
                    >
                      <iconify-icon icon={track.icon} style={{ color: track.accentColor, fontSize: "22px" }} />
                    </div>

                    <div>
                      <h1 className="font-venite-italic text-[20px] text-white leading-tight mb-1">{track.title}</h1>
                      <p className="font-body-readable text-[12px] text-[#7a7a7a]">{formatTrackMeta(track)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap justify-end">
                    {isMine ? (
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-blue-400/35 bg-blue-500/15 text-blue-200">
                        {t("trackDetail.myTrack")}
                      </span>
                    ) : null}
                    <span className={`${getLevelChipClass(track.levelLabel)} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                      {track.levelLabel}
                    </span>
                    {isMine && sprints.length > 0 ? (
                      <div className="min-w-[140px] rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5">
                        <div className="flex items-center justify-between text-[10px] text-[#89c7ff] font-semibold mb-1">
                          <span>{t("trackDetail.project")}</span>
                          <span>{projectProgress}%</span>
                        </div>
                        <div className="h-1 rounded bg-white/[0.07] overflow-hidden mb-1">
                          <div
                            className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]"
                            style={{ width: `${projectProgress}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-[#666] text-center">
                          {t("trackDetail.sprintCount").replace("{cleared}", String(sprints.filter((s) => s.cleared).length)).replace("{total}", String(sprints.length))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
                  <div className="space-y-5">
                    <p className="font-body-readable text-[13px] text-[#a5a5a5] leading-relaxed">{description}</p>

                    {missingPrereqs.length ? (
                      <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.08] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <iconify-icon icon="lucide:lightbulb" style={{ fontSize: "15px", color: "#fbbf24" }} />
                          <span className="font-venite-italic text-[11px] tracking-widest text-amber-200">{t("trackDetail.orderAdvice.title")}</span>
                        </div>
                        <p className="font-body-readable text-[12px] text-amber-100/90 leading-relaxed mb-3">
                          {t("trackDetail.orderAdvice.description")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {missingPrereqs.map((prereq) => (
                            <Link
                              key={prereq.slug}
                              href={localePath(`/tracks/${prereq.slug}`, localeP)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20 transition-colors"
                            >
                              {prereq.title}
                              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
                            </Link>
                          ))}
                        </div>
                        <p className="font-body-readable text-[10px] text-amber-200/60 mt-2.5">
                          {t("trackDetail.orderAdvice.note")}
                        </p>
                      </div>
                    ) : null}

                    <div>
                      <h2 className="font-venite-italic text-[12px] tracking-widest text-[#4F8EF7] mb-3">{t("trackDetail.competenciesTitle")}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {competencies.map((competence) => (
                          <div
                            key={`${track.id}-comp-${competence}`}
                            className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 flex items-center gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200 inline-flex items-center justify-center">
                              <iconify-icon icon="lucide:check" style={{ fontSize: "11px" }} />
                            </span>
                            <span className="font-body-readable text-[11px] text-[#c7c7c7] leading-snug">{competence}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-2">{t("trackDetail.objectiveTitle")}</div>
                      <p className="font-body-readable text-[12px] text-[#b3b3b3] leading-relaxed">{track.objective}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isMine ? (
                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-venite-italic text-[11px] tracking-widest text-[#89c7ff]">{t("trackDetail.myProject.title")}</div>
                          {hasProject ? (
                            <Link href={localePath(`/dashboard/projects/${trackProject!.id}`, localeP)} className="text-[10px] text-[#89c7ff] hover:underline">
                              {t("trackDetail.myProject.edit")}
                            </Link>
                          ) : null}
                        </div>
                        {hasProject ? (
                          <div className="space-y-2">
                            <div className="text-[13px] text-white font-semibold">{trackProject!.title}</div>
                            <div className="text-[11px] text-[#888] font-body-readable leading-relaxed">
                              {trackProject!.description || t("trackDetail.myProject.noDescription")}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-200">
                                {trackProject!.status === "published" ? t("trackDetail.myProject.statusPublished") : t("trackDetail.myProject.statusInProgress")}
                              </span>
                              {trackProject!.repoUrl ? (
                                <a href={trackProject!.repoUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#888] hover:text-blue-200 inline-flex items-center gap-1">
                                  <iconify-icon icon="lucide:github" style={{ fontSize: "11px" }} />
                                  Repo
                                </a>
                              ) : null}
                              {trackProject!.liveUrl ? (
                                <a href={trackProject!.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#888] hover:text-blue-200 inline-flex items-center gap-1">
                                  <iconify-icon icon="lucide:external-link" style={{ fontSize: "11px" }} />
                                  Live
                                </a>
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#666] font-body-readable mb-3">
                            {t("trackDetail.myProject.noProject")}
                          </div>
                        )}
                        <Link
                          href={localePath(`/dashboard/projects/${hasProject ? trackProject!.id : "new?track=" + track.id}`, localeP)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-lg border border-blue-400/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 transition-all mt-2"
                        >
                          <iconify-icon icon={hasProject ? "lucide:folder-code" : "lucide:plus"} style={{ fontSize: "12px" }} />
                          {hasProject ? t("trackDetail.myProject.viewProject") : t("trackDetail.myProject.createProject")}
                        </Link>
                      </div>
                    ) : null}

                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-3">{t("trackDetail.progressionPlan")}</div>
                      <div className="space-y-2.5">
                        {stepRows.map((step, index) => {
                          const ui = getStepUi(step.state);
                          return (
                            <div
                              key={`${track.id}-step-${step.label}`}
                              className="rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 flex items-center gap-2.5"
                            >
                              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${ui.chip}`}>
                                <iconify-icon icon={ui.icon} style={{ fontSize: "11px" }} />
                              </span>
                              <div className="flex-1">
                                <div className="font-body-readable text-[11px] text-[#d0d0d0] leading-snug">{step.label}</div>
                                <div className="text-[10px] text-[#666]">{t("trackDetail.stepLabel").replace("{n}", String(index + 1))}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-3">{t("trackDetail.resourcesTitle")}</div>
                      <div className="space-y-2">
                        {(resources.length ? resources : [t("trackDetail.resourcesPreparing")]).map((resource) => (
                          <div key={`${track.id}-resource-${resource}`} className="flex items-center gap-2 text-[11px] text-[#9b9b9b] font-body-readable">
                            <iconify-icon icon="lucide:file-text" style={{ fontSize: "12px", color: "#7f7f7f" }} />
                            <span>{resource}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {trackAffiliates.length ? (
                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                        <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-3">{t("trackDetail.partnersTitle")}</div>
                        <div className="space-y-2.5">
                          {trackAffiliates.map((aff) => (
                            <a
                              key={aff.id}
                              href={aff.url}
                              target="_blank"
                              rel="sponsored noopener noreferrer"
                              className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.01] p-3 card-hover"
                            >
                              <div className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center shrink-0 overflow-hidden">
                                {aff.logoUrl ? (
                                  <img src={aff.logoUrl} alt="" className="w-full h-full object-contain" />
                                ) : (
                                  <iconify-icon icon="lucide:external-link" style={{ fontSize: "14px", color: "#89c7ff" }} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[12px] text-white font-semibold leading-tight">{aff.title || aff.provider}</div>
                                {aff.description ? <p className="font-body-readable text-[10px] text-[#9b9b9b] leading-snug mt-0.5">{aff.description}</p> : null}
                              </div>
                            </a>
                          ))}
                        </div>
                        <p className="text-[9px] text-[#555] font-body-readable mt-2">{t("trackDetail.partnersAffiliateNotice")}</p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {hasCurriculum ? (
                  <div className="mt-8">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                      <div>
                        <h2 className="font-venite-italic text-[13px] tracking-widest text-[#4F8EF7]">{t("trackDetail.sprints.title")}</h2>
                        <p className="text-[11px] text-[#7a7a7a] font-body-readable mt-0.5">
                          {t("trackDetail.sprints.description")}
                        </p>
                      </div>
                      <span className="text-[10px] text-[#7a7a7a] font-body-readable">
                        {t("trackDetail.sprints.accomplished").replace("{cleared}", String(sprints.filter((s) => s.cleared).length)).replace("{total}", String(sprints.length))}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {sprints.map((sprint) => (
                        <div
                          key={`sprint-${sprint.moduleIndex}`}
                          className={`rounded-xl border p-4 ${
                            sprint.state === "completed"
                              ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                              : sprint.state === "current"
                                ? "border-blue-500/20 bg-blue-500/[0.03]"
                                : "border-white/[0.06] bg-white/[0.01]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-[12px] font-semibold shrink-0 ${
                                sprint.state === "completed"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                                  : sprint.state === "locked"
                                    ? "border-white/[0.12] bg-white/[0.03] text-[#7a7a7a]"
                                    : "border-blue-500/30 bg-blue-500/10 text-blue-200"
                              }`}>
                                {sprint.state === "locked" ? (
                                  <iconify-icon icon="lucide:lock" style={{ fontSize: "11px" }} />
                                ) : sprint.state === "completed" ? (
                                  <iconify-icon icon="lucide:check" style={{ fontSize: "12px" }} />
                                ) : (
                                  sprint.sprintNumber
                                )}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] text-[#666] font-semibold">{t("trackDetail.sprints.sprint").replace("{n}", String(sprint.sprintNumber))}</span>
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getSprintStatusChip(sprint.state)}`}>
                                    {getSprintStatusLabel(sprint.state)}
                                  </span>
                                </div>
                                <div className="font-venite-italic text-[14px] text-white leading-tight mt-0.5">{sprint.title}</div>
                                <div className="text-[12px] text-[#89c7ff] font-body-readable mt-1">
                                  {t("trackDetail.sprints.deliverable").replace("{deliverable}", sprint.deliverable)}
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                  <div className="flex-1 max-w-[160px]">
                                    <div className="h-1.5 rounded bg-white/[0.07] overflow-hidden">
                                      <div
                                        className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF] transition-all"
                                        style={{ width: `${sprint.totalLessons > 0 ? Math.floor((sprint.completedLessons / sprint.totalLessons) * 100) : 0}%` }}
                                      />
                                    </div>
                                  </div>
                                  <span className="text-[10px] text-[#666]">
                                    {t("trackDetail.sprints.lessonCount").replace("{completed}", String(sprint.completedLessons)).replace("{total}", String(sprint.totalLessons))}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {sprint.state === "current" ? (
                              <Link
                                href={localePath(`/tracks/${track.slug}/lesson/${curriculum!.modules[sprint.moduleIndex].lessons.find((l) => l.state === "current" || l.state === "available")?.slug || curriculum!.modules[sprint.moduleIndex].lessons[0]?.slug || ""}`, localeP)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-lg border border-blue-400/30 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20 transition-all shrink-0"
                              >
                                <iconify-icon icon="lucide:play-circle" style={{ fontSize: "12px" }} />
                                {t("trackDetail.sprints.continue")}
                              </Link>
                            ) : sprint.state === "locked" ? (
                              // Un sprint verrouille n'est pas un lien : pas de onClick
                              // (fonction non serialisable depuis un composant serveur).
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[#555] cursor-not-allowed shrink-0">
                                <iconify-icon icon="lucide:lock" style={{ fontSize: "12px" }} />
                                {t("trackDetail.sprints.locked")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 shrink-0">
                                <iconify-icon icon="lucide:check-circle" style={{ fontSize: "12px" }} />
                                {t("trackDetail.sprints.completed")}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {user ? (
                    <>
                      <Link href={localePath(continueHref, localeP)} className="btn-primary glow-btn inline-flex items-center gap-2 text-[13px]" style={{ padding: "12px 22px" }}>
                        <iconify-icon icon={isMine || (hasCurriculum && curriculum!.completedLessons > 0) ? "lucide:play-circle" : "lucide:play"} style={{ fontSize: "15px" }} />
                        {isMine || (hasCurriculum && curriculum!.completedLessons > 0) ? t("trackDetail.cta.continueProject") : t("trackDetail.cta.startProject")}
                      </Link>
                      {hasProject ? (
                        <Link href={localePath(`/dashboard/projects/${trackProject!.id}`, localeP)} className="inline-flex items-center gap-1.5 text-[12px] text-[#888] hover:text-white transition-colors">
                          <iconify-icon icon="lucide:folder-code" style={{ fontSize: "13px" }} />
                          {t("trackDetail.cta.manageProject")}
                        </Link>
                      ) : (
                        <Link href={localePath(`/dashboard/projects/new?track=${track.id}`, localeP)} className="inline-flex items-center gap-1.5 text-[12px] text-[#888] hover:text-white transition-colors">
                          <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
                          {t("trackDetail.cta.createProject")}
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link href={localePath("/signup?next=/dashboard", localeP)} className="btn-primary glow-btn inline-flex items-center gap-2 text-[13px]" style={{ padding: "12px 22px" }}>
                        <iconify-icon icon="lucide:play" style={{ fontSize: "15px" }} />
                        {t("trackDetail.cta.startTrack")}
                      </Link>
                      <Link href={localePath("/signin?next=/dashboard", localeP)} className="inline-flex items-center gap-1.5 text-[12px] text-[#888] hover:text-white transition-colors">
                        <iconify-icon icon="lucide:log-in" style={{ fontSize: "13px" }} />
                        {t("trackDetail.cta.haveAccount")}
                      </Link>
                    </>
                  )}
                </div>
              </article>
            ) : null}
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
      <PublicTour />
    </div>
  );
}

function GuestCTA({ locale: localeP }: { locale?: Locale } = {}) {
  const effectiveLocale = localeP || "en";
  const { t } = getLocale(effectiveLocale);
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[600px] mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center mx-auto mb-6">
              <iconify-icon icon="lucide:book-open" className="text-[#4F8EF7]" style={{ fontSize: "30px" }} />
            </div>
            <div className="section-label mb-3">{t("trackDetail.guest.sectionLabel")}</div>
<h1 className="font-valorax gradient-text" style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}>
{t("trackDetail.guest.title")}
</h1>
            <p className="font-body-readable text-[14px] text-[#888] mt-3 mb-8 leading-relaxed">
              {t("trackDetail.guest.description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={localePath("/signin", effectiveLocale)} className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                <iconify-icon icon="lucide:log-in" style={{ fontSize: "14px" }} />
                {t("trackDetail.guest.signIn")}
              </Link>
              <Link href={localePath("/signup", effectiveLocale)} className="btn-secondary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                <iconify-icon icon="lucide:user-plus" style={{ fontSize: "14px" }} />
                {t("trackDetail.guest.signUp")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
