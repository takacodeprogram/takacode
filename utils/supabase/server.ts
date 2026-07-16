import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return { supabaseUrl, supabaseKey };
}

export async function createClient(cookieStore?: Awaited<ReturnType<typeof cookies>>) {
  const store = cookieStore ?? (await cookies());
  const { supabaseUrl: url, supabaseKey: key } = getConfig();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            store.set(name, value, options);
          });
        } catch {
        }
      }
    }
  });
}
