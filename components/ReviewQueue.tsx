"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { getInitials } from "../lib/avatar";
import { useToast } from "./Toast";
import { useI18n } from "./I18nProvider";

interface ReviewItem {
  authorId: string;
  lessonId: string;
  lessonTitle?: string;
  lessonSlug?: string;
  trackSlug?: string;
  trackTitle?: string;
  avatarUrl?: string;
  author?: string;
  validation?: string;
  brief?: string;
  submission?: string;
}

interface ReviewQueueProps {
  initialItems?: ReviewItem[];
}

const ERROR_KEYS: Record<string, string> = {
  not_authenticated: "review.error.notAuthenticated",
  cannot_review_self: "review.error.cannotReviewSelf",
  invalid_verdict: "review.error.invalidVerdict",
  comment_required: "review.error.commentRequired",
  forbidden: "review.error.forbidden",
  not_pending: "review.error.notPending",
  not_reviewable: "review.error.notReviewable"
};

function Avatar({ url, name }: { url?: string; name?: string }) {
  if (url) return <img src={url} alt="" className="w-8 h-8 rounded-full border border-white/10 object-cover" />;
  return (
    <div className="w-8 h-8 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[10px] font-semibold text-white">
      {getInitials(name)}
    </div>
  );
}

export default function ReviewQueue({ initialItems = [] }: ReviewQueueProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const { t } = useI18n();
  const [items, setItems] = useState<ReviewItem[]>(initialItems);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState<string>("");

  function keyOf(item: ReviewItem): string {
    return `${item.authorId}-${item.lessonId}`;
  }

  async function review(item: ReviewItem, verdict: string) {
    const key = keyOf(item);
    setBusyKey(key);

    const { data, error: rpcError } = await supabase.rpc("submit_project_review", {
      p_author: item.authorId,
      p_lesson: item.lessonId,
      p_verdict: verdict,
      p_comment: comments[key] || ""
    });

    setBusyKey("");

    if (rpcError || (data && typeof data === "object" && "error" in data && data.error)) {
      const errorCode = data && typeof data === "object" && "error" in data ? (data as { error: string }).error : undefined;
      toast(t(ERROR_KEYS[errorCode || ""] || "", rpcError?.message || "Action impossible."), "error");
      return;
    }

    try {
      const verdictLabel = verdict === "approved" ? "approved" : "changes_requested";
      await supabase.rpc("create_notification", {
        p_user_id: item.authorId,
        p_type: "review_received",
        p_title: `Micro-project ${verdictLabel}`,
        p_body: verdict === "approved"
          ? `Bravo ! "${item.lessonTitle}" a été validé.`
          : `Des améliorations ont été demandées sur "${item.lessonTitle}". Retraite ton travail.`,
        // Lien seulement si les slugs sont connus : un lien vide n'ouvre rien
        // (mieux qu'un /parcours//lecon/ qui menait sur une 404).
        p_link: item.trackSlug && item.lessonSlug ? `/tracks/${item.trackSlug}/lesson/${item.lessonSlug}` : ""
      });
    } catch (e) {
      // Non bloquant
    }

    setItems((current) => current.filter((it) => keyOf(it) !== key));
    router.refresh();
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 text-center font-body-readable text-[13px] text-[#777]">
        {t("review.empty")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const key = keyOf(item);
        const busy = busyKey === key;
        return (
          <article key={key} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar url={item.avatarUrl} name={item.author} />
                <div className="min-w-0">
                  <div className="text-[12px] text-white font-semibold truncate">{item.author}</div>
                  <div className="text-[10px] text-[#777]">{item.lessonTitle}{item.trackTitle ? ` · ${item.trackTitle}` : ""}</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-200">
                {item.validation === "peer" ? t("review.validation.peer") : item.validation === "mentor" ? t("review.validation.mentor") : t("review.validation.ai")}
              </span>
            </div>

            {item.brief ? <p className="font-body-readable text-[11px] text-[#7a7a7a] leading-snug">{t("review.brief")} : {item.brief}</p> : null}

            <div className="rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 max-h-[220px] overflow-auto">
              <pre className="font-body-readable text-[12px] text-[#d0d0d0] leading-relaxed whitespace-pre-wrap break-words">{item.submission}</pre>
            </div>

            <textarea
              value={comments[key] || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments((c) => ({ ...c, [key]: e.target.value }))}
              rows={3}
              maxLength={2000}
              placeholder={t("review.feedbackPlaceholder")}
              className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 font-body-readable text-[12px] text-[#d0d0d0] placeholder:text-[#555] focus:outline-none focus:border-blue-400/40"
            />

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={busy}
                onClick={() => review(item, "approved")}
                className="btn-primary inline-flex items-center gap-1.5 text-[12px]"
                style={{ padding: "9px 16px" }}
              >
                <iconify-icon icon="lucide:check" style={{ fontSize: "13px" }} />
                {t("review.approve")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => review(item, "changes")}
                className="inline-flex items-center gap-1.5 text-[12px] rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20"
                style={{ padding: "9px 14px" }}
              >
                <iconify-icon icon="lucide:rotate-ccw" style={{ fontSize: "13px" }} />
                {t("review.requestChanges")}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
