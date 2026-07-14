import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { getTrackCurriculum } from "../../../../lib/curriculum";
import { buildPageMetadata } from "../../../../lib/seo";
import { formatTrackMeta, listUserTrackEnrollments } from "../../../../lib/tracks";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Mes parcours",
  description: "Les parcours ou tu es inscrit et ta progression reelle.",
  path: "/dashboard/parcours",
  noIndex: true
});

export default async function MyTracksPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/parcours");
  }

  const enrollmentResult = await listUserTrackEnrollments(supabase, user.id, { limit: 12 });
  const enrollments = enrollmentResult.enrollments;

  const cards = [];
  for (const enrollment of enrollments) {
    const curriculum = await getTrackCurriculum(supabase, enrollment.trackId, user.id);
    const progress = curriculum.hasCurriculum
      ? curriculum.progressPercent
      : Math.max(0, Math.min(Number(enrollment.progress ?? 0), 100));

    cards.push({
      track: enrollment.track,
      progress,
      completedLessons: curriculum.completedLessons,
      totalLessons: curriculum.totalLessons,
      nextHref: curriculum.nextLesson
        ? `/parcours/${enrollment.track.slug}/lecon/${curriculum.nextLesson.lessonSlug}`
        : `/parcours/${enrollment.track.slug}`,
      started: curriculum.completedLessons > 0
    });
  }

  return (
    <>
      <PageHeader
        title="MES PARCOURS"
        subtitle={`${cards.length} parcours actif${cards.length > 1 ? "s" : ""}`}
        actions={
          <Link href="/parcours" className="btn-secondary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:compass" style={{ fontSize: "13px" }} />
            Explorer le catalogue
          </Link>
        }
      />

      {cards.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {cards.map(({ track, progress, completedLessons, totalLessons, nextHref, started }) => (
            <article key={track.id} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 card-hover project-card">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0"
                  style={{ borderColor: `${track.accentColor}55`, background: `${track.accentColor}1f` }}
                >
                  <iconify-icon icon={track.icon} style={{ color: track.accentColor, fontSize: "20px" }} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-venite-italic text-[16px] text-white leading-tight">{track.title}</h2>
                  <p className="font-body-readable text-[11px] text-[#7a7a7a]">{formatTrackMeta(track)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-[#888]">Progression</span>
                <span className="text-[#89c7ff] font-semibold">
                  {progress}%{totalLessons ? ` · ${completedLessons}/${totalLessons} lecons` : ""}
                </span>
              </div>
              <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden mb-4">
                <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Link href={nextHref} className="btn-primary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 16px" }}>
                  {started ? "Continuer" : "Demarrer"}
                  <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
                </Link>
                <Link href={`/parcours/${track.slug}`} className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 16px" }}>
                  Programme
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <iconify-icon icon="lucide:map" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
          </div>
          <div>
            <div className="font-venite text-[15px] text-white mb-1.5">AUCUN PARCOURS ACTIF</div>
            <p className="font-body-readable text-[13px] text-[#777] max-w-[440px]">
              Choisis un parcours dans le catalogue pour commencer a apprendre et construire ton projet.
            </p>
          </div>
          <Link href="/parcours" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:compass" style={{ fontSize: "14px" }} />
            Explorer les parcours
          </Link>
        </div>
      )}
    </>
  );
}
