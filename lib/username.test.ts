import { describe, it, expect } from "vitest";
import { generateUsername } from "./username";

describe("generateUsername", () => {
  it("returns a string", () => {
    const result = generateUsername();
    expect(typeof result).toBe("string");
  });

  it("matches the expected pattern: AdjectiveNoun123", () => {
    const result = generateUsername();
    expect(result).toMatch(/^[A-Za-z]+[A-Za-z]+\d{3}$/);
  });

  it("contains at least one uppercase letter", () => {
    const result = generateUsername();
    // First letter of adjective/noun should be uppercase
    expect(result[0]).toMatch(/[A-Z]/);
  });

  it("ends with 3 digits", () => {
    const result = generateUsername();
    const suffix = result.slice(-3);
    expect(suffix).toMatch(/^\d{3}$/);
  });

  it("generates different usernames on multiple calls", () => {
    const results = new Set(Array.from({ length: 20 }, () => generateUsername()));
    // With 20 adjectives × 20 nouns × 900 numbers = 360,000 combinations,
    // 20 calls should almost always produce unique results
    expect(results.size).toBeGreaterThan(1);
  });

  it("generates at least 8 characters (adj + noun + 3 digits)", () => {
    const result = generateUsername();
    // Minimum: "Rapide" (6) + "Panda" (5) + "123" (3) = 14 chars
    // But let's just check it's reasonable
    expect(result.length).toBeGreaterThanOrEqual(8);
  });

  it("never contains spaces", () => {
    for (let i = 0; i < 100; i++) {
      expect(generateUsername()).not.toContain(" ");
    }
  });

  it("never contains special characters", () => {
    for (let i = 0; i < 100; i++) {
      expect(generateUsername()).toMatch(/^[A-Za-z0-9]+$/);
    }
  });
});
