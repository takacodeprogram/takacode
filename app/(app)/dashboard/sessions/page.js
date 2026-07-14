import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { buildPageMetadata } from "../../../../lib/seo";
import { listPublishedTracks } from "../../../../lib/tracks";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Sessions live",
  description: "Les prochaines sessions live liees a tes parcours.",
  path: "/dashboard/sessions",
  noIndex: true
});

export default async function SessionsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { tracks } = await listPublishedTracks(supabase, { limit: 12 });
  const sessions = tracks
    .map((track) => ({
      id: track.id,
      title: track.title,
      icon: track.icon,
      accentColor: track.accentColor,
      when: track.nextSession
    }))
    .filter((entry) => entry.when && entry.when.toLowerCase() !== "session annoncee bientot");

  return (
    <>
      <PageHeader title="SESSIONS LIVE" subtitle="Les rendez-vous de tes parcours" />

      {sessions.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {sessions.map((session) => (
            <article key={session.id} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0"
                style={{ borderColor: `${session.accentColor}55`, background: `${session.accentColor}1f` }}
              >
                <iconify-icon icon="lucide:video" style={{ color: session.accentColor, fontSize: "20px" }} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] text-white font-semibold leading-tight">{session.title}</div>
                <div className="text-[11px] text-[#89c7ff] font-body-readable inline-flex items-center gap-1.5 mt-0.5">
                  <iconify-icon icon="lucide:calendar-clock" style={{ fontSize: "12px" }} />
                  {session.when}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <iconify-icon icon="lucide:video" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
          </div>
          <div>
            <div className="font-venite text-[15px] text-white mb-1.5">AUCUNE SESSION PROGRAMMEE</div>
            <p className="font-body-readable text-[13px] text-[#777] max-w-[460px]">
              Les prochaines sessions live apparaitront ici des qu'elles seront programmees pour tes parcours.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
