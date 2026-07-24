"use client";

import { useI18n } from "./I18nProvider";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default function FAQSection() {
  const { t } = useI18n();
  return (
    <section className="py-28">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="section-label mb-4">{t("faq.sectionLabel")}</div>
            <h2 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(32px, 3vw, 48px)", letterSpacing: "-0.02em" }}>
              {t("faq.title1")}
              <br />
              {t("faq.title2")}
            </h2>
            <p className="font-body-readable text-[#666] text-[15px] leading-relaxed">{t("faq.subtitle")}</p>
          </div>

          <div className="space-y-0">
            {FAQ_KEYS.map((key, index) => (
              <div key={key} className="faq-item py-5" style={index === FAQ_KEYS.length - 1 ? { borderBottom: "none" } : undefined}>
                <div className="faq-question flex items-center justify-between">
                  <span className="font-body-readable text-[14px] text-[#CCC] font-medium">{t(`faq.questions.${key}`)}</span>
                  <iconify-icon icon="lucide:plus" className="text-[#444] flex-shrink-0" style={{ fontSize: "16px" }} />
                </div>
                {key === "q1" ? (
                  <p className="font-body-readable text-[13px] text-[#555] mt-3 leading-relaxed hidden">{t("faq.answers.q1")}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
