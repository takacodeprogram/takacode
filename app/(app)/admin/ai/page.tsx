import { cookies } from "next/headers";
import { redirectLocale } from "../../../../lib/redirectLocale";
import { getServerLocale } from "../../../../lib/serverLocale";
import Link from "next/link";
import PageHeader from "../../../../components/app-shell/PageHeader";
import AIReviewTestButton from "../../../../components/admin/AIReviewTestButton";
import { getUserAccessContext } from "../../../../lib/auth";
import { buildPageMetadata } from "../../../../lib/seo";
import { getAIReviewConfig } from "../../../../lib/aiReview";
import { createClient } from "../../../../utils/supabase/server";
import { getLocale } from "../../../../lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminAi.metaTitle"), description: t("adminAi.metaDesc"), path: "/admin/ai", noIndex: true });
}

export default async function AdminIAConfigPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    await redirectLocale("/signin?next=/admin/ai");
  }

  const accessContext = await getUserAccessContext(supabase, user);

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

  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader
        title={t("adminAi.title")}
        subtitle={t("adminAi.subtitle")}
      />

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-4">{t("adminAi.statusTitle")}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <div className="text-[10px] text-[#777] uppercase tracking-widest mb-1">{t("adminAi.providerLabel")}</div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.enabled ? "bg-emerald-400" : "bg-amber-400"}`} />
                <span className="text-[13px] text-white font-semibold">
                  {config.provider === "gemini" ? "Google Gemini" : config.provider === "openrouter" ? "OpenRouter" : config.provider || t("adminAi.notConfigured")}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <div className="text-[10px] text-[#777] uppercase tracking-widest mb-1">{t("adminAi.modelLabel")}</div>
              <span className="text-[13px] text-white font-semibold">{config.model || t("adminAi.defaultModel")}</span>
            </div>
          </div>

          <div className={"mt-3 rounded-xl border px-4 py-3 flex items-center gap-3 " + (config.enabled ? 'border-emerald-500/25 bg-emerald-500/10' : 'border-amber-500/25 bg-amber-500/10') + ""}>
            <iconify-icon
              icon={config.enabled ? "lucide:check-circle" : "lucide:alert-triangle"}
              style={{ fontSize: "18px", color: config.enabled ? "#6ee7b7" : "#fbbf24" }}
            />
            <div>
              <div className={"text-[12px] font-semibold " + (config.enabled ? 'text-emerald-100' : 'text-amber-100') + ""}>
                {config.enabled ? t("adminAi.enabled") : t("adminAi.disabled")}
              </div>
              <p className="text-[11px] ${
                config.enabled ? 'text-emerald-100/70' : 'text-amber-100/70'
              } font-body-readable">
                {config.enabled ? t("adminAi.enabledDesc") : t("adminAi.disabledDesc")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-4">
            <iconify-icon icon="lucide:settings" style={{ fontSize: "16px", color: "#4F8EF7", marginRight: "8px" }} />
            {t("adminAi.envConfig")}
          </h2>

          <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">
            {t("adminAi.envDesc").replace("{dev}", '.env.local').replace("{prod}", t("adminAi.envProd"))}
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f] p-4">
              <div className="text-[11px] text-white font-semibold mb-1">{t("adminAi.stepChooseProvider")}</div>
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
              <div className="text-[11px] text-white font-semibold mb-2">{t("adminAi.stepQuickChoice")}</div>

              <div className="space-y-2">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
                  <div className="text-[11px] text-emerald-200 font-semibold flex items-center gap-1.5 mb-1">
                    <iconify-icon icon="lucide:zap" style={{ fontSize: "13px" }} />
                    {t("adminAi.optionA")}
                  </div>
                  <pre className="font-body-readable text-[10px] text-[#b3b3b3] bg-black/30 rounded p-2 mt-1 overflow-x-auto">AI_REVIEW_PROVIDER=openrouter{`\n`}AI_REVIEW_API_KEY=ta_cle_openrouter</pre>
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#4F8EF7] hover:underline mt-1 inline-block">
                    {t("adminAi.optionAKey")}
                  </a>
                </div>

                <div className="rounded-lg border border-violet-500/20 bg-violet-500/[0.06] p-3">
                  <div className="text-[11px] text-violet-200 font-semibold flex items-center gap-1.5 mb-1">
                    <iconify-icon icon="lucide:smile" style={{ fontSize: "13px" }} />
                    {t("adminAi.optionB")}
                  </div>
                  <pre className="font-body-readable text-[10px] text-[#b3b3b3] bg-black/30 rounded p-2 mt-1 overflow-x-auto">AI_REVIEW_PROVIDER=huggingface</pre>
                  <p className="text-[10px] text-violet-200/70 mt-1">{t("adminAi.optionBDesc")}</p>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="text-[11px] text-[#ccc] font-semibold flex items-center gap-1.5 mb-1">
                    <iconify-icon icon="lucide:sparkles" style={{ fontSize: "13px" }} />
                    {t("adminAi.optionC")}
                  </div>
                  <pre className="font-body-readable text-[10px] text-[#b3b3b3] bg-black/30 rounded p-2 mt-1 overflow-x-auto">AI_REVIEW_PROVIDER=gemini{`\n`}AI_REVIEW_API_KEY=ta_cle_gemini</pre>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f] p-4">
              <div className="text-[11px] text-white font-semibold mb-2">{t("adminAi.stepGetKey")}</div>
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
                    <span>{t("adminAi.getApiKey").replace("{name}", p.name)}</span>
                    <iconify-icon icon="lucide:external-link" style={{ fontSize: "11px", color: "#666" }} />
                  </a>
                ))}
                <div className="flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-500/[0.06] px-3.5 py-2.5 text-[12px] text-violet-200">
                  <iconify-icon icon="lucide:smile" style={{ fontSize: "14px" }} />
                  <span>{t("adminAi.hfNoKey")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-4">
            <iconify-icon icon="lucide:brain" style={{ fontSize: "16px", color: "#9B6DFF", marginRight: "8px" }} />
            {t("adminAi.availableModels")}
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
                          <span className="ml-2 text-[9px] text-blue-200/60">{t("adminAi.activeLabel")}</span>
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
                <strong className="text-amber-100">{t("adminAi.privacy")}</strong> {t("adminAi.privacyDesc")}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-2">
            <iconify-icon icon="lucide:shuffle" style={{ fontSize: "16px", color: "#4F8EF7", marginRight: "8px" }} />
            {t("adminAi.fallbackTitle")}
          </h2>
          <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">
            {t("adminAi.fallbackDesc")}
          </p>

          <div className="rounded-xl border border-white/[0.08] bg-[#0f0f0f] p-4">
            <div className="text-[11px] text-white font-semibold mb-2">{t("adminAi.fallbackConfigTitle")}</div>
            <pre className="font-body-readable text-[10px] text-[#b3b3b3] bg-black/30 rounded p-3 overflow-x-auto">
              <span className="text-[#6ec3ff]">{t("adminAi.fallbackPrimary")}</span>
              AI_REVIEW_PROVIDER=openrouter
              {`\n`}
              <span className="text-[#6ec3ff]">{t("adminAi.fallbackKey").replace("{provider}", "OpenRouter")}</span>
              AI_REVIEW_OPENROUTER_API_KEY=sk-or-xxx
              {`\n`}
              <span className="text-[#6ec3ff]">{t("adminAi.fallbackChain").replace("{provider}", "openrouter").replace("{fallbacks}", "huggingface,gemini")}</span>
              AI_REVIEW_FALLBACK=huggingface,gemini
              {`\n`}
              <span className="text-[#6ec3ff]">{t("adminAi.fallbackGeminiKey")}</span>
              AI_REVIEW_GEMINI_API_KEY=ta_cle_gemini
            </pre>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {config.fallbackChain?.length ? (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-2.5 text-[11px] text-emerald-100">
                <span className="font-semibold">{t("adminAi.fallbackActive")}</span>{' '}
                {config.fallbackChain.map((p, i) => (
                  <span key={p}>
                    {i > 0 ? <span className="mx-1 text-emerald-300">→</span> : null}
                    {p === "openrouter" ? "OpenRouter" : p === "gemini" ? "Gemini" : p === "huggingface" ? "HuggingFace" : p}
                  </span>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3.5 py-2.5 text-[11px] text-amber-100">
                {t("adminAi.fallbackNone").replace("{var}", '<strong className="text-white">AI_REVIEW_FALLBACK=huggingface,gemini</strong>')}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <h2 className="font-venite-italic text-[14px] text-white mb-2">
            <iconify-icon icon="lucide:zap" style={{ fontSize: "16px", color: "#4F8EF7", marginRight: "8px" }} />
            {t("adminAi.testTitle")}
          </h2>
          <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">
            {t("adminAi.testDesc")}
          </p>

          <AIReviewTestButton />

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="flex items-start gap-2.5">
              <iconify-icon icon="lucide:info" style={{ fontSize: "14px", color: "#888", marginTop: "1px" }} />
              <div className="font-body-readable text-[11px] text-[#999] leading-relaxed">
                {t("adminAi.testInfo")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
