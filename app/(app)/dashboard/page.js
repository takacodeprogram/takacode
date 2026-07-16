import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GradeProgress from "../../../components/GradeProgress";
import PageHeader from "../../../components/app-shell/PageHeader";
import { getUserAccessContext } from "../../../lib/auth";
import { getTrackCurriculum } from "../../../lib/curriculum";
import { formatDisplayName } from "../../../lib/displayName";
import { getOnboardingProfile, isOnboardingCompleted } from "../../../lib/onboarding";
import { buildPageMetadata } from "../../../lib/seo";
import { formatTrackMeta, listPublishedTracks, listRecommendedTracksForGoal, listUserTrackEnrollments } from "../../../lib/tracks";
import { getTrackGuidance, guidanceLevelChip, orderTracksByGuidance } from "../../../lib/trackGuidance";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Dashboard",
  description: "Ton espace personnel TakaCode : progression, prochaine leçon et raccourcis.",
  path: "/dashboard",
  noIndex: true
});

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
    redirect("/onboarding");
  }

  const onboardingProfile = getOnboardingProfile(user);
  const displayName = formatDisplayName(user);
  const firstName = displayName.split(" ")[0] || "Membre";

  const enrollmentResult = await listUserTrackEnrollments(supabase, user.id, { limit: 8 });
  const enrolledTracks = enrollmentResult.enrollments;
  const primaryEnrollment = enrolledTracks[0] || null;

  const curriculum = primaryEnrollment
    ? await getTrackCurriculum(supabase, primaryEnrollment.trackId, user.id)
    : null;

  // Quand aucun parcours n'est démarré, on met en avant LE parcours recommandé
  // (basé sur l'objectif choisi à l'onboarding). Si ce goalKey ne pointe vers
  // aucun parcours avec contenu, on retombe sur le premier parcours publié.
  let recommendedTrack = null;
  if (!primaryEnrollment) {
    const recommendedResult = await listRecommendedTracksForGoal(supabase, onboardingProfile.goalKey, { limit: 1 });
    recommendedTrack = recommendedResult.tracks?.[0] || null;

    if (!recommendedTrack) {
      const publishedResult = await listPublishedTracks(supabase, { limit: 1 });
      recommendedTrack = publishedResult.tracks?.[0] || null;
    }
  }

  const progress = curriculum?.hasCurriculum
    ? curriculum.progressPercent
    : Math.max(0, Math.min(Number(primaryEnrollment?.progress ?? 0), 100));

  const startHref = primaryEnrollment
    ? curriculum?.nextLesson
      ? `/parcours/${primaryEnrollment.track.slug}/lecon/${curriculum.nextLesson.lessonSlug}`
      : `/parcours/${primaryEnrollment.track.slug}`
    : recommendedTrack
      ? `/parcours/${recommendedTrack.slug}`
      : "/parcours";

  const points = Number.isFinite(Number(accessContext.profile?.points)) ? Number(accessContext.profile.points) : 0;
  const grade = accessContext.profile?.grade || "Starter";

  // Feuille de route conseillée : tous les parcours dans l'ordre recommandé,
  // annotés de l'état du membre (terminé / en cours / à découvrir).
  const roadmapResult = await listPublishedTracks(supabase, { limit: 20 });
  const enrollmentByTrackId = new Map(enrolledTracks.map((entry) => [entry.trackId, entry]));
  const roadmap = orderTracksByGuidance(roadmapResult.tracks).map((item) => {
    const entry = enrollmentByTrackId.get(item.id) || null;
    const state = entry ? (entry.status === "completed" ? "done" : "active") : "todo";
    return { track: item, guidance: getTrackGuidance(item.slug), state };
  });

  const quickActions = [
    { label: "Mes parcours", href: "/dashboard/parcours", icon: "lucide:map" },
    { label: "Mes projets", href: "/dashboard/projets", icon: "lucide:folder-code" },
    { label: "Classement", href: "/classement", icon: "lucide:trophy" }
  ];

  return (
    <>
      <PageHeader title="DASHBOARD" subtitle={`Bienvenue ${displayName}`} />

      <div className="grid xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 animate-fade-up-d1">
          <div className="section-label mb-2">Mon cap</div>
          <h2 className="font-valorax text-[clamp(24px,3.4vw,38px)] leading-[0.95] mb-2">BONJOUR {firstName.toUpperCase()}</h2>
          <p className="font-body-readable text-[14px] text-[#a5a5a5] leading-relaxed mb-5">{onboardingProfile.goalLabel}</p>

          {primaryEnrollment ? (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 mb-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-[13px] text-white font-semibold">{primaryEnrollment.track.title}</div>
                <span className="text-[11px] text-[#89c7ff] font-semibold">{progress}%</span>
              </div>
              <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden mb-2">
                <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-[11px] text-[#777] font-body-readable">{formatTrackMeta(primaryEnrollment.track)}</div>
            </div>
          ) : recommendedTrack ? (
            <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 p-4 mb-5">
              <div className="text-[10px] text-blue-200 uppercase tracking-widest mb-2">Parcours recommandé pour toi</div>
              <div className="flex items-center gap-3">
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
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 mb-5 text-[12px] text-[#888] font-body-readable">
              Tu n'as pas encore de parcours actif. Choisis-en un pour démarrer.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link href={startHref} className="btn-primary inline-flex items-center gap-2">
              {primaryEnrollment ? (curriculum?.completedLessons ? "Continuer" : "Démarrer") : recommendedTrack ? "Démarrer ce parcours" : "Choisir un parcours"}
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
            </Link>
            <Link href="/dashboard/parcours" className="btn-secondary">Voir mes parcours</Link>
          </div>
        </section>

        <section className="space-y-4 animate-fade-up-d2">
          <GradeProgress points={points} compact />

          <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
            <h3 className="font-venite text-[12px] tracking-widest text-[#888] mb-3">MES STATS</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest">Points</div>
                <div className="text-[15px] text-white font-semibold">{points}</div>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest">Grade</div>
                <div className="text-[15px] text-white font-semibold">{grade}</div>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest">Parcours</div>
                <div className="text-[15px] text-white font-semibold">{enrolledTracks.length}</div>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
            <h3 className="font-venite text-[12px] tracking-widest text-[#888] mb-3">ACCES RAPIDE</h3>
            <div className="space-y-2.5">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-[12px] font-semibold text-[#d1d1d1] hover:bg-white/[0.05] transition-colors inline-flex items-center gap-2"
                >
                  <iconify-icon icon={action.icon} style={{ color: "#4F8EF7", fontSize: "14px" }} />
                  {action.label}
                </Link>
              ))}
            </div>
          </article>
        </section>
      </div>

      {roadmap.length > 1 ? (
        <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 mt-6 animate-fade-up-d3">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
            <h3 className="font-venite text-[12px] tracking-widest text-[#888] inline-flex items-center gap-2">
              <iconify-icon icon="lucide:route" style={{ color: "#4F8EF7", fontSize: "14px" }} />
              ORDRE CONSEILLE
            </h3>
            <Link href="/parcours" className="text-[11px] text-[#4F8EF7] hover:underline">
              Voir tout le catalogue
            </Link>
          </div>
          <p className="font-body-readable text-[12px] text-[#8d8d8d] leading-relaxed mb-4">
            Du plus fondamental au plus avancé. Comprends l'IA, puis apprends à construire avec elle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {roadmap.map((entry, index) => (
              <Link
                key={entry.track.id}
                href={`/parcours/${entry.track.slug}`}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 card-hover block"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-400/25 bg-blue-500/10 text-blue-200">
                    Étape {index + 1}
                  </span>
                  {entry.state === "done" ? (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                      terminé
                    </span>
                  ) : entry.state === "active" ? (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200">
                      en cours
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
