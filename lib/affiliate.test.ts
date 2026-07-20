import { describe, it, expect } from "vitest";
import { normalize, categoryLabel, AFFILIATE_CATEGORIES } from "./affiliate";

describe("normalize (affiliate)", () => {
  it("returns null for null input", () => {
    expect(normalize(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(normalize(undefined)).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(normalize("string")).toBeNull();
    expect(normalize(42)).toBeNull();
  });

  it("returns correct shape for a valid row", () => {
    const row = {
      id: "link-001",
      provider: "Vercel",
      category: "deploiement",
      title: "Vercel Pro",
      description: "Deploiement instantane",
      url: "https://vercel.com",
      logo_url: "https://vercel.com/logo.png",
      is_published: true,
      sort_order: 1,
      track_slug: "site-web"
    };

    const link = normalize(row);
    expect(link).not.toBeNull();
    expect(link!.id).toBe("link-001");
    expect(link!.provider).toBe("Vercel");
    expect(link!.category).toBe("deploiement");
    expect(link!.title).toBe("Vercel Pro");
    expect(link!.description).toBe("Deploiement instantane");
    expect(link!.url).toBe("https://vercel.com");
    expect(link!.logoUrl).toBe("https://vercel.com/logo.png");
    expect(link!.isPublished).toBe(true);
    expect(link!.sortOrder).toBe(1);
    expect(link!.trackSlug).toBe("site-web");
  });

  it("has sensible defaults for missing fields", () => {
    const row = { id: "link-002" };
    const link = normalize(row);
    expect(link!.provider).toBe("");
    expect(link!.category).toBe("outil");
    expect(link!.title).toBe("");
    expect(link!.description).toBe("");
    expect(link!.url).toBe("");
    expect(link!.logoUrl).toBe("");
    expect(link!.isPublished).toBe(false);
    expect(link!.sortOrder).toBe(100);
    expect(link!.trackSlug).toBe("");
  });

  it("category defaults to 'outil' when missing or null", () => {
    expect(normalize({ id: "l1" })!.category).toBe("outil");
    expect(normalize({ id: "l3", category: null })!.category).toBe("outil");
  });

  it("preserves empty string category as-is", () => {
    // typeof "" === "string" so it does NOT fall back to "outil"
    expect(normalize({ id: "l2", category: "" })!.category).toBe("");
  });

  it("isPublished is only true when explicitly true", () => {
    expect(normalize({ id: "l4", is_published: true })!.isPublished).toBe(true);
    expect(normalize({ id: "l5", is_published: false })!.isPublished).toBe(false);
    expect(normalize({ id: "l6", is_published: 1 })!.isPublished).toBe(false);
    expect(normalize({ id: "l7" })!.isPublished).toBe(false);
  });

  it("sortOrder defaults to 100 for missing value", () => {
    expect(normalize({ id: "l8" })!.sortOrder).toBe(100);
  });

  it("sortOrder accepts 0 as valid", () => {
    expect(normalize({ id: "l9", sort_order: 0 })!.sortOrder).toBe(0);
  });

  it("sortOrder defaults to 100 for invalid value", () => {
    expect(normalize({ id: "l10", sort_order: "abc" })!.sortOrder).toBe(100);
    expect(normalize({ id: "l12", sort_order: NaN })!.sortOrder).toBe(100);
  });

  it("sortOrder treats null as 0 (Number(null) = 0)", () => {
    // Number(null) = 0 which is finite, so it returns 0 not 100
    expect(normalize({ id: "l11", sort_order: null })!.sortOrder).toBe(0);
  });

  it("handles non-string fields gracefully", () => {
    const link = normalize({
      id: "l13",
      provider: 123,
      category: null,
      title: undefined,
      url: true,
      logo_url: 456,
      track_slug: []
    });
    expect(link!.provider).toBe("");
    expect(link!.category).toBe("outil");
    expect(link!.title).toBe("");
    expect(link!.url).toBe("");
    expect(link!.logoUrl).toBe("");
    expect(link!.trackSlug).toBe("");
  });

  it("preserves empty strings for provider and title", () => {
    const link = normalize({ id: "l14", provider: "", title: "" });
    expect(link!.provider).toBe("");
    expect(link!.title).toBe("");
  });
});

describe("categoryLabel", () => {
  it("returns correct label for each category", () => {
    for (const cat of AFFILIATE_CATEGORIES) {
      expect(categoryLabel(cat.value)).toBe(cat.label);
    }
  });

  it("returns 'Outil' for unknown value", () => {
    expect(categoryLabel("unknown")).toBe("Outil");
    expect(categoryLabel("nonexistent")).toBe("Outil");
    expect(categoryLabel("")).toBe("Outil");
  });

  it("is case sensitive", () => {
    expect(categoryLabel("HEBERGEMENT")).toBe("Outil");
    expect(categoryLabel("IA")).toBe("Outil");
  });

  it("returns 'Outil' for null/undefined", () => {
    expect(categoryLabel(null as unknown as string)).toBe("Outil");
    expect(categoryLabel(undefined as unknown as string)).toBe("Outil");
  });
});
