"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  lessonId: string;
  lessonTitle: string;
}

type ProviderChoice = "" | "mistral" | "openrouter" | "gemini" | "openai" | "anthropic";

export default function LessonAssistant({ lessonId, lessonTitle }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [providerChoice, setProviderChoice] = useState<ProviderChoice>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/lessons/${lessonId}/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, provider: providerChoice || undefined })
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || t("lessonAssistant.errorGeneric", "L'assistant est indisponible."));
        setMessages(next);
        return;
      }
      setMessages([...next, { role: "assistant", content: json.reply || "" }]);
    } catch {
      setError(t("lessonAssistant.errorNetwork", "Problème réseau. Réessaie."));
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#4F8EF7] hover:bg-[#3d7ce6] text-white shadow-lg px-4 py-3 transition-all"
          aria-label={t("lessonAssistant.open", "Ouvrir l'assistant IA")}
        >
          <iconify-icon icon="lucide:sparkles" style={{ fontSize: "18px" }} />
          <span className="text-[13px] font-semibold hidden sm:inline">
            {t("lessonAssistant.buttonLabel", "Assistant IA")}
          </span>
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 z-40 w-[min(380px,calc(100vw-3rem))] h-[min(560px,calc(100vh-6rem))] flex flex-col rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] shadow-[0_20px_50px_rgba(15,23,42,0.35)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-2)]">
            <div className="flex items-center gap-2">
              <iconify-icon icon="lucide:sparkles" style={{ color: "#4F8EF7", fontSize: "16px" }} />
              <div>
                <div className="text-[12px] font-semibold text-[var(--text-primary)]">{t("lessonAssistant.title", "Assistant IA")}</div>
                <div className="text-[10px] text-[var(--muted-3)] truncate max-w-[220px]">{lessonTitle}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <select
                value={providerChoice}
                onChange={(e) => setProviderChoice(e.target.value as ProviderChoice)}
                className="text-[10px] rounded-md border border-[var(--border-3)] bg-[var(--overlay-2)] px-1.5 py-1 text-[var(--muted-2)] focus:outline-none focus:border-[#4F8EF7]"
                aria-label={t("lessonAssistant.providerPicker", "Provider")}
              >
                <option value="">Auto</option>
                <option value="mistral">Mistral</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="openrouter">OpenRouter</option>
                <option value="gemini">Gemini</option>
              </select>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[var(--muted-3)] hover:text-[var(--text-primary)] p-1"
                aria-label={t("common.close", "Fermer")}
              >
                <iconify-icon icon="lucide:x" style={{ fontSize: "16px" }} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 font-body-readable text-[13px] text-[var(--text-primary)]">
            {messages.length === 0 ? (
              <div className="text-[12px] text-[var(--muted-3)] leading-relaxed">
                {t("lessonAssistant.hint", "Pose une question sur cette leçon, demande une reformulation, ou un exemple concret.")}
              </div>
            ) : null}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-xl bg-[#4F8EF7] text-white px-3 py-2 whitespace-pre-wrap"
                    : "mr-8 rounded-xl bg-[var(--overlay-4)] text-[var(--text-primary)] px-3 py-2 whitespace-pre-wrap"
                }
              >
                {m.content}
              </div>
            ))}
            {loading ? (
              <div className="mr-8 rounded-xl bg-[var(--overlay-4)] px-3 py-2 text-[var(--muted-3)] italic">
                {t("lessonAssistant.thinking", "L'assistant réfléchit…")}
              </div>
            ) : null}
            {error ? (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-[12px] text-red-400">
                {error}
              </div>
            ) : null}
          </div>

          <div className="border-t border-[var(--border-2)] p-2">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={2}
                maxLength={2000}
                placeholder={t("lessonAssistant.placeholder", "Ta question…")}
                className="flex-1 resize-none rounded-lg bg-[var(--overlay-2)] border border-[var(--border-3)] px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--muted-5)] focus:outline-none focus:border-[#4F8EF7]"
                disabled={loading}
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="rounded-lg bg-[#4F8EF7] hover:bg-[#3d7ce6] disabled:opacity-40 disabled:cursor-not-allowed text-white h-9 w-9 flex items-center justify-center"
                aria-label={t("lessonAssistant.send", "Envoyer")}
              >
                <iconify-icon icon="lucide:send" style={{ fontSize: "14px" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
