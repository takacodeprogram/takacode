import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function sanitizeNextPath(value) {
  if (typeof value !== "string") {
    return "/dashboard";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function getConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { supabaseUrl, supabaseKey };
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const oauthError = requestUrl.searchParams.get("error");
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next"));

  if (oauthError) {
    const redirectUrl = new URL("/signin", requestUrl.origin);
    redirectUrl.searchParams.set("error", "oauth_denied");
    return NextResponse.redirect(redirectUrl);
  }

  if (!code) {
    const redirectUrl = new URL("/signin", requestUrl.origin);
    redirectUrl.searchParams.set("error", "oauth_code_missing");
    return NextResponse.redirect(redirectUrl);
  }

  const { supabaseUrl: url, supabaseKey: key } = getConfig();

  const redirectUrl = new URL(nextPath, requestUrl.origin);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const failureUrl = new URL("/signin", requestUrl.origin);
    failureUrl.searchParams.set("error", "oauth_callback_failed");
    return NextResponse.redirect(failureUrl);
  }

  return response;
}