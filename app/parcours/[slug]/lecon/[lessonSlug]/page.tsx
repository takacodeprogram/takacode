import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import FooterSection from "../../../../../components/FooterSection";
import LessonExperience from "../../../../../components/LessonExperience";
import Navbar from "../../../../../components/Navbar";
import PublicTour from "../../../../../components/public-tour/PublicTour";
import { findLessonInCurriculum, getTrackCurriculum } from "../../../../../lib/curriculum";
import { buildPageMetadata } from "../../../../../lib/seo";
import { ensureUserTrackEnrollment, listPublishedTracks } from "../../../../../lib/tracks";
import { listOwnProjects } from "../../../../../lib/userProjects";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export async function generateMetadata({ params }: LessonPageProps) {
  const resolvedParams = await params;
  const slug = String(resolvedParams?.slug || "").trim();
  const lessonSlug = String(resolvedParams?.lessonSlug || "").trim();

  return buildPageMetadata({
    title: "Lecon",
    description: "Lecon TakaCode : ressources selectionnees, quiz de validation et micro projet pratique.",
    path: slug && lessonSlug ? `/parcours/${slug}/lecon/${lessonSlug}` : "/parcours",
    noIndex: true
  });
}

export default async function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = await params;
  const slug = String(resolvedParams?.slug || "").trim().toLowerCase();
  const lessonSlug = String(resolvedParams?.lessonSlug || "").trim().toLowerCase();

  if (!slug || !lessonSlug) {
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

  const allTracksResult = await listPublishedTracks(supabase);
  const track = allTracksResult.tracks.find((item) => String(item.slug || "").trim().toLowerCase() === slug) || null;

  if (!track) {
    notFound();
  }

  // Ouvrir une lecon marque le parcours comme demarre (apparait dans le dashboard).
  await ensureUserTrackEnrollment(supabase, user.id, track.id);

  const curriculum = await getTrackCurriculum(supabase, track.id, user.id);

  if (!curriculum.schemaReady) {
    redirect(`/parcours/${slug}`);
  }

  const { projects: ownProjects } = await listOwnProjects(supabase, user.id, { limit: 50 });
  const linkedProject = ownProjects.find((p) => p.trackId === track.id);
  const projectTitle = linkedProject?.title || "";
  const projectId = linkedProject?.id || "";

  const located = findLessonInCurriculum(curriculum, lessonSlug);

  if (!located) {
    notFound();
  }

  if (located.lesson.state === "locked") {
    redirect(`/parcours/${slug}`);
  }

  const { module, lesson, previousLesson, nextLesson, position, total } = located;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[980px] mx-auto space-y-8">
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href={`/parcours/${track.slug}`}
                className="btn-secondary inline-flex items-center gap-2 text-[12px]"
                style={{ padding: "9px 14px" }}
              >
                <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "13px" }} />
                Retour au parcours
              </Link>
              <span className="text-[11px] text-[#7d7d7d] font-body-readable">
                {track.title} / {module.title}
              </span>
            </div>

            <article className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 md:p-7 project-card">
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
                    <h1 className="font-venite-italic text-[20px] text-white leading-tight mb-1">{lesson.title}</h1>
                    <p className="font-body-readable text-[12px] text-[#7a7a7a]">
                      Lecon {position}/{total} - {lesson.durationMinutes} min - {lesson.xpReward} XP
                    </p>
                    {curriculum.totalLessons > 0 ? (
                      <div className="flex items-center gap-2.5 mt-2">
                        <div className="flex-1 h-1.5 rounded bg-white/[0.06] overflow-hidden max-w-[180px]">
                          <div
                            className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]"
                            style={{ width: `${curriculum.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#89c7ff] font-semibold">
                          {curriculum.completedLessons}/{curriculum.totalLessons} lecons ({curriculum.progressPercent}%)
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {lesson.state === "completed" ? (
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                    Lecon validee
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-blue-400/35 bg-blue-500/15 text-blue-200">
                    En cours
                  </span>
                )}
              </div>

              <LessonExperience
                lesson={lesson}
                trackSlug={track.slug}
                previousLessonSlug={previousLesson?.slug || ""}
                nextLessonSlug={nextLesson?.slug || ""}
                nextLessonTitle={nextLesson?.title || ""}
                projectTitle={projectTitle}
                projectId={projectId}
              />
            </article>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
      <PublicTour />
    </div>
  );
}

function GuestCTA() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[600px] mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center mx-auto mb-6">
              <iconify-icon icon="lucide:graduation-cap" className="text-[#4F8EF7]" style={{ fontSize: "30px" }} />
            </div>
            <div className="section-label mb-3">LECON</div>
            <h1 className="font-valorax gradient-text" style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}>
              ACCEDE AUX LECONS
            </h1>
            <p className="font-body-readable text-[14px] text-[#888] mt-3 mb-8 leading-relaxed">
              Connecte-toi ou cree un compte pour acceder au contenu des lecons et progresser dans tes parcours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signin" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                <iconify-icon icon="lucide:log-in" style={{ fontSize: "14px" }} />
                Se connecter
              </Link>
              <Link href="/signup" className="btn-secondary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                <iconify-icon icon="lucide:user-plus" style={{ fontSize: "14px" }} />
                Creer un compte
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
