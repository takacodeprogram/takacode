import { describe, it, expect } from "vitest";
import { formatTrackMeta, mapTrackToRecommendation, normalizeTrackRow } from "./tracks";
import type { Track } from "./tracks";

describe("formatTrackMeta", () => {
  it("returns 'Parcours' for null/undefined", () => {
    expect(formatTrackMeta(null)).toBe("Parcours");
    expect(formatTrackMeta(undefined)).toBe("Parcours");
  });

  it("formats track with duration and level", () => {
    const track = { durationWeeks: 8, levelLabel: "Débutant" } as Track;
    const result = formatTrackMeta(track);
    expect(result).toContain("8 semaines");
    expect(result).toContain("Débutant");
  });

  it("returns 'Progressif' when duration is 0", () => {
    const track = { durationWeeks: 0, levelLabel: "Avancé" } as Track;
    const result = formatTrackMeta(track);
    expect(result).toContain("Progressif");
    expect(result).toContain("Avancé");
  });
});

describe("normalizeTrackRow", () => {
  it("returns null for non-object input", () => {
    expect(normalizeTrackRow(null)).toBeNull();
    expect(normalizeTrackRow(undefined)).toBeNull();
    expect(normalizeTrackRow("string")).toBeNull();
    expect(normalizeTrackRow(123)).toBeNull();
  });

  it("returns null when id is missing", () => {
    expect(normalizeTrackRow({ title: "Test" })).toBeNull();
  });

  it("normalizes a valid track row", () => {
    const row = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      slug: "test-track",
      goal_key: "website",
      title: "Test Track",
      summary: "A test track",
      level_label: "Débutant",
      duration_weeks: 4,
      accent_color: "#4F8EF7",
      icon: "lucide:globe",
      is_published: true,
      is_active: true,
      sort_order: 10,
    };

    const track = normalizeTrackRow(row);
    expect(track).not.toBeNull();
    expect(track!.slug).toBe("test-track");
    expect(track!.title).toBe("Test Track");
    expect(track!.levelLabel).toBe("Débutant");
    expect(track!.durationWeeks).toBe(4);
    expect(track!.isPublished).toBe(true);
    expect(track!.isActive).toBe(true);
  });
});

describe("mapTrackToRecommendation", () => {
  it("returns fallback for null track", () => {
    const rec = mapTrackToRecommendation(null, "Mon Parcours");
    expect(rec.parcoursTitle).toBe("Mon Parcours");
    expect(rec.resources).toHaveLength(1);
  });

  it("maps a valid track to recommendation", () => {
    const track = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      slug: "test",
      goalKey: "website",
      title: "Mon Parcours",
      summary: "Summary",
      description: "Description",
      levelLabel: "Intermédiaire",
      durationWeeks: 6,
      accentColor: "#22D3EE",
      icon: "lucide:zap",
      objective: "Construire un site pro",
      resources: ["Doc1", "Doc2"],
      nextSession: "Lundi 19h",
      nextSteps: [{ label: "Démarrer", state: "current" }],
      isPublished: true,
      isActive: true,
      sortOrder: 1,
    } as Track;

    const rec = mapTrackToRecommendation(track);
    expect(rec.parcoursTitle).toBe("Mon Parcours");
    expect(rec.resources).toContain("Doc1");
    expect(rec.parcoursMeta).toContain("6 semaines");
    expect(rec.objective).toBe("Construire un site pro");
  });
});
