const PROVIDER_IDS = ["openrouter", "gemini", "huggingface"];

// Modeles OpenRouter essayes par defaut quand aucune variable d'env ne les fixe.
// Les variantes payantes (tres bon marche) d'abord : les modeles ":free" sont
// presque toujours rate-limites (429). Le ":free" reste en dernier recours.
// Cette liste est aussi celle du bouton "Tester la connexion" (route test) :
// le test et la vraie review doivent utiliser LES MEMES modeles.
export const OPENROUTER_DEFAULT_MODELS = [
  "meta-llama/llama-3.2-3b-instruct",
  "qwen/qwen-2.5-7b-instruct",
  "meta-llama/llama-3.2-3b-instruct:free"
];

interface ProviderConfig {
  envKeys: string[];
  defaultModel: string;
  endpoint: ((model: string) => string) | string;
  headers: (apiKey: string) => Record<string, string>;
  parseResponse: (json: any) => { verdict?: string; feedback?: string } | null;
  needsKey: boolean;
}

type ProviderId = (typeof PROVIDER_IDS)[number];

const PROVIDER_CONFIG: Record<string, ProviderConfig> = {
  openrouter: {
    envKeys: ["AI_REVIEW_OPENROUTER_API_KEY", "AI_REVIEW_OPEN_ROUTER_API_KEY", "AI_REVIEW_API_KEY"],
    defaultModel: "meta-llama/llama-3.2-3b-instruct:free",
    endpoint: () => "https://openrouter.ai/api/v1/chat/completions",
    headers: (apiKey: string) => ({
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      "HTTP-Referer": "https://takacode.com",
      "X-Title": "TakaCode AI Review"
    }),
    parseResponse: (json: any) => {
      const msg = json?.choices?.[0]?.message || {};
      const text = msg.content || msg.reasoning || "";
      return extractJson(text);
    },
    needsKey: true
  },
  gemini: {
    envKeys: ["AI_REVIEW_GEMINI_API_KEY", "AI_REVIEW_API_KEY"],
    defaultModel: "gemini-2.0-flash",
    endpoint: (model: string) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    headers: (apiKey: string) => ({
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    }),
    parseResponse: (json: any) => {
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return extractJson(text);
    },
    needsKey: true
  },
  huggingface: {
    envKeys: ["AI_REVIEW_HUGGINGFACE_API_KEY", "AI_REVIEW_API_KEY"],
    defaultModel: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    endpoint: (model: string) =>
      `https://api-inference.huggingface.co/models/${model}`,
    headers: (apiKey: string) => ({
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    }),
    parseResponse: (json: any) => {
      const text = Array.isArray(json)
        ? (json[0]?.generated_text || "")
        : (json?.generated_text || "");
      return extractJson(text);
    },
    needsKey: false
  }
};

interface ReviewVerdict {
  verdict: "approved" | "changes";
  feedback: string;
}

interface ReviewMessages {
  system: string;
  prompt: string;
}

interface ReviewInput {
  lessonTitle: string;
  projectTitle: string;
  brief: string;
  deliverable: string;
  steps: string[];
  submission: string;
}

