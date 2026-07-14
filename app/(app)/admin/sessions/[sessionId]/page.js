import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import SessionForm from "../../../../../components/admin/SessionForm";
import { getSession } from "../../../../../lib/liveSessions";
import { buildPageMetadata } from "../../../../../lib/seo";
import { listPublishedTracks } from "../../../../../lib/tracks";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Session live",
  description: "Editer une session live.",
  path: "/admin/sessions",
  noIndex: true
});

export default async function EditSessionPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const sessionId = String(resolvedParams?.sessionId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const [{ session }, { tracks }] = await Promise.all([
    getSession(supabase, sessionId),
    listPublishedTracks(supabase, { limit: 40 })
  ]);

  if (!session) {
    notFound();
  }

  return (
    <>
      <PageHeader title="EDITER LA SESSION" subtitle={session.title} backHref="/admin/sessions" backLabel="Sessions" />
      <SessionForm tracks={tracks} session={session} />
    </>
  );
}
