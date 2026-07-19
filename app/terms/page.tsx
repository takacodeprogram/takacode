import Link from "next/link";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Conditions d'utilisation",
  description: "Lis les conditions d'utilisation de TakaCode pour comprendre les règles d'usage de la plateforme.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/[0.04] via-transparent to-violet-900/[0.04] pointer-events-none" />
          <div className="max-w-[920px] mx-auto px-8 relative z-10">
            <div className="section-label mb-5">LEGAL</div>
            <h1 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(34px, 4.8vw, 58px)", letterSpacing: "-0.02em" }}>
              CONDITIONS D'UTILISATION
            </h1>
            <p className="font-body-readable text-[#888] text-[15px] leading-relaxed max-w-[760px] mb-10">
              Ces conditions definissent les regles d'usage de TakaCode. En utilisant la plateforme, tu acceptes les termes ci-dessous.
            </p>

            <div className="space-y-8 font-body-readable">
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">1. Objet du service</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  TakaCode fournit des parcours, ressources et outils de création de projets numériques a vocation educative.
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">2. Compte utilisateur</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Tu es responsable des informations de ton compte et de la confidentialite de tes accès.
                  Toute activite effectuee depuis ton compte est presumee t'etre attribuable.
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">3. Usage acceptable</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Il est interdit d'utiliser la plateforme pour des activites illegales, malveillantes, frauduleuses,
                  ou portant atteinte aux autres utilisateurs et aux infrastructures.
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">4. Propriete intellectuelle</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  Les contenus, marques et éléments de la plateforme restent la propriété de TakaCode ou de leurs ayants droit,
                  sauf mention contraire explicite.
                </p>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h2 className="text-[16px] font-semibold text-white mb-3">5. Modification des conditions</h2>
                <p className="text-[14px] leading-relaxed text-[#9A9A9A]">
                  TakaCode peut mettre à jour ces conditions a tout moment. La version en ligne fait foi.
                </p>
              </section>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/privacy" className="btn-primary glow-btn">Voir la politique de confidentialite</Link>
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
