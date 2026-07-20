import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";
import { firstEuroSchema, parseAndValidateBody } from "../../../../lib/validation";

export async function POST(request: NextRequest) {
  const parsed = await parseAndValidateBody(firstEuroSchema, request);
  if (!parsed.success) return parsed.response;

  const { projectId } = parsed.data;

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: project, error: fetchError } = await supabase
    .from("user_projects")
    .select("id, user_id, has_declared_first_euro, status")
    .eq("id", projectId)
    .single();

  if (fetchError || !project) {
    return NextResponse.json({ error: "project_not_found" }, { status: 404 });
  }

  if (project.user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (project.has_declared_first_euro) {
    return NextResponse.json({ error: "already_declared" }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("user_projects")
    .update({ first_euro_at: new Date().toISOString(), has_declared_first_euro: true })
    .eq("id", projectId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
