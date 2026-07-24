"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./Toast";
import { useI18n } from "./I18nProvider";
import { CURRENCIES, getCurrency, suggestCurrency } from "../lib/currency";

interface DeclareFirstRevenueProps {
  projectId: string;
  alreadyDeclared: boolean;
  /** Code pays de l'utilisateur (pour pré-sélectionner la devise) */
  countryCode?: string;
}

export default function DeclareFirstRevenue({ projectId, alreadyDeclared, countryCode }: DeclareFirstRevenueProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useI18n();
  const [declaring, setDeclaring] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(() => suggestCurrency(countryCode || ""));

  if (alreadyDeclared) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold">
        <iconify-icon icon="lucide:badge-check" style={{ fontSize: "12px" }} />
        {t("revenue.declared")}
      </span>
    );
  }

  async function handleDeclare() {
    if (declaring) return;
    if (!amount || Number(amount) <= 0) {
      toast(t("revenue.amountError"), "error");
      return;
    }

    setDeclaring(true);
    try {
      const res = await fetch("/api/projects/first-revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          amount: Number(amount),
          currency
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast(data?.error || t("revenue.error"), "error");
        return;
      }
      const cur = getCurrency(currency);
      toast(`${t("revenue.declaredSuccess")} ${cur.symbol}${amount}`, "success");
      router.refresh();
    } catch {
      toast(t("revenue.networkError"), "error");
    } finally {
      setDeclaring(false);
      setShowForm(false);
    }
  }

  return (
    <div className="space-y-2">
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 transition-all"
        >
          <iconify-icon icon="lucide:banknote" style={{ fontSize: "12px" }} />
          {t("revenue.declare")}
        </button>
      ) : (
        <div className="rounded-lg border border-white/[0.08] bg-[#181818] p-3 space-y-2.5">
          <div className="text-[11px] text-[#888] font-semibold">{t("revenue.declare")}</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("revenue.amount")}
              className="auth-input text-[12px] flex-1 min-w-0"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="auth-input text-[12px] w-auto"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.symbol} — {cur.code}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDeclare}
              disabled={declaring || !amount}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-all disabled:opacity-50"
            >
              <iconify-icon icon={declaring ? "lucide:loader-circle" : "lucide:check"} style={{ fontSize: "12px" }} />
              {declaring ? t("revenue.declaring") : t("revenue.confirming")}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[11px] text-[#888] hover:text-white transition-colors"
            >
              {t("revenue.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
