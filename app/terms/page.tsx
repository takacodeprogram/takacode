import Link from "next/link";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";
import { localePath } from "../../lib/localeHelpers";
import { getServerLocale } from "../../lib/serverLocale";
import { getLocale } from "../../lib/i18n";

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({
    title: t("termsPage.title"),
    description: t("termsPage.description"),
    path: "/terms"
  });
}

const TERMS_SECTIONS = ["purpose", "account", "acceptableUse", "intellectualProperty", "modifications"] as const;

export default async function TermsPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/[0.04] via-transparent to-violet-900/[0.04] pointer-events-none" />
          <div className="max-w-[920px] mx-auto px-8 relative z-10">
            <div className="section-label mb-5">{t("termsPage.sectionLabel")}</div>
            <h1 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(34px, 4.8vw, 58px)", letterSpacing: "-0.02em" }}>
              {t("termsPage.title")}
            </h1>
            <p className="font-body-readable text-[#888] text-[15px] leading-relaxed max-w-[760px] mb-10">
              {t("termsPage.description")}
            </p>

            <div className="space-y-8 font-body-readable">
              {TERMS_SECTIONS.map((key) => (
                <section key={key} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                  <h2 className="text-[16px] font-semibold text-white mb-3">{t(`termsPage.sections.${key}.title`)}</h2>
                  <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                    {t(`termsPage.sections.${key}.body`)}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href={localePath("/privacy", locale)} className="btn-primary glow-btn">{t("termsPage.cta.privacy")}</Link>
              <Link href={localePath("/community", locale)} className="btn-secondary">{t("termsPage.cta.contact")}</Link>
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
