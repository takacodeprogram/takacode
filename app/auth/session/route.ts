import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { resolveAvatarUrl } from "../../../lib/avatar";
import { getUserAccessContext } from "../../../lib/auth";
import { formatDisplayName } from "../../../lib/displayName";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { supabaseUrl, supabaseKey };
}

export async function GET(request: NextRequest) {
  const { supabaseUrl: url, supabaseKey: key } = getConfig();
  const cookiesToSet: Array<{name: string; value: string; options?: Record<string, unknown>}> = [];

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(nextCookies) {
        cookiesToSet.push(...nextCookies);
      }
    }
  });

  let payload: Record<string, unknown> = {
    authenticated: false,
    role: null,
    onboardingCompleted: false
  };

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const accessContext = await getUserAccessContext(supabase, user);

    // Requete gardee (colonne avatar_url absente si 012 pas encore applique).
    const { data: avatarRow } = await supabase.from("user_profiles").select("avatar_url").eq("id", user.id).maybeSingle();
    const googleAvatar = typeof user?.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : "";

    payload = {
      authenticated: true,
      role: accessContext.role,
      onboardingCompleted: user?.user_metadata?.onboarding_completed === true,
      displayName: formatDisplayName(user),
      email: user.email ?? "",
      avatarUrl: resolveAvatarUrl(avatarRow?.avatar_url, googleAvatar)
    };
  }

  const response = NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
