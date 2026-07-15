import { NextResponse } from "next/server";
import { getAIReviewConfig, isAIReviewAvailable } from "../../../../../lib/aiReview";

// Teste la connexion au provider IA configure.
// Envoie un prompt simple pour verifier que la cle API et le modele fonctionnent.
export async function GET() {
  const config = getAIReviewConfig();

  if (!isAIReviewAvailable(config)) {
    return NextResponse.json({
      ok: false,
      error: "AI review non configuree. Ajoute AI_REVIEW_API_KEY dans .env.local",
      provider: config.provider,
      model: config.model || config.defaultModel || "(defaut)"
    }, { status: 200 }); // 200 pour que le front puisse lire le message
  }

  try {
    const provider = config.provider;
    const model = config.model || PROVIDER_DEFAULTS[provider] || "";
    const apiKey = config.apiKey;

    // Construit une requete de test simple
    const url = provider === "gemini"
      ? `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-2.0-flash"}:generateContent`
      : "https://openrouter.ai/api/v1/chat/completions";

    const headers = provider === "gemini"
      ? { "Content-Type": "application/json", "x-goog-api-key": apiKey }
      : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://takacode.com",
          "X-Title": "TakaCode AI Review"
        };

    const body = provider === "gemini"
      ? {
          contents: [{ role: "user", parts: [{ text: "Reponds UNIQUEMENT par le mot OK." }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 10 }
        }
      : {
          model: model || "google/gemini-2.0-flash-lite-free",
          messages: [{ role: "user", content: "Reponds UNIQUEMENT par le mot OK." }],
          temperature: 0,
          max_tokens: 10
        };

    const startTime = Date.now();
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    const elapsed = Date.now() - startTime;

    if (!response.ok) {
      let errorBody = "";
      try {
        errorBody = await response.text();
      } catch {}
      return NextResponse.json({
        ok: false,
        error: `Erreur HTTP ${response.status}`,
        detail: errorBody.slice(0, 300),
        provider,
        model: model || "(defaut)",
        elapsedMs: elapsed
      });
    }

    const json = await response.json();

    // Verifie qu'on a bien une reponse
    const text = provider === "gemini"
      ? json?.candidates?.[0]?.content?.parts?.[0]?.text || ""
      : json?.choices?.[0]?.message?.content || "";

    const ok = text.trim().toLowerCase().includes("ok");

    return NextResponse.json({
      ok,
      provider,
      model: model || "(defaut)",
      elapsedMs: elapsed,
      response: text.trim().slice(0, 100),
      detail: ok ? "Connexion reussie ! Le provider IA est operationnel." : "Reponse inattendue du modele."
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err.message || "Erreur de connexion au provider IA",
      provider: config.provider,
      model: config.model || "(defaut)"
    });
  }
}

const PROVIDER_DEFAULTS = {
  gemini: "gemini-2.0-flash",
  openrouter: "google/gemini-2.0-flash-lite-free"
};
