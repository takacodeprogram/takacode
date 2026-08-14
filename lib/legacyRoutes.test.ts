import { describe, expect, it } from "vitest";
import { translateLegacyRoutePath } from "./legacyRoutes";

describe("translateLegacyRoutePath", () => {
  it("traduit les anciens segments de route, meme imbriques", () => {
    expect(translateLegacyRoutePath("/parcours/ia-fondamentaux/lecon/agents-ia"))
      .toBe("/tracks/ia-fondamentaux/lesson/agents-ia");
  });

  it("ne modifie pas les slugs de tracks contenant un nom de route", () => {
    expect(translateLegacyRoutePath("/tracks/ia-fondamentaux"))
      .toBe("/tracks/ia-fondamentaux");
    expect(translateLegacyRoutePath("/tracks/creation-contenu-ia"))
      .toBe("/tracks/creation-contenu-ia");
    expect(translateLegacyRoutePath("/tracks/nouveau-projet"))
      .toBe("/tracks/nouveau-projet");
  });

  it("preserve les slash initiaux et finaux", () => {
    expect(translateLegacyRoutePath("/parcours/"))
      .toBe("/tracks/");
  });
});
