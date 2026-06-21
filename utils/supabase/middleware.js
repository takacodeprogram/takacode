import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { userHasRole } from "../../lib/auth";
import { isOnboardingCompleted } from "../../lib/onboarding";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const AUTH_PATHS = new Set(["/signin", "/signup", "/connexion"]);
const ONBOARDING_PATH = "/onboarding";

function getConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  return { supabaseUrl, supabaseKey };
}

function isDashboardPath(pathname) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

function isOnboardingPath(pathname) {
  return pathname === ONBOARDING_PATH || pathname.startsWith("/onboarding/");
}

function buildNextPath(pathname, search) {
  return `${pathname}${search ?? ""}`;
}

export async function updateSession(request) {
  const { supabaseUrl: url, supabaseKey: key } = getConfig();

  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        supabaseResponse = NextResponse.next({
          request
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (isOnboardingPath(pathname)) {
    if (!user) {
      const redirectUrl = new URL("/signin", request.url);
      redirectUrl.searchParams.set("next", buildNextPath(pathname, search));
      return NextResponse.redirect(redirectUrl);
    }

    if (!userHasRole(user, ["user", "admin"])) {
      const redirectUrl = new URL("/signin", request.url);
      redirectUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(redirectUrl);
    }

    if (isOnboardingCompleted(user)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse;
  }

  if (isDashboardPath(pathname)) {
    if (!user) {
      const redirectUrl = new URL("/signin", request.url);
      redirectUrl.searchParams.set("next", buildNextPath(pathname, search));
      return NextResponse.redirect(redirectUrl);
    }

    if (!userHasRole(user, ["user", "admin"])) {
      const redirectUrl = new URL("/signin", request.url);
      redirectUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(redirectUrl);
    }

    if (!isOnboardingCompleted(user)) {
      return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
    }
  }

  if (AUTH_PATHS.has(pathname) && user) {
    const redirectTarget = isOnboardingCompleted(user) ? "/dashboard" : ONBOARDING_PATH;
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  }

  return supabaseResponse;
}