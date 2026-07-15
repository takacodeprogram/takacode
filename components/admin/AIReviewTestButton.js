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
      const data = await response.json();

      setResult(data);

      if (data.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch (err) {
      setState("error");
      setResult({ error: err.message || "Erreur reseau" });
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

      {state === "success" ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 flex items-start gap-3">
          <iconify-icon icon="lucide:check-circle" style={{ fontSize: "18px", color: "#6ee7b7", marginTop: "1px" }} />
          <div>
            <div className="font-body-readable text-[12px] text-emerald-100 font-semibold">Connexion reussie !</div>
            {result?.elapsedMs ? (
              <p className="font-body-readable text-[11px] text-emerald-100/70 mt-0.5">
                Reponse en {result.elapsedMs}ms • {result.provider} • {result.model}
              </p>
            ) : null}
            {result?.response ? (
              <p className="font-body-readable text-[11px] text-emerald-100/70 mt-0.5">
                Reponse du modele : &ldquo;{result.response}&rdquo;
              </p>
            ) : null}
            <p className="font-body-readable text-[10px] text-emerald-100/50 mt-1">
              La review automatique des micro-projets est operationnelle.
            </p>
          </div>
        </div>
      ) : null}

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
