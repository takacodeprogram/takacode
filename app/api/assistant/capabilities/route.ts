import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";
import { CHAT_PROVIDER_IDS, hasServerKeyForProvider } from "../../../../lib/aiChat";
import { getUniqueModelsForProvider, type AiProviderId } from "../../../../lib/aiModels";
import { getUserAiConfig } from "../../../../lib/userAiConfig";

const LABELS: Record<AiProviderId, string> = {
  mistral: "Mistral",
  openrouter: "OpenRouter",
  gemini: "Google Gemini",
  openai: "OpenAI",
  anthropic: "Anthropic"
};

export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const config = await getUserAiConfig(supabase, user.id);
  const providers = CHAT_PROVIDER_IDS.flatMap((provider) => {
    const userConfigured = Boolean(config.keys[provider]);
    const serverConfigured = hasServerKeyForProvider(provider);
    if (!userConfigured && !serverConfigured) return [];
    return [{
      id: provider,
      label: LABELS[provider],
      source: userConfigured ? "user" : "workspace",
      models: getUniqueModelsForProvider(provider).map((model) => ({
        id: model.id,
        label: model.id,
        contextWindow: model.contextWindow
      }))
    }];
  });

  return NextResponse.json({ providers, preferredProvider: config.provider || "" });
}
