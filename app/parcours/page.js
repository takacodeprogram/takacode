import Link from "next/link";
import { cookies } from "next/headers";
import FooterSection from "../../components/FooterSection";
import Navbar from "../../components/Navbar";
import { buildPageMetadata } from "../../lib/seo";
import { buildTrackCompetencies, getLevelChipClass, toProgress } from "../../lib/parcours";
import { formatTrackMeta, listPublishedTracks, listUserTrackEnrollments } from "../../lib/tracks";
import { getTrackGuidance, orderTracksByGuidance } from "../../lib/trackGuidance";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Parcours",
  description: "Catalogue des parcours TakaCode. Choisis un parcours dans la liste puis ouvre sa page détail pour voir compétences, plan et ressources.",
  path: "/parcours"
});

export default async function ParcoursPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const allTracksResult = await listPublishedTracks(supabase);
  // Ordonne le catalogue selon l'ordre conseille (fondations -> IA -> web -> vibe).
  const allTracks = orderTracksByGuidance(allTracksResult.tracks);

  const myEnrollmentsResult = user
    ? await listUserTrackEnrollments(supabase, user.id, { limit: 12 })
    : { enrollments: [], schemaReady: allTracksResult.schemaReady, error: null };

  const myEnrollments = myEnrollmentsResult.enrollments;
  const myTrackIds = new Set(myEnrollments.map((enrollment) => enrollment.trackId));
  const schemaReady = allTracksResult.schemaReady && myEnrollmentsResult.schemaReady;
  const hasError = Boolean(allTracksResult.error || myEnrollmentsResult.error);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[1320px] mx-auto space-y-8">
            <div className="max-w-[940px]">
              <div className="section-label mb-4">CATALOGUE</div>
              <h1 className="font-valorax gradient-text text-[clamp(34px,4vw,56px)] leading-[0.92]">LISTE COMPLETE DES PARCOURS</h1>
              <p className="font-body-readable text-[15px] text-[#8d8d8d] mt-4">
                Cette page affiche uniquement la liste des parcours. Clique sur un parcours pour ouvrir sa fiche détaillée.
              </p>
            </div>

            {user ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                  <h2 className="font-venite-italic text-[16px] text-white">MES PARCOURS</h2>
                  <Link href="/dashboard" className="text-[12px] text-[#4F8EF7] hover:underline">
                    Voir mon dashboard
                  </Link>
                </div>

                {myEnrollments.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {myEnrollments.map((enrollment) => {
                      const progress = toProgress(enrollment.progress);

                      return (
                        <article key={enrollment.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-venite-italic text-[13px] text-white leading-tight">{enrollment.track.title}</h3>
                            <span className="text-[10px] text-[#6ec3ff] font-semibold">{progress}%</span>
                          </div>
                          <p className="text-[11px] text-[#777] font-body-readable mb-3">{formatTrackMeta(enrollment.track)}</p>
                          <Link href={`/parcours/${enrollment.track.slug}`} className="text-[11px] text-[#4F8EF7] font-semibold hover:underline">
                            Ouvrir la fiche détail
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#7b7b7b] font-body-readable">
                    Aucun parcours en cours pour le moment. Commence par choisir un parcours dans la liste ci-dessous.
                  </p>
                )}
              </div>
            ) : null}

            {!schemaReady ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100">
                Tables parcours non détectées. Execute `supabase/sql/003_learning_tracks.sql` pour activer le catalogue BDD.
              </div>
            ) : null}

            {hasError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">
                Impossible de charger le catalogue parcours maintenant.
              </div>
            ) : null}

            {allTracks.length ? (
              <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                  <h2 className="font-venite-italic text-[16px] text-white">PARCOURS DISPONIBLES</h2>
                  <span className="text-[11px] text-[#8e8e8e] font-body-readable">{allTracks.length} parcours actifs</span>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 mb-5 flex items-start gap-2.5">
                  <iconify-icon icon="lucide:route" style={{ fontSize: "16px", color: "#4F8EF7" }} />
                  <p className="font-body-readable text-[12px] text-blue-100/90 leading-relaxed">
                    <span className="font-semibold text-white">Ordre conseillé :</span> les parcours sont rangés du plus fondamental au plus avancé.
                    Comprends d'abord l'IA, puis apprends à construire avec elle. Tu restes libre de commencer par où tu veux.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {allTracks.map((track, index) => {
                    const competencies = buildTrackCompetencies(track).slice(0, 3);
                    const levelChipClass = getLevelChipClass(track.levelLabel);
                    const isMine = myTrackIds.has(track.id);
                    const guidance = getTrackGuidance(track.slug);

                    return (
                      <article
                        key={track.id}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 card-hover project-card"
                      >
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <span className="text-[10px] px-2 py-1 rounded-full border border-blue-400/25 bg-blue-500/10 text-blue-200 font-semibold">
                            Étape {index + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            {isMine ? (
                              <span className="text-[10px] font-semibold px-2 py-1 rounded-full border border-blue-400/35 bg-blue-500/15 text-blue-200">
                                Mon parcours
                              </span>
                            ) : null}
                            <span className={`${levelChipClass} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                              {track.levelLabel}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-venite-italic text-[14px] text-white leading-tight mb-1.5">{track.title}</h3>
                        {guidance.tagline ? (
                          <p className="font-body-readable text-[11px] text-[#89c7ff] leading-snug mb-1.5">{guidance.tagline}</p>
                        ) : null}
                        <p className="font-body-readable text-[11px] text-[#6f6f6f] mb-3">{formatTrackMeta(track)}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {competencies.map((competence) => (
                            <span
                              key={`${track.id}-${competence}`}
                              className="text-[10px] px-2 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#9f9f9f]"
                            >
                              {competence}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/parcours/${track.slug}`}
                          className="inline-flex items-center gap-2 text-[11px] text-[#4F8EF7] font-semibold hover:underline"
                        >
                          Voir les détails
                          <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {!allTracks.length && schemaReady && !hasError ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 text-[13px] text-[#888] font-body-readable">
                Aucun parcours publié pour le moment.
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
