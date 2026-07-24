"use client";

import { useI18n } from "./I18nProvider";

export default function ValuesSection() {
  const { t } = useI18n();

  return (
    <section className="py-28 relative overflow-hidden" id="valeurs">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="mb-16">
          <div className="section-label mb-4">{t("values.sectionLabel")}</div>
          <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
            {t("values.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:target" className="text-[#4F8EF7]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">{t("values.cards.project.title")}</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">{t("values.cards.project.desc")}</p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:bot" className="text-[#9B6DFF]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">{t("values.cards.ai.title")}</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">{t("values.cards.ai.desc")}</p>
          </div>

          <div className="bg-[#151515] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer" style={{ borderColor: "rgba(79,142,247,0.12)", boxShadow: "0 0 40px rgba(79,142,247,0.06)" }}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:hammer" className="text-[#22D3EE]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">{t("values.cards.learning.title")}</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">{t("values.cards.learning.desc")}</p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:wallet" className="text-orange-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">{t("values.cards.monetization.title")}</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">{t("values.cards.monetization.desc")}</p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:users" className="text-green-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">{t("values.cards.community.title")}</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">{t("values.cards.community.desc")}</p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:rocket" className="text-[#4F8EF7]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">{t("values.cards.deploy.title")}</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">{t("values.cards.deploy.desc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
