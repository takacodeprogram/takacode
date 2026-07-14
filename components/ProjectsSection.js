import Link from "next/link";

export default function ProjectsSection() {
  return (
    <section className="py-28" id="projets">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-5">
          <div>
            <div className="section-label mb-4">GALERIE</div>
            <h2
              className="font-valorax gradient-text"
              style={{ fontSize: "clamp(28px, 3vw, 46px)", letterSpacing: "-0.02em", maxWidth: "600px" }}
            >
              DES PROJETS REELS.
              <br />
              PAS SEULEMENT DE LA THEORIE.
            </h2>
          </div>
          <Link href="/projets" id="projets-all-link" className="btn-secondary inline-flex items-center gap-2 self-start lg:self-auto">
            Voir tous les projets
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
          </Link>
        </div>
        <p className="font-body-readable text-[#666] text-[14px] mb-14">Les projets termines par les membres seront publies ici.</p>

        {/* Etat vide honnete: aucun projet publie tant que la communaute n'en a pas termine. */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <iconify-icon icon="lucide:rocket" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
          </div>
          <div>
            <div className="font-venite text-[15px] text-white mb-1.5">LA GALERIE DEMARRE AVEC TOI</div>
            <p className="font-body-readable text-[13px] text-[#777] max-w-[460px]">
              Aucun projet n'a encore ete publie. Termine ton premier parcours puis publie ton projet pour ouvrir la galerie de la communaute.
            </p>
          </div>
          <Link href="/parcours" id="projets-start-link" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:play" style={{ fontSize: "14px" }} />
            Commencer un parcours
          </Link>
        </div>

        <div className="flex items-center justify-center mt-10">
          <Link href="/projets" id="projets-publish-link" className="btn-secondary flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:upload" style={{ fontSize: "14px" }} />
            Publier mon projet
          </Link>
        </div>
      </div>
    </section>
  );
}