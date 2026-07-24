import { describe, it, expect } from "vitest";
import { dicebearUrl, resolveAvatarUrl, getInitials, AVATAR_STYLES } from "./avatar";

describe("AVATAR_STYLES", () => {
  it("has at least 5 styles", () => {
    expect(AVATAR_STYLES.length).toBeGreaterThanOrEqual(5);
  });

  it("includes fun-emoji as the first style", () => {
    expect(AVATAR_STYLES[0]).toBe("fun-emoji");
  });
});

describe("dicebearUrl", () => {
  it("returns a valid URL for a known style", () => {
    const url = dicebearUrl("fun-emoji", "user123");
    expect(url).toMatch(/^https:\/\/api\.dicebear\.com\/9\.x\//);
    expect(url).toContain("fun-emoji");
    expect(url).toContain("seed=user123");
  });

  it("falls back to fun-emoji for unknown style", () => {
    const url = dicebearUrl("nonexistent-style", "test-seed");
    expect(url).toContain("fun-emoji");
    expect(url).toContain("seed=test-seed");
  });

  it("encodes special characters in seed", () => {
    const url = dicebearUrl("bottts", "user@email.com");
    expect(url).toContain(encodeURIComponent("user@email.com"));
  });

  it("uses 'takacode' as default seed when empty", () => {
    const url = dicebearUrl("adventurer", "");
    expect(url).toContain("seed=takacode");
  });

  it("truncates seed to 40 characters", () => {
    const longSeed = "a".repeat(100);
    const url = dicebearUrl("thumbs", longSeed);
    const seedParam = url.split("seed=")[1];
    expect(seedParam?.length).toBeLessThanOrEqual(40);
  });

  it("handles null/undefined seed gracefully", () => {
    const urlNull = dicebearUrl("big-smile", null as unknown as string);
    expect(urlNull).toContain("seed=takacode");

    const urlUndef = dicebearUrl("micah", undefined as unknown as string);
    expect(urlUndef).toContain("seed=takacode");
  });

  it("handles numeric seed", () => {
    const url = dicebearUrl("fun-emoji", 12345 as unknown as string);
    expect(url).toContain("seed=12345");
  });
});

describe("resolveAvatarUrl", () => {
  it("returns profile avatar URL when valid https", () => {
    const result = resolveAvatarUrl("https://example.com/avatar.jpg", "");
    expect(result).toBe("https://example.com/avatar.jpg");
  });

  it("trims profile avatar URL", () => {
    const result = resolveAvatarUrl("  https://example.com/avatar.jpg  ", "");
    expect(result).toBe("https://example.com/avatar.jpg");
  });

  it("falls back to google avatar URL when profile is empty", () => {
    const result = resolveAvatarUrl("", "https://google.com/me.jpg");
    expect(result).toBe("https://google.com/me.jpg");
  });

  it("falls back to google avatar when profile is not https", () => {
    const result = resolveAvatarUrl("http://example.com/avatar.jpg", "https://google.com/me.jpg");
    expect(result).toBe("https://google.com/me.jpg");
  });

  it("returns empty string when neither URL is valid", () => {
    expect(resolveAvatarUrl("", "")).toBe("");
    expect(resolveAvatarUrl(null, null)).toBe("");
    expect(resolveAvatarUrl(undefined, undefined)).toBe("");
    expect(resolveAvatarUrl("not-a-url", "also-not")).toBe("");
  });

  it("returns empty string for non-string inputs", () => {
    expect(resolveAvatarUrl(123, "https://valid.com")).toBe("https://valid.com");
    expect(resolveAvatarUrl(null, 456)).toBe("");
  });

  it("discards http (non-https) URLs", () => {
    const result = resolveAvatarUrl("http://insecure.com/avatar.jpg", "https://secure.com/avatar.jpg");
    expect(result).toBe("https://secure.com/avatar.jpg");
  });
});

describe("getInitials", () => {
  it("returns 'ME' for null input", () => {
    expect(getInitials(null)).toBe("ME");
  });

  it("returns 'ME' for undefined input", () => {
    expect(getInitials(undefined)).toBe("ME");
  });

  it("returns 'ME' for empty string", () => {
    expect(getInitials("")).toBe("ME");
  });

  it("returns first two characters for single name", () => {
    expect(getInitials("John")).toBe("JO");
    expect(getInitials("A")).toBe("A");
  });

  it("returns first and last initial for full name", () => {
    expect(getInitials("Jean Dupont")).toBe("JD");
    expect(getInitials("Marie Curie")).toBe("MC");
  });

  it("handles multiple spaces", () => {
    expect(getInitials("  Jean   Dupont  ")).toBe("JD");
  });

  it("handles three+ word names", () => {
    expect(getInitials("Jean Baptiste Dupont")).toBe("JD");
    expect(getInitials("John Ronald Reuel Tolkien")).toBe("JT");
  });

  it("handles hyphenated names as single name", () => {
    const result = getInitials("Jean-Pierre");
    expect(result).toBe("JE"); // first 2 chars since it's a single token
  });

  it("converts to uppercase", () => {
    expect(getInitials("jean dupont")).toBe("JD");
    expect(getInitials("marie curie")).toBe("MC");
  });

  it("handles non-string inputs gracefully", () => {
    expect(getInitials(42)).toBe("42"); // String(42) = "42"
    expect(getInitials(true)).toBe("TR"); // String(true) = "true"
  });
});
