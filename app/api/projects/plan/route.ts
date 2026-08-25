import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";
import { generatePlanSchema, parseAndValidateBody } from "../../../../lib/validation";
import { generatePlanFromFramework } from "../../../../lib/projectPlan";

/**
 * POST /api/projects/plan — genere le plan d'un projet a partir d'un framework.
 *
 * cf. ROADMAP_REPOSITIONNEMENT.md §11 (M2). Le framework n'est qu'un point de
 * depart : une fois genere, le plan appartient au Builder.
 */
export async function POST(request: NextRequest) {
  const parsed = await parseAndValidateBody(generatePlanSchema, request);
  if (!parsed.success) return parsed.response;

  const { projectId, frameworkId } = parsed.data;

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
    .select("id, user_id")
    .eq("id", projectId)
    .single();

  if (fetchError || !project) {
    return NextResponse.json({ error: "project_not_found" }, { status: 404 });
  }

  if (project.user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data: framework, error: frameworkError } = await supabase
    .from("project_frameworks")
    .select("id, project_type_id, is_published")
    .eq("id", frameworkId)
    .single();

  if (frameworkError || !framework || !framework.is_published) {
    return NextResponse.json({ error: "framework_not_found" }, { status: 404 });
  }

  const result = await generatePlanFromFramework(supabase, projectId, frameworkId);

  if (result.created === 0) {
    // "plan_exists" n'est pas une erreur du client : regenerer ecraserait un
    // travail en cours, donc on refuse explicitement plutot que de dupliquer.
    const status = result.reason === "plan_exists" ? 409 : 422;
    return NextResponse.json({ error: result.reason || "plan_not_generated" }, { status });
  }

  // Le projet retient le framework utilise, et son type si le sien n'est pas
  // encore renseigne. On ne l'ecrase jamais : le membre reste maitre du type.
  const patch: Record<string, unknown> = { framework_id: frameworkId };
  if (framework.project_type_id) {
    const { data: current } = await supabase
      .from("user_projects")
      .select("project_type_id")
      .eq("id", projectId)
      .single();
    if (current && !current.project_type_id) {
      patch.project_type_id = framework.project_type_id;
    }
  }

  await supabase.from("user_projects").update(patch).eq("id", projectId);

  return NextResponse.json({ created: result.created });
}
