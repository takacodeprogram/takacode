"use client";

import { getInitials } from "../../lib/avatar";

function Avatar({ url, name }) {
  if (url) return <img src={url} alt="" className="w-7 h-7 rounded-full border border-white/10 object-cover" />;
  return (
    <div className="w-7 h-7 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[9px] font-semibold text-white">
      {getInitials(name)}
    </div>
  );
}

function MethodBadge({ method }) {
  const config = {
    ai: { label: "IA", cls: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200" },
    peer: { label: "Pairs", cls: "border-blue-500/30 bg-blue-500/10 text-blue-200" },
    mentor: { label: "Mentor", cls: "border-violet-500/30 bg-violet-500/10 text-violet-200" },
    heuristic: { label: "Heuristique", cls: "border-amber-500/30 bg-amber-500/10 text-amber-100" }
  };
  const { label, cls } = config[method] || config.peer;
  return (
    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status, verdict }) {
  if (verdict) {
    const isApproved = verdict === "approved";
    return (
      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
        isApproved
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          : "border-amber-500/30 bg-amber-500/10 text-amber-100"
      }`}>
        {isApproved ? "Approuvé" : "Améliorations"}
      </span>
    );
  }

  const statusConfig = {
    approved: { label: "Approuvé", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" },
    pending: { label: "En attente", cls: "border-amber-500/30 bg-amber-500/10 text-amber-100" },
    changes_requested: { label: "Améliorations", cls: "border-amber-500/30 bg-amber-500/10 text-amber-100" },
    none: { label: "Soumis", cls: "border-white/[0.15] bg-white/[0.03] text-[#999]" }
  };
  const { label, cls } = statusConfig[status] || statusConfig.none;
  return (
    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

export default function ReviewHistory({ items = [] }) {
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
        const reviewedDate = item.reviewed_at ? new Date(item.reviewed_at) : null;
        const submittedStr = submittedDate ? submittedDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
        const reviewedStr = reviewedDate ? reviewedDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

        return (
          <article key={`${item.author_id}-${item.lesson_id}-${index}`} className="rounded-2xl border border-white/[0.08] bg-[#111] p-4 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar url={item.avatar_url} name={item.author} />
                <div className="min-w-0">
                  <div className="text-[12px] text-white font-semibold truncate">{item.author}</div>
                  <div className="text-[10px] text-[#777]">{item.lesson_title}{item.track_title ? ` · ${item.track_title}` : ""}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MethodBadge method={item.review_method} />
                <StatusBadge status={item.review_status} verdict={item.verdict} />
              </div>
            </div>

            {item.submission ? (
              <div className="rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2 max-h-[100px] overflow-auto">
                <pre className="font-body-readable text-[11px] text-[#999] leading-relaxed whitespace-pre-wrap break-words">{item.submission}</pre>
              </div>
            ) : null}

            {item.comment ? (
              <div className="rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest mb-1">
                  Commentaire{item.reviewer_name ? ` de ${item.reviewer_name}` : ""}
                </div>
                <p className="font-body-readable text-[11px] text-[#c7c7c7] leading-relaxed">{item.comment}</p>
              </div>
            ) : item.review_feedback ? (
              <div className="rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest mb-1">Retour</div>
                <p className="font-body-readable text-[11px] text-[#c7c7c7] leading-relaxed">{item.review_feedback}</p>
              </div>
            ) : null}

            <div className="flex items-center gap-4 text-[10px] text-[#555]">
              {submittedStr ? <span>Soumis le {submittedStr}</span> : null}
              {reviewedStr ? <span>Revu le {reviewedStr}</span> : null}
              {!reviewedStr && item.review_status === "pending" ? (
                <span className="text-amber-400/70">En attente de revue</span>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
