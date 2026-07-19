import Link from "next/link";
import { cookies } from "next/headers";
import { listPublishedProjects } from "../lib/userProjects";
import { createClient } from "../utils/supabase/server";

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function ProjectsSection() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { projects } = await listPublishedProjects(supabase, 6);

  return (
    <section className="py-28" id="projets">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-5">
          <div>
            <div className="section-label mb-4">Galerie</div>
            <h2
              className="font-valorax gradient-text"
              style={{ fontSize: "clamp(28px, 3vw, 46px)", letterSpacing: "-0.02em", maxWidth: "600px" }}
            >
              Des projets publiés.
              <br />
              Pas seulement des exercices.
            </h2>
          </div>
          <Link href="/projets" id="projets-all-link" className="btn-secondary inline-flex items-center gap-2 self-start lg:self-auto">
            Voir tous les projets
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
          </Link>
        </div>
        <p className="font-body-readable text-[#666] text-[14px] mb-14">Les projets publiés par les membres apparaissent ici.</p>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <article key={project.id} className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                    <iconify-icon icon="lucide:folder" style={{ color: "#4F8EF7", fontSize: "18px" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#777] uppercase tracking-widest">Projet</div>
                    <h3 className="font-venite-italic text-[14px] text-white leading-tight truncate">{project.title}</h3>
                  </div>
                  {project.hasDeclaredFirstEuro ? (
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shrink-0">
                      <iconify-icon icon="lucide:badge-check" style={{ fontSize: "10px" }} />
                      1er euro
                    </span>
                  ) : null}
                </div>
                {project.objective ? (
                  <p className="font-body-readable text-[11px] text-[#a5a5a5] leading-relaxed mb-3 line-clamp-2">{project.objective}</p>
                ) : null}
                <div className="flex items-center gap-3 text-[10px] text-[#585858] font-body-readable">
                  {project.revenueModel ? <span>Modele: {project.revenueModel}</span> : null}
                  {project.publishedAt ? <span>Publie le {formatDate(project.publishedAt)}</span> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
              <iconify-icon icon="lucide:rocket" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
            </div>
            <div>
              <div className="font-venite text-[15px] text-white mb-1.5">La galerie démarre avec toi</div>
              <p className="font-body-readable text-[13px] text-[#777] max-w-[460px]">
                Aucun projet publie pour l'instant. Construis ton projet, publie-le et inspire la communauté.
              </p>
            </div>
            <Link href="/projets" id="projets-start-link" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
              <iconify-icon icon="lucide:play" style={{ fontSize: "14px" }} />
              Commencer un projet
            </Link>
          </div>
        )}

        <div className="flex items-center justify-center mt-10">
          <Link href="/signup" id="projets-publish-link" className="btn-secondary flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:upload" style={{ fontSize: "14px" }} />
            Rejoindre et publier mon projet
          </Link>
        </div>
      </div>
    </section>
  );
}
