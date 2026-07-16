import { createClient as createSupabaseAdminClient, User } from "@supabase/supabase-js";
import { normalizeText } from "./utils";

const LIST_USERS_PER_PAGE = 200;
const LIST_USERS_MAX_PAGES = 5;

interface AuthUserEntry {
  email: string;
  displayName: string;
}

type AuthUsersById = Record<string, AuthUserEntry>;

function resolveDisplayNameFromAuthUser(authUser: User): string {
  const fullName = normalizeText(authUser?.user_metadata?.full_name);
  if (fullName) {
    return fullName;
  }

  const firstName = normalizeText(authUser?.user_metadata?.first_name);
  const lastName = normalizeText(authUser?.user_metadata?.last_name);
  const joinedName = [firstName, lastName].filter(Boolean).join(" ").trim();
  if (joinedName) {
    return joinedName;
  }

  const email = normalizeText(authUser?.email);
  if (email && email.includes("@")) {
    return email.split("@")[0];
  }

  return "";
}

export async function buildAuthUsersLookup(): Promise<AuthUsersById> {
  const supabaseUrl = normalizeText(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeText(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl || !serviceRoleKey) {
    return {};
  }

  const adminClient = createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const usersById: AuthUsersById = {};

  for (let page = 1; page <= LIST_USERS_MAX_PAGES; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: LIST_USERS_PER_PAGE
    });

    if (error) {
      return usersById;
    }

    const users = Array.isArray(data?.users) ? data.users : [];

    for (const authUser of users) {
      const userId = normalizeText(authUser?.id);
      if (!userId) {
        continue;
      }

      usersById[userId] = {
        email: normalizeText(authUser?.email),
        displayName: resolveDisplayNameFromAuthUser(authUser)
      };
    }

    if (users.length < LIST_USERS_PER_PAGE) {
      break;
    }
  }

  return usersById;
}

export function mergeProfilesWithAuthUsers<T extends Record<string, unknown>>(profiles: T[], usersById: AuthUsersById): (T & { email: string; display_name: string })[] {
  const list = Array.isArray(profiles) ? profiles : [];
  const lookup = usersById && typeof usersById === "object" ? usersById : {};

  return list.map((profile) => {
    const userId = normalizeText(profile?.id);
    const authData: AuthUserEntry = lookup[userId] || { email: "", displayName: "" };

    return {
      ...profile,
      email: normalizeText(authData.email),
      display_name: normalizeText(authData.displayName)
    };
  });
}
