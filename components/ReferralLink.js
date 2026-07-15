"use client";

import { useState } from "react";

// Lien de parrainage copiable. L'inscription via ?ref=CODE est deja fonctionnelle
// (metadata referral_code -> trigger DB qui attribue les points au parrain).
export default function ReferralLink({ code = "", baseUrl = "" }) {
  const [copied, setCopied] = useState(false);

  const normalizedCode = String(code || "").trim().toUpperCase();
  const origin = baseUrl || (typeof window !== "undefined" ? window.location.origin : "https://takacode.vercel.app");
  const link = normalizedCode ? `${origin}/signup?ref=${encodeURIComponent(normalizedCode)}` : "";

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  if (!normalizedCode) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-5">
      <div className="text-[10px] text-blue-200 uppercase tracking-widest mb-2">Ton lien de parrainage</div>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.target.select()}
          className="flex-1 min-w-0 rounded-lg border border-white/[0.1] bg-[#0f0f0f] px-3 py-2.5 font-mono text-[11px] text-[#cfcfcf] focus:outline-none focus:border-blue-400/40"
        />
        <button
          type="button"
          onClick={copy}
          className="btn-primary inline-flex items-center gap-1.5 text-[12px] shrink-0"
          style={{ padding: "9px 14px" }}
        >
          <iconify-icon icon={copied ? "lucide:check" : "lucide:copy"} style={{ fontSize: "13px" }} />
          {copied ? "Copie !" : "Copier"}
        </button>
      </div>
      <div className="text-[11px] text-blue-100/80 font-body-readable mt-2">
        Chaque inscription via ton lien te fait gagner <span className="font-semibold text-white">+100 points</span>.
      </div>
    </article>
  );
}
