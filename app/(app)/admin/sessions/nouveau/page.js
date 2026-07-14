import { cookies } from "next/headers";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import SessionForm from "../../../../../components/admin/SessionForm";
import { buildPageMetadata } from "../../../../../lib/seo";
import { listPublishedTracks } from "../../../../../lib/tracks";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Nouvelle session",
  description: "Creer une session live.",
  path: "/admin/sessions/nouveau",
  noIndex: true
});

export default async function NewSessionPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { tracks } = await listPublishedTracks(supabase, { limit: 40 });

  return (
    <>
      <PageHeader title="NOUVELLE SESSION" subtitle="Programmer une session live" backHref="/admin/sessions" backLabel="Sessions" />
      <SessionForm tracks={tracks} />
    </>
  );
}
