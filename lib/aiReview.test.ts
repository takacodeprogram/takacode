import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  OPENROUTER_DEFAULT_MODELS,
  getAIReviewConfig,
  isAIReviewAvailable,
  reviewProject
} from "./aiReview";
import type { AIReviewConfig } from "./aiReview";

// ─── Env helpers ─────────────────────────────────────────────────

function setEnv(overrides: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function resetEnv() {
  // Clear all AI_REVIEW_* vars
  for (const key of Object.keys(process.env)) {
    if (key.startsWith("AI_REVIEW_")) {
      delete process.env[key];
    }
  }
}

// ─── OPENROUTER_DEFAULT_MODELS ───────────────────────────────────

describe("OPENROUTER_DEFAULT_MODELS", () => {
  it("has exactly 3 models", () => {
    expect(OPENROUTER_DEFAULT_MODELS).toHaveLength(3);
  });

  it("contains a free model as last resort", () => {
    expect(OPENROUTER_DEFAULT_MODELS[2]).toContain(":free");
  });

  it("all models are non-empty strings", () => {
    for (const model of OPENROUTER_DEFAULT_MODELS) {
      expect(typeof model).toBe("string");
      expect(model.length).toBeGreaterThan(0);
    }
  });
});

// ─── getAIReviewConfig ───────────────────────────────────────────

describe("getAIReviewConfig", () => {
  beforeEach(() => {
    resetEnv();
  });

  afterEach(() => {
    resetEnv();
  });

  it("returns defaults when no env vars are set", () => {
    const config = getAIReviewConfig();
    expect(config.provider).toBe("openrouter");
    expect(config.model).toBe("");
    expect(config.apiKey).toBe("");
    expect(config.enabled).toBe(false);
    expect(Array.isArray(config.fallbackChain)).toBe(true);
  });

  it("uses env vars when set", () => {
    setEnv({
      AI_REVIEW_PROVIDER: "gemini",
      AI_REVIEW_GEMINI_API_KEY: "test-key-123",
      AI_REVIEW_MODEL: "gemini-2.0-flash"
    });
    const config = getAIReviewConfig();
    expect(config.provider).toBe("gemini");
    expect(config.apiKey).toBe("test-key-123");
    expect(config.model).toBe("gemini-2.0-flash");
  });

  it("falls back to AI_REVIEW_API_KEY when provider-specific key is missing", () => {
    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_API_KEY: "fallback-key"
    });
    const config = getAIReviewConfig();
    expect(config.apiKey).toBe("fallback-key");
  });

  it("overrides provider via argument", () => {
    setEnv({
      AI_REVIEW_API_KEY: "env-key"
    });
    const config = getAIReviewConfig({ provider: "gemini", apiKey: "override-key" });
    expect(config.provider).toBe("gemini");
    expect(config.apiKey).toBe("override-key");
  });

  it("sets enabled=true when provider is ready", () => {
    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_API_KEY: "valid-key"
    });
    const config = getAIReviewConfig();
    expect(config.enabled).toBe(true);
  });

  it("sets enabled=false when provider is not ready (no key)", () => {
    setEnv({ AI_REVIEW_PROVIDER: "openrouter" });
    const config = getAIReviewConfig();
    expect(config.enabled).toBe(false);
  });

  it("sets enabled=true for huggingface (needsKey=false)", () => {
    setEnv({ AI_REVIEW_PROVIDER: "huggingface" });
    const config = getAIReviewConfig();
    expect(config.enabled).toBe(true);
  });

  it("honours explicit enabled override", () => {
    const config = getAIReviewConfig({ enabled: true });
    expect(config.enabled).toBe(true);
  });

  it("respects AI_REVIEW_FALLBACK env var", () => {
    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_OPENROUTER_API_KEY: "key1",
      AI_REVIEW_FALLBACK: "gemini,huggingface",
      AI_REVIEW_GEMINI_API_KEY: "key2"
    });
    const config = getAIReviewConfig();
    expect(config.fallbackChain).toContain("openrouter");
    expect(config.fallbackChain).toContain("gemini");
  });

  it("fallback chain contains only ready providers", () => {
    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_OPENROUTER_API_KEY: "key1",
      AI_REVIEW_GEMINI_API_KEY: "key2"
      // huggingface has no API key but needsKey=false, so it's always ready
    });
    const config = getAIReviewConfig();
    expect(config.fallbackChain).toContain("openrouter");
    expect(config.fallbackChain).toContain("gemini");
    expect(config.fallbackChain).toContain("huggingface");
  });

  it("fallback chain excludes providers without keys", () => {
    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_API_KEY: "key1"
      // gemini and huggingface are accessible but without keys gemini is excluded
    });
    const config = getAIReviewConfig();
    expect(config.fallbackChain).toContain("openrouter");
    // huggingface has needsKey=false, so it should be included
    expect(config.fallbackChain).toContain("huggingface");
  });
});

