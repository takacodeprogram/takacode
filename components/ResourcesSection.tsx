import Link from "next/link";
import { localePath } from "../lib/localeHelpers";
import { getServerLocale } from "../lib/serverLocale";
import { getLocale } from "../lib/i18n";

export default async function RessourcesSection() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  const tags = t("ressources.tags").split(",");

  return (
    <section className="py-28" id="ressources">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="section-label mb-4">{t("ressources.sectionLabel")}</div>
            <h2 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
              {t("ressources.title")}
            </h2>
            <p className="font-body-readable text-[#666] text-[15px] leading-relaxed mb-8 max-w-[420px]">
              {t("ressources.description")}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {tags.map((tag) => (
                <span key={tag} className="community-tag">{tag.trim()}</span>
              ))}
            </div>

            <Link href={localePath("/tracks", locale)} id="ressources-cta-link" className="btn-primary glow-btn inline-flex items-center gap-2" style={{ fontSize: "14px", padding: "14px 28px" }}>
              {t("ressources.cta")}
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "16px" }} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-4">
                <iconify-icon icon="lucide:file-text" className="text-[#4F8EF7]" style={{ fontSize: "16px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-1.5">{t("ressources.cards.guides.title")}</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-3">{t("ressources.cards.guides.desc")}</p>
              <div className="font-body-readable text-[10px] text-[#444]">{t("ressources.cards.guides.count")}</div>
            </div>

            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mb-4">
                <iconify-icon icon="lucide:play-circle" className="text-red-400" style={{ fontSize: "16px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-1.5">{t("ressources.cards.videos.title")}</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-3">{t("ressources.cards.videos.desc")}</p>
              <div className="font-body-readable text-[10px] text-[#444]">{t("ressources.cards.videos.count")}</div>
            </div>

            <div className="bg-[#151515] border border-white/[0.07] rounded-2xl p-5 card-hover" style={{ borderColor: "rgba(79,142,247,0.12)" }}>
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mb-4">
                <iconify-icon icon="lucide:layout-template" className="text-[#9B6DFF]" style={{ fontSize: "16px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-1.5">{t("ressources.cards.templates.title")}</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-3">{t("ressources.cards.templates.desc")}</p>
              <div className="font-body-readable text-[10px] text-[#444]">{t("ressources.cards.templates.count")}</div>
            </div>

            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center mb-4">
                <iconify-icon icon="lucide:wrench" className="text-orange-400" style={{ fontSize: "16px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-1.5">{t("ressources.cards.tools.title")}</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-3">{t("ressources.cards.tools.desc")}</p>
              <div className="font-body-readable text-[10px] text-[#444]">{t("ressources.cards.tools.count")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
