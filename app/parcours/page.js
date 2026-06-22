import Link from "next/link";
import { cookies } from "next/headers";
import FooterSection from "../../components/FooterSection";
import Navbar from "../../components/Navbar";
import { buildPageMetadata } from "../../lib/seo";
import { formatTrackMeta, listPublishedTracks, listUserTrackEnrollments } from "../../lib/tracks";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Parcours",
  description: "Explore les parcours TakaCode, les competences fournies et les details de progression avant de te lancer.",
  path: "/parcours"
});

const GOAL_COMPETENCY_MAP = {
  website: [
    "Structurer une page web propre",
    "Creer un design responsive",
    "Optimiser SEO et performance",
    "Mettre en ligne sur Vercel"
  ],
  web_app: [
    "Concevoir une architecture front claire",
    "Construire des composants React reutilisables",
    "Brancher API et base de donnees",
    "Gerer auth et roles utilisateur"
  ],
  mobile_app: [
    "Creer des ecrans mobiles fluides",
    "Organiser navigation et etats",
    "Connecter notifications et backend",
    "Publier une app testable"
  ],
  automation_ai: [
    "Mapper un workflow metier",
    "Automatiser avec n8n ou Make",
    "Integrer un agent IA utile",
    "Superviser les executions"
  ],
  data_analysis: [
    "Nettoyer des jeux de donnees",
    "Construire des KPI actionnables",
    "Visualiser dans un dashboard",
    "Presenter des insights decisions"
  ],
  videos_youtube: [
    "Definir une ligne editoriale",
    "Structurer un script efficace",
    "Monter et publier proprement",
    "Optimiser miniatures et retention"
  ],
  podcast_audio: [
    "Preparer un format audio clair",
    "Enregistrer avec bonne qualite",
    "Mixer et masteriser rapidement",
    "Publier sur les plateformes"
  ],
  digital_business: [
    "Positionner une offre claire",
    "Creer un MVP monetisable",
    "Structurer acquisition et vente",
    "Suivre conversion et revenu"
  ],
  marketing_online: [
    "Definir audience et message",
    "Planifier contenu multicanal",
    "Lancer des campagnes testables",
    "Mesurer ROI des actions"
  ],
  web3: [
    "Comprendre wallets et chaines",
    "Coder un smart contract simple",
    "Connecter wallet au front",
    "Deployer une dApp de base"
  ],
  three_d: [
    "Modeliser des assets 3D",
    "Animer une scene interactive",
    "Exporter vers web ou produit",
    "Optimiser rendu et fluidite"
  ],
  custom_projects: [
    "Cadrer un besoin client",
    "Choisir le stack adapte",
    "Decouper en sprints realistes",
    "Livrer une V1 fonctionnelle"
  ],
  learn_explore: [
    "Tester plusieurs domaines tech",
    "Identifier tes points forts",
    "Construire un mini-projet guide",
    "Choisir ton prochain cap"
  ],
  other: [
    "Transformer une idee en plan",
    "Prioriser les etapes critiques",
    "Executer un premier sprint",
    "Mesurer les premiers resultats"
  ]
};

function getLevelChipClass(levelLabel) {
  const normalized = String(levelLabel || "").toLowerCase();

  if (normalized.includes("debutant")) {
    return "level-beginner";
  }

  if (normalized.includes("inter") || normalized.includes("build") || normalized.includes("execution") || normalized.includes("pratique")) {
    return "level-intermediate";
  }

  return "level-advanced";
}

function getTrackAnchor(track) {
  const raw = String(track?.slug || track?.id || "").trim().toLowerCase();
  const normalized = raw
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

  return `detail-${normalized || "parcours"}`;
}

function toProgress(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function toTextList(values, limit = 4) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, limit);
}

function buildTrackCompetencies(track) {
  const mapped = toTextList(GOAL_COMPETENCY_MAP[track.goalKey], 4);
  if (mapped.length) {
    return mapped;
  }

  const fromResources = toTextList(track.resources, 4);
  if (fromResources.length) {
    return fromResources;
  }

  const fromSteps = toTextList((track.nextSteps || []).map((step) => step?.label), 4);
  if (fromSteps.length) {
    return fromSteps;
  }

  return [
    "Construire un plan de progression",
    "Executer des exercices pratiques",
    "Finaliser un projet concret"
  ];
}

function getStepUi(stepState) {
  const state = String(stepState || "locked").toLowerCase();

  if (state === "done") {
    return {
      icon: "lucide:check",
      chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
    };
  }

  if (state === "current") {
    return {
      icon: "lucide:play",
      chip: "border-blue-500/30 bg-blue-500/10 text-blue-200"
    };
  }

  return {
    icon: "lucide:lock",
    chip: "border-white/[0.12] bg-white/[0.03] text-[#7a7a7a]"
  };
}

function buildStepRows(track) {
  const fromTrack = Array.isArray(track.nextSteps)
    ? track.nextSteps
        .map((step) => {
          const label = String(step?.label || "").trim();
          if (!label) {
            return null;
          }

          return {
            label,
            state: String(step?.state || "locked").trim().toLowerCase() || "locked"
          };
        })
        .filter(Boolean)
    : [];

  if (fromTrack.length) {
    return fromTrack.slice(0, 4);
  }

  return [
    { label: "Demarrer le parcours", state: "current" },
    { label: "Completer la premiere pratique", state: "locked" },
    { label: "Finaliser le mini-projet", state: "locked" }
  ];
}