// ─── isAIReviewAvailable ─────────────────────────────────────────

describe("isAIReviewAvailable", () => {
  it("returns true when enabled", () => {
    const config: AIReviewConfig = {
      provider: "openrouter",
      model: "",
      apiKey: "key",
      enabled: true,
      fallbackChain: []
    };
    expect(isAIReviewAvailable(config)).toBe(true);
  });

  it("returns true when fallbackChain has items", () => {
    const config: AIReviewConfig = {
      provider: "openrouter",
      model: "",
      apiKey: "",
      enabled: false,
      fallbackChain: ["huggingface"]
    };
    expect(isAIReviewAvailable(config)).toBe(true);
  });

  it("returns false when not enabled and no fallback", () => {
    const config: AIReviewConfig = {
      provider: "openrouter",
      model: "",
      apiKey: "",
      enabled: false,
      fallbackChain: []
    };
    expect(isAIReviewAvailable(config)).toBe(false);
  });

  it("returns true when both enabled and fallback exist", () => {
    const config: AIReviewConfig = {
      provider: "openrouter",
      model: "",
      apiKey: "key",
      enabled: true,
      fallbackChain: ["gemini"]
    };
    expect(isAIReviewAvailable(config)).toBe(true);
  });
});

// ─── reviewProject (with fetch mocking) ──────────────────────────

