import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";
import { addDeliverableSchema, parseAndValidateBody } from "../../../../lib/validation";
import { addDeliverable } from "../../../../lib/projectDeliverables";

/**
 * POST /api/projects/deliverable — depose un livrable.
 *
 * cf. ROADMAP_REPOSITIONNEMENT.md §11 (M3). Une etape cochee est une
 * declaration ; une etape avec un livrable est une preuve.
 */
export async function POST(request: NextRequest) {
  const parsed = await parseAndValidateBody(addDeliverableSchema, request);
  if (!parsed.success) return parsed.response;

  const { projectId, stepId, kind, title, url, body } = parsed.data;

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: project, error: projectError } = await supabase
    .from("user_projects")
    .select("id, user_id")
    .eq("id", projectId)
    .single();

  if (projectError || !project || project.user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Une etape rattachee doit appartenir au meme projet : sinon un livrable
  // pourrait se retrouver accroche au plan de quelqu'un d'autre.
  if (stepId) {
    const { data: step } = await supabase
      .from("project_plan_steps")
      .select("id, project_id")
      .eq("id", stepId)
      .single();

    if (!step || step.project_id !== projectId) {
      return NextResponse.json({ error: "step_mismatch" }, { status: 400 });
    }
  }

  const result = await addDeliverable(supabase, {
    projectId,
    stepId: stepId || null,
    kind,
    title,
    url,
    body
  });

  if (!result.ok) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ id: result.id });
}
