import Navbar from "../../components/Navbar";
import SkillsSection from "../../components/SkillsSection";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";
import { getServerLocale } from "../../lib/serverLocale";

export const metadata = buildPageMetadata({
  title: "Compétences et projets",
  description: "Découvre les types de projets que tu peux construire avec TakaCode : web, IA, data, web3, 3D, mobile, contenu et business digital.",
  path: "/skills"
});

export default async function CompetencesPage() {
  const locale = await getServerLocale();
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <SkillsSection />
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