describe("reviewProject", () => {
  const validInput = {
    lessonTitle: "Introduction au HTML",
    projectTitle: "Ma premiere page",
    brief: "Cree une page HTML simple",
    deliverable: "Un fichier index.html",
    steps: ["Creer le fichier", "Ajouter du contenu", "Valider le HTML"],
    submission: "<html><body><h1>Hello</h1></body></html>"
  };

  const validVerdict = {
    verdict: "approved",
    feedback: "Bon travail ! Ta page HTML est correcte et bien structuree."
  };

  const changesVerdict = {
    verdict: "changes",
    feedback: "Il manque des balises essentielles comme la declaration DOCTYPE."
  };

  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    resetEnv();
    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_OPENROUTER_API_KEY: "test-api-key",
      AI_REVIEW_MODEL: "meta-llama/llama-3.2-3b-instruct"
    });
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    resetEnv();
  });

  function mockOpenRouterResponse(responseData: unknown, status = 200) {
    mockFetch.mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(responseData),
      text: () => Promise.resolve("")
    });
  }

  it("returns approved verdict from OpenRouter", async () => {
    mockOpenRouterResponse({
      choices: [{ message: { content: JSON.stringify(validVerdict) } }]
    });
    const result = await reviewProject(validInput);
    expect(result.verdict).toBe("approved");
    expect(result.feedback).toBe(validVerdict.feedback);
    expect(result.usedProvider).toBe("openrouter");
    expect(result.usedModel).toBe("meta-llama/llama-3.2-3b-instruct");
  });

  it("returns changes verdict from OpenRouter", async () => {
    mockOpenRouterResponse({
      choices: [{ message: { content: JSON.stringify(changesVerdict) } }]
    });
    const result = await reviewProject(validInput);
    expect(result.verdict).toBe("changes");
    expect(result.feedback).toBe(changesVerdict.feedback);
  });

  it("parses JSON inside markdown code block", async () => {
    mockOpenRouterResponse({
      choices: [{
        message: {
          content: "Voici mon analyse :\n```json\n" + JSON.stringify(validVerdict) + "\n```"
        }
      }]
    });
    const result = await reviewProject(validInput);
    expect(result.verdict).toBe("approved");
  });

  it("parses JSON from reasoning field (fallback)", async () => {
    mockOpenRouterResponse({
      choices: [{ message: { reasoning: JSON.stringify(validVerdict), content: "" } }]
    });
    const result = await reviewProject(validInput);
    expect(result.verdict).toBe("approved");
  });

  it("extracts JSON from text containing braces (object match)", async () => {
    mockOpenRouterResponse({
      choices: [{
        message: {
          content: "Resultat: " + JSON.stringify(validVerdict) + " Fin du message."
        }
      }]
    });
    const result = await reviewProject(validInput);
    expect(result.verdict).toBe("approved");
  });

  it("falls back to next provider when first fails with HTTP error", async () => {
    // First call fails (OpenRouter 429)
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve("Rate limited")
      })
      // Second call succeeds (Gemini)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          candidates: [{ content: { parts: [{ text: JSON.stringify(validVerdict) }] } }]
        }),
        text: () => Promise.resolve("")
      });

    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_OPENROUTER_API_KEY: "key1",
      AI_REVIEW_FALLBACK: "gemini",
      AI_REVIEW_GEMINI_API_KEY: "key2"
    });

    const result = await reviewProject(validInput);
    expect(result.verdict).toBe("approved");
    expect(result.usedProvider).toBe("gemini");
  });

  it("falls back through multiple providers until one works", async () => {
    // OpenRouter fails
    mockFetch
      .mockResolvedValueOnce({
        ok: false, status: 500, json: () => Promise.resolve({}),
        text: () => Promise.resolve("Server error")
      })
      // Gemini fails
      .mockResolvedValueOnce({
        ok: false, status: 503, json: () => Promise.resolve({}),
        text: () => Promise.resolve("Unavailable")
      })
      // HuggingFace succeeds
      .mockResolvedValueOnce({
        ok: true, status: 200,
        json: () => Promise.resolve({
          generated_text: JSON.stringify(validVerdict)
        }),
        text: () => Promise.resolve("")
      });

    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_OPENROUTER_API_KEY: "key1",
      AI_REVIEW_FALLBACK: "gemini,huggingface",
      AI_REVIEW_GEMINI_API_KEY: "key2"
    });

    const result = await reviewProject(validInput);
    expect(result.usedProvider).toBe("huggingface");
    expect(result.verdict).toBe("approved");
  });

  it("throws when all providers fail", async () => {
    mockFetch.mockResolvedValue({
      ok: false, status: 500, json: () => Promise.resolve({}),
      text: () => Promise.resolve("Error")
    });

    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_OPENROUTER_API_KEY: "key1",
      AI_REVIEW_FALLBACK: "gemini",
      AI_REVIEW_GEMINI_API_KEY: "key2"
    });

    await expect(reviewProject(validInput)).rejects.toThrow(
      "Tous les providers IA ont echoue"
    );
  });

  it("throws when all providers fail with network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network failure"));
    await expect(reviewProject(validInput)).rejects.toThrow(
      "Tous les providers IA ont echoue"
    );
  });

  it("handles empty or null feedback gracefully", async () => {
    mockOpenRouterResponse({
      choices: [{ message: { content: JSON.stringify({ verdict: "approved" }) } }]
    });
    const result = await reviewProject(validInput);
    expect(result.verdict).toBe("approved");
    expect(result.feedback).toBe("Revision effectuee par l'IA.");
  });

  it("handles invalid JSON response from provider", async () => {
    mockOpenRouterResponse({
      choices: [{ message: { content: "Ceci n'est pas du JSON" } }]
    });

    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_OPENROUTER_API_KEY: "key1",
      AI_REVIEW_FALLBACK: "huggingface"
    });

    // Should fall back since no model tries with huggingface if openrouter fails
    await expect(reviewProject(validInput)).rejects.toThrow(
      "Tous les providers IA ont echoue"
    );
  });

  it("uses default OpenRouter models when no model is configured", async () => {
    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_OPENROUTER_API_KEY: "key1",
      AI_REVIEW_MODEL: "" // empty, will use defaults
    });

    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        choices: [{ message: { content: JSON.stringify(validVerdict) } }]
      }),
      text: () => Promise.resolve("")
    });

    const result = await reviewProject(validInput);
    expect(result.usedProvider).toBe("openrouter");
    expect(result.usedModel).toBeTruthy();
  });

  it("uses model specific env var per provider", async () => {
    setEnv({
      AI_REVIEW_PROVIDER: "openrouter",
      AI_REVIEW_OPENROUTER_API_KEY: "key1",
      AI_REVIEW_OPENROUTER_MODEL: "anthropic/claude-3-haiku",
      AI_REVIEW_FALLBACK: "gemini",
      AI_REVIEW_GEMINI_API_KEY: "key2",
      AI_REVIEW_GEMINI_MODEL: "gemini-2.0-flash-lite"
    });

    mockFetch
      .mockResolvedValueOnce({
        ok: false, status: 500, json: () => Promise.resolve({}),
        text: () => Promise.resolve("Error")
      })
      .mockResolvedValueOnce({
        ok: true, status: 200,
        json: () => Promise.resolve({
          candidates: [{ content: { parts: [{ text: JSON.stringify(validVerdict) }] } }]
        }),
        text: () => Promise.resolve("")
      });

    const result = await reviewProject(validInput);
    expect(result.usedProvider).toBe("gemini");
    expect(result.usedModel).toBe("gemini-2.0-flash-lite");
  });

  it("allows configOverrides to set provider and apiKey", async () => {
    mockOpenRouterResponse({
      choices: [{ message: { content: JSON.stringify(validVerdict) } }]
    });

    const result = await reviewProject(validInput, {
      provider: "openrouter",
      apiKey: "override-key",
      enabled: true
    });
    expect(result.verdict).toBe("approved");
  });

  it("builds the Gemini request body format", async () => {
    setEnv({
      AI_REVIEW_PROVIDER: "gemini",
      AI_REVIEW_GEMINI_API_KEY: "gemini-key",
      AI_REVIEW_MODEL: "gemini-2.0-flash"
    });

    // Capture the fetch call to verify Gemini format
    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        candidates: [{ content: { parts: [{ text: JSON.stringify(validVerdict) }] } }]
      }),
      text: () => Promise.resolve("")
    });

    const result = await reviewProject(validInput);
    expect(result.usedProvider).toBe("gemini");

    // Verify the URL contains the Gemini endpoint
    const callUrl = mockFetch.mock.calls[0][0];
    expect(callUrl).toContain("generativelanguage.googleapis.com");
    expect(callUrl).toContain("gemini-2.0-flash");
  });

  it("builds the HuggingFace request body format", async () => {
    setEnv({
      AI_REVIEW_PROVIDER: "huggingface",
      AI_REVIEW_MODEL: "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    });

    mockFetch.mockResolvedValue({
      ok: true, status: 200,
      json: () => Promise.resolve({
        generated_text: JSON.stringify(validVerdict)
      }),
      text: () => Promise.resolve("")
    });

    const result = await reviewProject(validInput);
    expect(result.usedProvider).toBe("huggingface");

    // Verify the URL contains the HuggingFace endpoint
    const callUrl = mockFetch.mock.calls[0][0];
    expect(callUrl).toContain("api-inference.huggingface.co");
  });
});
