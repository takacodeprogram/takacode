"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18nProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ProviderChoice = "" | "mistral" | "openrouter" | "gemini" | "openai" | "anthropic";
type ContextKind = "dashboard" | "lesson" | "track" | "project" | "generic";

interface Props {
  // Titre du chat quand aucun contexte spécifique. Ex. "Coach IA".
  fallbackTitle?: string;
}

const SUGGESTED_PROMPTS_BY_CONTEXT_FR: Record<ContextKind, string[]> = {
  dashboard: [
    "Quelle est la prochaine étape sur mon projet ?",
    "Comment monétiser mon projet plus vite ?",
    "Sur quoi je devrais passer plus de temps cette semaine ?"
  ],
  lesson: [
    "Explique-moi la leçon autrement",
    "Donne-moi un exemple concret",
    "Quelle est l'idée clé à retenir ?"
  ],
  track: [
    "Ce parcours colle-t-il à mon projet ?",
    "Combien de temps pour finir ?",
    "Par quoi commencer ?"
  ],
  project: [
    "Que puis-je apprendre de ce projet ?",
    "Comment adapter cette idée au mien ?",
    "Quelles compétences a-t-il fallu ?"
  ],
  generic: [
    "Aide-moi à choisir mon prochain projet",
    "Comment monétiser une compétence digitale ?",
    "Par où commencer sur TakaCode ?"
  ]
};

const SUGGESTED_PROMPTS_BY_CONTEXT_EN: Record<ContextKind, string[]> = {
  dashboard: [
    "What's the next step on my project?",
    "How can I monetize my project faster?",
    "What should I spend more time on this week?"
  ],
  lesson: [
    "Explain this lesson differently",
    "Give me a concrete example",
    "What's the key idea to remember?"
  ],
  track: [
    "Does this track fit my project?",
    "How long to finish?",
    "Where should I start?"
  ],
  project: [
    "What can I learn from this project?",
    "How can I adapt this idea to mine?",
    "What skills did it take?"
  ],
  generic: [
    "Help me pick my next project",
    "How can I monetize a digital skill?",
    "Where should I start on TakaCode?"
  ]
};

const CONTEXT_ICONS: Record<ContextKind, string> = {
  dashboard: "lucide:layout-dashboard",
  lesson: "lucide:book-open",
  track: "lucide:route",
  project: "lucide:folder-code",
  generic: "lucide:sparkles"
};

function contextFromPathname(pathname: string): { kind: ContextKind; ref: string } {
  const stripped = pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
  const lessonMatch = stripped.match(/^\/tracks\/([^/]+)\/lesson\/([^/]+)/);
  if (lessonMatch) return { kind: "lesson", ref: lessonMatch[2] };
  const trackMatch = stripped.match(/^\/tracks\/([^/]+)/);
  if (trackMatch) return { kind: "track", ref: trackMatch[1] };
  const projectMatch = stripped.match(/^\/projects\/([^/]+)/);
  if (projectMatch) return { kind: "project", ref: projectMatch[1] };
  if (stripped.startsWith("/dashboard") || stripped.startsWith("/admin")) return { kind: "dashboard", ref: "" };
  return { kind: "generic", ref: "" };
}

