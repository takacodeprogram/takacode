import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import CommunityLivesPage from "../../components/CommunityLivesPage";

export default function CommunautePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <CommunityLivesPage />
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
