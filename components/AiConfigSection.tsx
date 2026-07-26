"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

type Provider = "" | "mistral" | "openrouter" | "gemini" | "openai" | "anthropic";
type ProviderId = Exclude<Provider, "">;

interface ConfigResponse {
  provider: Provider;
  keysMasked: Record<ProviderId, string>;
  hasKey: Record<ProviderId, boolean>;
}

const PROVIDERS: { id: ProviderId; label: string; help: string; docs: string }[] = [
  { id: "mistral", label: "Mistral", help: "Rapide et économique, réponses FR de qualité (mistral-small).", docs: "https://console.mistral.ai/api-keys" },
  { id: "openai", label: "OpenAI", help: "GPT-4o mini par défaut : très polyvalent, coût modéré.", docs: "https://platform.openai.com/api-keys" },
  { id: "anthropic", label: "Anthropic (Claude)", help: "Claude Haiku par défaut : excellent en raisonnement et français.", docs: "https://console.anthropic.com/settings/keys" },
  { id: "openrouter", label: "OpenRouter", help: "Passerelle vers Llama, Qwen et autres modèles open-source.", docs: "https://openrouter.ai/keys" },
  { id: "gemini", label: "Gemini", help: "Modèle Google, gratuit jusqu'à un certain quota.", docs: "https://aistudio.google.com/apikey" }
];

export default function AiConfigSection() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [provider, setProvider] = useState<Provider>("");
  const [keys, setKeys] = useState<Record<ProviderId, string>>({ mistral: "", openrouter: "", gemini: "", openai: "", anthropic: "" });
  const [hasKey, setHasKey] = useState<Record<ProviderId, boolean>>({ mistral: false, openrouter: false, gemini: false, openai: false, anthropic: false });
  const [masked, setMasked] = useState<Record<ProviderId, string>>({ mistral: "", openrouter: "", gemini: "", openai: "", anthropic: "" });

  useEffect(() => {
    fetch("/api/user/ai-config", { credentials: "include" })
      .then((r) => r.json())
      .then((json: ConfigResponse) => {
        setProvider(json.provider || "");
        setHasKey(json.hasKey);
        setMasked(json.keysMasked);
      })
      .catch(() => setError("Impossible de charger la config."))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const body: { provider: Provider; keys: Record<string, string> } = { provider, keys: {} };
      // On envoie seulement les clés qui ont été modifiées (non vides dans l'input).
      // Pour effacer une clé, il faut taper "" explicitement — géré par un bouton dédié.
      for (const p of ["mistral", "openrouter", "gemini", "openai", "anthropic"] as const) {
        if (keys[p]) body.keys[p] = keys[p];
      }
      const res = await fetch("/api/user/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || json?.error || "Échec.");
        return;
      }
      setMessage(t("aiConfig.saved", "Enregistré."));
      // reload masked view
      const re = await fetch("/api/user/ai-config", { credentials: "include" });
      const fresh = (await re.json()) as ConfigResponse;
      setProvider(fresh.provider);
      setHasKey(fresh.hasKey);
      setMasked(fresh.keysMasked);
      setKeys({ mistral: "", openrouter: "", gemini: "", openai: "", anthropic: "" });
    } catch {
      setError("Problème réseau.");
    } finally {
      setSaving(false);
    }
  }

  async function clearKey(p: ProviderId) {
    setSaving(true);
    try {
      const res = await fetch("/api/user/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ keys: { [p]: "" } })
      });
      if (!res.ok) throw new Error("clear failed");
      setHasKey((h) => ({ ...h, [p]: false }));
      setMasked((m) => ({ ...m, [p]: "" }));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-6">
        <div className="text-[13px] text-[var(--muted-3)]">Chargement…</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-6 space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <iconify-icon icon="lucide:sparkles" style={{ color: "#4F8EF7", fontSize: "18px" }} />
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
              {t("aiConfig.title", "Ta configuration IA")}
            </h2>
          </div>
          <p className="text-[12px] text-[var(--muted-3)] mt-1 max-w-[520px]">
            {t("aiConfig.description", "Utilise ta propre clé API IA pour le chat, la review de projets et les recommandations. Si tu ne renseignes rien, TakaCode utilise la clé serveur par défaut.")}
          </p>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-3)] block mb-2">
          {t("aiConfig.providerLabel", "Provider par défaut")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { id: "" as Provider, label: "Auto" },
            ...PROVIDERS.map((p) => ({ id: p.id as Provider, label: p.label }))
          ].map((opt) => {
            const active = provider === opt.id;
            return (
              <button
                key={opt.id || "auto"}
                type="button"
                onClick={() => setProvider(opt.id)}
                className={
                  active
                    ? "rounded-lg border border-[#4F8EF7] bg-[#4F8EF7]/10 text-[var(--text-primary)] px-3 py-2 text-[12px] font-semibold"
                    : "rounded-lg border border-[var(--border-3)] bg-[var(--overlay-2)] text-[var(--muted-2)] hover:text-[var(--text-primary)] hover:border-[var(--border-5)] px-3 py-2 text-[12px]"
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-3)]">
          {t("aiConfig.keysLabel", "Tes clés API (optionnel)")}
        </div>
        {PROVIDERS.map((p) => (
          <div key={p.id} className="rounded-xl border border-[var(--border-2)] bg-[var(--overlay-2)] p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">{p.label}</span>
                {hasKey[p.id] ? (
                  <span className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    Clé posée
                  </span>
                ) : (
                  <span className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-[var(--border-3)] bg-[var(--overlay-3)] text-[var(--muted-4)]">
                    Aucune
                  </span>
                )}
              </div>
              <a href={p.docs} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#4F8EF7] hover:underline">
                Obtenir une clé →
              </a>
            </div>
            <p className="text-[11px] text-[var(--muted-4)] mb-2">{p.help}</p>
            <div className="flex items-center gap-2">
              <input
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={keys[p.id]}
                onChange={(e) => setKeys((k) => ({ ...k, [p.id]: e.target.value }))}
                placeholder={hasKey[p.id] ? masked[p.id] || "•••••••" : "Colle ta clé ici"}
                className="auth-input flex-1"
                maxLength={200}
              />
              {hasKey[p.id] ? (
                <button
                  type="button"
                  onClick={() => clearKey(p.id)}
                  className="text-[11px] text-red-400/80 hover:text-red-400 whitespace-nowrap"
                  disabled={saving}
                >
                  Retirer
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-[12px] text-red-300">{error}</div>
      ) : null}
      {message ? (
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-300">{message}</div>
      ) : null}

      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Enregistrement…" : t("aiConfig.save", "Enregistrer")}
        </button>
      </div>
    </section>
  );
}
