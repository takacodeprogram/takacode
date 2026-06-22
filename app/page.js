import { cookies } from "next/headers";
import CommunitySection from "../components/CommunitySection.js";
import CompetencesSection from "../components/CompetencesSection.js";
import FAQSection from "../components/FAQSection.js";
import FinalCtaSection from "../components/FinalCtaSection.js";
import FooterSection from "../components/FooterSection.js";
import Hero from "../components/Hero.js";
import HowItWorksSection from "../components/HowItWorksSection.js";
import Navbar from "../components/Navbar.js";
import ParcoursSection from "../components/ParcoursSection.js";
import ProjectsSection from "../components/ProjectsSection.js";
import RessourcesSection from "../components/RessourcesSection.js";
import SessionsLiveSection from "../components/SessionsLiveSection.js";
import TestimonialsSection from "../components/TestimonialsSection.js";
import ValuesSection from "../components/ValuesSection.js";
import { buildPageMetadata } from "../lib/seo";
import { listPublishedTracks } from "../lib/tracks";
import { createClient } from "../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Accueil",
  description:
    "TakaCode est la plateforme ou tu apprends en construisant: parcours guides, projets reels, sessions live et communaute active.",
  path: "/"
});

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { tracks } = await listPublishedTracks(supabase, { limit: 7 });

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
        <ParcoursSection tracks={tracks} />
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
