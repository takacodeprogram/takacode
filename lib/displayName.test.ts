import { describe, it, expect } from "vitest";
import { formatDisplayName } from "./displayName";
import type { User } from "@supabase/supabase-js";

function makeUser(overrides: Partial<Record<string, unknown>> = {}): User {
  return {
    id: "user-001",
    aud: "authenticated",
    role: "",
    email: "",
    email_confirmed_at: null,
    phone: "",
    confirmed_at: null as unknown as string | undefined,
    last_sign_in_at: null,
    app_metadata: {},
    user_metadata: {},
    identities: [],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: null,
    is_anonymous: false,
    ...overrides
  } as unknown as User;
}

describe("formatDisplayName", () => {
  it("returns 'Membre' for null user", () => {
    expect(formatDisplayName(null)).toBe("Membre");
  });

  it("returns 'Membre' for undefined user", () => {
    expect(formatDisplayName(undefined)).toBe("Membre");
  });

  it("returns full_name when present", () => {
    const user = makeUser({ user_metadata: { full_name: "Jean Dupont" } });
    expect(formatDisplayName(user)).toBe("Jean Dupont");
  });

  it("trims full_name", () => {
    const user = makeUser({ user_metadata: { full_name: "  Marie Curie  " } });
    expect(formatDisplayName(user)).toBe("Marie Curie");
  });

  it("falls back to first_name + last_name", () => {
    const user = makeUser({
      user_metadata: { first_name: "Albert", last_name: "Einstein" }
    });
    expect(formatDisplayName(user)).toBe("Albert Einstein");
  });

  it("handles only first_name", () => {
    const user = makeUser({ user_metadata: { first_name: "Miles" } });
    expect(formatDisplayName(user)).toBe("Miles");
  });

  it("handles only last_name", () => {
    const user = makeUser({ user_metadata: { last_name: "Monroe" } });
    expect(formatDisplayName(user)).toBe("Monroe");
  });

  it("falls back to email prefix when no name metadata", () => {
    const user = makeUser({ email: "john.doe@example.com" });
    expect(formatDisplayName(user)).toBe("john.doe");
  });

  it("falls back to 'Membre' when email has no @", () => {
    const user = makeUser({ email: "invalid-email" });
    expect(formatDisplayName(user)).toBe("Membre");
  });

  it("falls back to 'Membre' when no metadata and no email", () => {
    const user = makeUser({ email: "", user_metadata: {} });
    expect(formatDisplayName(user)).toBe("Membre");
  });

  it("handles non-string full_name gracefully", () => {
    const user = makeUser({ user_metadata: { full_name: 123 } });
    expect(formatDisplayName(user)).toBe("Membre");
  });

  it("handles empty string full_name", () => {
    const user = makeUser({ user_metadata: { full_name: "" } });
    expect(formatDisplayName(user)).toBe("Membre");
  });

  it("prefers full_name over first_name/last_name", () => {
    const user = makeUser({
      user_metadata: {
        full_name: "Priorite",
        first_name: "Ignored",
        last_name: "Ignored"
      }
    });
    expect(formatDisplayName(user)).toBe("Priorite");
  });

  it("prefers first_name+last_name over email", () => {
    const user = makeUser({
      email: "fallback@test.com",
      user_metadata: { first_name: "Nom", last_name: "Prioritaire" }
    });
    expect(formatDisplayName(user)).toBe("Nom Prioritaire");
  });
});
