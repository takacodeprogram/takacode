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
import { buildPageMetadata } from "../../../lib/seo";
import { formatTrackMeta, listPublishedTracks, listUserTrackEnrollments } from "../../../lib/tracks";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const slug = String(resolvedParams?.slug || "").trim();

  return buildPageMetadata({
    title: "Detail Parcours",
    description: "Details d'un parcours TakaCode: competences fournies, plan de progression, objectif et ressources.",
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

  const progress = toProgress(enrollment?.progress);
  const isMine = Boolean(enrollment);

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
                Retour a la liste
              </Link>
              {track ? (
                <span className="text-[11px] text-[#7d7d7d] font-body-readable">/{track.slug}</span>
              ) : null}
            </div>

            {!schemaReady ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100">
                Tables parcours non detectees. Execute `supabase/sql/003_learning_tracks.sql` pour activer le catalogue BDD.
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
                                <div className="text-[10px] text-[#666]">Etape {index + 1}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-3">RESSOURCES INCLUSES</div>
                      <div className="space-y-2">
                        {(resources.length ? resources : ["Ressources en preparation"]).map((resource) => (
                          <div key={`${track.id}-resource-${resource}`} className="flex items-center gap-2 text-[11px] text-[#9b9b9b] font-body-readable">
                            <iconify-icon icon="lucide:file-text" style={{ fontSize: "12px", color: "#7f7f7f" }} />
                            <span>{resource}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {user ? (
                    <>
                      <Link href="/dashboard" className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 16px" }}>
                        {isMine ? "Continuer" : "Demarrer"}
                        <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
                      </Link>
                      <Link href="/projets" className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 16px" }}>
                        Projets associes
                        <iconify-icon icon="lucide:folder-code" style={{ fontSize: "13px" }} />
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/signin?next=/dashboard" className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 16px" }}>
                        Connexion
                        <iconify-icon icon="lucide:log-in" style={{ fontSize: "13px" }} />
                      </Link>
                      <Link href="/signup?next=/dashboard" className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 16px" }}>
                        Commencer
                        <iconify-icon icon="lucide:play" style={{ fontSize: "13px" }} />
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
