import { describe, it, expect } from "vitest";
import {
  getLevelChipClass,
  toProgress,
  toTextList,
  buildTrackCompetencies,
  getStepUi,
  buildStepRows
} from "./track-helpers";
import type { Track } from "./tracks";

describe("getLevelChipClass", () => {
  it("returns 'level-foundations' for 'Fondation' level", () => {
    expect(getLevelChipClass("Fondation")).toBe("level-foundations");
    expect(getLevelChipClass("fondation")).toBe("level-foundations");
    expect(getLevelChipClass("FONDATION")).toBe("level-foundations");
  });

  it("returns 'level-beginner' for 'Debutant' level (no accent)", () => {
    expect(getLevelChipClass("Debutant")).toBe("level-beginner");
    expect(getLevelChipClass("debutant")).toBe("level-beginner");
  });

  it("returns 'level-beginner' for 'Débutant' (with accent)", () => {
    // Accents are stripped by NFD normalization
    expect(getLevelChipClass("Débutant")).toBe("level-beginner");
    expect(getLevelChipClass("débutant")).toBe("level-beginner");
  });

  it("returns 'level-intermediate' for 'Intermédiaire'", () => {
    expect(getLevelChipClass("Intermediaire")).toBe("level-intermediate");
    expect(getLevelChipClass("Intermédiaire")).toBe("level-intermediate");
    expect(getLevelChipClass("inter")).toBe("level-intermediate");
  });

  it("returns 'level-expert' for 'Expert' level", () => {
    expect(getLevelChipClass("Expert")).toBe("level-expert");
    expect(getLevelChipClass("expert")).toBe("level-expert");
    expect(getLevelChipClass("EXPERT")).toBe("level-expert");
  });

  it("returns 'level-advanced' for unknown level", () => {
    expect(getLevelChipClass("")).toBe("level-advanced");
    expect(getLevelChipClass("Avancé")).toBe("level-advanced");
    expect(getLevelChipClass("Master")).toBe("level-advanced");
    expect(getLevelChipClass("unknown")).toBe("level-advanced");
  });

  it("handles null/undefined gracefully", () => {
    expect(getLevelChipClass(null as unknown as string)).toBe("level-advanced");
    expect(getLevelChipClass(undefined as unknown as string)).toBe("level-advanced");
  });

  it("matches 'debutant' substring within longer text", () => {
    expect(getLevelChipClass("Débutant +")).toBe("level-beginner");
    expect(getLevelChipClass("Débutant Avancé")).toBe("level-beginner");
  });
});

describe("toProgress", () => {
  it("returns 0 for null/undefined", () => {
    expect(toProgress(null)).toBe(0);
    expect(toProgress(undefined)).toBe(0);
  });

  it("returns 0 for NaN", () => {
    expect(toProgress(NaN)).toBe(0);
  });

  it("returns 0 for Infinity", () => {
    expect(toProgress(Infinity)).toBe(0);
  });

  it("returns 0 for non-numeric values", () => {
    expect(toProgress("abc")).toBe(0);
    expect(toProgress({})).toBe(0);
    expect(toProgress([])).toBe(0);
  });

  it("clamps values below 0 to 0", () => {
    expect(toProgress(-10)).toBe(0);
    expect(toProgress(-1)).toBe(0);
  });

  it("clamps values above 100 to 100", () => {
    expect(toProgress(150)).toBe(100);
    expect(toProgress(999)).toBe(100);
  });

  it("rounds decimal values", () => {
    expect(toProgress(33.3)).toBe(33);
    expect(toProgress(66.7)).toBe(67);
    expect(toProgress(50.5)).toBe(51);
  });

  it("returns valid values unchanged", () => {
    expect(toProgress(0)).toBe(0);
    expect(toProgress(50)).toBe(50);
    expect(toProgress(100)).toBe(100);
  });

  it("parses numeric strings", () => {
    expect(toProgress("75")).toBe(75);
    expect(toProgress("0")).toBe(0);
  });
});

