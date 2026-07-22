import { describe, it, expect } from "vitest";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  createT,
  detectLocale,
  getLocale,
  getAlternateUrls,
  useLocale
} from "./i18n";

describe("SUPPORTED_LOCALES", () => {
  it("includes fr and en", () => {
    expect(SUPPORTED_LOCALES).toContain("fr");
    expect(SUPPORTED_LOCALES).toContain("en");
  });

  it("has exactly 2 locales", () => {
    expect(SUPPORTED_LOCALES).toHaveLength(2);
  });

  it("has fr as the first locale", () => {
    expect(SUPPORTED_LOCALES[0]).toBe("fr");
  });
});

describe("DEFAULT_LOCALE", () => {
  it("is en", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });
});

describe("createT", () => {
  it("returns FR translations by default", () => {
    const t = createT("fr");
    expect(t("navbar.accueil")).toBe("Accueil");
    expect(t("navbar.projets")).toBe("Projets");
    expect(t("navbar.commencer")).toBe("Commencer");
  });

  it("returns EN translations for en locale", () => {
    const t = createT("en");
    expect(t("navbar.accueil")).toBe("Home");
    expect(t("navbar.projets")).toBe("Projects");
    expect(t("navbar.commencer")).toBe("Get started");
  });

  it("falls back to EN for unsupported locale", () => {
    const t = createT("de" as "fr");
    expect(t("navbar.accueil")).toBe("Home");
  });

  it("returns nested translations", () => {
    const t = createT("fr");
    expect(t("home.hero.badge")).toBe("Plateforme de création de projets");
    expect(t("home.hero.ctaPrimary")).toBe("Commencer un projet");
  });

  it("returns key as-is for unknown path", () => {
    const t = createT("fr");
    expect(t("nonexistent.key")).toBe("nonexistent.key");
  });

  it("uses fallback when key is not found", () => {
    const t = createT("fr");
    expect(t("nonexistent.key", "Fallback")).toBe("Fallback");
  });

  it("does not use fallback when key exists", () => {
    const t = createT("fr");
    expect(t("navbar.accueil", "Fallback")).toBe("Accueil");
  });

  it("returns EN auth translations", () => {
    const t = createT("en");
    expect(t("auth.signIn")).toBe("Sign in");
    expect(t("auth.signUp")).toBe("Create account");
    expect(t("auth.forgotPassword")).toBe("Forgot password?");
  });

  it("returns FR project status translations", () => {
    const t = createT("fr");
    expect(t("project.status.idea")).toBe("Idée");
    expect(t("project.status.inProgress")).toBe("En cours");
    expect(t("project.status.published")).toBe("Publié");
  });

  it("returns EN project status translations", () => {
    const t = createT("en");
    expect(t("project.status.idea")).toBe("Idea");
    expect(t("project.status.inProgress")).toBe("In progress");
  });

  it("returns FR common translations", () => {
    const t = createT("fr");
    expect(t("common.loading")).toBe("Chargement...");
    expect(t("common.error")).toBe("Erreur");
    expect(t("common.save")).toBe("Enregistrer");
  });

  it("returns EN common translations", () => {
    const t = createT("en");
    expect(t("common.loading")).toBe("Loading...");
    expect(t("common.save")).toBe("Save");
  });
});

describe("detectLocale", () => {
  it("returns en for undefined", () => {
    expect(detectLocale()).toBe("en");
  });

  it("returns en for empty string", () => {
    expect(detectLocale("")).toBe("en");
  });

  it("detects fr from fr-FR", () => {
    expect(detectLocale("fr-FR")).toBe("fr");
  });

  it("detects fr from fr", () => {
    expect(detectLocale("fr")).toBe("fr");
  });

  it("detects en from en-US", () => {
    expect(detectLocale("en-US")).toBe("en");
  });

  it("detects en from en", () => {
    expect(detectLocale("en")).toBe("en");
  });

  it("detects en from en-GB", () => {
    expect(detectLocale("en-GB")).toBe("en");
  });

  it("picks the first supported locale from a list", () => {
    expect(detectLocale("de, en-US, fr")).toBe("en");
  });

  it("falls back to en for unsupported locales", () => {
    expect(detectLocale("de-DE")).toBe("en");
    expect(detectLocale("es")).toBe("en");
    expect(detectLocale("zh-CN, ja-JP")).toBe("en");
  });

  it("strips quality values from accept-language", () => {
    expect(detectLocale("fr;q=0.9, en;q=0.8")).toBe("fr");
    expect(detectLocale("en;q=0.9, fr;q=0.8")).toBe("en");
  });
});

describe("getLocale", () => {
  it("returns EN by default", () => {
    const { t, locale } = getLocale();
    expect(locale).toBe("en");
    expect(t("navbar.accueil")).toBe("Home");
  });

  it("returns EN when specified", () => {
    const { t, locale } = getLocale("en");
    expect(locale).toBe("en");
    expect(t("navbar.accueil")).toBe("Home");
  });

  it("returns EN for unknown locale", () => {
    const { t, locale } = getLocale("de" as "fr");
    expect(locale).toBe("en");
    expect(t("navbar.accueil")).toBe("Home");
  });

  it("supports string locale argument", () => {
    const { locale } = getLocale("en");
    expect(locale).toBe("en");
  });
});

describe("getAlternateUrls", () => {
  it("returns EN without prefix and FR with /fr prefix for root path", () => {
    const urls = getAlternateUrls("/");
    expect(urls.en).toBe("");
    expect(urls.fr).toBe("/fr");
  });

  it("returns correct alternates for sub-paths", () => {
    const urls = getAlternateUrls("/parcours");
    expect(urls.en).toBe("/parcours");
    expect(urls.fr).toBe("/fr/parcours");
  });

  it("handles paths with trailing slash", () => {
    const urls = getAlternateUrls("/projets/");
    expect(urls.en).toBe("/projets/");
    expect(urls.fr).toBe("/fr/projets/");
  });

  it("handles deep paths", () => {
    const urls = getAlternateUrls("/parcours/site-web/lecon/html");
    expect(urls.en).toBe("/parcours/site-web/lecon/html");
    expect(urls.fr).toBe("/fr/parcours/site-web/lecon/html");
  });

  it("returns object with exactly 2 keys", () => {
    const urls = getAlternateUrls("/");
    expect(Object.keys(urls)).toHaveLength(2);
    expect(urls).toHaveProperty("fr");
    expect(urls).toHaveProperty("en");
  });
});

describe("useLocale", () => {
  it("returns EN translations by default", () => {
    const { t, locale } = useLocale();
    expect(locale).toBe("en");
    expect(t("navbar.accueil")).toBe("Home");
  });

  it("returns EN translations when specified", () => {
    const { t, locale } = useLocale("en");
    expect(locale).toBe("en");
    expect(t("navbar.accueil")).toBe("Home");
  });

  it("returns EN for unsupported locale", () => {
    const { t, locale } = useLocale("de" as "fr");
    expect(locale).toBe("en");
    expect(t("navbar.accueil")).toBe("Home");
  });

  it("t function handles fallback", () => {
    const { t } = useLocale("en");
    expect(t("nonexistent", "Fallback EN")).toBe("Fallback EN");
  });

  it("t function handles existing without fallback", () => {
    const { t } = useLocale("fr");
    expect(t("common.loading")).toBe("Chargement...");
  });
});
