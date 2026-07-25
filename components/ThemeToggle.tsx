"use client";

import { useTheme } from "./ThemeProvider";
import { useI18n } from "./I18nProvider";

interface Props {
  className?: string;
}

export default function ThemeToggle({ className = "" }: Props) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const isDark = theme === "dark";
  const label = isDark
    ? t("navbar.themeLight", "Passer en mode clair")
    : t("navbar.themeDark", "Passer en mode sombre");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border-4)] bg-[var(--overlay-3)] text-[var(--muted-2)] hover:text-[var(--text-primary)] hover:border-[var(--border-5)] transition-all ${className}`}
      aria-label={label}
      title={label}
    >
      <iconify-icon icon={isDark ? "lucide:sun" : "lucide:moon"} style={{ fontSize: "16px" }} />
    </button>
  );
}
