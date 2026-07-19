import PageHeader from "../../../../components/app-shell/PageHeader";
import { PRODUCT_RELEASES } from "../../../../lib/productReleases";
import { buildPageMetadata } from "../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Nouveautes",
  description: "Les evolutions de TakaCode, version après version.",
  path: "/dashboard/nouveautes",
  noIndex: true
});

const STATUS_LABELS = {
  livree: "Livree",
  en_cours: "En cours",
  planifiee: "Planifiee"
};

const STATUS_CLASSES = {
  livree: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  en_cours: "border-blue-400/35 bg-blue-500/15 text-blue-200",
  planifiee: "border-white/[0.1] bg-white/[0.03] text-[#8d8d8d]"
};

export default function ProductUpdatesPage() {
  return (
    <>
      <PageHeader title="NOUVEAUTES" subtitle="TakaCode evolue avec toi" />

      <section className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-[#111] to-violet-500/10 p-5 md:p-6 mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="section-label mb-2">Journal produit</div>
            <h2 className="font-venite-italic text-[18px] md:text-[22px] text-white leading-tight mb-2">
              CHAQUE VERSION RAPPROCHE TON IDEE DE LA MISE EN LIGNE
            </h2>
            <p className="font-body-readable text-[12px] md:text-[13px] leading-relaxed text-[#a5a5a5]">
              Retrouve ici les grands changements livres, les ameliorations en cours et ce qu'ils changent concretement dans ton experience.
            </p>
          </div>
          <div className="shrink-0 rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/80 px-5 py-4 text-center">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#666] mb-1">Version actuelle</div>
            <div className="font-valorax text-3xl text-white">V{PRODUCT_RELEASES[0].version}</div>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {PRODUCT_RELEASES.map((release, index) => (
          <article key={release.version} className="project-card rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 font-venite-italic text-[13px] text-blue-200">
                  {release.version}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-venite-italic text-[15px] text-white">{release.title}</h2>
                    {index === 0 ? (
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-cyan-100">
                        Dernière version
                      </span>
                    ) : null}
                  </div>
                  <p className="font-body-readable text-[12px] leading-relaxed text-[#9b9b9b]">{release.summary}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end">
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${STATUS_CLASSES[release.status]}`}>
                  {STATUS_LABELS[release.status]}
                </span>
                <time className="text-[10px] text-[#666]">{release.date}</time>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {release.highlights.map((highlight) => (
                <div key={highlight} className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200" aria-hidden="true">
                    <iconify-icon icon="lucide:check" style={{ fontSize: "11px" }} />
                  </span>
                  <span className="font-body-readable text-[11px] leading-relaxed text-[#c7c7c7]">{highlight}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

