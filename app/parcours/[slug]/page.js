import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import FooterSection from "../../../components/FooterSection";
import Navbar from "../../../components/Navbar";
import {
  buildStepRows,
  buildTrackCompetencies,
  getLevelChipClass,
  getStepUi,
  toProgress,
  toTextList
} from "../../../lib/parcours";
import { getTrackCurriculum } from "../../../lib/curriculum";
import { buildPageMetadata } from "../../../lib/seo";
import { formatTrackMeta, listPublishedTracks, listUserTrackEnrollments } from "../../../lib/tracks";
import { missingPrerequisites } from "../../../lib/trackGuidance";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = String(resolvedParams?.slug || "").trim();

  return buildPageMetadata({
    title: "Détail Parcours",
    description: "Détails d'un parcours TakaCode: compétences fournies, plan de progression, objectif et ressources.",
    path: slug ? `/parcours/${slug}` : "/parcours"
  });
}

export default async function ParcoursDetailPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = String(resolvedParams?.slug || "").trim().toLowerCase();

  if (!slug) {
    notFound();
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

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

  // Prérequis conseillés non encore démarrés (guidage, non bloquant).
  const startedSlugs = new Set(myEnrollmentsResult.enrollments.map((entry) => entry.track?.slug).filter(Boolean));
  const trackTitleBySlug = Object.fromEntries(allTracks.map((item) => [item.slug, item.title]));
  const missingPrereqs = track ? missingPrerequisites(track.slug, startedSlugs, trackTitleBySlug) : [];

  const curriculum = track ? await getTrackCurriculum(supabase, track.id, user?.id || "") : null;
  const hasCurriculum = Boolean(curriculum?.hasCurriculum);

  const progress = user && hasCurriculum ? toProgress(curriculum.progressPercent) : toProgress(enrollment?.progress);
  const isMine = Boolean(enrollment);

  const continueHref = hasCurriculum && curriculum.nextLesson
    ? `/parcours/${track.slug}/lecon/${curriculum.nextLesson.lessonSlug}`
    : "/dashboard";

  const competencies = track ? buildTrackCompetencies(track) : [];
  const stepRows = track ? buildStepRows(track) : [];
  const resources = track ? toTextList(track.resources, 4) : [];
  const description = track ? String(track.description || track.summary || "").trim() : "";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[1320px] mx-auto space-y-8">
            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/parcours" className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "9px 14px" }}>
                <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "13px" }} />
                Retour à la liste
              </Link>
              {track ? (
                <span className="text-[11px] text-[#7d7d7d] font-body-readable">/{track.slug}</span>
              ) : null}
            </div>

            {!schemaReady ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100">
                Tables parcours non détectées. Execute `supabase/sql/003_learning_tracks.sql` pour activer le catalogue BDD.
              </div>
            ) : null}

            {hasError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">
                Impossible de charger ce parcours maintenant.
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
                        Mon parcours
                      </span>
                    ) : null}
                    <span className={`${getLevelChipClass(track.levelLabel)} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                      {track.levelLabel}
                    </span>
                    {isMine ? (
                      <div className="min-w-[128px] rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5">
                        <div className="flex items-center justify-between text-[10px] text-[#89c7ff] font-semibold mb-1">
                          <span>Progression</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1 rounded bg-white/[0.07] overflow-hidden">
                          <div
                            className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]"
                            style={{ width: `${progress}%` }}
                          />
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
                          <span className="font-venite-italic text-[11px] tracking-widest text-amber-200">CONSEIL D'ORDRE</span>
                        </div>
                        <p className="font-body-readable text-[12px] text-amber-100/90 leading-relaxed mb-3">
                          Pour tirer le meilleur de ce parcours, on te conseille de suivre d'abord :
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {missingPrereqs.map((prereq) => (
                            <Link
                              key={prereq.slug}
                              href={`/parcours/${prereq.slug}`}
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20 transition-colors"
                            >
                              {prereq.title}
                              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
                            </Link>
                          ))}
                        </div>
                        <p className="font-body-readable text-[10px] text-amber-200/60 mt-2.5">
                          Ce n'est qu'un conseil : tu peux commencer ce parcours quand tu veux.
                        </p>
                      </div>
                    ) : null}

                    <div>
                      <h2 className="font-venite-italic text-[12px] tracking-widest text-[#4F8EF7] mb-3">COMPETENCES FOURNIES</h2>
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
                      <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-2">OBJECTIF DU PARCOURS</div>
                      <p className="font-body-readable text-[12px] text-[#b3b3b3] leading-relaxed">{track.objective}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-3">PLAN DE PROGRESSION</div>
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
                                <div className="text-[10px] text-[#666]">Étape {index + 1}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-3">RESSOURCES INCLUSES</div>
                      <div className="space-y-2">
                        {(resources.length ? resources : ["Ressources en préparation"]).map((resource) => (
                          <div key={`${track.id}-resource-${resource}`} className="flex items-center gap-2 text-[11px] text-[#9b9b9b] font-body-readable">
                            <iconify-icon icon="lucide:file-text" style={{ fontSize: "12px", color: "#7f7f7f" }} />
                            <span>{resource}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {hasCurriculum ? (
                  <div className="mt-6">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                      <h2 className="font-venite-italic text-[12px] tracking-widest text-[#4F8EF7]">PROGRAMME DU PARCOURS</h2>
                      <span className="text-[10px] text-[#7a7a7a] font-body-readable">
                        {curriculum.totalLessons} leçons - quiz et micro projet à chaque étape
                      </span>
                    </div>

                    <div className="space-y-3">
                      {curriculum.modules.map((module, moduleIndex) => (
                        <div key={`${track.id}-module-${module.id}`} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                            <div className="flex items-center gap-3">
                              <span
                                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold ${
                                  module.state === "completed"
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                                    : module.state === "locked"
                                      ? "border-white/[0.12] bg-white/[0.03] text-[#7a7a7a]"
                                      : "border-blue-500/30 bg-blue-500/10 text-blue-200"
                                }`}
                              >
                                {module.state === "locked" ? (
                                  <iconify-icon icon="lucide:lock" style={{ fontSize: "11px" }} />
                                ) : (
                                  moduleIndex + 1
                                )}
                              </span>
                              <div>
                                <div className="font-venite-italic text-[13px] text-white leading-tight">{module.title}</div>
                                {module.summary ? (
                                  <div className="font-body-readable text-[11px] text-[#7a7a7a]">{module.summary}</div>
                                ) : null}
                              </div>
                            </div>
                            <span className="text-[10px] text-[#89c7ff] font-semibold">
                              {module.completedLessons}/{module.totalLessons} leçons
                            </span>
                          </div>

                          <div className="space-y-2">
                            {module.lessons.map((lesson) => {
                              const lessonUiState =
                                lesson.state === "completed" ? "done" : lesson.state === "locked" ? "locked" : "current";
                              const ui = getStepUi(lessonUiState);
                              const isLocked = lesson.state === "locked" || !user;

                              const lessonRow = (
                                <div
                                  className={`rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 flex items-center gap-2.5 ${
                                    isLocked ? "opacity-60" : "card-hover"
                                  }`}
                                >
                                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${ui.chip}`}>
                                    <iconify-icon icon={ui.icon} style={{ fontSize: "11px" }} />
                                  </span>
                                  <div className="flex-1">
                                    <div className="font-body-readable text-[11px] text-[#d0d0d0] leading-snug flex items-center gap-2">
                                      {lesson.title}
                                      {lesson.state === "review" ? (
                                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-200">
                                          en revue
                                        </span>
                                      ) : null}
                                    </div>
                                    <div className="text-[10px] text-[#666]">
                                      {lesson.durationMinutes} min - {lesson.xpReward} XP
                                      {lesson.quiz.length ? " - quiz" : ""}
                                      {lesson.microProject ? " - micro projet" : ""}
                                    </div>
                                  </div>
                                  {!isLocked ? (
                                    <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px", color: "#7f7f7f" }} />
                                  ) : null}
                                </div>
                              );

                              return isLocked ? (
                                <div key={`${module.id}-lesson-${lesson.id}`}>{lessonRow}</div>
                              ) : (
                                <Link
                                  key={`${module.id}-lesson-${lesson.id}`}
                                  href={`/parcours/${track.slug}/lecon/${lesson.slug}`}
                                  className="block"
                                >
                                  {lessonRow}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {user ? (
                    <>
                      <Link href={continueHref} className="btn-primary glow-btn inline-flex items-center gap-2 text-[13px]" style={{ padding: "12px 22px" }}>
                        <iconify-icon icon={isMine || (hasCurriculum && curriculum.completedLessons > 0) ? "lucide:play-circle" : "lucide:play"} style={{ fontSize: "15px" }} />
                        {isMine || (hasCurriculum && curriculum.completedLessons > 0) ? "Continuer le parcours" : "Démarrer le parcours"}
                      </Link>
                      <Link href="/projets" className="inline-flex items-center gap-1.5 text-[12px] text-[#888] hover:text-white transition-colors">
                        <iconify-icon icon="lucide:folder-code" style={{ fontSize: "13px" }} />
                        Voir les projets associés
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/signup?next=/dashboard" className="btn-primary glow-btn inline-flex items-center gap-2 text-[13px]" style={{ padding: "12px 22px" }}>
                        <iconify-icon icon="lucide:play" style={{ fontSize: "15px" }} />
                        Commencer ce parcours
                      </Link>
                      <Link href="/signin?next=/dashboard" className="inline-flex items-center gap-1.5 text-[12px] text-[#888] hover:text-white transition-colors">
                        <iconify-icon icon="lucide:log-in" style={{ fontSize: "13px" }} />
                        J'ai déjà un compte
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
    </div>
  );
}
