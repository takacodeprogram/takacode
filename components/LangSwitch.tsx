"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "./I18nProvider";
import type { Locale } from "../lib/i18n";
import { switchLocalePath } from "../utils/localePath";

interface Props {
  className?: string;
  alternatePath?: string;
}

export default function LangSwitch({ className = "", alternatePath }: Props) {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next: Locale = locale === "fr" ? "en" : "fr";
    const nextPath = alternatePath || switchLocalePath(pathname, locale, next);
    setLocale(next);
    router.push(nextPath);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center justify-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--border-4)] bg-[var(--overlay-3)] text-[var(--muted-2)] hover:text-[var(--text-primary)] hover:border-[var(--border-5)] transition-all min-w-[44px] ${className}`}
      aria-label={locale === "fr" ? t("navbar.switchToEnglish") : t("navbar.switchToFrench")}
    >
      <span className={locale === "en" ? "text-[var(--text-primary)]" : "text-[var(--muted-4)]"}>EN</span>
      <span className="text-[var(--muted-6)]">/</span>
      <span className={locale === "fr" ? "text-[var(--text-primary)]" : "text-[var(--muted-4)]"}>FR</span>
    </button>
  );
}
