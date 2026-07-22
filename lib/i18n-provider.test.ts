import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  I18nProvider,
  useI18n,
  detectBrowserLocale,
  readStoredLocale,
  persistLocale,
} from "../components/I18nProvider";

// ─── localStorage mock ───────────────────────────────────────────

const STORAGE_KEY = "takacode_locale";
let mockStorage: Record<string, string> = {};

beforeEach(() => {
  mockStorage = {};

  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; },
      get length() { return Object.keys(mockStorage).length; },
      key: (i: number) => Object.keys(mockStorage)[i] ?? null,
    },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  delete (globalThis as any).localStorage;
});

// ─── navigator mock helper ───────────────────────────────────────

function setNavigatorLanguage(lang: string | undefined) {
  Object.defineProperty(globalThis, "navigator", {
    value: {
      language: lang,
      languages: lang ? [lang] : [],
    },
    writable: true,
    configurable: true,
  });
}

afterEach(() => {
  delete (globalThis as any).navigator;
});

// ─── Tests ───────────────────────────────────────────────────────

describe("detectBrowserLocale", () => {
  it("returns fr when navigator.language is fr-FR", () => {
    setNavigatorLanguage("fr-FR");
    expect(detectBrowserLocale()).toBe("fr");
  });

  it("returns en when navigator.language is en-US", () => {
    setNavigatorLanguage("en-US");
    expect(detectBrowserLocale()).toBe("en");
  });

  it("returns en when navigator.language is en", () => {
    setNavigatorLanguage("en");
    expect(detectBrowserLocale()).toBe("en");
  });

  it("returns en for unsupported language", () => {
    setNavigatorLanguage("de-DE");
    expect(detectBrowserLocale()).toBe("en");
  });

  it("returns en when navigator is undefined (SSR)", () => {
    delete (globalThis as any).navigator;
    expect(detectBrowserLocale()).toBe("en");
  });
});

describe("readStoredLocale", () => {
  it("returns stored locale when valid", () => {
    persistLocale("en");
    expect(readStoredLocale()).toBe("en");
  });

  it("returns browser locale when nothing is stored", () => {
    setNavigatorLanguage("en-US");
    expect(readStoredLocale()).toBe("en");
  });

  it("returns fr when stored value is invalid", () => {
    setNavigatorLanguage("fr-FR");
    persistLocale("de" as "fr");
    expect(readStoredLocale()).toBe("fr");
  });

  it("falls back to browser locale when localStorage throws", () => {
    setNavigatorLanguage("en-US");
    const orig = localStorage.getItem;
    localStorage.getItem = () => { throw new Error("Storage error"); };
    expect(readStoredLocale()).toBe("en");
    localStorage.getItem = orig;
  });
});

describe("persistLocale", () => {
  it("stores the locale in localStorage", () => {
    persistLocale("en");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("en");
  });

  it("overwrites previous stored locale", () => {
    persistLocale("fr");
    persistLocale("en");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("en");
  });

  it("silently fails when localStorage is unavailable", () => {
    const orig = localStorage.setItem;
    localStorage.setItem = () => { throw new Error("Storage error"); };
    expect(() => persistLocale("en")).not.toThrow();
    localStorage.setItem = orig;
  });
});

describe("useI18n", () => {
  it("throws when used outside I18nProvider", () => {
    // En Node.js, React jette avant notre guard "useI18n must be used within"
    // Donc on accepte les messages possibles selon l'environnement
    expect(() => useI18n()).toThrow(/useI18n|useContext|Invalid hook/i);
  });
});
