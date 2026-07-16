import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import ProjectForm from "../../../../../components/ProjectForm";
import { buildPageMetadata } from "../../../../../lib/seo";
import { listPublishedTracks } from "../../../../../lib/tracks";
import { getOwnProject } from "../../../../../lib/userProjects";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Mon projet",
  description: "Edite ton projet.",
  path: "/dashboard/projets",
  noIndex: true
});

export default async function EditProjectPage({ params }: { params: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const projectId = String(resolvedParams?.projectId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/projets");
  }

  const [{ project }, { tracks }] = await Promise.all([
    getOwnProject(supabase, user.id, projectId),
    listPublishedTracks(supabase, { limit: 40 })
  ]);

  if (!project) {
    notFound();
  }

  return (
    <>
      <PageHeader title={project.title} subtitle="Editer mon projet" backHref="/dashboard/projets" backLabel="Mes projets" />
      <ProjectForm userId={user.id} tracks={tracks} project={project} />
    </>
  );
}
