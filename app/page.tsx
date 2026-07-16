import { cookies } from "next/headers";
import CommunitySection from "../components/CommunitySection";
import CompetencesSection from "../components/CompetencesSection";
import FAQSection from "../components/FAQSection";
import FinalCtaSection from "../components/FinalCtaSection";
import FooterSection from "../components/FooterSection";
import Hero from "../components/Hero";
import HowItWorksSection from "../components/HowItWorksSection";
import Navbar from "../components/Navbar";
import ParcoursSection from "../components/ParcoursSection";
import ProjectsSection from "../components/ProjectsSection";
import RessourcesSection from "../components/RessourcesSection";
import SessionsLiveSection from "../components/SessionsLiveSection";
import ValuesSection from "../components/ValuesSection";
import { getPlatformStats } from "../lib/platformStats";
import { buildPageMetadata } from "../lib/seo";
import { listPublishedTracks } from "../lib/tracks";
import { createClient } from "../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Accueil",
  description:
    "TakaCode est la plateforme où tu apprends en construisant : parcours guidés, projets réels, sessions live et communauté active.",
  path: "/"
});

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const [{ tracks }, stats] = await Promise.all([
    listPublishedTracks(supabase, { limit: 7 }),
    getPlatformStats(supabase)
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main>
        <Hero stats={stats} />
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
        <FAQSection />
        <hr className="section-divider" />
        <FinalCtaSection />
        <hr className="section-divider" />
      </main>
      <FooterSection />
    </div>
  );
}
