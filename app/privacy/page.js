import Link from "next/link";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Politique de confidentialité",
  description: "Consulte la politique de confidentialité TakaCode : données collectées, utilisation, protection et droits utilisateur.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/[0.04] via-transparent to-violet-900/[0.04] pointer-events-none" />
          <div className="max-w-[920px] mx-auto px-8 relative z-10">
            <div className="section-label mb-5">LEGAL</div>
            <h1 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(34px, 4.8vw, 58px)", letterSpacing: "-0.02em" }}>
              POLITIQUE DE CONFIDENTIALITE
            </h1>
            <p className="font-body-readable text-[#888] text-[15px] leading-relaxed max-w-[760px] mb-10">
              Cette page explique quelles données TakaCode collecte, comment elles sont utilisées et quelles options tu as pour les gérer.
              En utilisant la plateforme, tu acceptes les pratiques décrites ici.
            </p>

            <div className="space-y-8 font-body-readable">
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">1. Données collectées</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Nous pouvons collecter des informations de compte (nom, email), des données d'usage (pages consultées, progression),
                  et des données techniques (navigateur, appareil, logs de sécurité).
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">2. Utilisation des données</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Ces données sont utilisées pour fournir le service, améliorer l'expérience, personnaliser les contenus,
                  assurer la sécurité de la plateforme et communiquer des informations importantes.
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">3. Conservation et protection</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Les données sont conservées pendant la durée nécessaire au fonctionnement du service et protégées par des mesures
                  techniques et organisationnelles adaptées.
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">4. Tes droits</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Tu peux demander l'accès, la correction ou la suppression de tes données, selon la réglementation applicable.
                  Pour toute demande, utilise la page communauté/contact.
                </p>
              </section>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/terms" className="btn-primary glow-btn">Voir les conditions</Link>
              <Link href="/communaute" className="btn-secondary">Contacter TakaCode</Link>
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
