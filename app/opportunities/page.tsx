import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import OpportunitiesSection from "../../components/OpportunitiesSection";
import { buildPageMetadata } from "../../lib/seo";
import { getServerLocale } from "../../lib/serverLocale";
import { getLocale } from "../../lib/i18n";

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({
    title: t("opportunitiesPage.metaTitle"),
    description: t("opportunitiesPage.metaDescription"),
    path: "/opportunities",
    locale
  });
}

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Navbar />
      <main className="pt-[64px]">
        <OpportunitiesSection />
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
