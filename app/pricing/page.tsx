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
    title: t("tarifsPage.title"),
    description: t("tarifsPage.description"),
    path: "/pricing",
    locale
  });
}

export default async function TarifsPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/[0.04] via-transparent to-violet-900/[0.04] pointer-events-none" />
          <div className="max-w-[920px] mx-auto px-8 text-center relative z-10">
            <div className="section-label mb-5">{t("tarifsPage.sectionLabel")}</div>
            <h1 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(42px, 5vw, 70px)", letterSpacing: "-0.02em" }}>
              {t("tarifsPage.title")}
            </h1>
            <p className="font-body-readable text-[#888] text-[15px] leading-relaxed max-w-[620px] mx-auto mb-10">
              {t("tarifsPage.description")}
            </p>
            <div className="inline-flex items-center gap-3">
              <Link href={localePath("/tracks", locale)} className="btn-primary glow-btn">{t("tarifsPage.ctaTracks")}</Link>
              <Link href={localePath("/projects", locale)} className="btn-secondary">{t("tarifsPage.ctaProject")}</Link>
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
