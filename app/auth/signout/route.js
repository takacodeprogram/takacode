import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  return { supabaseUrl, supabaseKey };
}

async function signOutAndRedirect(request) {
  const { supabaseUrl: url, supabaseKey: key } = getConfig();
  const requestUrl = new URL(request.url);

  const response = NextResponse.redirect(new URL("/signin", requestUrl.origin));

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

export async function GET(request) {
  return signOutAndRedirect(request);
}

export async function POST(request) {
  return signOutAndRedirect(request);
}