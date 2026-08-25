import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../../utils/supabase/server";
import { updateStepStatusSchema, parseAndValidateBody } from "../../../../../lib/validation";
import { setStepStatus } from "../../../../../lib/projectPlan";

/**
 * POST /api/projects/plan/step — fait avancer une etape.
 *
 * La RLS de project_plan_steps remonte deja la propriete jusqu'a user_projects,
 * donc une etape qui ne t'appartient pas est invisible. On verifie quand meme
 * explicitement : un 403 clair vaut mieux qu'une mise a jour qui ne fait
 * silencieusement rien.
 */
export async function POST(request: NextRequest) {
  const parsed = await parseAndValidateBody(updateStepStatusSchema, request);
  if (!parsed.success) return parsed.response;

  const { stepId, status } = parsed.data;

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: step, error: stepError } = await supabase
    .from("project_plan_steps")
    .select("id, project_id")
    .eq("id", stepId)
    .single();

  if (stepError || !step) {
    return NextResponse.json({ error: "step_not_found" }, { status: 404 });
  }

  const { data: project, error: projectError } = await supabase
    .from("user_projects")
    .select("id, user_id")
    .eq("id", step.project_id)
    .single();

  if (projectError || !project || project.user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const updated = await setStepStatus(supabase, stepId, status);
  if (!updated) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ status });
}
