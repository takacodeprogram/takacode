import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import ProjectForm from "../../../../../components/ProjectForm";
import { buildPageMetadata } from "../../../../../lib/seo";
import { listPublishedTracks } from "../../../../../lib/tracks";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Nouveau projet",
  description: "Cree ton projet.",
  path: "/dashboard/projets/nouveau",
  noIndex: true
});

export default async function NewProjectPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/projets/nouveau");
  }

  const { tracks } = await listPublishedTracks(supabase, { limit: 40 });

  return (
    <>
      <PageHeader title="NOUVEAU PROJET" subtitle="Cree le projet que tu vas construire" backHref="/dashboard/projets" backLabel="Mes projets" />
      <ProjectForm userId={user.id} tracks={tracks} />
    </>
  );
}
