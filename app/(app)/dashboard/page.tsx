import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "../../../lib/i18n";
import { getServerLocale } from "../../../lib/serverLocale";
import { redirectLocale } from "../../../lib/redirectLocale";
import GradeProgress from "../../../components/GradeProgress";
import NextActionBlock from "../../../components/NextActionBlock";
import ProjectCockpit from "../../../components/ProjectCockpit";
import PageHeader from "../../../components/app-shell/PageHeader";
import { getUserAccessContext } from "../../../lib/auth";
import { getTrackCurriculum } from "../../../lib/curriculum";
import { formatDisplayName } from "../../../lib/displayName";
import { getOnboardingProfile, isOnboardingCompleted } from "../../../lib/onboarding";
import { buildPageMetadata } from "../../../lib/seo";
import { formatTrackMeta, listPublishedTracks, listRecommendedTracksForGoal, listUserTrackEnrollments } from "../../../lib/tracks";
import { getTrackGuidance, guidanceLevelChip, orderTracksByGuidance } from "../../../lib/trackGuidance";
import { localePath } from "../../../lib/localeHelpers";
import { listOwnProjects } from "../../../lib/userProjects";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("common.loading"),
    description: t("dashboard.startPrompt"),
    path: "/dashboard",
    noIndex: true
  });
}

