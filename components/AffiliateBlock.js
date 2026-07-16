import { categoryLabel } from "../lib/affiliate";

// Bloc "Fournisseurs recommandés" réutilisable (leçons, page outils, communauté).
// Les liens portent rel="sponsored" (transparence affiliation).
export default function AffiliateBlock({ links = [], heading = "Fournisseurs recommandes", grouped = false }) {
  if (!Array.isArray(links) || links.length === 0) {
    return null;
  }

  const groups = grouped
    ? links.reduce((acc, link) => {
        (acc[link.category] = acc[link.category] || []).push(link);
        return acc;
      }, {})
    : { all: links };

  return (
    <section className="space-y-4">
      {heading ? <h2 className="font-venite text-[13px] tracking-widest text-[#888]">{heading.toUpperCase()}</h2> : null}

      {Object.entries(groups).map(([key, items]) => (
        <div key={key} className="space-y-2.5">
          {grouped ? <div className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{categoryLabel(key)}</div> : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((link) => (
              <a
                key={link.id}
                href={link.url || "#"}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="rounded-2xl border border-white/[0.08] bg-[#111] p-4 card-hover flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center shrink-0 overflow-hidden">
                  {link.logoUrl ? (
                    <img src={link.logoUrl} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <iconify-icon icon="lucide:external-link" style={{ fontSize: "16px", color: "#89c7ff" }} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-white font-semibold leading-tight">{link.title || link.provider}</div>
                  {link.description ? <p className="font-body-readable text-[11px] text-[#9b9b9b] leading-snug mt-0.5">{link.description}</p> : null}
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#4F8EF7] mt-1.5">
                    Voir l'offre
                    <iconify-icon icon="lucide:arrow-up-right" style={{ fontSize: "11px" }} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      <p className="text-[10px] text-[#555] font-body-readable">Certains liens sont affilies : ils soutiennent TakaCode sans cout supplementaire pour toi.</p>
    </section>
  );
}
