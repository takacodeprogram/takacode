import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { normalizeRole, hasRole, isBootstrapAdminEmail, getUserRole, userHasRole } from "./auth";

describe("normalizeRole", () => {
  it("returns empty string for non-string input", () => {
    expect(normalizeRole(null)).toBe("");
    expect(normalizeRole(undefined)).toBe("");
    expect(normalizeRole(123)).toBe("");
    expect(normalizeRole({})).toBe("");
  });

  it("trims and lowercases a valid string", () => {
    expect(normalizeRole("Admin")).toBe("admin");
    expect(normalizeRole("  USER ")).toBe("user");
    expect(normalizeRole("MENTOR")).toBe("mentor");
  });

  it("returns empty string for empty string input", () => {
    expect(normalizeRole("")).toBe("");
    expect(normalizeRole("   ")).toBe("");
  });
});

describe("hasRole", () => {
  it("returns true when role matches allowed list", () => {
    expect(hasRole("admin", ["admin", "user"])).toBe(true);
    expect(hasRole("user", ["user"])).toBe(true);
    expect(hasRole("mentor", ["admin", "user", "mentor"])).toBe(true);
  });

  it("returns false when role does not match", () => {
    expect(hasRole("user", ["admin"])).toBe(false);
    expect(hasRole("", ["admin"])).toBe(false);
    expect(hasRole(null, ["admin"])).toBe(false);
  });

  it("defaults to 'user' when no allowedRoles provided", () => {
    expect(hasRole("user")).toBe(true);
    expect(hasRole("admin")).toBe(false);
    expect(hasRole("")).toBe(true); // defaults to "user"
  });

  it("ignores case when comparing", () => {
    expect(hasRole("Admin", ["admin"])).toBe(true);
    expect(hasRole("ADMIN", ["admin"])).toBe(true);
    expect(hasRole("admin", ["Admin"])).toBe(true);
  });
});

describe("isBootstrapAdminEmail", () => {
  const ORIGINAL_ENV = process.env.TAKACODE_ADMIN_EMAILS;

  beforeEach(() => {
    process.env.TAKACODE_ADMIN_EMAILS = "admin@test.com, boss@test.com";
  });

  afterEach(() => {
    process.env.TAKACODE_ADMIN_EMAILS = ORIGINAL_ENV;
  });

  it("returns true for emails in the env list", () => {
    expect(isBootstrapAdminEmail("admin@test.com")).toBe(true);
    expect(isBootstrapAdminEmail("boss@test.com")).toBe(true);
  });

  it("is case insensitive", () => {
    expect(isBootstrapAdminEmail("Admin@Test.com")).toBe(true);
    expect(isBootstrapAdminEmail("BOSS@TEST.COM")).toBe(true);
  });

  it("returns false for emails not in the list", () => {
    expect(isBootstrapAdminEmail("other@test.com")).toBe(false);
    expect(isBootstrapAdminEmail("")).toBe(false);
  });

  it("returns false for null/undefined input", () => {
    expect(isBootstrapAdminEmail(null)).toBe(false);
    expect(isBootstrapAdminEmail(undefined)).toBe(false);
  });
});

describe("getUserRole", () => {
  it("returns profile role when set", () => {
    const user = {} as any;
    expect(getUserRole(user, "mentor")).toBe("mentor");
    expect(getUserRole(user, "admin")).toBe("admin");
  });

  it("falls back to app_metadata role when no profile role", () => {
    const user = { app_metadata: { role: "admin" } } as any;
    expect(getUserRole(user, "")).toBe("admin");
  });

  it("falls back to bootstrap admin check when no roles found", () => {
    process.env.TAKACODE_ADMIN_EMAILS = "admin@test.com";
    const user = { email: "admin@test.com", app_metadata: {} } as any;
    expect(getUserRole(user, "")).toBe("admin");
  });

  it("returns 'user' when nothing matches", () => {
    const user = { email: "user@test.com", app_metadata: {} } as any;
    expect(getUserRole(user, "")).toBe("user");
  });

  it("returns 'user' for null user", () => {
    process.env.TAKACODE_ADMIN_EMAILS = "";
    expect(getUserRole(null, "")).toBe("user");
  });
});

describe("userHasRole", () => {
  it("returns false for null user", () => {
    expect(userHasRole(null, ["admin"])).toBe(false);
    expect(userHasRole(undefined as any, ["admin"])).toBe(false);
  });

  it("checks role correctly for valid user", () => {
    const user = { app_metadata: { role: "admin" } } as any;
    expect(userHasRole(user, ["admin"])).toBe(true);
    expect(userHasRole(user, ["user"])).toBe(false);
  });

  it("checks profile role", () => {
    const user = {} as any;
    expect(userHasRole(user, ["mentor"], "mentor")).toBe(true);
    expect(userHasRole(user, ["admin"], "mentor")).toBe(false);
  });
});