export default async function ParcoursPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const allTracksResult = await listPublishedTracks(supabase);
  const allTracks = allTracksResult.tracks;

  const myEnrollmentsResult = user
    ? await listUserTrackEnrollments(supabase, user.id, { limit: 12 })
    : { enrollments: [], schemaReady: allTracksResult.schemaReady, error: null };

  const myEnrollments = myEnrollmentsResult.enrollments;
  const myEnrollmentByTrackId = new Map(myEnrollments.map((enrollment) => [enrollment.trackId, enrollment]));
  const myTrackIds = new Set(myEnrollments.map((enrollment) => enrollment.trackId));
  const schemaReady = allTracksResult.schemaReady && myEnrollmentsResult.schemaReady;
  const hasError = Boolean(allTracksResult.error || myEnrollmentsResult.error);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[1320px] mx-auto space-y-8">
            <div className="max-w-[920px]">
              <div className="section-label mb-4">CATALOGUE</div>
              <h1 className="font-valorax gradient-text text-[clamp(34px,4vw,56px)] leading-[0.92]">LISTE COMPLETE DES PARCOURS</h1>
              <p className="font-body-readable text-[15px] text-[#8d8d8d] mt-4">
                Tu vois dabord la liste des parcours, puis les details complets de chaque parcours (competences, plan de progression,
                ressources et objectif final).
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
                        <article
                          key={enrollment.id}
                          className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-venite-italic text-[13px] text-white leading-tight">{enrollment.track.title}</h3>
                            <span className="text-[10px] text-[#6ec3ff] font-semibold">{progress}%</span>
                          </div>
                          <p className="text-[11px] text-[#777] font-body-readable mb-3">{formatTrackMeta(enrollment.track)}</p>
                          <div className="h-1 rounded bg-white/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
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
                Tables parcours non detectees. Execute `supabase/sql/003_learning_tracks.sql` pour activer le catalogue BDD.
              </div>
            ) : null}

            {hasError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">
                Impossible de charger le catalogue parcours maintenant.
              </div>
            ) : null}

            {allTracks.length ? (
              <>
                <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
                    <h2 className="font-venite-italic text-[16px] text-white">LISTE RAPIDE AVANT DETAILS</h2>
                    <span className="text-[11px] text-[#8e8e8e] font-body-readable">{allTracks.length} parcours actifs</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {allTracks.map((track, index) => {
                      const competencies = buildTrackCompetencies(track).slice(0, 3);
                      const anchor = getTrackAnchor(track);

                      return (
                        <article
                          key={`${track.id}-quick`}
                          className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 card-hover project-card"
                        >
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="text-[10px] px-2 py-1 rounded-full border border-white/[0.1] text-[#8a8a8a] font-semibold">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className={`${getLevelChipClass(track.levelLabel)} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                              {track.levelLabel}
                            </span>
                          </div>

                          <h3 className="font-venite-italic text-[14px] text-white leading-tight mb-1.5">{track.title}</h3>
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
                            href={`#${anchor}`}
                            className="inline-flex items-center gap-2 text-[11px] text-[#4F8EF7] font-semibold hover:underline"
                          >
                            Voir les details
                            <iconify-icon icon="lucide:arrow-down" style={{ fontSize: "12px" }} />
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <section className="space-y-5">
                  {allTracks.map((track) => {
                    const anchor = getTrackAnchor(track);
                    const competencies = buildTrackCompetencies(track);
                    const stepRows = buildStepRows(track);
                    const resources = toTextList(track.resources, 4);
                    const enrollment = myEnrollmentByTrackId.get(track.id);
                    const progress = toProgress(enrollment?.progress);
                    const isMine = myTrackIds.has(track.id);
                    const description = String(track.description || track.summary || "").trim();

                    return (
                      <article
                        key={track.id}
                        id={anchor}
                        className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 md:p-7 card-hover project-card"
                      >
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
                              <h2 className="font-venite-italic text-[18px] text-white leading-tight mb-1">{track.title}</h2>
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
                              <h3 className="font-venite-italic text-[12px] tracking-widest text-[#4F8EF7] mb-3">COMPETENCES FOURNIES</h3>
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
                              <Link
                                href="/dashboard"
                                className="btn-secondary inline-flex items-center gap-2 text-[12px]"
                                style={{ padding: "10px 16px" }}
                              >
                                {isMine ? "Continuer" : "Demarrer"}
                                <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
                              </Link>
                              <Link
                                href="/projets"
                                className="btn-secondary inline-flex items-center gap-2 text-[12px]"
                                style={{ padding: "10px 16px" }}
                              >
                                Projets associes
                                <iconify-icon icon="lucide:folder-code" style={{ fontSize: "13px" }} />
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                href="/signin?next=/dashboard"
                                className="btn-secondary inline-flex items-center gap-2 text-[12px]"
                                style={{ padding: "10px 16px" }}
                              >
                                Connexion
                                <iconify-icon icon="lucide:log-in" style={{ fontSize: "13px" }} />
                              </Link>
                              <Link
                                href="/signup?next=/dashboard"
                                className="btn-secondary inline-flex items-center gap-2 text-[12px]"
                                style={{ padding: "10px 16px" }}
                              >
                                Commencer
                                <iconify-icon icon="lucide:play" style={{ fontSize: "13px" }} />
                              </Link>
                            </>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </section>
              </>
            ) : null}

            {!allTracks.length && schemaReady && !hasError ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 text-[13px] text-[#888] font-body-readable">
                Aucun parcours publie pour le moment.
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
