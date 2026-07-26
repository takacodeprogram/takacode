import type { SupabaseClient, User } from "@supabase/supabase-js";

export type UserAiProvider = "" | "mistral" | "openrouter" | "gemini";

export interface UserAiConfig {
  provider: UserAiProvider;
  keys: {
    mistral: string;
    openrouter: string;
    gemini: string;
  };
}

export const EMPTY_AI_CONFIG: UserAiConfig = {
  provider: "",
  keys: { mistral: "", openrouter: "", gemini: "" }
};

// Lit la config IA du user courant depuis public.user_profiles.
// La RLS sur user_profiles doit garantir qu'un user ne lit que sa propre ligne.
export async function getUserAiConfig(supabase: SupabaseClient, userId: string): Promise<UserAiConfig> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("ai_provider, ai_api_key_mistral, ai_api_key_openrouter, ai_api_key_gemini")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return EMPTY_AI_CONFIG;
  const provider = ((data as any).ai_provider || "").trim() as UserAiProvider;
  return {
    provider: provider === "mistral" || provider === "openrouter" || provider === "gemini" ? provider : "",
    keys: {
      mistral: String((data as any).ai_api_key_mistral || "").trim(),
      openrouter: String((data as any).ai_api_key_openrouter || "").trim(),
      gemini: String((data as any).ai_api_key_gemini || "").trim()
    }
  };
}

export interface AskOverride {
  providerOverride?: "mistral" | "openrouter" | "gemini";
  apiKeyOverride?: string;
}

// À partir de la config user + d'un provider optionnellement forcé par le
// client (ex. dropdown chat), renvoie l'override à passer à askAI.
// Règle : si le client force un provider et l'user a une clé pour ce provider,
// on l'utilise. Sinon on utilise la clé serveur (apiKeyOverride absent).
// Si le client ne force rien, on utilise le provider par défaut du user + sa clé.
export function resolveAskOverride(config: UserAiConfig, clientProviderChoice?: string): AskOverride {
  const wanted = (clientProviderChoice || config.provider || "").trim();
  if (wanted !== "mistral" && wanted !== "openrouter" && wanted !== "gemini") return {};
  const userKey = config.keys[wanted];
  const out: AskOverride = { providerOverride: wanted };
  if (userKey) out.apiKeyOverride = userKey;
  return out;
}
