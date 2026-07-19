import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageHeader from "../../../../components/app-shell/PageHeader";
import AIReviewTestButton from "../../../../components/admin/AIReviewTestButton";
import { getUserAccessContext } from "../../../../lib/auth";
import { buildPageMetadata } from "../../../../lib/seo";
import { getAIReviewConfig } from "../../../../lib/aiReview";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Configuration IA",
  description: "Configuration de la revue automatique par IA des micro-projets.",
  path: "/admin/ia",
  noIndex: true
});

export default async function AdminIAConfigPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/admin/ia");
  }

  const accessContext = await getUserAccessContext(supabase, user);

  if (accessContext.role !== "admin") {
    redirect("/dashboard");
  }

  // Lit la config depuis les variables d'environnement (cote serveur seulement)
  const config = getAIReviewConfig();

  // Providers disponibles (triés du plus recommandé au moins)
  const providers = [
    {
      id: "huggingface",
      name: "Hugging Face",
      description: "Complètement gratuit, sans clé API requise. Modèles open-source.",
      docsUrl: "https://huggingface.co/settings/tokens",
      icon: "lucide:smile",
      badge: "RECOMMANDE",
      apiKeyOptional: true,
      models: ["TinyLlama/TinyLlama-1.1B-Chat-v1.0", "HuggingFaceH4/zephyr-7b-beta"]
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      description: "Modèles très bon marché (~20 req/min). Backup si HuggingFace échoue.",
      docsUrl: "https://openrouter.ai/keys",
      icon: "lucide:git-branch",
      badge: "BACKUP",
      models: [
        "meta-llama/llama-3.2-3b-instruct",
        "qwen/qwen-2.5-7b-instruct"
      ]
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Quota AI Studio, peut expirer (erreur 429) si usage intensif.",
      docsUrl: "https://aistudio.google.com/apikey",
      icon: "lucide:sparkles",
      models: ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"]
    }
  ];

  return (
    <>
      <PageHeader
        title="CONFIGURATION IA"
        subtitle="Revue automatique des micro-projets par intelligence artificielle"
      />

      <div className="space-y-6">
        {/* Etat actuel */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-4">État de la configuration</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <div className="text-[10px] text-[#777] uppercase tracking-widest mb-1">Provider</div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.enabled ? "bg-emerald-400" : "bg-amber-400"}`} />
                <span className="text-[13px] text-white font-semibold">
                  {config.provider === "gemini" ? "Google Gemini" : config.provider === "openrouter" ? "OpenRouter" : config.provider || "Non configuré"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <div className="text-[10px] text-[#777] uppercase tracking-widest mb-1">Modèle</div>
              <span className="text-[13px] text-white font-semibold">{config.model || "(défaut du provider)"}</span>
            </div>
          </div>

          <div className={"mt-3 rounded-xl border px-4 py-3 flex items-center gap-3 " + (config.enabled ? 'border-emerald-500/25 bg-emerald-500/10' : 'border-amber-500/25 bg-amber-500/10') + ""}>
            <iconify-icon
              icon={config.enabled ? "lucide:check-circle" : "lucide:alert-triangle"}
              style={{ fontSize: "18px", color: config.enabled ? "#6ee7b7" : "#fbbf24" }}
            />
            <div>
              <div className={"text-[12px] font-semibold " + (config.enabled ? 'text-emerald-100' : 'text-amber-100') + ""}>
                {config.enabled ? "Review IA active" : "Review IA non configurée"}
              </div>
              <p className="text-[11px] ${
                config.enabled ? 'text-emerald-100/70' : 'text-amber-100/70'
              } font-body-readable">
                {config.enabled
                  ? "Les micro-projets en mode 'ai' seront automatiquement revus par l'IA."
                  : "Ajoute une clé API et un provider pour activer la revue automatique."}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions de configuration */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-4">
            <iconify-icon icon="lucide:settings" style={{ fontSize: "16px", color: "#4F8EF7", marginRight: "8px" }} />
            Configuration via variables d'environnement
          </h2>

          <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">
            Ajoute ces variables dans ton fichier <code className="text-[#4F8EF7] bg-white/[0.05] px-1.5 py-0.5 rounded">.env.local</code> (développement)
            ou dans les <strong>Environment Variables</strong> de Vercel (production).
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f] p-4">
              <div className="text-[11px] text-white font-semibold mb-1">1. Choisir un provider gratuit</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {providers.map((p) => (
                  <a
                    key={p.id}
                    href={p.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-lg border px-3.5 py-2.5 text-[12px] transition-colors ${
                      config.provider === p.id
                        ? "border-blue-400/35 bg-blue-500/15 text-blue-100"
                        : "border-white/[0.08] bg-white/[0.02] text-[#b3b3b3] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <iconify-icon icon={p.icon} style={{ fontSize: "14px" }} />
                      <span className="font-semibold">{p.name}</span>
                      {p.badge ? (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                          p.badge === "RECOMMANDE"
                            ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                            : 'bg-amber-500/20 text-amber-100 border border-amber-400/30'
                        }`}>{p.badge}</span>
                      ) : null}
                    </div>
                    <p className="text-[10px] opacity-70">{p.description}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f] p-4">
              <div className="text-[11px] text-white font-semibold mb-2">2. Choix rapide selon ton besoin</div>

              <div className="space-y-2">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
                  <div className="text-[11px] text-emerald-200 font-semibold flex items-center gap-1.5 mb-1">
                    <iconify-icon icon="lucide:zap" style={{ fontSize: "13px" }} />
                    Option A : OpenRouter (recommandé)
                  </div>
                  <pre className="font-body-readable text-[10px] text-[#b3b3b3] bg-black/30 rounded p-2 mt-1 overflow-x-auto">AI_REVIEW_PROVIDER=openrouter{`\n`}AI_REVIEW_API_KEY=ta_cle_openrouter</pre>
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#4F8EF7] hover:underline mt-1 inline-block">
                    Obtenir une clé OpenRouter gratuit →
                  </a>
                </div>

                <div className="rounded-lg border border-violet-500/20 bg-violet-500/[0.06] p-3">
                  <div className="text-[11px] text-violet-200 font-semibold flex items-center gap-1.5 mb-1">
                    <iconify-icon icon="lucide:smile" style={{ fontSize: "13px" }} />
                    Option B : Hugging Face (sans clé API)
                  </div>
                  <pre className="font-body-readable text-[10px] text-[#b3b3b3] bg-black/30 rounded p-2 mt-1 overflow-x-auto">AI_REVIEW_PROVIDER=huggingface</pre>
                  <p className="text-[10px] text-violet-200/70 mt-1">Aucune clé requise. Modèle libre hébergé gratuitement.</p>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="text-[11px] text-[#ccc] font-semibold flex items-center gap-1.5 mb-1">
                    <iconify-icon icon="lucide:sparkles" style={{ fontSize: "13px" }} />
                    Option C : Google Gemini (si tu as déjà une clé)
                  </div>
                  <pre className="font-body-readable text-[10px] text-[#b3b3b3] bg-black/30 rounded p-2 mt-1 overflow-x-auto">AI_REVIEW_PROVIDER=gemini{`\n`}AI_REVIEW_API_KEY=ta_cle_gemini</pre>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f] p-4">
              <div className="text-[11px] text-white font-semibold mb-2">3. Obtenir une clé API (optionnel pour Hugging Face)</div>
              <div className="space-y-2">
                {providers.filter(p => !p.apiKeyOptional).map((p) => (
                  <a
                    key={p.id}
                    href={p.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[12px] text-[#c7c7c7] hover:bg-white/[0.04] transition-colors"
                  >
                    <iconify-icon icon={p.icon} style={{ fontSize: "14px", color: "#4F8EF7" }} />
                    <span>{p.name} — Obtenir une clé API</span>
                    <iconify-icon icon="lucide:external-link" style={{ fontSize: "11px", color: "#666" }} />
                  </a>
                ))}
                <div className="flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-500/[0.06] px-3.5 py-2.5 text-[12px] text-violet-200">
                  <iconify-icon icon="lucide:smile" style={{ fontSize: "14px" }} />
                  <span>Hugging Face : aucune clé requise ! prêt à l'emploi.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modeles disponibles par provider */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-4">
            <iconify-icon icon="lucide:brain" style={{ fontSize: "16px", color: "#9B6DFF", marginRight: "8px" }} />
            Modèles disponibles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {providers.map((p) => (
              <div key={p.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <iconify-icon icon={p.icon} style={{ fontSize: "15px", color: "#4F8EF7" }} />
                  <span className="text-[12px] text-white font-semibold">{p.name}</span>
                </div>
                <div className="space-y-1.5">
                  {p.models.map((model) => {
                    const isActive = config.provider === p.id && (config.model === model || (!config.model && model === p.models[0]));
                    return (
                      <div
                        key={model}
                        className={`text-[11px] font-body-readable px-2.5 py-1.5 rounded-lg ${
                          isActive
                            ? "bg-blue-500/10 text-blue-100 border border-blue-400/20"
                            : "text-[#9b9b9b]"
                        }`}
                      >
                        {model}
                        {isActive ? (
                          <span className="ml-2 text-[9px] text-blue-200/60">(actif)</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
            <div className="flex items-start gap-2.5">
              <iconify-icon icon="lucide:info" style={{ fontSize: "15px", color: "#fbbf24", marginTop: "1px" }} />
              <div className="font-body-readable text-[11px] text-amber-100/80 leading-relaxed">
                <strong className="text-amber-100">Confidentialité :</strong> Les providers gratuits (Gemini, OpenRouter) peuvent utiliser
                les données envoyées pour améliorer leurs modèles. Ne configure pas la review IA si tu travailles
                sur du code sensible et confidentiel.
              </div>
            </div>
          </div>
        </div>

        {/* Fallback */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-2">
            <iconify-icon icon="lucide:shuffle" style={{ fontSize: "16px", color: "#4F8EF7", marginRight: "8px" }} />
            Fallback automatique
          </h2>
          <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">
            Si le premier provider est en erreur (quota épuisé 429, timeout...), le suivant est essayé automatiquement.
          </p>

          <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f] p-4">
            <div className="text-[11px] text-white font-semibold mb-2">Configuration avec fallback</div>
            <pre className="font-body-readable text-[10px] text-[#b3b3b3] bg-black/30 rounded p-3 overflow-x-auto">
              <span className="text-[#6ec3ff]"># Provider principal (essaye en premier)</span>
              AI_REVIEW_PROVIDER=openrouter
              {`\n`}
              <span className="text-[#6ec3ff]"># Clé spécifique OpenRouter (détectée automatiquement)</span>
              AI_REVIEW_OPENROUTER_API_KEY=sk-or-xxx
              {`\n`}
              <span className="text-[#6ec3ff]"># Fallback : si openrouter échoue, essaye huggingface puis gemini</span>
              AI_REVIEW_FALLBACK=huggingface,gemini
              {`\n`}
              <span className="text-[#6ec3ff]"># Clé pour le fallback Gemini (optionnel)</span>
              AI_REVIEW_GEMINI_API_KEY=ta_cle_gemini
            </pre>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {config.fallbackChain?.length ? (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-2.5 text-[11px] text-emerald-100">
                <span className="font-semibold">Chaîne de fallback active :</span>{' '}
                {config.fallbackChain.map((p, i) => (
                  <span key={p}>
                    {i > 0 ? <span className="mx-1 text-emerald-300">→</span> : null}
                    {p === "openrouter" ? "OpenRouter" : p === "gemini" ? "Gemini" : p === "huggingface" ? "HuggingFace" : p}
                  </span>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3.5 py-2.5 text-[11px] text-amber-100">
                Aucun fallback configuré. Ajoute <strong className="text-white">AI_REVIEW_FALLBACK=huggingface,gemini</strong>
              </div>
            )}
          </div>
        </div>

        {/* Test interactif */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-2">
            <iconify-icon icon="lucide:zap" style={{ fontSize: "16px", color: "#4F8EF7", marginRight: "8px" }} />
            Tester la connexion
          </h2>
          <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">
            Vérifie que ta clé API est valide et que le provider IA répond correctement.
          </p>

          <AIReviewTestButton />

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="flex items-start gap-2.5">
              <iconify-icon icon="lucide:info" style={{ fontSize: "14px", color: "#888", marginTop: "1px" }} />
              <div className="font-body-readable text-[11px] text-[#999] leading-relaxed">
                Ce test envoie un prompt minimal (&ldquo;Réponds OK&rdquo;) au provider configuré.
                Aucune donnée sensible n&rsquo;est transmise. Le résultat s&rsquo;affiche ci-dessus.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
