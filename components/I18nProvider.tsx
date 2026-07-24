"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { Locale } from "../lib/i18n";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, createT } from "../lib/i18n";

// ─── Constantes ─────────────────────────────────────────────────

const STORAGE_KEY = "takacode_locale";

// ─── Types ───────────────────────────────────────────────────────

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: ReturnType<typeof createT>;
  isLoaded: boolean;
}

// ─── Context ─────────────────────────────────────────────────────

const I18nContext = createContext<I18nContextValue | null>(null);

// ─── Helpers ─────────────────────────────────────────────────────

export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;

  const raw = navigator.language || navigator.languages?.[0] || "";
  const lang = raw.slice(0, 2).toLowerCase();

  if (SUPPORTED_LOCALES.includes(lang as Locale)) {
    return lang as Locale;
  }
  return DEFAULT_LOCALE;
}

export function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch {
    // localStorage inaccessible (SSR, private browsing restrictions)
  }
  return detectBrowserLocale();
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function updateHtmlLang(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
}

// ─── Lecture du cookie (set via middleware) ──────────────────────

export function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)takacode_locale=([^;]*)/);
  if (match) {
    const val = match[1] as Locale;
    if (SUPPORTED_LOCALES.includes(val)) return val;
  }
  return null;
}

export function persistCookieLocale(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `takacode_locale=${locale};path=/;max-age=${60 * 60 * 24 * 365};sameSite=lax`;
}

// ─── Provider ────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize locale on mount (client-side only)
  useEffect(() => {
    const fromCookie = readCookieLocale();
    const initial = fromCookie || readStoredLocale();
    setLocaleState(initial);
    updateHtmlLang(initial);
    setIsLoaded(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return;
    setLocaleState(newLocale);
    persistLocale(newLocale);
    persistCookieLocale(newLocale);
    updateHtmlLang(newLocale);
  }, []);

  const t = useMemo(() => createT(locale), [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, isLoaded }),
    [locale, setLocale, t, isLoaded]
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an <I18nProvider>");
  }
  return context;
}
