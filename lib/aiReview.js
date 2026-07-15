// Service de revue automatique des micro-projets par IA avec fallback.
//
// Providers supportes :
//   - openrouter  (OpenRouter - acces a de nombreux modeles gratuits) [RECOMMANDE]
//   - gemini      (Google Gemini API - quota gratuit mais peut expirer 429)
//   - huggingface (Hugging Face Inference API - completement gratuit, sans cle)
//
// Configuration :
//   AI_REVIEW_PROVIDER  = provider principal ("openrouter" | "gemini" | "huggingface")
//   AI_REVIEW_FALLBACK  = ordre de fallback, ex: "huggingface,gemini"
//   AI_REVIEW_API_KEY   = cle generique (utilisee par tous les providers)
//   AI_REVIEW_OPENROUTER_API_KEY = cle specifique OpenRouter (prioritaire)
//   AI_REVIEW_GEMINI_API_KEY     = cle specifique Gemini (prioritaire)
//   AI_REVIEW_OPEN_ROUTER_API_KEY = variante acceptee aussi
//   AI_REVIEW_MODEL     = modele (defaut selon le provider)
//
// Free tiers 2026 :
//   OpenRouter  → modeles 'Free' (Gemini Lite, Llama, Mistral...) ~20 req/min.
//   Gemini      → quotas AI Studio, peut expirer (erreur 429).
//   HuggingFace → 1000 req/5min sans cle API, modele open-source.

const PROVIDER_IDS = ["openrouter", "gemini", "huggingface"];

const PROVIDER_CONFIG = {
  openrouter: {
    envKeys: ["AI_REVIEW_OPENROUTER_API_KEY", "AI_REVIEW_OPEN_ROUTER_API_KEY", "AI_REVIEW_API_KEY"],
    defaultModel: "openrouter/free",
    endpoint: () => "https://openrouter.ai/api/v1/chat/completions",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      "HTTP-Referer": "https://takacode.com",
      "X-Title": "TakaCode AI Review"
    }),
    parseResponse: (json) => {
      const msg = json?.choices?.[0]?.message || {};
      // Certains modeles (poolside, deepseek, etc.) mettent le texte dans reasoning
      const text = msg.content || msg.reasoning || "";
      return extractJson(text);
    },
    needsKey: true
  },
  gemini: {
    envKeys: ["AI_REVIEW_GEMINI_API_KEY", "AI_REVIEW_API_KEY"],
    defaultModel: "gemini-2.0-flash",
    endpoint: (model) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    }),
    parseResponse: (json) => {
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return extractJson(text);
    },
    needsKey: true
  },
  huggingface: {
    envKeys: ["AI_REVIEW_HUGGINGFACE_API_KEY", "AI_REVIEW_API_KEY"],
    defaultModel: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    endpoint: (model) =>
      `https://api-inference.huggingface.co/models/${model}`,
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    }),
    parseResponse: (json) => {
      const text = Array.isArray(json)
        ? (json[0]?.generated_text || "")
        : (json?.generated_text || "");
      return extractJson(text);
    },
    needsKey: false // Pas de cle requise
  }
};

