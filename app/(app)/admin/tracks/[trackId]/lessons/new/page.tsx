import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../../../components/app-shell/PageHeader";
import LessonForm from "../../../../../../../components/admin/LessonForm";
import { getAdminTrack, getAdminTrackCurriculum } from "../../../../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../../../../lib/seo";
import { createClient } from "../../../../../../../utils/supabase/server";
import { getLocale } from "../../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../../lib/serverLocale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminLessonNew.metaTitle"), description: t("adminLessonNew.metaDesc"), path: "/admin/tracks", noIndex: true });
}

export default async function NewLessonPage({ params, searchParams }: { params: Promise<Record<string, string>>; searchParams?: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams);
  const trackId = String(resolvedParams?.trackId || "").trim();
  const defaultModuleId = String(resolvedSearch?.module || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { track: rawTrack } = await getAdminTrack(supabase, trackId);
  if (!rawTrack) {
    notFound();
  }

  const track = rawTrack as Record<string, unknown>;

  const { modules } = await getAdminTrackCurriculum(supabase, trackId);

  return (
    <>
      <PageHeader
        title={t("adminLessonNew.title")}
        subtitle={String(track.title || "")}
        backHref={`/admin/tracks/${trackId}`}
        backLabel={t("adminLessonNew.backToTrack")}
      />

      {modules.length ? (
        <LessonForm trackId={trackId} modules={modules} defaultModuleId={defaultModuleId} userId={user?.id || ""} />
      ) : (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          {t("adminLessonNew.createModuleFirst")}
        </div>
      )}
    </>
  );
}
