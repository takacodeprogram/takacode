// Service de revue automatique des micro-projets par IA.
//
// Providers supportes :
//   - openrouter (OpenRouter - acces a de nombreux modeles gratuits) [RECOMMANDE]
//   - gemini     (Google Gemini API - quota gratuit genereux mais peut etre epuise)
//   - huggingface (Hugging Face Inference API - completement gratuit, sans cle requise)
//
// Configuration (env vars ou options explicites) :
//   AI_REVIEW_PROVIDER  = "openrouter" | "gemini" | "huggingface"
//   AI_REVIEW_API_KEY   = cle API du provider (optionnel pour huggingface)
//   AI_REVIEW_MODEL     = modele (defaut selon le provider)
//
// Free tiers 2026 :
//   OpenRouter  → modeles 'Free' (Gemini Lite, Llama, Mistral...) ~20 req/min.
//   Gemini      → quotas AI Studio, peut expirer (erreur 429).
//   HuggingFace → 1000 req/5min sans cle API, modele open-source.

const PROVIDER_CONFIG = {
  openrouter: {
    envKey: "AI_REVIEW_API_KEY",
    defaultModel: "google/gemini-2.0-flash-lite-free",
    endpoint: () => "https://openrouter.ai/api/v1/chat/completions",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      "HTTP-Referer": "https://takacode.com",
      "X-Title": "TakaCode AI Review"
    }),
    parseResponse: (json) => {
      const text = json?.choices?.[0]?.message?.content || "";
      return extractJson(text);
    },
    needsKey: true
  },
  gemini: {
    envKey: "AI_REVIEW_API_KEY",
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
    envKey: "AI_REVIEW_API_KEY",
    // Modele gratuit, performant et rapide pour du texte court
    defaultModel: "microsoft/phi-4-mini-instruct",
    endpoint: (model) =>
      `https://api-inference.huggingface.co/models/${model}`,
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    }),
    parseResponse: (json) => {
      // HF renvoie [{ generated_text: "..." }]
      const text = Array.isArray(json)
        ? (json[0]?.generated_text || "")
        : (json?.generated_text || "");
      return extractJson(text);
    },
    needsKey: false // Pas de cle requise pour les petits modeles
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

// Options de configuration (peuvent venir d'env vars, d'une table BDD, etc.)
export function getAIReviewConfig(overrides = {}) {
  const provider = overrides.provider || process.env.AI_REVIEW_PROVIDER || "openrouter";
  const config = PROVIDER_CONFIG[provider];

  // Pour huggingface, pas besoin de cle API : on considere enabled = true meme sans cle
  const apiKey = overrides.apiKey || process.env.AI_REVIEW_API_KEY || "";
  const needsKey = config?.needsKey !== false; // true par defaut
  const enabled = overrides.enabled !== undefined ? overrides.enabled : (needsKey ? Boolean(apiKey) : true);

  return {
    provider,
    model: overrides.model || process.env.AI_REVIEW_MODEL || "",
    apiKey,
    enabled
  };
}

// Verifie si la config est valide pour effectuer une review.
export function isAIReviewAvailable(config) {
  const providerConfig = PROVIDER_CONFIG[config.provider];
  if (!providerConfig) return false;
  // HuggingFace ne necessite pas de cle API (needsKey === false)
  const keyOk = providerConfig.needsKey === false || Boolean(config.apiKey);
  return config.enabled && keyOk;
}

// Effectue une revue IA d'un micro-projet.
// Retourne { verdict, feedback } ou lance une erreur.
export async function reviewProject({ lessonTitle, projectTitle, brief, deliverable, steps, submission }, configOverrides = {}) {
  const config = getAIReviewConfig(configOverrides);

  if (!isAIReviewAvailable(config)) {
    throw new Error("AI review non configuree. Ajoute AI_REVIEW_API_KEY dans .env.local");
  }

  const messages = buildReviewPrompt({
    lessonTitle,
    projectTitle,
    brief,
    deliverable,
    steps,
    submission
  });

  const result = await callProvider(
    config.provider,
    config.model,
    config.apiKey,
    messages
  );

  return {
    verdict: result.verdict === "approved" ? "approved" : "changes",
    feedback: typeof result.feedback === "string" ? result.feedback : "Revision effectuee par l'IA."
  };
}
