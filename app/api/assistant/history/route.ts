import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

// GET  /api/assistant/history?context=lesson&ref=my-lesson-slug&limit=50
// DELETE /api/assistant/history?context=lesson&ref=my-lesson-slug
// RLS garantit que le user ne lit/supprime que ses propres messages.

const ALLOWED_KINDS = new Set(["dashboard", "lesson", "track", "project", "generic"]);

async function resolveUserAndParams(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "not_authenticated" }, { status: 401 }) };

  const url = new URL(request.url);
  const kind = String(url.searchParams.get("context") || "generic").toLowerCase();
  const ref = String(url.searchParams.get("ref") || "").slice(0, 200);
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit")) || 50));
  if (!ALLOWED_KINDS.has(kind)) {
    return { error: NextResponse.json({ error: "invalid_context" }, { status: 400 }) };
  }
  return { supabase, user, kind, ref, limit };
}

export async function GET(request: NextRequest) {
  const resolved = await resolveUserAndParams(request);
  if ("error" in resolved) return resolved.error;
  const { supabase, user, kind, ref, limit } = resolved;

  const { data, error } = await supabase
    .from("ai_chat_messages")
    .select("role, content, provider, model, created_at")
    .eq("user_id", user.id)
    .eq("context_kind", kind)
    .eq("context_ref", ref)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }
  return NextResponse.json({ messages: data || [] });
}

export async function DELETE(request: NextRequest) {
  const resolved = await resolveUserAndParams(request);
  if ("error" in resolved) return resolved.error;
  const { supabase, user, kind, ref } = resolved;

  const { error } = await supabase
    .from("ai_chat_messages")
    .delete()
    .eq("user_id", user.id)
    .eq("context_kind", kind)
    .eq("context_ref", ref);

  if (error) {
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
