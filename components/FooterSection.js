import Link from "next/link";
import logoLight4 from "../assets/logos-light-png/logo-light-4.png";

export default function FooterSection() {
  return (
    <footer className="py-16">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <img src={logoLight4.src} alt="TakaCode" width="130" height="130" className="nav-logo-image opacity-80" />
          <p className="font-body-readable text-[12px] text-[#444]">L'atelier numerique ou l'on apprend en construisant.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">Plateforme</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/parcours" id="footer-parcours-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Parcours</Link></div>
              <div><Link href="/competences" id="footer-competences-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Competences</Link></div>
              <div><Link href="/projets" id="footer-projets-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Projets</Link></div>
              <div><Link href="/competences" id="footer-competences2-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Approche</Link></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">Communaute</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/communaute" id="footer-communaute-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Communaute</Link></div>
              <div><Link href="/communaute#sessions" id="footer-sessions-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Sessions live</Link></div>
              <div><Link href="/communaute" id="footer-challenges-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Challenges</Link></div>
              <div><Link href="/projets" id="footer-galerie-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Galerie projets</Link></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">Compte</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/signin" id="footer-connexion-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Connexion</Link></div>
              <div><Link href="/signup" id="footer-inscription-link" className="text-[12px] text-[#555] hover:text-white transition-colors">S'inscrire</Link></div>
              <div><Link href="/tarifs" id="footer-tarifs-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Tarifs</Link></div>
              <div><Link href="/dashboard" id="footer-profil-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Mon dashboard</Link></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">Entreprise</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/" id="footer-about-link" className="text-[12px] text-[#555] hover:text-white transition-colors">A propos</Link></div>
              <div><Link href="/communaute" id="footer-contact-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Contact</Link></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">Legal</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/privacy" id="footer-privacy-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Confidentialite</Link></div>
              <div><Link href="/terms" id="footer-terms-link" className="text-[12px] text-[#555] hover:text-white transition-colors">Conditions</Link></div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-body-readable text-[11px] text-[#333]">(c) 2025 TakaCode. Tous droits réservés.</div>
          <div className="font-body-readable flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/" id="footer-francais-link" className="text-[11px] text-[#444] hover:text-white transition-colors">Francais</Link>
            <Link href="/parcours" id="footer-parcours-footer-link" className="text-[11px] text-[#444] hover:text-white transition-colors">Parcours</Link>
            <Link href="/projets" id="footer-projets-footer-link" className="text-[11px] text-[#444] hover:text-white transition-colors">Projets</Link>
            <Link href="/communaute" id="footer-communaute-footer-link" className="text-[11px] text-[#444] hover:text-white transition-colors">Communaute</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
