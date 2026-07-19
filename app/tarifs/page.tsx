import Link from "next/link";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Tarifs",
  description: "Les formules TakaCode seront publiees ici. En attendant, démarre gratuitement.",
  path: "/tarifs"
});

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/[0.04] via-transparent to-violet-900/[0.04] pointer-events-none" />
          <div className="max-w-[920px] mx-auto px-8 text-center relative z-10">
            <div className="section-label mb-5">TARIFS</div>
            <h1 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(42px, 5vw, 70px)", letterSpacing: "-0.02em" }}>
              CONSTRUIS, LANCE, GAGNE
            </h1>
            <p className="font-body-readable text-[#888] text-[15px] leading-relaxed max-w-[620px] mx-auto mb-10">
              Les formules seront publiees ici. En attendant, démarre gratuitement et construis ton premier projet. 
              L idée est de t'aider a réaliser des projets digitaux qui peuvent un jour te rapporter.
            </p>
            <div className="inline-flex items-center gap-3">
              <Link href="/parcours" className="btn-primary glow-btn">Voir les parcours</Link>
              <Link href="/projets" className="btn-secondary">Commencer un projet</Link>
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
