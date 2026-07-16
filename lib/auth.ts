import { isMissingSchemaError } from "./utils";
import type { SupabaseClient, User } from "@supabase/supabase-js";

const AUTH_TABLES = ["user_profiles"];

const DEFAULT_ROLE = "user";
const PROFILE_SELECT = "id, role, points, grade, referral_code, referred_by, created_at, updated_at";

interface UserProfile {
  id: string;
  role: string | null;
  points: number | null;
  grade: string | null;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AccessContext {
  role: string;
  profile: UserProfile | null;
  profileError: Error | null;
  hasRole: (allowedRoles?: string[]) => boolean;
}

function parseBootstrapAdminEmails(): string[] {
  const source = process.env.TAKACODE_ADMIN_EMAILS || process.env.NEXT_PUBLIC_TAKACODE_ADMIN_EMAILS || "";

  return source
    .split(",")
    .map((value: string) => value.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

export function normalizeRole(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

export function hasRole(role: unknown, allowedRoles: string[] = [DEFAULT_ROLE]): boolean {
  const normalizedRole = normalizeRole(role) || DEFAULT_ROLE;
  const normalizedAllowedRoles = allowedRoles
    .map((value) => normalizeRole(value))
    .filter(Boolean);

  if (!normalizedAllowedRoles.length) {
    return normalizedRole === DEFAULT_ROLE;
  }

  return normalizedAllowedRoles.includes(normalizedRole);
}

export function isBootstrapAdminEmail(email: unknown): boolean {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return false;
  }

  return parseBootstrapAdminEmails().includes(normalizedEmail);
}

export function getUserRole(user: User | null, profileRole: unknown = ""): string {
  const tableRole = normalizeRole(profileRole);
  if (tableRole) {
    return tableRole;
  }

  const appRole = normalizeRole(user?.app_metadata?.role);
  if (appRole) {
    return appRole;
  }

  if (isBootstrapAdminEmail(user?.email)) {
    return "admin";
  }

  return DEFAULT_ROLE;
}

export function userHasRole(user: User | null, allowedRoles: string[] = [DEFAULT_ROLE], profileRole: unknown = ""): boolean {
  if (!user) {
    return false;
  }

  const role = getUserRole(user, profileRole);
  return hasRole(role, allowedRoles);
}

export async function getUserProfile(supabase: SupabaseClient, userId: string | null): Promise<{ profile: UserProfile | null; error: Error | null }> {
  if (!supabase || !userId) {
    return { profile: null, error: null };
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select(PROFILE_SELECT)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST116" || isMissingSchemaError(error, AUTH_TABLES)) {
      return { profile: null, error: null };
    }

    return { profile: null, error };
  }

  return { profile: data ?? null, error: null };
}

export async function getUserAccessContext(supabase: SupabaseClient, user: User | null): Promise<AccessContext> {
  if (!user) {
    return {
      role: DEFAULT_ROLE,
      profile: null,
      profileError: null,
      hasRole: () => false
    };
  }

  const { profile, error: profileError } = await getUserProfile(supabase, user.id);
  const role = getUserRole(user, profile?.role);

  return {
    role,
    profile,
    profileError,
    hasRole: (allowedRoles: string[] = [DEFAULT_ROLE]) => hasRole(role, allowedRoles)
  };
}