describe("toTextList", () => {
  it("returns empty array for non-array input", () => {
    expect(toTextList(null)).toEqual([]);
    expect(toTextList(undefined)).toEqual([]);
    expect(toTextList("string")).toEqual([]);
    expect(toTextList(42)).toEqual([]);
    expect(toTextList({})).toEqual([]);
  });

  it("trims string values", () => {
    expect(toTextList(["  hello  ", "world  "])).toEqual(["hello", "world"]);
  });

  it("filters empty strings", () => {
    expect(toTextList(["valid", "", "  ", null, undefined])).toEqual(["valid"]);
  });

  it("converts non-string values to strings", () => {
    expect(toTextList([123, true, { key: "val" }])).toEqual(["123", "true", "[object Object]"]);
  });

  it("respects the limit parameter", () => {
    expect(toTextList(["a", "b", "c", "d", "e", "f"])).toHaveLength(4);
    expect(toTextList(["a", "b", "c", "d", "e", "f"], 2)).toHaveLength(2);
    expect(toTextList(["a", "b", "c"])).toHaveLength(3);
  });

  it("returns empty array for empty input array", () => {
    expect(toTextList([])).toEqual([]);
  });
});

describe("buildTrackCompetencies", () => {
  it("returns competencies from GOAL_COMPETENCY_MAP by goalKey", () => {
    const track = { goalKey: "website" };
    const competencies = buildTrackCompetencies(track);
    expect(competencies).toHaveLength(4);
    expect(competencies[0]).toContain("Structurer");
    expect(competencies[3]).toContain("Mettre en ligne");
  });

  it("reads from goal_key (snake_case) if goalKey not present", () => {
    const track = { goal_key: "web_app" };
    const competencies = buildTrackCompetencies(track);
    expect(competencies).toHaveLength(4);
    expect(competencies[0]).toContain("architecture");
    expect(competencies[3]).toContain("auth");
  });

  it("returns competencies for wordpress_nocode goal", () => {
    const track = { goalKey: "wordpress_nocode" };
    const competencies = buildTrackCompetencies(track);
    expect(competencies).toHaveLength(4);
    expect(competencies[0]).toContain("WordPress");
  });

  it("falls back to resources when goal key not found", () => {
    const track = {
      goalKey: "nonexistent",
      resources: ["Custom skill 1", "Custom skill 2"]
    };
    const competencies = buildTrackCompetencies(track);
    expect(competencies).toEqual(["Custom skill 1", "Custom skill 2"]);
  });

  it("falls back to nextSteps when resources are empty", () => {
    const track = {
      goalKey: "nonexistent",
      resources: null,
      nextSteps: [
        { label: "Step 1", state: "done" },
        { label: "Step 2", state: "current" }
      ]
    };
    const competencies = buildTrackCompetencies(track);
    expect(competencies).toContain("Step 1");
    expect(competencies).toContain("Step 2");
  });

  it("falls back to next_steps (snake_case) when nextSteps not present", () => {
    const track = {
      goalKey: "nonexistent",
      next_steps: [
        { label: "Snake step", state: "done" }
      ]
    };
    const competencies = buildTrackCompetencies(track);
    expect(competencies).toContain("Snake step");
  });

  it("returns default fallback when nothing is available", () => {
    const competencies = buildTrackCompetencies({ goalKey: "nonexistent" });
    expect(competencies).toEqual([
      "Construire un plan de progression",
      "Exécuter des exercices pratiques",
      "Finaliser un projet concret"
    ]);
  });

  it("limits to 4 items", () => {
    const track = {
      goalKey: "nonexistent",
      resources: Array.from({ length: 10 }, (_, i) => `Skill ${i + 1}`)
    };
    expect(buildTrackCompetencies(track)).toHaveLength(4);
  });
});

