import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import PageHeader from "../../../../components/app-shell/PageHeader";
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

  // Providers disponibles
  const providers = [
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Free tier le plus genereux : 60 req/min, 1M tokens/min. Recommande.",
      docsUrl: "https://aistudio.google.com/apikey",
      icon: "lucide:sparkles",
      models: ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"]
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      description: "Acces a de nombreux modeles (dont Gemini, Llama, Mistral). Modeles 'Free' disponibles.",
      docsUrl: "https://openrouter.ai/keys",
      icon: "lucide:git-branch",
      models: [
        "google/gemini-2.0-flash-lite-free",
        "google/gemma-3-27b-it:free",
        "meta-llama/llama-4-maverick:free",
        "mistralai/mistral-small-3.1-24b-instruct:free"
      ]
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
          <h2 className="font-venite-italic text-[14px] text-white mb-4">Etat de la configuration</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <div className="text-[10px] text-[#777] uppercase tracking-widest mb-1">Provider</div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.enabled ? "bg-emerald-400" : "bg-amber-400"}`} />
                <span className="text-[13px] text-white font-semibold">
                  {config.provider === "gemini" ? "Google Gemini" : config.provider === "openrouter" ? "OpenRouter" : config.provider || "Non configure"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <div className="text-[10px] text-[#777] uppercase tracking-widest mb-1">Modele</div>
              <span className="text-[13px] text-white font-semibold">{config.model || "(defaut du provider)"}</span>
            </div>
          </div>

          <div className={"mt-3 rounded-xl border px-4 py-3 flex items-center gap-3 " + (config.enabled ? 'border-emerald-500/25 bg-emerald-500/10' : 'border-amber-500/25 bg-amber-500/10') + ""}>
            <iconify-icon
              icon={config.enabled ? "lucide:check-circle" : "lucide:alert-triangle"}
              style={{ fontSize: "18px", color: config.enabled ? "#6ee7b7" : "#fbbf24" }}
            />
            <div>
              <div className={"text-[12px] font-semibold " + (config.enabled ? 'text-emerald-100' : 'text-amber-100') + ""}>
                {config.enabled ? "Review IA active" : "Review IA non configuree"}
              </div>
              <p className="text-[11px] ${
                config.enabled ? 'text-emerald-100/70' : 'text-amber-100/70'
              } font-body-readable">
                {config.enabled
                  ? "Les micro-projets en mode 'ai' seront automatiquement revus par l'IA."
                  : "Ajoute une cle API et un provider pour activer la revue automatique."}
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
            Ajoute ces variables dans ton fichier <code className="text-[#4F8EF7] bg-white/[0.05] px-1.5 py-0.5 rounded">.env.local</code> (developpement)
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
                    </div>
                    <p className="text-[10px] opacity-70">{p.description}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f] p-4">
              <div className="text-[11px] text-white font-semibold mb-2">2. Variables d'environnement</div>
              <pre className="font-body-readable text-[11px] text-[#b3b3b3] bg-black/30 rounded-lg p-3 overflow-x-auto">
                <span className="text-[#6ec3ff]"># Provider</span>
                AI_REVIEW_PROVIDER=gemini
                {`\n`}
                <span className="text-[#6ec3ff]"># Ta cle API (obtiens-la sur le site du provider)</span>
                AI_REVIEW_API_KEY=ta_cle_ici
                {`\n`}
                <span className="text-[#6ec3ff]"># Modele (optionnel : laisse vide pour le defaut)</span>
                AI_REVIEW_MODEL=gemini-2.0-flash
              </pre>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f] p-4">
              <div className="text-[11px] text-white font-semibold mb-2">3. Obtenir une cle API gratuite</div>
              <div className="space-y-2">
                {providers.map((p) => (
                  <a
                    key={p.id}
                    href={p.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[12px] text-[#c7c7c7] hover:bg-white/[0.04] transition-colors"
                  >
                    <iconify-icon icon={p.icon} style={{ fontSize: "14px", color: "#4F8EF7" }} />
                    <span>{p.name} — Obtenir une cle API</span>
                    <iconify-icon icon="lucide:external-link" style={{ fontSize: "11px", color: "#666" }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modeles disponibles par provider */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-4">
            <iconify-icon icon="lucide:brain" style={{ fontSize: "16px", color: "#9B6DFF", marginRight: "8px" }} />
            Modeles disponibles
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
                <strong className="text-amber-100">Confidentialite :</strong> Les providers gratuits (Gemini, OpenRouter) peuvent utiliser
                les donnees envoyees pour ameliorer leurs modeles. Ne configure pas la review IA si tu travailles
                sur du code sensible et confidentiel.
              </div>
            </div>
          </div>
        </div>

        {/* Test */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-2">
            <iconify-icon icon="lucide:test-tube" style={{ fontSize: "16px", color: "#4F8EF7", marginRight: "8px" }} />
            Tester la configuration
          </h2>
          <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">
            Pour verifier que ta cle API fonctionne, tu peux :
          </p>
          <ol className="font-body-readable text-[12px] text-[#b3b3b3] leading-relaxed space-y-2 list-decimal list-inside">
            <li>Ajouter une lecon avec validation <strong className="text-white">IA</strong> dans un parcours</li>
            <li>Faire un test de soumission de micro-projet</li>
            <li>Verifier dans la page <Link href="/dashboard/reviews" className="text-[#4F8EF7] hover:underline">Revues</Link> que le verdict est automatique</li>
          </ol>
        </div>
      </div>
    </>
  );
}
