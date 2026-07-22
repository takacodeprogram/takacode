import { cookies } from "next/headers";
import CommunitySection from "../components/CommunitySection";
import SkillsSection from "../components/SkillsSection";
import FAQSection from "../components/FAQSection";
import FinalCtaSection from "../components/FinalCtaSection";
import FooterSection from "../components/FooterSection";
import GlobeSection from "../components/GlobeSection";
import Hero from "../components/Hero";
import HowItWorksSection from "../components/HowItWorksSection";
import Navbar from "../components/Navbar";
import TracksSection from "../components/TracksSection";
import ProjectsSection from "../components/ProjectsSection";
import ResourcesSection from "../components/ResourcesSection";
import SessionsLiveSection from "../components/SessionsLiveSection";
import StartupLoader from "../components/StartupLoader";
import ValuesSection from "../components/ValuesSection";
import { getPlatformStats } from "../lib/platformStats";
import { getServerLocale } from "../lib/serverLocale";
import { buildPageMetadata } from "../lib/seo";
import { getPublicLeaderboard } from "../lib/leaderboard";
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
  const locale = await getServerLocale();
  const [{ tracks }, stats] = await Promise.all([
    listPublishedTracks(supabase, { limit: 7, locale }),
    getPlatformStats(supabase)
  ]);

  const { entries } = await getPublicLeaderboard(supabase, 200);
  const countryCount = new Map<string, number>();
  for (const e of entries) {
    if (e.countryCode) {
      countryCount.set(e.countryCode, (countryCount.get(e.countryCode) || 0) + 1);
    }
  }
  const globeMarkers = Array.from(countryCount.entries())
    .filter(([, count]) => count > 0)
    .map(([countryCode, count]) => ({ countryCode, count }));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <StartupLoader />
      <Navbar />
      <main>
        <Hero stats={stats} />
        <ValuesSection />
        <hr className="section-divider" />
        <HowItWorksSection />
        <hr className="section-divider" />
        <SkillsSection />
        <hr className="section-divider" />
        <TracksSection tracks={tracks} />
        <hr className="section-divider" />
        <ResourcesSection />
        <hr className="section-divider" />
        <SessionsLiveSection />
        <hr className="section-divider" />
        <ProjectsSection />
        <hr className="section-divider" />
        <CommunitySection />
        <hr className="section-divider" />
        <GlobeSection markers={globeMarkers} />
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
