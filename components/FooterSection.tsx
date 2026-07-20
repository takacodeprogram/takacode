"use client";

import Link from "next/link";
import type { StaticImageData } from "next/image";
import logoLight4 from "../assets/logos-light-png/logo-light-4.png";
import { useI18n } from "./I18nProvider";

export default function FooterSection() {
  const { t } = useI18n();
  return (
    <footer className="py-16">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
           <img src={logoLight4.src} alt="TakaCode" width="130" height="130" className="nav-logo-image opacity-80" />
          <p className="font-body-readable text-[12px] text-[#444]">{t("footer.tagline")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{t("footer.sections.platform")}</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/parcours" id="footer-parcours-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.parcours")}</Link></div>
              <div><Link href="/competences" id="footer-competences-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.competences")}</Link></div>
              <div><Link href="/projets" id="footer-projets-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.projets")}</Link></div>
              <div><Link href="/competences" id="footer-competences2-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.approche")}</Link></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{t("footer.sections.community")}</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/communaute" id="footer-communaute-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.communaute")}</Link></div>
              <div><Link href="/communaute#sessions" id="footer-sessions-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.sessionsLive")}</Link></div>
              <div><Link href="/communaute" id="footer-challenges-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.challenges")}</Link></div>
              <div><Link href="/projets" id="footer-galerie-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.galerieProjets")}</Link></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{t("footer.sections.account")}</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/signin" id="footer-connexion-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.connexion")}</Link></div>
              <div><Link href="/signup" id="footer-inscription-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.inscription")}</Link></div>
              <div><Link href="/dashboard" id="footer-profil-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.monDashboard")}</Link></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{t("footer.sections.company")}</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/" id="footer-about-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.aPropos")}</Link></div>
              <div><Link href="/communaute" id="footer-contact-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.contact")}</Link></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{t("footer.sections.legal")}</div>
            <div className="space-y-2.5 font-body-readable">
              <div><Link href="/privacy" id="footer-privacy-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.confidentialite")}</Link></div>
              <div><Link href="/terms" id="footer-terms-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.conditions")}</Link></div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-body-readable text-[11px] text-[#333]">{t("footer.copyright")}</div>
          <div className="font-body-readable flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/" id="footer-francais-link" className="text-[11px] text-[#444] hover:text-white transition-colors">{t("footer.footerLang")}</Link>
            <Link href="/parcours" id="footer-parcours-footer-link" className="text-[11px] text-[#444] hover:text-white transition-colors">{t("footer.links.parcours")}</Link>
            <Link href="/projets" id="footer-projets-footer-link" className="text-[11px] text-[#444] hover:text-white transition-colors">{t("footer.links.projets")}</Link>
            <Link href="/communaute" id="footer-communaute-footer-link" className="text-[11px] text-[#444] hover:text-white transition-colors">{t("footer.links.communaute")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
