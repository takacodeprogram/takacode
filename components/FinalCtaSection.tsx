import Link from "next/link";
import { localePath } from "../lib/localeHelpers";
import { getServerLocale } from "../lib/serverLocale";
import { getLocale } from "../lib/i18n";

export default async function FinalCtaSection() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.04] rounded-full filter blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/[0.05] rounded-full filter blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-8 text-center">
        <div className="section-label mb-6">{t("finalCta.sectionLabel")}</div>
        <h2 className="font-valorax mb-6" style={{ fontSize: "clamp(42px, 5vw, 72px)", letterSpacing: "-0.02em", lineHeight: "0.95" }}>
          <span className="gradient-text">{t("finalCta.title1")}</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #4F8EF7 0%, #9B6DFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("finalCta.title2")}
          </span>
        </h2>
        <p className="font-body-readable text-[#666] text-[15px] leading-relaxed mb-3 max-w-[500px] mx-auto">{t("finalCta.desc1")}</p>
        <p className="font-body-readable text-[#888] text-[15px] leading-relaxed mb-3">{t("finalCta.desc2")}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link href={localePath("/projects", locale)} id="final-cta-primary" className="btn-primary glow-btn flex items-center gap-2" style={{ fontSize: "15px", padding: "16px 36px" }}>
            <iconify-icon icon="lucide:zap" style={{ fontSize: "18px" }} />
            {t("finalCta.ctaPrimary")}
          </Link>
          <Link href={localePath("/tracks", locale)} id="final-cta-secondary" className="btn-secondary flex items-center gap-2" style={{ fontSize: "15px", padding: "16px 36px" }}>
            {t("finalCta.ctaSecondary")}
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "16px" }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
