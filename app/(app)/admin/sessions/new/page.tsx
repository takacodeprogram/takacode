import { cookies } from "next/headers";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import SessionForm from "../../../../../components/admin/SessionForm";
import { buildPageMetadata } from "../../../../../lib/seo";
import { listPublishedTracks } from "../../../../../lib/tracks";
import { createClient } from "../../../../../utils/supabase/server";
import { getLocale } from "../../../../../lib/i18n";
import { getServerLocale } from "../../../../../lib/serverLocale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminSessionNew.metaTitle"), description: t("adminSessionNew.metaDesc"), path: "/admin/sessions/new", noIndex: true });
}

export default async function NewSessionPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  const { tracks } = await listPublishedTracks(supabase, { limit: 40 });

  return (
    <>
      <PageHeader title={t("adminSessionNew.title")} subtitle={t("adminSessionNew.subtitle")} backHref="/admin/sessions" backLabel={t("admin.backSessions")} />
      <SessionForm tracks={tracks} />
    </>
  );
}