export default function GlobalAssistant({ fallbackTitle }: Props) {
  const { t, locale } = useI18n();
  const pathname = usePathname() || "/";
  const contextInfo = useMemo(() => contextFromPathname(pathname), [pathname]);
  const contextKind = contextInfo.kind;
  const contextRef = contextInfo.ref;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorCta, setErrorCta] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ provider?: string; model?: string; context?: string }>({});
  const [providerChoice, setProviderChoice] = useState<ProviderChoice>("");
  const [restoredCount, setRestoredCount] = useState<number>(0);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch history when context changes (nav from lesson to track for ex.)
  useEffect(() => {
    let cancelled = false;
    setError("");
    setErrorCta(null);
    setMessages([]);
    setRestoredCount(0);
    setHistoryLoading(true);
    const url = `/api/assistant/history?context=${encodeURIComponent(contextKind)}&ref=${encodeURIComponent(contextRef)}&limit=100`;
    fetch(url, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        const hist: Message[] = Array.isArray(data.messages)
          ? data.messages
              .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
              .map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content }))
          : [];
        setMessages(hist);
        setRestoredCount(hist.length);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [contextKind, contextRef]);

  async function clearHistory() {
    if (!confirm(t("globalAssistant.clearConfirm", "Effacer l'historique du chat pour cette page ?"))) return;
    try {
      await fetch(`/api/assistant/history?context=${encodeURIComponent(contextKind)}&ref=${encodeURIComponent(contextRef)}`, {
        method: "DELETE"
      });
    } catch {}
    setMessages([]);
    setRestoredCount(0);
    setMeta({});
  }

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, loading]);

  const prompts = (locale === "en" ? SUGGESTED_PROMPTS_BY_CONTEXT_EN : SUGGESTED_PROMPTS_BY_CONTEXT_FR)[contextKind];
  const contextLabel = t(`globalAssistant.context.${contextKind}`, fallbackTitle || "Coach IA");
  const buttonLabel = t("globalAssistant.buttonLabel", "Coach IA");

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");
    setErrorCta(null);
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, pathname, provider: providerChoice || undefined })
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || t("globalAssistant.errorGeneric", "Assistant indisponible."));
        setErrorCta(json?.cta || null);
        return;
      }
      setMessages([...next, { role: "assistant", content: json.reply || "" }]);
      setMeta({ provider: json.provider, model: json.model, context: json.context });
    } catch {
      setError(t("globalAssistant.errorNetwork", "Problème réseau."));
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF] hover:brightness-110 text-white shadow-[0_10px_30px_rgba(79,142,247,0.35)] px-4 py-3 transition-all"
          aria-label={t("globalAssistant.open", "Ouvrir l'assistant IA")}
        >
          <span className="relative inline-flex items-center justify-center w-4 h-4">
            <span className="absolute inset-0 rounded-full bg-white/25" style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
            <span className="relative w-2 h-2 rounded-full bg-white" />
          </span>
          <iconify-icon icon="lucide:sparkles" style={{ fontSize: "16px" }} />
          <span className="text-[13px] font-semibold hidden sm:inline">{buttonLabel}</span>
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 z-40 w-[min(400px,calc(100vw-3rem))] h-[min(600px,calc(100vh-6rem))] flex flex-col rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] shadow-[0_25px_60px_rgba(15,23,42,0.4)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-2)] gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#9B6DFF] flex items-center justify-center shrink-0">
                <iconify-icon icon="lucide:sparkles" style={{ color: "white", fontSize: "14px" }} />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{buttonLabel}</div>
                <div className="text-[10px] text-[var(--muted-3)] flex items-center gap-1 truncate">
                  <iconify-icon icon={CONTEXT_ICONS[contextKind]} style={{ fontSize: "10px" }} />
                  {contextLabel}
                </div>
              </div>
            </div>
            <select
              value={providerChoice}
              onChange={(e) => setProviderChoice(e.target.value as ProviderChoice)}
              className="text-[10px] bg-[var(--overlay-2)] border border-[var(--border-3)] rounded-md px-1.5 py-1 text-[var(--muted-2)] focus:outline-none focus:border-[#4F8EF7]"
              aria-label={t("globalAssistant.provider", "Fournisseur IA")}
              title={t("globalAssistant.provider", "Fournisseur IA")}
            >
              <option value="">Auto</option>
              <option value="mistral">Mistral</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="openrouter">OpenRouter</option>
              <option value="gemini">Gemini</option>
            </select>
            {messages.length > 0 ? (
              <button
                type="button"
                onClick={clearHistory}
                className="text-[var(--muted-3)] hover:text-red-400 p-1"
                aria-label={t("globalAssistant.clearHistory", "Effacer l'historique")}
                title={t("globalAssistant.clearHistory", "Effacer l'historique")}
              >
                <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px" }} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[var(--muted-3)] hover:text-[var(--text-primary)] p-1"
              aria-label={t("common.close", "Fermer")}
            >
              <iconify-icon icon="lucide:x" style={{ fontSize: "16px" }} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 font-body-readable text-[13px] text-[var(--text-primary)]">
            {historyLoading ? (
              <div className="text-[11px] text-[var(--muted-4)] italic flex items-center gap-1.5">
                <iconify-icon icon="lucide:loader" style={{ fontSize: "10px", animation: "spin 1s linear infinite" }} />
                {t("globalAssistant.loadingHistory", "Chargement de l'historique…")}
              </div>
            ) : restoredCount > 0 ? (
              <div className="text-[10px] text-[var(--muted-4)] italic flex items-center gap-1.5">
                <iconify-icon icon="lucide:history" style={{ fontSize: "10px" }} />
                {t("globalAssistant.restoredHint", "{n} messages précédents restaurés").replace("{n}", String(restoredCount))}
              </div>
            ) : null}
            {!historyLoading && messages.length === 0 ? (
              <div className="space-y-2.5">
                <div className="text-[12px] text-[var(--muted-3)] leading-relaxed">
                  {t(`globalAssistant.hint.${contextKind}`, t("globalAssistant.hint.generic", "Pose une question, je te réponds avec le contexte de cette page."))}
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  {prompts.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => sendMessage(p)}
                      disabled={loading}
                      className="text-left text-[12px] rounded-lg border border-[var(--border-3)] bg-[var(--overlay-2)] hover:bg-[var(--overlay-4)] hover:border-[#4F8EF7]/40 px-3 py-2 transition-all text-[var(--muted-2)] hover:text-[var(--text-primary)]"
                    >
                      <iconify-icon icon="lucide:message-circle-question" style={{ fontSize: "12px", color: "#4F8EF7", marginRight: "6px" }} />
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#3d7ce6] text-white px-3 py-2 whitespace-pre-wrap"
                    : "mr-8 rounded-xl bg-[var(--overlay-4)] text-[var(--text-primary)] px-3 py-2 whitespace-pre-wrap"
                }
              >
                {m.content}
              </div>
            ))}
            {loading ? (
              <div className="mr-8 rounded-xl bg-[var(--overlay-4)] px-3 py-2 text-[var(--muted-3)] italic flex items-center gap-2">
                <iconify-icon icon="lucide:loader" style={{ fontSize: "12px", animation: "spin 1s linear infinite" }} />
                {t("globalAssistant.thinking", "Le coach réfléchit…")}
              </div>
            ) : null}
            {error ? (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-[12px] text-red-400">
                {error}
                {errorCta ? (
                  <a href={errorCta} className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4F8EF7] hover:underline">
                    <iconify-icon icon="lucide:key-round" style={{ fontSize: "12px" }} />
                    {t("globalAssistant.configureKeyCta", "Configurer une clé IA")}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {meta.provider && messages.length > 0 ? (
            <div className="px-4 py-1.5 text-[10px] text-[var(--muted-4)] border-t border-[var(--border-1)] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                {t("globalAssistant.poweredBy", "Propulsé par")} {meta.provider}
              </span>
              <span className="font-mono">{meta.model}</span>
            </div>
          ) : null}

          <div className="border-t border-[var(--border-2)] p-2">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={2}
                maxLength={2000}
                placeholder={t("globalAssistant.placeholder", "Ta question…")}
                className="flex-1 resize-none rounded-lg bg-[var(--overlay-2)] border border-[var(--border-3)] px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--muted-5)] focus:outline-none focus:border-[#4F8EF7]"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#9B6DFF] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white h-9 w-9 flex items-center justify-center"
                aria-label={t("globalAssistant.send", "Envoyer")}
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
