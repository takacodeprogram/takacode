"use client";

import Link from "next/link";
import type { StaticImageData } from "next/image";
import logoLight4 from "../assets/logos-light-png/logo-light-4.png";
import L from "./L";
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
              <div><L href="/tracks" id="footer-parcours-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.parcours")}</L></div>
              <div><L href="/skills" id="footer-competences-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.competences")}</L></div>
              <div><L href="/projects" id="footer-projets-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.projets")}</L></div>
              <div><L href="/skills" id="footer-competences2-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.approche")}</L></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{t("footer.sections.community")}</div>
            <div className="space-y-2.5 font-body-readable">
              <div><L href="/community" id="footer-communaute-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.communaute")}</L></div>
              <div><L href="/community#sessions" id="footer-sessions-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.sessionsLive")}</L></div>
              <div><L href="/community" id="footer-challenges-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.challenges")}</L></div>
              <div><L href="/projects" id="footer-galerie-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.galerieProjets")}</L></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{t("footer.sections.account")}</div>
            <div className="space-y-2.5 font-body-readable">
              <div><L href="/signin" id="footer-connexion-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.connexion")}</L></div>
              <div><L href="/signup" id="footer-inscription-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.inscription")}</L></div>
              <div><L href="/dashboard" id="footer-profil-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.monDashboard")}</L></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{t("footer.sections.company")}</div>
            <div className="space-y-2.5 font-body-readable">
              <div><L href="/" id="footer-about-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.aPropos")}</L></div>
              <div><L href="/community" id="footer-contact-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.contact")}</L></div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-[#444] uppercase tracking-widest mb-4">{t("footer.sections.legal")}</div>
            <div className="space-y-2.5 font-body-readable">
              <div><L href="/privacy" id="footer-privacy-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.confidentialite")}</L></div>
              <div><L href="/terms" id="footer-terms-link" className="text-[12px] text-[#555] hover:text-white transition-colors">{t("footer.links.conditions")}</L></div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-body-readable text-[11px] text-[#333]">{t("footer.copyright")}</div>
          <div className="font-body-readable flex flex-wrap items-center gap-x-5 gap-y-2">
            <L href="/" id="footer-francais-link" className="text-[11px] text-[#444] hover:text-white transition-colors">{t("footer.footerLang")}</L>
            <L href="/tracks" id="footer-parcours-footer-link" className="text-[11px] text-[#444] hover:text-white transition-colors">{t("footer.links.parcours")}</L>
            <L href="/projects" id="footer-projets-footer-link" className="text-[11px] text-[#444] hover:text-white transition-colors">{t("footer.links.projets")}</L>
            <L href="/community" id="footer-communaute-footer-link" className="text-[11px] text-[#444] hover:text-white transition-colors">{t("footer.links.communaute")}</L>
          </div>
        </div>
      </div>
    </footer>
  );
}
