import Navbar from "../../components/Navbar";
import CompetencesSection from "../../components/CompetencesSection";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Competences et projets",
  description: "Decouvre les types de projets que tu peux construire avec TakaCode : web, IA, data, web3, 3D, mobile, contenu et business digital.",
  path: "/competences"
});

export default function CompetencesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <CompetencesSection />
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
