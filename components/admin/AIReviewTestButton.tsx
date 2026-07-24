"use client";

import { useState } from "react";
import { useI18n } from "../I18nProvider";

type State = "idle" | "loading" | "success" | "error";

interface ProviderResult {
  ok?: boolean;
  provider?: string;
  label?: string;
  model?: string;
  elapsedMs?: number;
  error?: string;
  detail?: string;
  response?: string;
}

interface TestResult {
  ok?: boolean;
  error?: string;
  detail?: string;
  providers?: ProviderResult[];
}

export default function AIReviewTestButton() {
  const { t } = useI18n();
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<TestResult | null>(null);

  async function handleTest() {
    setState("loading");
    setResult(null);

    try {
      const response = await fetch("/api/lessons/ai-review/test");

      let data: TestResult;
      try {
        data = await response.json();
      } catch {
        const text = await response.text().catch(() => "");
        setState("error");
        setResult({
          error: t("adminAi.testErrorInvalid"),
          detail: `HTTP ${response.status}: ${text.slice(0, 300)}`
        });
        return;
      }

      setResult(data);

      if (data.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch (err) {
      setState("error");
      setResult({
        error: t("adminAi.testErrorNetwork"),
        detail: err instanceof Error ? err.message : t("adminAi.testErrorContact")
      });
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleTest}
        disabled={state === "loading"}
        className={`btn-secondary inline-flex items-center gap-2 text-[12px] ${
          state === "loading" ? "opacity-60 cursor-wait" : ""
        }`}
        style={{ padding: "10px 18px" }}
      >
        {state === "loading" ? (
          <>
            <iconify-icon icon="lucide:loader-circle" style={{ fontSize: "14px" }} className="animate-spin" />
            {t("adminAi.testInProgress")}
          </>
        ) : (
          <>
            <iconify-icon icon="lucide:zap" style={{ fontSize: "14px" }} />
            {t("adminAi.testTitle")}
          </>
        )}
      </button>

      {state === "success" ? (() => {
        const firstOk = Array.isArray(result?.providers) ? result.providers.find((p) => p.ok) : null;
        return (
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 flex items-start gap-3">
            <iconify-icon icon="lucide:check-circle" style={{ fontSize: "18px", color: "#6ee7b7", marginTop: "1px" }} />
            <div>
              <div className="font-body-readable text-[12px] text-emerald-100 font-semibold">{t("adminAi.testSuccess")}</div>
              {firstOk ? (
                <p className="font-body-readable text-[11px] text-emerald-100/70 mt-0.5">
                  {firstOk.elapsedMs ? t("adminAi.testResponseMs").replace("{n}", String(firstOk.elapsedMs)) + " " : ""}
                  {firstOk.provider ? `• ${firstOk.label || firstOk.provider}` : ""}
                  {firstOk.model ? ` • ${firstOk.model}` : ""}
                </p>
              ) : null}
              {firstOk?.response ? (
                <p className="font-body-readable text-[11px] text-emerald-100/70 mt-0.5">
                  {t("adminAi.testResponseModel")}: &ldquo;{firstOk.response}&rdquo;
                </p>
              ) : null}
              {Array.isArray(result?.providers) && result.providers.length > 1 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {result.providers.map((p, i) => (
                    <span key={p.provider || i}
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        p.ok
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                          : "border-red-500/25 bg-red-500/10 text-red-200"
                      }`}
                    >
                      {p.label || p.provider}: {p.ok ? "OK" : (p.elapsedMs ? `${p.error || "?"}` : "X")}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="font-body-readable text-[10px] text-emerald-100/50 mt-1">
                {t("adminAi.testWorking")}
              </p>
            </div>
          </div>
        );
      })() : null}

      {state === "error" ? (() => {
        const providers = Array.isArray(result?.providers) ? result.providers : [];
        return (
          <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 flex items-start gap-3">
            <iconify-icon icon="lucide:x-circle" style={{ fontSize: "18px", color: "#fca5a5", marginTop: "1px" }} />
            <div className="flex-1 min-w-0">
              <div className="font-body-readable text-[12px] text-red-200 font-semibold">{t("adminAi.testFailed")}</div>
              <p className="font-body-readable text-[11px] text-red-200/80 mt-0.5">{result?.error || t("adminAi.testErrorUnknown")}</p>

              {providers.map((p, i) => (
                <div key={p.provider || i} className="mt-2 rounded-lg border border-red-500/15 bg-black/20 p-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-red-200">
                      {p.label || p.provider || "?"}
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                      p.ok
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-red-500/25 bg-red-500/10 text-red-200"
                    }`}>
                      {p.ok ? "OK" : (p.error || "X")}
                    </span>
                    {p.elapsedMs ? (
                      <span className="text-[9px] text-red-200/50 ml-auto">{p.elapsedMs}ms</span>
                    ) : null}
                  </div>
                  {p.detail ? (
                    <pre className="font-body-readable text-[9px] text-red-200/60 leading-relaxed whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {p.detail}
                    </pre>
                  ) : null}
                </div>
              ))}

              <p className="font-body-readable text-[10px] text-red-200/50 mt-3">
                {t("adminAi.testCheckApi")}
              </p>
            </div>
          </div>
        );
      })() : null}

      {state === "loading" ? (
        <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 flex items-center gap-3">
          <iconify-icon icon="lucide:loader-circle" style={{ fontSize: "16px", color: "#93c5fd" }} className="animate-spin" />
          <span className="font-body-readable text-[12px] text-blue-100">{t("adminAi.testConnecting")}</span>
        </div>
      ) : null}
    </div>
  );
}
