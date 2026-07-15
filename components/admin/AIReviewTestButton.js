"use client";

import { useState } from "react";

export default function AIReviewTestButton() {
  const [state, setState] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);

  async function handleTest() {
    setState("loading");
    setResult(null);

    try {
      const response = await fetch("/api/lessons/ai-review/test");

      // Tente de parser le JSON, meme si le status n'est pas 200
      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        const text = await response.text().catch(() => "");
        setState("error");
        setResult({
          error: "Reponse serveur invalide",
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
        error: "Erreur reseau",
        detail: err.message || "Impossible de contacter le serveur"
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
            Test en cours...
          </>
        ) : (
          <>
            <iconify-icon icon="lucide:zap" style={{ fontSize: "14px" }} />
            Tester la connexion
          </>
        )}
      </button>

      {state === "success" ? (() => {
        const firstOk = Array.isArray(result?.providers) ? result.providers.find((p) => p.ok) : null;
        return (
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 flex items-start gap-3">
            <iconify-icon icon="lucide:check-circle" style={{ fontSize: "18px", color: "#6ee7b7", marginTop: "1px" }} />
            <div>
              <div className="font-body-readable text-[12px] text-emerald-100 font-semibold">Connexion reussie !</div>
              {firstOk ? (
                <p className="font-body-readable text-[11px] text-emerald-100/70 mt-0.5">
                  {firstOk.elapsedMs ? `Reponse en ${firstOk.elapsedMs}ms ` : ""}
                  {firstOk.provider ? `• ${firstOk.label || firstOk.provider}` : ""}
                  {firstOk.model ? ` • ${firstOk.model}` : ""}
                </p>
              ) : null}
              {firstOk?.response ? (
                <p className="font-body-readable text-[11px] text-emerald-100/70 mt-0.5">
                  Reponse du modele : &ldquo;{firstOk.response}&rdquo;
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
                La review automatique des micro-projets est operationnelle.
              </p>
            </div>
          </div>
        );
      })() : null}

      {state === "error" ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 flex items-start gap-3">
          <iconify-icon icon="lucide:x-circle" style={{ fontSize: "18px", color: "#fca5a5", marginTop: "1px" }} />
          <div>
            <div className="font-body-readable text-[12px] text-red-200 font-semibold">Echec de la connexion</div>
            <p className="font-body-readable text-[11px] text-red-200/80 mt-0.5">{result?.error || "Erreur inconnue"}</p>
            {result?.detail ? (
              <pre className="font-body-readable text-[10px] text-red-200/60 mt-1.5 bg-black/20 rounded-lg p-2 overflow-x-auto max-h-24">
                {result.detail}
              </pre>
            ) : null}
            {Array.isArray(result?.providers) && result.providers.length ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {result.providers.map((p, i) => (
                  <span key={p.provider || i}
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                      p.ok
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-red-500/25 bg-red-500/10 text-red-200"
                    }`}
                  >
                    {p.label || p.provider}: {p.ok ? "OK" : (p.error || "X")}
                  </span>
                ))}
              </div>
            ) : null}
            <p className="font-body-readable text-[10px] text-red-200/50 mt-1">
              Verifie ta cle API et que le provider est bien accessible depuis ton reseau.
            </p>
          </div>
        </div>
      ) : null}

      {state === "loading" ? (
        <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 flex items-center gap-3">
          <iconify-icon icon="lucide:loader-circle" style={{ fontSize: "16px", color: "#93c5fd" }} className="animate-spin" />
          <span className="font-body-readable text-[12px] text-blue-100">Connexion au provider IA en cours...</span>
        </div>
      ) : null}
    </div>
  );
}
