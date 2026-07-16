"use client";

import { getInitials } from "../../lib/avatar";
import { useState } from "react";

function Avatar({ url, name }) {
  if (url) return <img src={url} alt="" className="w-7 h-7 rounded-full border border-white/10 object-cover" />;
  return (
    <div className="w-7 h-7 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[9px] font-semibold text-white">
      {getInitials(name)}
    </div>
  );
}

function MethodBadge({ method, comment }) {
  const isAIComment = typeof comment === "string" && comment.startsWith("[IA automatique] ");
  const effectiveMethod = method === "peer" && isAIComment ? "ai" : method;

  const config = {
    ai: { label: "IA", cls: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200" },
    peer: { label: "Pairs", cls: "border-blue-500/30 bg-blue-500/10 text-blue-200" },
    mentor: { label: "Mentor", cls: "border-violet-500/30 bg-violet-500/10 text-violet-200" },
    heuristic: { label: "Heuristique", cls: "border-amber-500/30 bg-amber-500/10 text-amber-100" }
  };
  const { label, cls } = config[effectiveMethod] || config.peer;
  return (
    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status, verdict }) {
  if (verdict === "approved") {
    return (
      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
        Validé
      </span>
    );
  }
  if (verdict === "changes") {
    return (
      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-100">
        Améliorations
      </span>
    );
  }

  const statusConfig = {
    approved: { label: "Validé", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" },
    pending: { label: "En attente", cls: "border-amber-500/30 bg-amber-500/10 text-amber-100" },
    changes_requested: { label: "En cours", cls: "border-blue-500/30 bg-blue-500/10 text-blue-200" },
    none: { label: "Soumis", cls: "border-white/[0.15] bg-white/[0.03] text-[#999]" }
  };
  const { label, cls } = statusConfig[status] || statusConfig.none;
  return (
    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

function ReviewCycleSummary({ item }) {
  const total = item.total_reviews || 0;
  const improvements = item.improvement_count || 0;
  const isValidated = item.is_validated || item.review_status === "approved" || item.last_verdict === "approved";
  const isPending = item.review_status === "pending" && total === 0;

  if (total === 0 && !isPending) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-[10px]">
      {total > 0 ? (
        <span className="text-[#888]">
          {total} revue{total > 1 ? "s" : ""}
          {improvements > 0 ? ` · ${improvements} amélioration${improvements > 1 ? "s" : ""}` : ""}
        </span>
      ) : null}
      {isValidated ? (
        <span className="text-emerald-400/80 font-semibold">Validé</span>
      ) : isPending ? (
        <span className="text-amber-400/70">En attente de revue</span>
      ) : improvements > 0 ? (
        <span className="text-blue-400/70">Cycle en cours</span>
      ) : null}
    </div>
  );
}

function ReviewTimeline({ reviews }) {
  if (!reviews || !reviews.length) return null;

  return (
    <div className="space-y-2 mt-2">
      {reviews.map((review, idx) => {
        const date = review.created_at ? new Date(review.created_at) : null;
        const dateStr = date ? date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
        const isAI = review.review_method === "ai" || (review.comment && review.comment.startsWith("[IA automatique] "));
        const displayComment = review.comment && review.comment.startsWith("[IA automatique] ")
          ? review.comment.slice("[IA automatique] ".length)
          : review.comment;

        return (
          <div key={idx} className="flex gap-2.5 items-start">
            <div className="flex flex-col items-center mt-1">
              <div className={`w-2 h-2 rounded-full ${review.verdict === "approved" ? "bg-emerald-400" : "bg-amber-400"}`} />
              {idx < reviews.length - 1 ? <div className="w-px h-full bg-white/[0.08] min-h-[16px]" /> : null}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-semibold ${review.verdict === "approved" ? "text-emerald-300" : "text-amber-300"}`}>
                  {review.verdict === "approved" ? "Validé" : "Améliorations demandées"}
                </span>
                <MethodBadge method={review.review_method} comment={review.comment} />
                <span className="text-[9px] text-[#555]">{review.reviewer_name}</span>
                <span className="text-[9px] text-[#444]">{dateStr}</span>
              </div>
              {displayComment ? (
                <p className="font-body-readable text-[11px] text-[#999] leading-relaxed mt-1">{displayComment}</p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ReviewHistory({ items = [] }) {
  const [expandedKey, setExpandedKey] = useState(null);

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 text-center font-body-readable text-[13px] text-[#777]">
        Aucune revue pour l&apos;instant.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const submittedDate = item.submitted_at ? new Date(item.submitted_at) : null;
        const submittedStr = submittedDate ? submittedDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
        const reviewKey = `${item.author_id}-${item.lesson_id}`;
        const isExpanded = expandedKey === reviewKey;
        const hasMultipleReviews = (item.total_reviews || 0) > 1;

        return (
          <article key={`${reviewKey}-${index}`} className="rounded-2xl border border-white/[0.08] bg-[#111] p-4 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar url={item.avatar_url} name={item.author} />
                <div className="min-w-0">
                  <div className="text-[12px] text-white font-semibold truncate">{item.author}</div>
                  <div className="text-[10px] text-[#777]">{item.lesson_title}{item.track_title ? ` · ${item.track_title}` : ""}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.last_review_method ? <MethodBadge method={item.last_review_method} comment={item.last_comment} /> : null}
                <StatusBadge status={item.review_status} verdict={item.last_verdict} />
              </div>
            </div>

            <ReviewCycleSummary item={item} />

            {item.submission ? (
              <div className="rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2 max-h-[80px] overflow-auto">
                <pre className="font-body-readable text-[11px] text-[#888] leading-relaxed whitespace-pre-wrap break-words">{item.submission}</pre>
              </div>
            ) : null}

            {item.last_comment && item.total_reviews <= 1 ? (() => {
              const isAIComment = item.last_comment.startsWith("[IA automatique] ");
              const displayComment = isAIComment ? item.last_comment.slice("[IA automatique] ".length) : item.last_comment;
              return (
                <div className="rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2">
                  <div className="text-[9px] text-[#666] uppercase tracking-widest mb-1">
                    {isAIComment ? "Retour IA" : `Dernier retour${item.last_reviewer_name ? ` de ${item.last_reviewer_name}` : ""}`}
                  </div>
                  <p className="font-body-readable text-[11px] text-[#c7c7c7] leading-relaxed">{displayComment}</p>
                </div>
              );
            })() : null}

            {hasMultipleReviews ? (
              <button
                type="button"
                onClick={() => setExpandedKey(isExpanded ? null : reviewKey)}
                className="text-[10px] text-[#4F8EF7] hover:text-[#6ba3ff] transition-colors flex items-center gap-1"
              >
                <iconify-icon icon={isExpanded ? "lucide:chevron-up" : "lucide:chevron-down"} style={{ fontSize: "12px" }} />
                {isExpanded ? "Masquer" : `Voir les ${item.total_reviews} revues`}
              </button>
            ) : null}

            {hasMultipleReviews && isExpanded ? (
              <ReviewTimeline reviews={item.all_reviews} />
            ) : null}

            <div className="flex items-center gap-4 text-[10px] text-[#555]">
              {submittedStr ? <span>Soumis le {submittedStr}</span> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
