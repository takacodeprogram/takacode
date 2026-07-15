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

    // Construit la requete de test selon le provider
    let url, headers, body;

    if (provider === "gemini") {
      const m = model || "gemini-2.0-flash";
      url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;
      headers = { "Content-Type": "application/json", "x-goog-api-key": apiKey };
      body = {
        contents: [{ role: "user", parts: [{ text: "Reponds UNIQUEMENT par le mot OK." }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 10 }
      };
    } else if (provider === "huggingface") {
      const m = model || "microsoft/phi-4-mini-instruct";
      url = `https://api-inference.huggingface.co/models/${m}`;
      headers = { "Content-Type": "application/json" };
      if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
      body = {
        inputs: "Reponds UNIQUEMENT par le mot OK.",
        parameters: { temperature: 0, max_new_tokens: 10, return_full_text: false }
      };
    } else {
      // openrouter (defaut)
      const m = model || "google/gemini-2.0-flash-lite-free";
      url = "https://openrouter.ai/api/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        "HTTP-Referer": "https://takacode.com",
        "X-Title": "TakaCode AI Review"
      };
      body = {
        model: m,
        messages: [{ role: "user", content: "Reponds UNIQUEMENT par le mot OK." }],
        temperature: 0,
        max_tokens: 10
      };
    }

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

    // Extrait le texte selon le provider
    let text = "";
    if (provider === "gemini") {
      text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else if (provider === "huggingface") {
      text = Array.isArray(json) ? (json[0]?.generated_text || "") : (json?.generated_text || "");
    } else {
      text = json?.choices?.[0]?.message?.content || "";
    }

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
  openrouter: "google/gemini-2.0-flash-lite-free",
  huggingface: "microsoft/phi-4-mini-instruct"
};
