import Navbar from "../../components/Navbar";
import CompetencesSection from "../../components/CompetencesSection";
import FooterSection from "../../components/FooterSection";

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