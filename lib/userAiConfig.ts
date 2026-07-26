import type { SupabaseClient, User } from "@supabase/supabase-js";

export type UserAiProvider = "" | "mistral" | "openrouter" | "gemini" | "openai" | "anthropic";

export const AI_PROVIDER_IDS = ["mistral", "openrouter", "gemini", "openai", "anthropic"] as const;
export type AiProviderId = (typeof AI_PROVIDER_IDS)[number];

export interface UserAiConfig {
  provider: UserAiProvider;
  keys: Record<AiProviderId, string>;
}

export const EMPTY_AI_CONFIG: UserAiConfig = {
  provider: "",
  keys: { mistral: "", openrouter: "", gemini: "", openai: "", anthropic: "" }
};

function isValidProvider(v: unknown): v is AiProviderId {
  return v === "mistral" || v === "openrouter" || v === "gemini" || v === "openai" || v === "anthropic";
}

// Lit la config IA du user courant depuis public.user_profiles.
// La RLS sur user_profiles doit garantir qu'un user ne lit que sa propre ligne.
export async function getUserAiConfig(supabase: SupabaseClient, userId: string): Promise<UserAiConfig> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("ai_provider, ai_api_key_mistral, ai_api_key_openrouter, ai_api_key_gemini, ai_api_key_openai, ai_api_key_anthropic")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return EMPTY_AI_CONFIG;
  const row = data as any;
  const provider = String(row.ai_provider || "").trim();
  return {
    provider: isValidProvider(provider) ? provider : "",
    keys: {
      mistral: String(row.ai_api_key_mistral || "").trim(),
      openrouter: String(row.ai_api_key_openrouter || "").trim(),
      gemini: String(row.ai_api_key_gemini || "").trim(),
      openai: String(row.ai_api_key_openai || "").trim(),
      anthropic: String(row.ai_api_key_anthropic || "").trim()
    }
  };
}

export interface AskOverride {
  providerOverride?: AiProviderId;
  apiKeyOverride?: string;
}

// À partir de la config user + d'un provider optionnellement forcé par le
// client (ex. dropdown chat), renvoie l'override à passer à askAI.
export function resolveAskOverride(config: UserAiConfig, clientProviderChoice?: string): AskOverride {
  const wanted = (clientProviderChoice || config.provider || "").trim();
  if (!isValidProvider(wanted)) return {};
  const userKey = config.keys[wanted];
  const out: AskOverride = { providerOverride: wanted };
  if (userKey) out.apiKeyOverride = userKey;
  return out;
}
