import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "../../../lib/i18n";
import type { Locale } from "../../../lib/i18n";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const COOKIE_NAME = "takacode_locale";

function getConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { supabaseUrl, supabaseKey };
}

function getLocaleFromRequest(request: NextRequest): Locale {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie && SUPPORTED_LOCALES.includes(cookie as Locale)) {
    return cookie as Locale;
  }
  return DEFAULT_LOCALE;
}

function localeSigninUrl(request: NextRequest): URL {
  const requestUrl = new URL(request.url);
  const locale = getLocaleFromRequest(request);
  const path = locale === DEFAULT_LOCALE ? "/signin" : `/${locale}/signin`;
  return new URL(path, requestUrl.origin);
}

async function signOutAndRedirect(request: NextRequest) {
  const { supabaseUrl: url, supabaseKey: key } = getConfig();

  const response = NextResponse.redirect(localeSigninUrl(request));

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

  await supabase.auth.signOut();

  return response;
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(localeSigninUrl(request));
}

export async function POST(request: NextRequest) {
  return signOutAndRedirect(request);
}
