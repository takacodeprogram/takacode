import { NextResponse } from "next/server";
import { getAIReviewConfig } from "../../../../../lib/aiReview";

const PROVIDER_DEFAULTS = {
  gemini: "gemini-2.0-flash",
  openrouter: "meta-llama/llama-3.2-3b-instruct",
  huggingface: "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
};

// Modeles OpenRouter fallback (tres bon marche, pas de :free car rate-limited)
const OPENROUTER_FALLBACK_MODELS = [
  "meta-llama/llama-3.2-3b-instruct",
  "qwen/qwen-2.5-7b-instruct"
];

const PROVIDER_LABELS = {
  gemini: "Google Gemini",
  openrouter: "OpenRouter",
  huggingface: "Hugging Face"
};

function buildRequest(provider: string, model: string, apiKey: string) {
  const m = model || (PROVIDER_DEFAULTS as Record<string, string>)[provider] || "";

  if (provider === "gemini") {
    return {
      url: `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: {
        contents: [{ role: "user", parts: [{ text: "Reponds UNIQUEMENT par le mot OK." }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 10 }
      }
    };
  }

  if (provider === "huggingface") {
    return {
      url: `https://api-inference.huggingface.co/models/${m}`,
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      body: {
        inputs: "Reponds UNIQUEMENT par le mot OK.",
        parameters: { temperature: 0, max_new_tokens: 10, return_full_text: false }
      }
    };
  }

  // openrouter
  return {
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      "HTTP-Referer": "https://takacode.com",
      "X-Title": "TakaCode AI Review"
    },
    body: {
      model: m,
      messages: [{ role: "user", content: "Reponds UNIQUEMENT par le mot OK." }],
      temperature: 0,
      max_tokens: 50
    }
  };
}

function parseResponse(provider: string, json: any) {
  if (provider === "gemini") return json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (provider === "huggingface") {
    return Array.isArray(json) ? (json[0]?.generated_text || "") : (json?.generated_text || "");
  }
  // openrouter : certains modeles (poolside, deepseek) mettent le texte dans reasoning
  const msg = json?.choices?.[0]?.message || {};
  return msg.content || msg.reasoning || "";
}

async function testSingleProvider(provider: string) {
  // Supporte modeles specifiques par provider : AI_REVIEW_<PROVIDER>_MODEL
  const providerModels = process.env[`AI_REVIEW_${provider.toUpperCase()}_MODEL`];
  const genericModels = process.env.AI_REVIEW_MODEL;

  // Pour OpenRouter, on teste plusieurs modeles fallback
  const modelsToTest = provider === "openrouter"
    ? (providerModels
        ? providerModels.split(",").map((m) => m.trim()).filter(Boolean)
        : OPENROUTER_FALLBACK_MODELS)
    : [providerModels || genericModels || ""];

  const errors = [];

  for (const model of modelsToTest) {
    try {
      // Cherche la cle specifique ou generique
      const key = process.env[`AI_REVIEW_${provider.toUpperCase()}_API_KEY`]
        || (provider === "openrouter" ? process.env.AI_REVIEW_OPEN_ROUTER_API_KEY : "")
        || process.env.AI_REVIEW_API_KEY
        || "";

      const { url, headers, body } = buildRequest(provider, model, key);
      const startTime = Date.now();
      const response = await fetch(url, {
        method: "POST",
        headers: headers as Record<string, string>,
        body: JSON.stringify(body)
      });
      const elapsedMs = Date.now() - startTime;

      if (!response.ok) {
        let detail = "";
        try { detail = await response.text(); } catch {}
        errors.push(`${model}: HTTP ${response.status}`);
        continue; //essaie le modele suivant
      }

      const json = await response.json();
      const text = parseResponse(provider, json).trim();
      const ok = text.toLowerCase().includes("ok");
      const responseText = text.slice(0, 200);

      if (!ok) {
        errors.push(`${model}: Reponse inattendue`);
        continue;
      }

      return {
        ok,
        provider,
        model,
        elapsedMs,
        response: responseText,
        label: (PROVIDER_LABELS as Record<string, string>)[provider] || provider
      };
    } catch (err) {
      errors.push(`${model}: ${(err instanceof Error ? err.message : String(err)) || "Erreur reseau"}`);
    }
  }

  // Tous les modeles ont echoue pour ce provider
  return {
    ok: false,
    provider,
    model: modelsToTest.join(", "),
    error: errors.join(" | ") || "Erreur inconnue",
    detail: ""
  };
}

// Teste tous les providers configures (fallback chain).
export async function GET() {
  try {
    const config = getAIReviewConfig();
    const chain = config.fallbackChain?.length ? config.fallbackChain : [config.provider];

    if (!chain.length) {
      return NextResponse.json({ providers: [], ok: false, error: "Aucun provider IA configure. Ajoute AI_REVIEW_PROVIDER et AI_REVIEW_API_KEY dans .env" }, { status: 200 });
    }

    const results = await Promise.allSettled(chain.map(testSingleProvider));
    const providers = results.map((r) => {
      if (r.status === "fulfilled") return r.value;
      const reason = r.reason;
      return {
        ok: false,
        provider: "?",
        error: reason?.message || "Erreur inconnue",
        detail: reason?.stack ? reason.stack.slice(0, 200) : ""
      };
    });

    const anyOk = providers.some((p) => p.ok);
    const allFailed = providers.length > 0 && !anyOk;

    return NextResponse.json({
      ok: anyOk,
      providers,
      chain,
      error: allFailed ? providers.map((p) => `${p.provider}: ${p.error || "?"}`).join(" | ") : undefined
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      providers: [],
      chain: [],
      error: (err instanceof Error ? err.message : String(err)) || "Erreur interne du serveur",
      detail: err instanceof Error ? err.stack?.slice(0, 300) : ""
    }, { status: 200 });
  }
}
