import Link from "next/link";
import { cookies } from "next/headers";
import FooterSection from "../../components/FooterSection";
import Navbar from "../../components/Navbar";
import { listPublishedProjects } from "../../lib/userProjects";
import { buildPageMetadata } from "../../lib/seo";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Projets publies",
  description: "Découvre les projets digitaux construits et publiés par la communauté TakaCode.",
  path: "/projets"
});

function getLevelChipClass(levelLabel: string) {
  const normalized = String(levelLabel || "").toLowerCase();
  if (normalized.includes("debutant")) return "level-beginner";
  if (normalized.includes("inter") || normalized.includes("build") || normalized.includes("execution")) return "level-intermediate";
  return "level-advanced";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function ProjetsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { projects } = await listPublishedProjects(supabase, 50);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[1320px] mx-auto space-y-10">
            <div className="max-w-[930px]">
              <div className="section-label mb-4">Projets</div>
<h1 className="font-valorax gradient-text text-[clamp(34px,4vw,56px)] leading-[0.92]">
Les projets de la communauté
</h1>
              <p className="font-body-readable text-[15px] text-[#8d8d8d] mt-4 leading-relaxed">
                Découvre les projets digitaux construits, publies et parfois monetises par les membres TakaCode.
                Inspire-toi, explore les stacks et lance le tien.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <article className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4">
                <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Bibliothèque</div>
                <div className="font-venite-italic text-[20px] text-white">{projects.length} projets</div>
                <p className="font-body-readable text-[11px] text-[#767676] mt-1">Des projets publics par les membres.</p>
              </article>
              <article className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4">
                <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Objectif</div>
                <div className="font-venite-italic text-[20px] text-white">Publier</div>
                <p className="font-body-readable text-[11px] text-[#767676] mt-1">Chaque projet est en ligne et accessible.</p>
              </article>
              <article className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4">
                <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Prochaine étape</div>
                <div className="font-venite-italic text-[20px] text-white">Monétiser</div>
                <p className="font-body-readable text-[11px] text-[#767676] mt-1">Transformer un projet en revenus.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="px-8 pb-24">
          <div className="max-w-[1320px] mx-auto">
            {projects.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {projects.map((project) => (
                  <Link key={project.id} href={`/projets/${project.id}`} className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover block">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                          <iconify-icon icon="lucide:folder" style={{ color: "#4F8EF7", fontSize: "20px" }} />
                        </div>
                        <div>
                          <div className="text-[10px] text-[#777] uppercase tracking-widest">Projet</div>
                          <h3 className="font-venite-italic text-[15px] text-white leading-tight">{project.title}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.hasDeclaredFirstEuro ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                            <iconify-icon icon="lucide:badge-check" style={{ fontSize: "10px" }} />
                            1er euro
                          </span>
                        ) : null}
                        <span className="level-beginner text-[10px] font-semibold px-2.5 py-1 rounded-full">{project.status}</span>
                      </div>
                    </div>

                    {project.objective ? (
                      <div className="mb-4">
                        <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Objectif</div>
                        <p className="font-body-readable text-[12px] text-[#c9c9c9] leading-relaxed">{project.objective}</p>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#585858] font-body-readable">
                      {project.trackTitle ? <span>Parcours: {project.trackTitle}</span> : null}
                      {project.deadline ? <span>Deadline: {formatDate(project.deadline)}</span> : null}
                      {project.publishedAt ? <span>Publie le {formatDate(project.publishedAt)}</span> : null}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-16 text-center">
                <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center mx-auto mb-4">
                  <iconify-icon icon="lucide:rocket" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
                </div>
                <div className="font-venite text-[15px] text-white mb-1.5">Sois le premier à publier</div>
                <p className="font-body-readable text-[13px] text-[#777] max-w-[460px] mx-auto mb-6">
                  Aucun projet publie pour l'instant. La communauté attend tes realisations.
                </p>
                <Link href="/signup" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                  <iconify-icon icon="lucide:plus" style={{ fontSize: "14px" }} />
                  Rejoindre et créer mon projet
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
