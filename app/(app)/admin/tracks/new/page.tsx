import PageHeader from "../../../../../components/app-shell/PageHeader";
import TrackForm from "../../../../../components/admin/TrackForm";
import { buildPageMetadata } from "../../../../../lib/seo";
import { getLocale } from "../../../../../lib/i18n";
import { getServerLocale } from "../../../../../lib/serverLocale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminTrackNew.metaTitle"), description: t("adminTrackNew.metaDesc"), path: "/admin/tracks/new", noIndex: true });
}

export default async function NewTrackPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return (
    <>
      <PageHeader title={t("adminTrackNew.title")} subtitle={t("adminTrackNew.subtitle")} backHref="/admin/tracks" backLabel={t("admin.backTracks")} />
      <TrackForm mode="create" />
    </>
  );
}
