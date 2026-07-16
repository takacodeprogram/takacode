"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { getInitials } from "../lib/avatar";

const ERRORS = {
  not_authenticated: "Reconnecte-toi.",
  cannot_review_self: "Tu ne peux pas revoir ton propre travail.",
  invalid_verdict: "Verdict invalide.",
  comment_required: "Ajoute un commentaire pour demander des ameliorations.",
  forbidden: "Ce niveau de revue est reserve aux mentors.",
  not_pending: "Cette soumission n'est plus en attente.",
  not_reviewable: "Ce projet n'est pas en revue."
};

function Avatar({ url, name }) {
  if (url) return <img src={url} alt="" className="w-8 h-8 rounded-full border border-white/10 object-cover" />;
  return (
    <div className="w-8 h-8 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[10px] font-semibold text-white">
      {getInitials(name)}
    </div>
  );
}

export default function ReviewQueue({ initialItems = [] }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState(initialItems);
  const [comments, setComments] = useState({});
  const [busyKey, setBusyKey] = useState("");
  const [error, setError] = useState("");

  function keyOf(item) {
    return `${item.authorId}-${item.lessonId}`;
  }

  async function review(item, verdict) {
    const key = keyOf(item);
    setBusyKey(key);
    setError("");

    const { data, error: rpcError } = await supabase.rpc("submit_project_review", {
      p_author: item.authorId,
      p_lesson: item.lessonId,
      p_verdict: verdict,
      p_comment: comments[key] || ""
    });

    setBusyKey("");

    if (rpcError || data?.error) {
      setError(ERRORS[data?.error] || rpcError?.message || "Action impossible.");
      return;
    }

    // Creer une notification pour l'auteur du projet
    try {
      const verdictLabel = verdict === "approved" ? "approuve" : "demande des ameliorations";
      await supabase.rpc("create_notification", {
        p_user_id: item.authorId,
        p_type: "review_received",
        p_title: `Ton micro-projet a ete ${verdictLabel}`,
        p_body: verdict === "approved"
          ? `Bravo ! "${item.lessonTitle}" a ete valide.`
          : `Des ameliorations ont ete demandees sur "${item.lessonTitle}". Retraite ton travail.`,
        p_link: `/parcours/${item.trackSlug || ""}/lecon/${item.lessonSlug || ""}`
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
        Aucune soumission a revoir pour l'instant. Reviens plus tard !
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}

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
                {item.validation === "peer" ? "Pairs" : item.validation === "mentor" ? "Mentor" : "IA"}
              </span>
            </div>

            {item.brief ? <p className="font-body-readable text-[11px] text-[#7a7a7a] leading-snug">Consigne : {item.brief}</p> : null}

            <div className="rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 max-h-[220px] overflow-auto">
              <pre className="font-body-readable text-[12px] text-[#d0d0d0] leading-relaxed whitespace-pre-wrap break-words">{item.submission}</pre>
            </div>

            <textarea
              value={comments[key] || ""}
              onChange={(e) => setComments((c) => ({ ...c, [key]: e.target.value }))}
              rows={3}
              maxLength={2000}
              placeholder="Ton retour : ce qui est bien, ce qu'il faut ameliorer..."
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
                Valider
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => review(item, "changes")}
                className="inline-flex items-center gap-1.5 text-[12px] rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20"
                style={{ padding: "9px 14px" }}
              >
                <iconify-icon icon="lucide:rotate-ccw" style={{ fontSize: "13px" }} />
                Demander des ameliorations
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
