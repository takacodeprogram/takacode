import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "../../../lib/i18n";
import type { Locale } from "../../../lib/i18n";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const COOKIE_NAME = "takacode_locale";

function getLocaleFromRequest(request: NextRequest): Locale {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie && SUPPORTED_LOCALES.includes(cookie as Locale)) {
    return cookie as Locale;
  }
  return DEFAULT_LOCALE;
}

function localeSigninUrl(request: NextRequest, error?: string): URL {
  const requestUrl = new URL(request.url);
  const locale = getLocaleFromRequest(request);
  const path = locale === DEFAULT_LOCALE ? "/signin" : `/${locale}/signin`;
  const url = new URL(path, requestUrl.origin);
  if (error) url.searchParams.set("error", error);
  return url;
}

function sanitizeNextPath(value: string | null) {
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
    return null;
  }

  return { supabaseUrl, supabaseKey };
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const oauthError = requestUrl.searchParams.get("error");
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next"));

  if (oauthError) {
    return NextResponse.redirect(localeSigninUrl(request, "oauth_denied"));
  }

  if (!code) {
    return NextResponse.redirect(localeSigninUrl(request, "oauth_code_missing"));
  }

  const config = getConfig();

  if (!config) {
    return NextResponse.redirect(localeSigninUrl(request, "auth_config_missing"));
  }

  const redirectUrl = new URL(nextPath, requestUrl.origin);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(config.supabaseUrl, config.supabaseKey, {
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

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(localeSigninUrl(request, "oauth_callback_failed"));
    }

    return response;
  } catch {
    return NextResponse.redirect(localeSigninUrl(request, "auth_network"));
  }
}
