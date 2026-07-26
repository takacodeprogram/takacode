import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

const ALLOWED_PROVIDERS = new Set(["", "mistral", "openrouter", "gemini"]);
const MAX_KEY_LEN = 200;

interface WriteBody {
  provider?: string;
  keys?: { mistral?: string; openrouter?: string; gemini?: string };
}

function safeKey(v: unknown): string | null {
  if (v === undefined) return null; // no update
  if (typeof v !== "string") return "";
  const t = v.trim();
  if (t.length > MAX_KEY_LEN) return t.slice(0, MAX_KEY_LEN);
  return t;
}

function mask(k: string): string {
  if (!k) return "";
  if (k.length <= 8) return "•".repeat(k.length);
  return `${k.slice(0, 4)}…${k.slice(-4)}`;
}

export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const { data } = await supabase
    .from("user_profiles")
    .select("ai_provider, ai_api_key_mistral, ai_api_key_openrouter, ai_api_key_gemini")
    .eq("id", user.id)
    .maybeSingle();

  const rec = (data || {}) as Record<string, string>;
  return NextResponse.json({
    provider: rec.ai_provider || "",
    keysMasked: {
      mistral: mask(rec.ai_api_key_mistral || ""),
      openrouter: mask(rec.ai_api_key_openrouter || ""),
      gemini: mask(rec.ai_api_key_gemini || "")
    },
    hasKey: {
      mistral: Boolean(rec.ai_api_key_mistral),
      openrouter: Boolean(rec.ai_api_key_openrouter),
      gemini: Boolean(rec.ai_api_key_gemini)
    }
  });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  let body: WriteBody;
  try {
    body = (await request.json()) as WriteBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const update: Record<string, string> = {};

  if (typeof body.provider === "string") {
    const p = body.provider.trim();
    if (!ALLOWED_PROVIDERS.has(p)) {
      return NextResponse.json({ error: "invalid_provider" }, { status: 400 });
    }
    update.ai_provider = p;
  }

  const kMistral = safeKey(body.keys?.mistral);
  if (kMistral !== null) update.ai_api_key_mistral = kMistral;
  const kOpenrouter = safeKey(body.keys?.openrouter);
  if (kOpenrouter !== null) update.ai_api_key_openrouter = kOpenrouter;
  const kGemini = safeKey(body.keys?.gemini);
  if (kGemini !== null) update.ai_api_key_gemini = kGemini;

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_profiles")
    .update(update)
    .eq("id", user.id);
  if (error) {
    return NextResponse.json({ error: "update_failed", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
