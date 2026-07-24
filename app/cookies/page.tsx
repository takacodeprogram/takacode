import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";
import { getServerLocale } from "../../lib/serverLocale";
import { getLocale } from "../../lib/i18n";

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({
    title: t("cookiesPage.title"),
    description: t("cookiesPage.description"),
    path: "/cookies"
  });
}

const SECTION_KEYS = ["essential", "noAds", "localStorage", "affiliate", "manage"] as const;

export default async function CookiesPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[760px] mx-auto">
            <div className="section-label mb-3">{t("cookiesPage.sectionLabel")}</div>
            <h1 className="font-valorax gradient-text" style={{ fontSize: "clamp(30px, 3.5vw, 46px)", letterSpacing: "-0.02em" }}>
              {t("cookiesPage.title")}
            </h1>
            <p className="font-body-readable text-[14px] text-[#888] mt-3 mb-10">
              {t("cookiesPage.description")}
            </p>

            <div className="space-y-4">
              {SECTION_KEYS.map((key) => (
                <article key={key} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
                  <h2 className="font-venite text-[13px] tracking-widest text-[#888] mb-2">{t(`cookiesPage.sections.${key}.title`).toUpperCase()}</h2>
                  <p className="font-body-readable text-[13px] text-[#a5a5a5] leading-relaxed">{t(`cookiesPage.sections.${key}.body`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
