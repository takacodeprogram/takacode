"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { useToast } from "../Toast";
import { useI18n } from "../I18nProvider";

interface PendingTrack {
  id: string;
  slug: string;
  title: string;
}

interface PendingTracksReviewProps {
  initialPending?: PendingTrack[];
}

export default function PendingTracksReview({ initialPending = [] }: PendingTracksReviewProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const { t } = useI18n();
  const [pending, setPending] = useState<PendingTrack[]>(initialPending);
  const [busyId, setBusyId] = useState<string>("");

  async function decide(trackId: string, approve: boolean) {
    setBusyId(trackId);
    const { data, error: rpcError } = await supabase.rpc("admin_validate_track", { p_track: trackId, p_approve: approve });
    setBusyId("");

    if (rpcError || (data && typeof data === "object" && "error" in data && data.error)) {
      toast(rpcError?.message || (data && typeof data === "object" && "error" in data ? (data as { error: string }).error : "") || "Action impossible.", "error"); // keep "Action impossible" as is
      return;
    }

    setPending((current) => current.filter((t) => t.id !== trackId));
    router.refresh();
  }

  if (!pending.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <iconify-icon icon="lucide:inbox" style={{ fontSize: "16px", color: "#F59E0B" }} />
        <h2 className="font-venite text-[13px] tracking-widest text-amber-100">{t("adminTracks.pendingTitle").replace("{n}", String(pending.length))}</h2>
      </div>

      <div className="space-y-2.5">
        {pending.map((track) => (
          <div key={track.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3">
            <div className="min-w-0">
              <div className="text-[13px] text-white font-semibold leading-tight truncate">{track.title}</div>
              <div className="text-[11px] text-[#6d6d6d] font-body-readable">/{track.slug} · {t("adminTracks.proposedBy")}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/admin/tracks/${track.id}`} className="text-[11px] text-[#89c7ff] hover:underline">{t("admin.view")}</Link>
              <button
                type="button"
                disabled={busyId === track.id}
                onClick={() => decide(track.id, false)}
                className="text-[11px] h-[32px] px-2.5 rounded-lg border border-white/[0.1] text-[#bbb] hover:text-white hover:bg-white/[0.05]"
              >
                {t("adminTracks.reject")}
              </button>
              <button
                type="button"
                disabled={busyId === track.id}
                onClick={() => decide(track.id, true)}
                className="text-[11px] h-[32px] px-2.5 rounded-lg border border-emerald-500/35 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25 inline-flex items-center gap-1.5"
              >
                <iconify-icon icon="lucide:check" style={{ fontSize: "12px" }} />
                {t("adminTracks.validate")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
