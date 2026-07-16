import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { supabaseUrl, supabaseKey };
}

async function signOutAndRedirect(request: NextRequest) {
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

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  return NextResponse.redirect(new URL("/signin", requestUrl.origin));
}

export async function POST(request: NextRequest) {
  return signOutAndRedirect(request);
}
