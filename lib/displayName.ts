import type { User } from "@supabase/supabase-js";

export function formatDisplayName(user: User | null | undefined): string {
  const fullName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  if (fullName) {
    return fullName;
  }

  const firstName = typeof user?.user_metadata?.first_name === "string" ? user.user_metadata.first_name.trim() : "";
  const lastName = typeof user?.user_metadata?.last_name === "string" ? user.user_metadata.last_name.trim() : "";
  const fromParts = [firstName, lastName].filter(Boolean).join(" ");

  if (fromParts) {
    return fromParts;
  }

  if (typeof user?.email === "string" && user.email.includes("@")) {
    return user.email.split("@")[0];
  }

  return "Membre";
}
