import { describe, expect, it } from "vitest";
import { localizedTrackPath } from "./trackLocalization";

const frenchTrack = {
  slug: "ia-fondamentaux",
  locale: "fr",
  counterpartSlug: "ai-foundations-en"
};

describe("localizedTrackPath", () => {
  it("utilise le slug anglais sans prefixe pour la locale par defaut", () => {
    expect(localizedTrackPath(frenchTrack, "en")).toBe("/tracks/ai-foundations-en");
  });

  it("utilise le slug francais sous /fr", () => {
    expect(localizedTrackPath(frenchTrack, "fr")).toBe("/fr/tracks/ia-fondamentaux");
  });

  it("revient au catalogue cible lorsqu'aucun equivalent n'existe", () => {
    expect(localizedTrackPath({ ...frenchTrack, counterpartSlug: "" }, "en"))
      .toBe("/tracks");
  });
});
