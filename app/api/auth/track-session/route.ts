import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "config" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => cookies.forEach((c) => response.cookies.set(c.name, c.value, c.options))
    }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  const ua = request.headers.get("user-agent") || "";

  const browser = ua.includes("Firefox") ? "Firefox"
    : ua.includes("Chrome") ? "Chrome"
    : ua.includes("Safari") ? "Safari"
    : ua.includes("Edg") ? "Edge"
    : ua.includes("OPR") ? "Opera"
    : "Autre";

  const os = ua.includes("Windows") ? "Windows"
    : ua.includes("Mac") ? "macOS"
    : ua.includes("Linux") && !ua.includes("Android") ? "Linux"
    : ua.includes("Android") ? "Android"
    : ua.includes("iPhone") || ua.includes("iPad") ? "iOS"
    : "Autre";

  const deviceType = ua.includes("Mobile") || ua.includes("Android") ? "mobile"
    : ua.includes("iPad") || ua.includes("Tablet") ? "tablet"
    : "desktop";

  const deviceName = `${os} ${browser}`;

  await supabase.rpc("upsert_my_session", {
    p_device_name: deviceName,
    p_device_type: deviceType,
    p_browser: browser,
    p_os: os,
    p_ip_address: ip,
    p_country_code: ""
  });

  await supabase
    .from("user_profiles")
    .update({ ip_address: ip, last_sign_in_at: new Date().toISOString() })
    .eq("id", user.id);

  return response;
}