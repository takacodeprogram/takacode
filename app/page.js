import Navbar from "../components/Navbar.js";
import Hero from "../components/Hero.js";
import ValuesSection from "../components/ValuesSection.js";
import HowItWorksSection from "../components/HowItWorksSection.js";
import CompetencesSection from "../components/CompetencesSection.js";
import ParcoursSection from "../components/ParcoursSection.js";
import RessourcesSection from "../components/RessourcesSection.js";
import SessionsLiveSection from "../components/SessionsLiveSection.js";
import ProjectsSection from "../components/ProjectsSection.js";
import CommunitySection from "../components/CommunitySection.js";
import TestimonialsSection from "../components/TestimonialsSection.js";
import FAQSection from "../components/FAQSection.js";
import FinalCtaSection from "../components/FinalCtaSection.js";
import FooterSection from "../components/FooterSection.js";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main>
        <Hero />
        <ValuesSection />
        <hr className="section-divider" />
        <HowItWorksSection />
        <hr className="section-divider" />
        <CompetencesSection />
        <hr className="section-divider" />
        <ParcoursSection />
        <hr className="section-divider" />
        <RessourcesSection />
        <hr className="section-divider" />
        <SessionsLiveSection />
        <hr className="section-divider" />
        <ProjectsSection />
        <hr className="section-divider" />
        <CommunitySection />
        <hr className="section-divider" />
        <TestimonialsSection />
        <hr className="section-divider" />
        <FAQSection />
        <hr className="section-divider" />
        <FinalCtaSection />
        <hr className="section-divider" />
      </main>
      <FooterSection />
    </div>
  );
}
