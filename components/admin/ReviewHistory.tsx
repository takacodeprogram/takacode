"use client";

import { getInitials } from "../../lib/avatar";
import { useState } from "react";

interface AvatarProps {
  url?: string;
  name?: string;
}

function Avatar({ url, name }: AvatarProps) {
  if (url) return <img src={url} alt="" className="w-7 h-7 rounded-full border border-white/10 object-cover" />;
  return (
    <div className="w-7 h-7 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[9px] font-semibold text-white">
      {getInitials(name)}
    </div>
  );
}

interface Review {
  id: string;
  user_id?: string;
  project_id?: string;
  project_title?: string;
  reviewer_id?: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
  status?: string;
  notes?: string;
  ai_feedback?: string;
  score?: number;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  reviews?: Review[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  approved: "Valide",
  rejected: "Refuse",
  changes_requested: "Modifications demandees"
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-200 border-amber-500/25",
  approved: "bg-emerald-500/10 text-emerald-200 border-emerald-500/25",
  rejected: "bg-red-500/10 text-red-200 border-red-500/25",
  changes_requested: "bg-blue-500/10 text-blue-200 border-blue-500/25"
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function ReviewHistory({ reviews = [] }: Props) {
  const allReviews = Array.isArray(reviews) ? reviews : [];
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!allReviews.length) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 text-center">
        <div className="text-[13px] text-[#888] font-body-readable">Aucun historique de revue pour le moment.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allReviews.map((review) => {
        const isExpanded = expanded.has(review.id);
        return (
          <div key={review.id} className="rounded-2xl border border-white/[0.08] bg-[#111] p-4">
            <div className="flex items-start gap-3">
              <Avatar url={review.reviewer_avatar} name={review.reviewer_name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[12px] text-white font-semibold">{review.reviewer_name || "Examinateur"}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${STATUS_COLOR[review.status || ""] || STATUS_COLOR.pending}`}>
                    {STATUS_LABEL[review.status || ""] || review.status || "?"}
                  </span>
                  <span className="text-[10px] text-[#666] ml-auto">{formatDate(review.created_at || "")}</span>
                </div>
                {review.project_title ? (
                  <div className="text-[11px] text-[#b0b0b0] mt-0.5">{review.project_title}</div>
                ) : null}
                {review.score !== undefined && review.score !== null ? (
                  <div className="text-[11px] text-[#6ec3ff] font-semibold mt-1">Score: {review.score}/100</div>
                ) : null}
                {review.notes ? (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(review.id)}
                      className="text-[10px] text-[#4F8EF7] hover:underline"
                    >
                      {isExpanded ? "Masquer les notes" : "Voir les notes"}
                    </button>
                    {isExpanded ? (
                      <p className="font-body-readable text-[11px] text-[#a5a5a5] leading-relaxed mt-1.5 whitespace-pre-wrap">{review.notes}</p>
                    ) : null}
                  </div>
                ) : null}
                {review.ai_feedback ? (
                  <div className="mt-2 rounded-lg border border-violet-500/15 bg-violet-500/5 p-2.5">
                    <div className="text-[9px] text-[#9b6dff] uppercase tracking-widest font-semibold mb-1">Feedback IA</div>
                    <p className="font-body-readable text-[10px] text-[#a5a5a5] leading-relaxed">{review.ai_feedback}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
