import Link from "next/link";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Politique de confidentialite",
  description: "Consulte la politique de confidentialite TakaCode : donnees collectees, utilisation, protection et droits utilisateur.",
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
              Cette page explique quelles donnees TakaCode collecte, comment elles sont utilisees et quelles options tu as pour les gerer.
              En utilisant la plateforme, tu acceptes les pratiques decrites ici.
            </p>

            <div className="space-y-8 font-body-readable">
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">1. Donnees collectees</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Nous pouvons collecter des informations de compte (nom, email), des donnees d'usage (pages consultees, progression),
                  et des donnees techniques (navigateur, appareil, logs de securite).
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">2. Utilisation des donnees</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Ces donnees sont utilisees pour fournir le service, ameliorer l'experience, personnaliser les contenus,
                  assurer la securite de la plateforme et communiquer des informations importantes.
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">3. Conservation et protection</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Les donnees sont conservees pendant la duree necessaire au fonctionnement du service et protegees par des mesures
                  techniques et organisationnelles adaptees.
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">4. Tes droits</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Tu peux demander l'acces, la correction ou la suppression de tes donnees, selon la reglementation applicable.
                  Pour toute demande, utilise la page communaute/contact.
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
