import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getUserAccessContext } from "../../../lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { supabaseUrl, supabaseKey };
}

export async function GET(request) {
  const { supabaseUrl: url, supabaseKey: key } = getConfig();
  const cookiesToSet = [];

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

  let payload = {
    authenticated: false,
    role: null,
    onboardingCompleted: false
  };

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    const accessContext = await getUserAccessContext(supabase, user);

    payload = {
      authenticated: true,
      role: accessContext.role,
      onboardingCompleted: user?.user_metadata?.onboarding_completed === true
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