function extractJson(text: string): ReviewVerdict | null {
  if (!text) return null;
  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = blockMatch ? blockMatch[1].trim() : text.trim();

  try {
    return JSON.parse(raw) as ReviewVerdict;
  } catch {
    const objMatch = raw.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        return JSON.parse(objMatch[0]) as ReviewVerdict;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function buildReviewPrompt({ lessonTitle, projectTitle, brief, deliverable, steps, submission }: ReviewInput): ReviewMessages {
  return {
    system: `Tu es un correcteur bienveillant sur TakaCode, une plateforme d'apprentissage.
Tu évalues les micro-projets des étudiants. Ton rôle : vérifier que le livrable répond
aux consignes, encourager les bonnes pratiques, et demander des améliorations si nécessaire.

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

async function callProvider(provider: string, model: string, apiKey: string, messages: ReviewMessages): Promise<ReviewVerdict> {
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

  return result as ReviewVerdict;
}

function getKeyForProvider(providerId: string): string {
  const config = PROVIDER_CONFIG[providerId];
  if (!config) return "";
  for (const keyName of config.envKeys) {
    const val = process.env[keyName];
    if (val && val.trim()) return val.trim();
  }
  return "";
}

function isProviderReady(providerId: string): boolean {
  const config = PROVIDER_CONFIG[providerId];
  if (!config) return false;
  if (config.needsKey === false) return true;
  return Boolean(getKeyForProvider(providerId));
}

function buildProviderChain(): string[] {
  const primary = (process.env.AI_REVIEW_PROVIDER || "openrouter").trim().toLowerCase();
  const fallbackRaw = process.env.AI_REVIEW_FALLBACK || "";

  const fallbackList = fallbackRaw
    ? fallbackRaw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  const seen = new Set<string>();
  const chain: string[] = [];

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

interface AIReviewConfig {
  provider: string;
  model: string;
  apiKey: string;
  enabled: boolean;
  fallbackChain: string[];
}

export function getAIReviewConfig(overrides: Record<string, unknown> = {}): AIReviewConfig {
  const provider = (overrides.provider as string) || process.env.AI_REVIEW_PROVIDER || "openrouter";
  const config = PROVIDER_CONFIG[provider];

  const apiKey = (overrides.apiKey as string) || getKeyForProvider(provider) || "";
  const needsKey = config?.needsKey !== false;
  const enabled = overrides.enabled !== undefined ? Boolean(overrides.enabled) : isProviderReady(provider);

  const fallbackChain = buildProviderChain();

  return {
    provider,
    model: (overrides.model as string) || process.env.AI_REVIEW_MODEL || "",
    apiKey,
    enabled,
    fallbackChain
  };
}

export function isAIReviewAvailable(config: AIReviewConfig): boolean {
  return config.enabled || (Array.isArray(config.fallbackChain) && config.fallbackChain.length > 0);
}

export async function reviewProject(input: ReviewInput, configOverrides: Record<string, unknown> = {}): Promise<{ verdict: string; feedback: string; usedProvider: string; usedModel: string }> {
  const config = getAIReviewConfig(configOverrides);
  const chain = config.fallbackChain?.length ? config.fallbackChain : config.enabled ? [config.provider] : [];

  if (!chain.length) {
    throw new Error("Aucun provider IA disponible. Configure AI_REVIEW_PROVIDER et AI_REVIEW_FALLBACK dans .env.local");
  }

  const messages = buildReviewPrompt(input);

  const errors: string[] = [];
  const primaryProvider = (process.env.AI_REVIEW_PROVIDER || "openrouter").trim().toLowerCase();

  for (const providerId of chain) {
    const apiKey = getKeyForProvider(providerId);

    // AI_REVIEW_MODEL (generique) ne s'applique qu'au provider principal :
    // un id de modele OpenRouter envoye a Gemini/HuggingFace donne un 404
    // et fait echouer toute la chaine de fallback.
    const modelsRaw =
      process.env[`AI_REVIEW_${providerId.toUpperCase()}_MODEL`]
      || (providerId === primaryProvider ? process.env.AI_REVIEW_MODEL : "")
      || "";
    let models = modelsRaw
      ? modelsRaw.split(",").map((m) => m.trim()).filter(Boolean)
      : [];
    if (!models.length) {
      // Memes modeles par defaut que la route de test connexion.
      models = providerId === "openrouter" ? [...OPENROUTER_DEFAULT_MODELS] : [""];
    }

    let success = false;
    for (const model of models) {
      try {
        const result = await callProvider(providerId, model, apiKey, messages);
        return {
          verdict: result.verdict === "approved" ? "approved" : "changes",
          feedback: typeof result.feedback === "string" ? result.feedback : "Revision effectuee par l'IA.",
          usedProvider: providerId,
          usedModel: model || PROVIDER_CONFIG[providerId]?.defaultModel
        };
      } catch (err) {
        errors.push(`${providerId}${model ? ` (${model})` : ""}: ${(err as Error).message}`);
      }
    }
  }

  throw new Error(`Tous les providers IA ont echoue : ${errors.join(" | ")}`);
}
