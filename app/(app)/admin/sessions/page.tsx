import Link from "next/link";
import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { listAllSessions } from "../../../../lib/liveSessions";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Sessions live",
  description: "Gestion des sessions live.",
  path: "/admin/sessions",
  noIndex: true
});

function formatWhen(value: string | null | undefined) {
  if (!value) return "Date a confirmer";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date a confirmer";
  return parsed.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminSessionsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { sessions, schemaReady, error } = await listAllSessions(supabase);

  return (
    <>
      <PageHeader
        title="SESSIONS LIVE"
        subtitle={`${sessions.length} session${sessions.length > 1 ? "s" : ""}`}
        backHref="/admin"
        backLabel="Centre admin"
        actions={
          <Link href="/admin/sessions/nouveau" className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            Nouvelle session
          </Link>
        }
      />

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          Table sessions absente. Lance supabase/sql/010_live_sessions.sql.
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200 font-body-readable">{error.message || "Erreur"}</div>
      ) : sessions.length ? (
        <div className="space-y-2.5">
          {sessions.map((session) => (
            <Link key={session.id} href={`/admin/sessions/${session.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3.5 card-hover">
              <div className="min-w-0">
                <div className="text-[13px] text-white font-semibold leading-tight truncate">{session.title}</div>
                <div className="text-[11px] text-[#6d6d6d] font-body-readable">{formatWhen(session.scheduledAt)}{session.trackTitle ? ` · ${session.trackTitle}` : ""}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${session.isPublished ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-white/[0.12] bg-white/[0.03] text-[#888]"}`}>
                  {session.isPublished ? " Publiée" : "Brouillon"}
                </span>
                <iconify-icon icon="lucide:chevron-right" style={{ fontSize: "16px", color: "#666" }} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center">
          <p className="font-body-readable text-[13px] text-[#777] mb-4">Aucune session pour l'instant.</p>
          <Link href="/admin/sessions/nouveau" className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            Creer la premiere session
          </Link>
        </div>
      )}
    </>
  );
}
