import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import TrackForm from "../../../../../components/admin/TrackForm";
import { buildPageMetadata } from "../../../../../lib/seo";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Proposer un parcours",
  description: "Nouvelle proposition de parcours.",
  path: "/dashboard/mentor/nouveau",
  noIndex: true
});

export default async function MentorNewTrackPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/mentor/nouveau");
  }

  return (
    <>
      <PageHeader title="PROPOSER UN PARCOURS" subtitle="Sera valide par un admin" backHref="/dashboard/mentor" backLabel="Mes propositions" />
      <TrackForm mode="create" proposal userId={user.id} redirectBase="/dashboard/mentor" />
    </>
  );
}