describe("getStepUi", () => {
  it("returns check icon for 'done' state", () => {
    const ui = getStepUi("done");
    expect(ui.icon).toBe("lucide:check");
    expect(ui.chip).toContain("emerald");
  });

  it("returns play icon for 'current' state", () => {
    const ui = getStepUi("current");
    expect(ui.icon).toBe("lucide:play");
    expect(ui.chip).toContain("blue");
  });

  it("returns lock icon for unknown states", () => {
    expect(getStepUi("locked").icon).toBe("lucide:lock");
    expect(getStepUi("pending").icon).toBe("lucide:lock");
    expect(getStepUi("").icon).toBe("lucide:lock");
  });

  it("returns lock icon for null/undefined", () => {
    expect(getStepUi(null as unknown as string).icon).toBe("lucide:lock");
    expect(getStepUi(undefined as unknown as string).icon).toBe("lucide:lock");
  });

  it("is case insensitive", () => {
    expect(getStepUi("DONE").icon).toBe("lucide:check");
    expect(getStepUi("Current").icon).toBe("lucide:play");
    expect(getStepUi("LOCKED").icon).toBe("lucide:lock");
  });
});

describe("buildStepRows", () => {
  it("returns steps from nextSteps field", () => {
    const track = {
      nextSteps: [
        { label: "Step 1", state: "done" },
        { label: "Step 2", state: "current" },
        { label: "Step 3", state: "locked" }
      ]
    };
    const rows = buildStepRows(track);
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({ label: "Step 1", state: "done" });
    expect(rows[1]).toEqual({ label: "Step 2", state: "current" });
    expect(rows[2]).toEqual({ label: "Step 3", state: "locked" });
  });

  it("reads from next_steps (snake_case) if nextSteps not present", () => {
    const track = {
      next_steps: [
        { label: "Snake step", state: "done" }
      ]
    };
    const rows = buildStepRows(track);
    expect(rows).toHaveLength(1);
    expect(rows[0].label).toBe("Snake step");
  });

  it("trims labels and normalizes state to lowercase", () => {
    const track = {
      nextSteps: [
        { label: "  Step 1  ", state: "DONE" },
        { label: "  Step 2  ", state: "  CURRENT  " }
      ]
    };
    const rows = buildStepRows(track);
    expect(rows[0].label).toBe("Step 1");
    expect(rows[0].state).toBe("done");
    expect(rows[1].label).toBe("Step 2");
    expect(rows[1].state).toBe("current");
  });

  it("filters out step rows with empty labels", () => {
    const track = {
      nextSteps: [
        { label: "Valid step", state: "done" },
        { label: "", state: "current" },
        { label: "  ", state: "locked" },
        null
      ]
    };
    const rows = buildStepRows(track);
    expect(rows).toHaveLength(1);
    expect(rows[0].label).toBe("Valid step");
  });

  it("uses 'locked' as default state when missing", () => {
    const track = {
      nextSteps: [
        { label: "Step" },
        { label: "Step 2", state: null }
      ]
    };
    const rows = buildStepRows(track);
    expect(rows[0].state).toBe("locked");
    expect(rows[1].state).toBe("locked");
  });

  it("limits to 4 rows", () => {
    const track = {
      nextSteps: Array.from({ length: 10 }, (_, i) => ({
        label: `Step ${i + 1}`,
        state: "locked"
      }))
    };
    expect(buildStepRows(track)).toHaveLength(4);
  });

  it("returns fallback rows when no steps available", () => {
    const rows = buildStepRows({});
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({ label: "Demarrer le parcours", state: "current" });
    expect(rows[1]).toEqual({ label: "Completer la premiere pratique", state: "locked" });
    expect(rows[2]).toEqual({ label: "Finaliser le mini-projet", state: "locked" });
  });

  it("returns fallback for null track", () => {
    const rows = buildStepRows(null as unknown as Track);
    expect(rows).toHaveLength(3);
    expect(rows[0].label).toBe("Demarrer le parcours");
  });
});
