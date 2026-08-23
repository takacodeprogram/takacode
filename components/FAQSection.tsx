"use client";

import { useI18n } from "./I18nProvider";
import { useState } from "react";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default function FAQSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            <p className="font-body-readable text-[var(--muted-4)] text-[15px] leading-relaxed">{t("faq.subtitle")}</p>
          </div>

          <div className="space-y-0">
            {FAQ_KEYS.map((key, index) => {
              const isOpen = openIndex === index;
              const answer = t(`faq.answers.${key}`);
              return (
                <div
                  key={key}
                  className="faq-item py-5 cursor-pointer"
                  style={index === FAQ_KEYS.length - 1 ? { borderBottom: "none" } : undefined}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <div className="faq-question flex items-center justify-between">
                    <span className="font-body-readable text-[14px] text-[var(--muted-1)] font-medium">{t(`faq.questions.${key}`)}</span>
                    <iconify-icon
                      icon="lucide:chevron-down"
                      className="text-[var(--muted-6)] flex-shrink-0 transition-transform duration-200"
                      style={{ fontSize: "16px", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                    />
                  </div>
                  {isOpen && answer && (
                    <p className="font-body-readable text-[13px] text-[var(--muted-5)] mt-3 leading-relaxed">{answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