export default async function DashboardHomePage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard");
  }

  const accessContext = await getUserAccessContext(supabase, user);

  if (accessContext.role !== "admin" && !isOnboardingCompleted(user)) {
    await redirectLocale("/onboarding");
  }

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const onboardingProfile = getOnboardingProfile(user);
  const displayName = formatDisplayName(user);
  const firstName = displayName.split(" ")[0] || "Membre";

  const enrollmentResult = await listUserTrackEnrollments(supabase, user.id, { limit: 8 });
  const enrolledTracks = enrollmentResult.enrollments;
  const ownProjectsResult = await listOwnProjects(supabase, user.id);
  const mainProject = ownProjectsResult.projects?.[0] || null;
  const projectEnrollment = mainProject?.trackId
    ? enrolledTracks.find((entry) => entry.trackId === mainProject.trackId) || null
    : null;
  const primaryEnrollment = projectEnrollment || enrolledTracks[0] || null;

  const curriculum = primaryEnrollment
    ? await getTrackCurriculum(supabase, primaryEnrollment.trackId, user.id)
    : null;

  let recommendedTrack = null;
  if (!primaryEnrollment) {
    const recommendedResult = await listRecommendedTracksForGoal(supabase, onboardingProfile.goalKey, { limit: 1 });
    recommendedTrack = recommendedResult.tracks?.[0] || null;

    if (!recommendedTrack) {
      const publishedResult = await listPublishedTracks(supabase, { limit: 1, locale: await getServerLocale() });
      recommendedTrack = publishedResult.tracks?.[0] || null;
    }
  }

  const progress = curriculum?.hasCurriculum
    ? curriculum.progressPercent
    : Math.max(0, Math.min(Number(primaryEnrollment?.progress ?? 0), 100));

  const startHref = primaryEnrollment
    ? curriculum?.nextLesson
        ? `/tracks/${primaryEnrollment.track.slug}/lesson/${curriculum.nextLesson.lessonSlug}`
      : `/tracks/${primaryEnrollment.track.slug}`
    : recommendedTrack
      ? `/tracks/${recommendedTrack.slug}`
      : "/tracks";

  const points = Number.isFinite(Number(accessContext.profile?.points)) ? Number(accessContext.profile!.points) : 0;
  const grade = accessContext.profile?.grade || "Starter";

  const roadmapResult = await listPublishedTracks(supabase, { limit: 20, locale });
  const enrollmentByTrackId = new Map(enrolledTracks.map((entry) => [entry.trackId, entry]));
  const roadmap = orderTracksByGuidance(roadmapResult.tracks).map((item) => {
    const entry = enrollmentByTrackId.get(item.id) || null;
    const state = entry ? (entry.status === "completed" ? "done" : "active") : "todo";
    return { track: item, guidance: getTrackGuidance(item.slug), state };
  });

  const quickActions = [
    { label: t("dashboard.myTracks"), href: "/dashboard/tracks", icon: "lucide:map" },
    { label: t("dashboard.myProjects"), href: "/dashboard/projects", icon: "lucide:folder-code" },
    { label: t("dashboard.leaderboard"), href: "/classement", icon: "lucide:trophy" }
  ];

  return (
    <>
      <PageHeader title={t("dashboard.title")} subtitle={`${t("dashboard.welcome")} ${displayName}`} />

      <div className="grid xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="space-y-6">
          <ProjectCockpit project={mainProject} firstName={firstName} goalLabel={onboardingProfile.goalLabel} />

          {primaryEnrollment ? (
            <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 animate-fade-up-d2">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <h3 className="font-venite text-[12px] tracking-widest text-[#888] inline-flex items-center gap-2">
                  <iconify-icon icon="lucide:zap" style={{ color: "#4F8EF7", fontSize: "14px" }} />
                  {t("dashboard.trainToAdvance")}
                </h3>
                <span className="text-[11px] text-[#89c7ff] font-semibold">{progress}%</span>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="text-[13px] text-white font-semibold mb-1">{primaryEnrollment.track.title}</div>
                <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden mb-2">
                  <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: `${progress}%` }} />
                </div>
                <p className="font-body-readable text-[11px] text-[#8d8d8d] leading-snug mb-3">
                  {curriculum?.nextLesson
                    ? t("dashboard.nextCompetence", curriculum.nextLesson.title)
                    : t("dashboard.trackCompleted")}
                </p>
                <Link href={startHref} className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "9px 14px" }}>
                  {curriculum?.completedLessons ? t("dashboard.continueLesson") : t("dashboard.startTraining")}
                  <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
                </Link>
              </div>
            </section>
          ) : recommendedTrack ? (
            <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 animate-fade-up-d2">
              <h3 className="font-venite text-[12px] tracking-widest text-[#888] inline-flex items-center gap-2 mb-3">
                <iconify-icon icon="lucide:zap" style={{ color: "#4F8EF7", fontSize: "14px" }} />
                {t("dashboard.trainToAdvance")}
              </h3>
              <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0"
                    style={{ borderColor: `${recommendedTrack.accentColor}55`, background: `${recommendedTrack.accentColor}1f` }}
                  >
                    <iconify-icon icon={recommendedTrack.icon} style={{ color: recommendedTrack.accentColor, fontSize: "20px" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] text-white font-semibold leading-tight">{recommendedTrack.title}</div>
                    <div className="text-[11px] text-blue-100/80 font-body-readable">{formatTrackMeta(recommendedTrack)}</div>
                  </div>
                </div>
                <p className="font-body-readable text-[11px] text-blue-100/70 leading-snug mb-3">
                  {t("dashboard.trackUnlocksSkills")}
                </p>
                <Link href={startHref} className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "9px 14px" }}>
                  {t("dashboard.startThisTrack")}
                  <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
                </Link>
              </div>
            </section>
          ) : null}
        </div>

        <section className="space-y-4 animate-fade-up-d2">
          <NextActionBlock
            project={mainProject ? {
              id: mainProject.id,
              title: mainProject.title,
              status: mainProject.status,
              repoUrl: mainProject.repoUrl,
              liveUrl: mainProject.liveUrl
            } : null}
            hasEnrollment={enrolledTracks.length > 0}
            hasOnboarding={true}
          />

          <GradeProgress points={points} compact />

          <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
            <h3 className="font-venite text-[12px] tracking-widest text-[#888] mb-3">{t("dashboard.myStats")}</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest">{t("dashboard.points")}</div>
                <div className="text-[15px] text-white font-semibold">{points}</div>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest">{t("dashboard.grade")}</div>
                <div className="text-[15px] text-white font-semibold">{grade}</div>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest">{t("dashboard.tracks")}</div>
                <div className="text-[15px] text-white font-semibold">{enrolledTracks.length}</div>
              </div>
            </div>
          </article>
        </section>
      </div>

      {roadmap.length > 1 ? (
        <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 mt-6 animate-fade-up-d3">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
            <h3 className="font-venite text-[12px] tracking-widest text-[#888] inline-flex items-center gap-2">
              <iconify-icon icon="lucide:route" style={{ color: "#4F8EF7", fontSize: "14px" }} />
              {t("dashboard.projectAccelerators")}
            </h3>
            <Link href={localePath("/tracks", locale)} className="text-[11px] text-[#4F8EF7] hover:underline">
              {t("dashboard.viewAllCatalog")}
            </Link>
          </div>
          <p className="font-body-readable text-[12px] text-[#8d8d8d] leading-relaxed mb-4">
            {t("dashboard.roadmapDescription")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {roadmap.map((entry, index) => (
              <Link
                key={entry.track.id}
                href={`/tracks/${entry.track.slug}`}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 card-hover block"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-400/25 bg-blue-500/10 text-blue-200">
                    {t("dashboard.step", `${index + 1}`)}
                  </span>
                  {entry.state === "done" ? (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                      {t("dashboard.completed")}
                    </span>
                  ) : entry.state === "active" ? (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200">
                      {t("dashboard.inProgress")}
                    </span>
                  ) : entry.guidance.level ? (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${guidanceLevelChip(entry.guidance.level)}`}>
                      {entry.guidance.level}
                    </span>
                  ) : null}
                </div>
                <div className="text-[12px] text-white font-semibold leading-tight mb-1">{entry.track.title}</div>
                {entry.guidance.tagline ? (
                  <p className="font-body-readable text-[11px] text-[#8d8d8d] leading-snug">{entry.guidance.tagline}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