function extractJson(text) {
  if (!text) return null;
  // Extrait le premier bloc JSON ```json ... ``` ou ``` ... ```
  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = blockMatch ? blockMatch[1].trim() : text.trim();

  try {
    return JSON.parse(raw);
  } catch {
    // Tente de trouver un objet JSON dans le texte
    const objMatch = raw.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        return JSON.parse(objMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// Construit le prompt de revue pour l'IA.
function buildReviewPrompt({ lessonTitle, projectTitle, brief, deliverable, steps, submission }) {
  return {
    system: `Tu es un correcteur bienveillant sur TakaCode, une plateforme d'apprentissage.
Tu evalues les micro-projets des etudiants. Ton role : verifier que le livrable repond
aux consignes, encourager les bonnes pratiques, et demander des ameliorations si necessaire.

Retourne UNIQUEMENT un objet JSON valide (sans markdown) :
{
  "verdict": "approved" ou "changes",
  "feedback": "Message constructif en francais (2-4 phrases)"
}

- "approved" : le livrable est correct, bien explique, et repond a la consigne.
- "changes"  : il manque des elements, le travail est trop leger, ou la consigne n'est pas respectee.
  Dans ce cas, explique precisement ce qu'il faut ameliorer.

Sois encourageant mais honnete. Un etudiant qui a fourni un effort serieux merite d'etre approuve,
meme si ce n'est pas parfait.`,

    prompt: `## Lecon : ${lessonTitle || "Sans titre"}

## Micro-projet
Titre : ${projectTitle || "Sans titre"}
Consigne : ${brief || "Aucune consigne fournie"}
${deliverable ? `Livrable attendu : ${deliverable}` : ""}
${steps?.length ? `Etapes :\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}` : ""}

## Travail soumis par l'etudiant
\`\`\`
${submission || "Aucun livrable soumis"}
\`\`\`

Relis le travail. Est-ce que l'etudiant a repondu a la consigne ? Son travail est-il
serieux et abouti ? Retourne un verdict JSON.`
  };
}

// Appelle le provider IA et retourne le verdict.
async function callProvider(provider, model, apiKey, messages) {
  const config = PROVIDER_CONFIG[provider];
  if (!config) throw new Error(`Provider inconnu : ${provider}`);

  const actualModel = model || config.defaultModel;
  const url =
    typeof config.endpoint === "function"
      ? config.endpoint(actualModel)
      : config.endpoint;

  const body =
    provider === "gemini"
      ? {
          contents: [
            { role: "user", parts: [{ text: `${messages.system}\n\n${messages.prompt}` }] }
          ],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024, responseMimeType: "text/plain" }
        }
      : provider === "huggingface"
        ? {
            inputs: `${messages.system}\n\n${messages.prompt}`,
            parameters: { temperature: 0.3, max_new_tokens: 1024, return_full_text: false }
          }
        : {
            model: actualModel,
            messages: [
              { role: "system", content: messages.system },
              { role: "user", content: messages.prompt }
            ],
            temperature: 0.3,
            max_tokens: 1024
          };

  const response = await fetch(url, {
    method: "POST",
    headers: config.headers(apiKey),
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`IA ${provider} erreur ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const json = await response.json();
  const result = config.parseResponse(json);

  if (!result || !result.verdict) {
    throw new Error(`Reponse IA invalide : ${JSON.stringify(json).slice(0, 200)}`);
  }

  return result;
}

// Lit la cle API pour un provider donne (cle specifique > cle generique).
function getKeyForProvider(providerId) {
  const config = PROVIDER_CONFIG[providerId];
  if (!config) return "";
  for (const keyName of config.envKeys) {
    const val = process.env[keyName];
    if (val && val.trim()) return val.trim();
  }
  return "";
}

// Verifie si un provider est configurable (cle presente OU pas besoin de cle).
function isProviderReady(providerId) {
  const config = PROVIDER_CONFIG[providerId];
  if (!config) return false;
  if (config.needsKey === false) return true;
  return Boolean(getKeyForProvider(providerId));
}

// Construit la liste des providers a essayer, dans l'ordre de fallback.
function buildProviderChain() {
  const primary = (process.env.AI_REVIEW_PROVIDER || "openrouter").trim().toLowerCase();
  const fallbackRaw = process.env.AI_REVIEW_FALLBACK || "";

  // Fallback explicit : "huggingface,gemini"
  const fallbackList = fallbackRaw
    ? fallbackRaw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  // Ordre final : primary + fallback + les autres providers non encore listes
  const seen = new Set();
  const chain = [];

  for (const id of [primary, ...fallbackList, ...PROVIDER_IDS]) {
    if (!seen.has(id) && PROVIDER_CONFIG[id]) {
      seen.add(id);
      if (isProviderReady(id)) {
        chain.push(id);
      }
    }
  }

  return chain;
}

// Options de configuration.
export function getAIReviewConfig(overrides = {}) {
  const provider = overrides.provider || process.env.AI_REVIEW_PROVIDER || "openrouter";
  const config = PROVIDER_CONFIG[provider];

  const apiKey = overrides.apiKey || getKeyForProvider(provider) || "";
  const needsKey = config?.needsKey !== false;
  const enabled = overrides.enabled !== undefined ? overrides.enabled : isProviderReady(provider);

  // Construit la liste des providers dispo pour le fallback
  const fallbackChain = buildProviderChain();

  return {
    provider,
    model: overrides.model || process.env.AI_REVIEW_MODEL || "",
    apiKey,
    enabled,
    fallbackChain // utilise par reviewProject pour le fallback
  };
}

// Verifie si au moins un provider est disponible.
export function isAIReviewAvailable(config) {
  return config.enabled || (Array.isArray(config.fallbackChain) && config.fallbackChain.length > 0);
}

// Effectue une revue IA d'un micro-projet avec fallback automatique.
// Si le premier provider echoue (quota, timeout), essaie le suivant.
export async function reviewProject({ lessonTitle, projectTitle, brief, deliverable, steps, submission }, configOverrides = {}) {
  const config = getAIReviewConfig(configOverrides);
  const chain = config.fallbackChain?.length ? config.fallbackChain : config.enabled ? [config.provider] : [];

  if (!chain.length) {
    throw new Error("Aucun provider IA disponible. Configure AI_REVIEW_PROVIDER et AI_REVIEW_FALLBACK dans .env.local");
  }

  const messages = buildReviewPrompt({
    lessonTitle,
    projectTitle,
    brief,
    deliverable,
    steps,
    submission
  });

  const errors = [];

  for (const providerId of chain) {
    const apiKey = getKeyForProvider(providerId);
    const model = process.env.AI_REVIEW_MODEL || "";

    try {
      const result = await callProvider(providerId, model, apiKey, messages);
      // Succes ! On retourne le resultat
      return {
        verdict: result.verdict === "approved" ? "approved" : "changes",
        feedback: typeof result.feedback === "string" ? result.feedback : "Revision effectuee par l'IA.",
        usedProvider: providerId
      };
    } catch (err) {
      errors.push(`${providerId}: ${err.message}`);
      // Si ce n'est pas le dernier, on continue (fallback)
    }
  }

  // Tous les providers ont echoue
  throw new Error(`Tous les providers IA ont echoue : ${errors.join(" | ")}`);
}
