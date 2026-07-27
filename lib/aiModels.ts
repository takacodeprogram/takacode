// Registre des modèles par provider et par tâche.
// La stratégie : chaque tâche a des besoins différents (latence, précision,
// coût, JSON strict, tool use). Pour chaque provider, on pick le modèle
// optimal selon ces besoins et le pricing officiel (juillet 2026).
//
// Sources (récupérées via WebFetch depuis la doc officielle) :
//   - Mistral : https://mistral.ai/pricing/api/
//   - Anthropic : https://platform.claude.com/docs/en/docs/about-claude/models/overview
//   - Gemini : https://ai.google.dev/pricing
//   - OpenAI : https://developers.openai.com/api/docs/pricing (gpt-5.4/5.6 series)
//   - OpenRouter : catalogue open-source (llama, qwen, deepseek)

export type AiTask =
  | "chat"       // conversation courte, latence prio, coût maîtrisé
  | "review"     // JSON strict (verdict/feedback), précision > vitesse
  | "recommend"  // JSON structuré, contexte moyen (2-5k tokens)
  | "analyze"    // JSON structuré + contexte long (5k+), analyse admin
  | "agent";     // tool use, plusieurs itérations, fiabilité prio

export type AiProviderId = "mistral" | "openai" | "anthropic" | "gemini" | "openrouter";

// Prix indicatif $/1M tokens (input, output) — pour aide au choix et logs
// pas utilisé pour la facturation. Mis à jour juillet 2026.
export interface ModelSpec {
  id: string;
  inputPrice: number;   // $/1M input tokens
  outputPrice: number;  // $/1M output tokens
  contextWindow?: number;
  notes?: string;
}

const MODELS: Record<AiProviderId, Record<AiTask, ModelSpec>> = {
  mistral: {
    // mistral-small : $0.15/$0.6 — imbattable rapport qualité/prix pour chat FR
    chat:      { id: "mistral-small-latest",  inputPrice: 0.15, outputPrice: 0.6, contextWindow: 128_000 },
    // mistral-small pour review : json_object supporté nativement
    review:    { id: "mistral-small-latest",  inputPrice: 0.15, outputPrice: 0.6, contextWindow: 128_000 },
    recommend: { id: "mistral-small-latest",  inputPrice: 0.15, outputPrice: 0.6, contextWindow: 128_000 },
    // mistral-large-latest : $0.5/$1.5 — flagship, meilleur en raisonnement complexe
    analyze:   { id: "mistral-large-latest",  inputPrice: 0.5,  outputPrice: 1.5, contextWindow: 128_000, notes: "Reasoning + JSON strict" },
    // Large pour agents (tool use fiable), medium possible en fallback
    agent:     { id: "mistral-large-latest",  inputPrice: 0.5,  outputPrice: 1.5, contextWindow: 128_000, notes: "Tool use natif" }
  },
  anthropic: {
    // Haiku 4.5 : $1/$5 — le plus rapide, near-frontier, extended thinking
    chat:      { id: "claude-haiku-4-5",      inputPrice: 1,    outputPrice: 5,   contextWindow: 200_000 },
    review:    { id: "claude-haiku-4-5",      inputPrice: 1,    outputPrice: 5,   contextWindow: 200_000 },
    recommend: { id: "claude-haiku-4-5",      inputPrice: 1,    outputPrice: 5,   contextWindow: 200_000 },
    // Sonnet 5 : $3/$15 (intro $2/$10 jusqu'au 31 août 2026) — meilleur balance
    analyze:   { id: "claude-sonnet-5",       inputPrice: 3,    outputPrice: 15,  contextWindow: 1_000_000, notes: "Best balance vitesse/intelligence" },
    // Haiku pour agents : ultra-rapide, tool use excellent
    agent:     { id: "claude-haiku-4-5",      inputPrice: 1,    outputPrice: 5,   contextWindow: 200_000, notes: "Tool use fiable, très rapide" }
  },
  openai: {
    // gpt-5.4-mini : $0.75/$4.50 — bon rapport pour chat
    chat:      { id: "gpt-5.4-mini",          inputPrice: 0.75, outputPrice: 4.5, contextWindow: 128_000 },
    review:    { id: "gpt-5.4-mini",          inputPrice: 0.75, outputPrice: 4.5, contextWindow: 128_000 },
    recommend: { id: "gpt-5.4-mini",          inputPrice: 0.75, outputPrice: 4.5, contextWindow: 128_000 },
    // gpt-5.4 : $2.5/$15 — flagship abordable pour analyse
    analyze:   { id: "gpt-5.4",               inputPrice: 2.5,  outputPrice: 15,  contextWindow: 128_000 },
    agent:     { id: "gpt-5.4",               inputPrice: 2.5,  outputPrice: 15,  contextWindow: 128_000, notes: "Tool use natif solide" }
  },
  gemini: {
    // gemini-2.5-flash-lite : $0.10/$0.40 — imbattable en coût pour chat volumineux
    chat:      { id: "gemini-2.5-flash-lite", inputPrice: 0.1,  outputPrice: 0.4, contextWindow: 1_000_000 },
    // 2.5-flash pour review : hybrid reasoning, meilleur JSON
    review:    { id: "gemini-2.5-flash",      inputPrice: 0.3,  outputPrice: 2.5, contextWindow: 1_000_000 },
    recommend: { id: "gemini-2.5-flash",      inputPrice: 0.3,  outputPrice: 2.5, contextWindow: 1_000_000 },
    // 2.5-pro pour analyse (raisonnement complexe, long ctx)
    analyze:   { id: "gemini-2.5-pro",        inputPrice: 1.25, outputPrice: 10,  contextWindow: 1_000_000, notes: "SOTA multipurpose, 1M ctx" },
    agent:     { id: "gemini-2.5-flash",      inputPrice: 0.3,  outputPrice: 2.5, contextWindow: 1_000_000 }
  },
  openrouter: {
    // Modèles open-source cheap ; llama 3.2 3b pour chat rapide
    chat:      { id: "meta-llama/llama-3.2-3b-instruct", inputPrice: 0.02, outputPrice: 0.02, contextWindow: 128_000 },
    review:    { id: "qwen/qwen-2.5-7b-instruct",         inputPrice: 0.04, outputPrice: 0.10, contextWindow: 128_000 },
    recommend: { id: "qwen/qwen-2.5-7b-instruct",         inputPrice: 0.04, outputPrice: 0.10, contextWindow: 128_000 },
    // deepseek pour raisonnement plus profond (cheap)
    analyze:   { id: "deepseek/deepseek-chat",            inputPrice: 0.14, outputPrice: 0.28, contextWindow: 128_000, notes: "Reasoning cheap" },
    agent:     { id: "qwen/qwen-2.5-72b-instruct",        inputPrice: 0.35, outputPrice: 0.40, contextWindow: 128_000 }
  }
};

/**
 * Renvoie le model spec pour un provider + tâche donnés.
 * Fallback silencieux sur "chat" si task inconnue.
 */
export function getModelForTask(provider: AiProviderId, task: AiTask): ModelSpec {
  const providerModels = MODELS[provider];
  if (!providerModels) throw new Error(`Provider inconnu : ${provider}`);
  return providerModels[task] || providerModels.chat;
}

export function getAllModelsForProvider(provider: AiProviderId): Record<AiTask, ModelSpec> {
  return MODELS[provider];
}
