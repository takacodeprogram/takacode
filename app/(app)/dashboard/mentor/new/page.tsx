import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import TrackForm from "../../../../../components/admin/TrackForm";
import { getLocale } from "../../../../../lib/i18n";
import { getServerLocale } from "../../../../../lib/serverLocale";
import { buildPageMetadata } from "../../../../../lib/seo";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardMentorNew.title"),
    description: t("dashboardMentorNew.subtitle"),
    path: "/dashboard/mentor/new",
    noIndex: true
  });
}

export default async function MentorNewTrackPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/mentor/new");
  }

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardMentorNew.title")} subtitle={t("dashboardMentorNew.subtitle")} backHref="/dashboard/mentor" backLabel={t("dashboardMentorNew.backLabel")} />
      <TrackForm mode="create" proposal userId={user.id} redirectBase="/dashboard/mentor" />
    </>
  );
}
