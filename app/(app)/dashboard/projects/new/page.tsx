import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import PageHeader from "../../../../../components/app-shell/PageHeader";
import ProjectForm from "../../../../../components/ProjectForm";
import { getLocale } from "../../../../../lib/i18n";
import { buildPageMetadata } from "../../../../../lib/seo";
import { getServerLocale } from "../../../../../lib/serverLocale";
import { localePath } from "../../../../../lib/localeHelpers";
import { DEFAULT_LOCALE } from "../../../../../lib/i18n";
import { listPublishedTracks } from "../../../../../lib/tracks";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardProjectNew.title"),
    description: t("dashboardProjectNew.subtitle"),
    path: "/dashboard/projects/new",
    noIndex: true
  });
}

export default async function NewProjectPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const p = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
    redirect(`${p}/signin?next=${p}/dashboard/projects/new`);
  }

  const { t } = getLocale(locale);
  const { tracks } = await listPublishedTracks(supabase, { limit: 40, locale });

  return (
    <>
      <PageHeader title={t("dashboardProjectNew.title")} subtitle={t("dashboardProjectNew.subtitle")} backHref={localePath("/dashboard/projects", locale)} backLabel={t("dashboardProjectNew.backLabel")} />
      <ProjectForm userId={user.id} tracks={tracks} />
    </>
  );
}
