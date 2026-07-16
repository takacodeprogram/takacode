import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Cookies",
  description: "Comment TakaCode utilise les cookies : uniquement l'essentiel.",
  path: "/cookies"
});

const SECTIONS = [
  {
    title: "Cookies essentiels",
    body: "Ils sont nécessaires au fonctionnement du site : garder ta session ouverte après connexion et mémoriser tes préférences (ex : consentement cookies, avatar). Sans eux, tu ne pourrais pas rester connecté."
  },
  {
    title: "Aucune publicite, aucun traceur tiers",
    body: "TakaCode n'utilise pas de cookies publicitaires ni de traceurs marketing tiers. Nous ne revendons pas tes données."
  },
  {
    title: "Stockage local",
    body: "Certaines préférences (consentement, guide vu, son activé/coupé) sont conservées dans le stockage local de ton navigateur, pas dans un cookie envoyé au serveur."
  },
  {
    title: "Liens d'affiliation",
    body: "Certains liens vers des outils recommandés sont affiliés : si tu passes par eux, TakaCode peut percevoir une commission sans coût supplémentaire pour toi. Ces liens peuvent déposer leurs propres cookies sur le site du partenaire, selon leur propre politique."
  },
  {
    title: "Gerer tes choix",
    body: "Tu peux effacer les cookies et le stockage local à tout moment depuis les paramètres de ton navigateur. La bannière de consentement réapparaîtra après effacement."
  }
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[760px] mx-auto">
            <div className="section-label mb-3">POLITIQUE</div>
            <h1 className="font-valorax gradient-text" style={{ fontSize: "clamp(30px, 3.5vw, 46px)", letterSpacing: "-0.02em" }}>
              COOKIES
            </h1>
            <p className="font-body-readable text-[14px] text-[#888] mt-3 mb-10">
              TakaCode utilise le strict minimum : des cookies essentiels au fonctionnement du site.
            </p>

            <div className="space-y-4">
              {SECTIONS.map((section) => (
                <article key={section.title} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
                  <h2 className="font-venite text-[13px] tracking-widest text-[#888] mb-2">{section.title.toUpperCase()}</h2>
                  <p className="font-body-readable text-[13px] text-[#a5a5a5] leading-relaxed">{section.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
