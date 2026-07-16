import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { getMemberSessions } from "../../../../lib/liveSessions";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Sessions live",
  description: "Les sessions live a venir et les replays.",
  path: "/dashboard/sessions",
  noIndex: true
});

function formatWhen(value: string | null | undefined) {
  if (!value) return "Date a confirmer";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date a confirmer";
  return parsed.toLocaleString("fr-FR", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
}

export default async function SessionsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { upcoming, replays, schemaReady } = await getMemberSessions(supabase);

  return (
    <>
      <PageHeader title="SESSIONS LIVE" subtitle="A venir et replays" />

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          Table sessions absente. Lance supabase/sql/010_live_sessions.sql.
        </div>
      ) : upcoming.length === 0 && replays.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <iconify-icon icon="lucide:video" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
          </div>
          <div className="font-venite text-[15px] text-white">AUCUNE SESSION PROGRAMMEE</div>
          <p className="font-body-readable text-[13px] text-[#777] max-w-[460px]">Les prochaines sessions live seront annoncees ici.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length ? (
            <section>
              <h2 className="font-venite text-[13px] tracking-widest text-[#888] mb-3">A VENIR</h2>
              <div className="space-y-3">
                {upcoming.map((session) => (
                  <article key={session.id} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <div className="text-[14px] text-white font-semibold leading-tight">{session.title}</div>
                        <div className="text-[11px] text-[#89c7ff] font-body-readable inline-flex items-center gap-1.5 mt-1">
                          <iconify-icon icon="lucide:calendar-clock" style={{ fontSize: "12px" }} />
                          {formatWhen(session.scheduledAt)} · {session.durationMinutes} min
                        </div>
                        {session.trackTitle ? <div className="text-[10px] text-[#666] mt-1">{session.trackTitle}</div> : null}
                        {session.description ? <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-snug mt-2">{session.description}</p> : null}
                      </div>
                      {session.joinUrl ? (
                        <a href={session.joinUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 text-[12px] shrink-0" style={{ padding: "10px 16px" }}>
                          <iconify-icon icon="lucide:video" style={{ fontSize: "13px" }} />
                          Rejoindre
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {replays.length ? (
            <section>
              <h2 className="font-venite text-[13px] tracking-widest text-[#888] mb-3">REPLAYS</h2>
              <div className="space-y-3">
                {replays.map((session) => (
                  <article key={session.id} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[13px] text-white font-semibold leading-tight">{session.title}</div>
                      <div className="text-[10px] text-[#666] font-body-readable mt-0.5">{formatWhen(session.scheduledAt)}</div>
                    </div>
                    <a href={session.replayUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2 text-[12px] shrink-0" style={{ padding: "9px 14px" }}>
                      <iconify-icon icon="lucide:play-circle" style={{ fontSize: "13px" }} />
                      Revoir
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </>
  );
}
