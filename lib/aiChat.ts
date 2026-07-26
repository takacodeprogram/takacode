// Generic chat helper for open-ended AI interactions (assistant, track review).
// Distinct from lib/aiReview.ts (which enforces a strict verdict/feedback JSON
// contract for project submissions). This one returns raw text and supports
// the same provider fallback chain: mistral > openrouter > gemini > huggingface.

const CHAT_PROVIDER_IDS = ["mistral", "openrouter", "gemini"] as const;
type ChatProviderId = (typeof CHAT_PROVIDER_IDS)[number];

interface ChatProviderConfig {
  envKeys: string[];
  defaultModel: string;
  endpoint: (model: string) => string;
  headers: (apiKey: string) => Record<string, string>;
  buildBody: (model: string, system: string, userMessages: ChatMessage[]) => unknown;
  parseText: (json: any) => string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const CHAT_PROVIDERS: Record<ChatProviderId, ChatProviderConfig> = {
  mistral: {
    envKeys: ["AI_MISTRAL_API_KEY", "AI_REVIEW_MISTRAL_API_KEY", "MISTRAL_API_KEY"],
    defaultModel: "mistral-small-latest",
    endpoint: () => "https://api.mistral.ai/v1/chat/completions",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`
    }),
    buildBody: (model, system, messages) => ({
      model,
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.4,
      max_tokens: 1024
    }),
    parseText: (json) => json?.choices?.[0]?.message?.content ?? ""
  },
  openrouter: {
    envKeys: ["AI_REVIEW_OPENROUTER_API_KEY", "AI_REVIEW_OPEN_ROUTER_API_KEY", "OPENROUTER_API_KEY"],
    defaultModel: "meta-llama/llama-3.2-3b-instruct",
    endpoint: () => "https://openrouter.ai/api/v1/chat/completions",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://takacode.com",
      "X-Title": "TakaCode AI Chat"
    }),
    buildBody: (model, system, messages) => ({
      model,
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.4,
      max_tokens: 1024
    }),
    parseText: (json) => json?.choices?.[0]?.message?.content ?? ""
  },
  gemini: {
    envKeys: ["AI_REVIEW_GEMINI_API_KEY", "GEMINI_API_KEY"],
    defaultModel: "gemini-2.0-flash",
    endpoint: (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    }),
    buildBody: (_model, system, messages) => ({
      contents: [
        { role: "user", parts: [{ text: `${system}\n\n${messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n")}` }] }
      ],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 }
    }),
    parseText: (json) => json?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
  }
};

function readEnvKey(keys: string[]): string {
  for (const k of keys) {
    const v = process.env[k];
    if (v && v.trim()) return v.trim();
  }
  return "";
}

function orderedChain(): ChatProviderId[] {
  const primary = (process.env.AI_REVIEW_PROVIDER || "mistral").trim().toLowerCase() as ChatProviderId;
  const seen = new Set<ChatProviderId>();
  const chain: ChatProviderId[] = [];
  for (const id of [primary, ...CHAT_PROVIDER_IDS]) {
    if (CHAT_PROVIDERS[id] && !seen.has(id)) {
      seen.add(id);
      if (readEnvKey(CHAT_PROVIDERS[id].envKeys)) chain.push(id);
    }
  }
  return chain;
}

export function hasAnyChatProvider(): boolean {
  return orderedChain().length > 0;
}

export interface AskOptions {
  system: string;
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  // Override user : force ce provider en premier dans la chaîne, avec sa clé.
  // Si la clé est vide, on utilise la clé serveur pour ce provider.
  providerOverride?: ChatProviderId;
  apiKeyOverride?: string;
}

export interface AskResult {
  text: string;
  provider: ChatProviderId;
  model: string;
}

function chainForOverride(override?: ChatProviderId): ChatProviderId[] {
  const base = orderedChain();
  if (!override || !CHAT_PROVIDERS[override]) return base;
  return [override, ...base.filter((p) => p !== override)];
}

export async function askAI({ system, messages, model, maxTokens, providerOverride, apiKeyOverride }: AskOptions): Promise<AskResult> {
  const chain = chainForOverride(providerOverride);
  // Si l'override fournit une clé et qu'il n'apparaît pas dans le chain (env
  // vide côté serveur), on le pousse quand même en tête.
  if (providerOverride && apiKeyOverride && !chain.includes(providerOverride) && CHAT_PROVIDERS[providerOverride]) {
    chain.unshift(providerOverride);
  }
  if (!chain.length) throw new Error("Aucun provider IA configuré. Ajoute AI_MISTRAL_API_KEY (ou autre) dans .env.local");

  const errors: string[] = [];
  for (const providerId of chain) {
    const config = CHAT_PROVIDERS[providerId];
    const apiKey =
      providerId === providerOverride && apiKeyOverride
        ? apiKeyOverride
        : readEnvKey(config.envKeys);
    if (!apiKey) {
      errors.push(`${providerId}: no key`);
      continue;
    }
    const actualModel = model || config.defaultModel;

    const body = config.buildBody(actualModel, system, messages) as Record<string, unknown>;
    if (maxTokens && typeof body === "object") {
      if ("max_tokens" in body) body.max_tokens = maxTokens;
      if ("generationConfig" in body && typeof body.generationConfig === "object") {
        (body.generationConfig as Record<string, unknown>).maxOutputTokens = maxTokens;
      }
    }

    try {
      const res = await fetch(config.endpoint(actualModel), {
        method: "POST",
        headers: config.headers(apiKey),
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const err = await res.text().catch(() => "");
        throw new Error(`${providerId} HTTP ${res.status}: ${err.slice(0, 200)}`);
      }
      const json = await res.json();
      const text = config.parseText(json).trim();
      if (!text) throw new Error(`${providerId}: empty response`);
      return { text, provider: providerId, model: actualModel };
    } catch (e) {
      errors.push((e as Error).message);
    }
  }

  throw new Error(`Tous les providers IA ont échoué : ${errors.join(" | ")}`);
}
