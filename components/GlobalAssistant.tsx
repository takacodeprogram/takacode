"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18nProvider";
import RichTextRenderer from "./RichTextRenderer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ProviderCapability {
  id: ProviderChoice;
  label: string;
  source: "user" | "workspace";
  models: Array<{ id: string; label: string; contextWindow?: number }>;
}

interface HistoryThread {
  contextKind: ContextKind;
  contextRef: string;
  preview: string;
  updatedAt: string;
  messageCount: number;
}

interface Attachment {
  id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  extracted_chars?: number;
  warning?: string;
}

interface PendingAction {
  tool: string;
  arguments: Record<string, unknown>;
  reason: string;
}

interface ToolEvent {
  tool: string;
  status: "completed" | "confirmation_required" | "failed";
  summary: string;
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
  const projectMatch = stripped.match(/^(?:\/dashboard)?\/projects\/([^/]+)/);
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
  const [modelChoice, setModelChoice] = useState("");
  const [providers, setProviders] = useState<ProviderCapability[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [threads, setThreads] = useState<HistoryThread[]>([]);
  const [viewingThread, setViewingThread] = useState<HistoryThread | null>(null);
  const [nudge, setNudge] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceBusy, setVoiceBusy] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [toolEvents, setToolEvents] = useState<ToolEvent[]>([]);
  const [restoredCount, setRestoredCount] = useState<number>(0);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    fetch("/api/assistant/capabilities", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(response))
      .then((data) => {
        const available = Array.isArray(data.providers) ? data.providers : [];
        setProviders(available);
        const preferred = available.find((provider: ProviderCapability) => provider.id === data.preferredProvider) || available[0];
        if (preferred) {
          setProviderChoice(preferred.id);
          setModelChoice(preferred.models[0]?.id || "");
        }
      })
      .catch(() => setProviders([]));
  }, []);

  // Fetch history when context changes (nav from lesson to track for ex.)
  useEffect(() => {
    let cancelled = false;
    setError("");
    setErrorCta(null);
    setMessages([]);
    setRestoredCount(0);
    setPendingAction(null);
    setToolEvents([]);
    setViewingThread(null);
    setHistoryOpen(false);
    setAttachments([]);
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

  useEffect(() => {
    if (open) return;
    const key = `takacode-coach-nudge:${pathname}`;
    if (sessionStorage.getItem(key)) return;
    const timer = window.setTimeout(() => {
      const page = t(`globalAssistant.context.${contextKind}`, contextKind);
      setNudge(locale === "en" ? `Need help on this ${page.toLowerCase()}?` : `Besoin d'aide sur cette page ${page.toLowerCase()} ?`);
      sessionStorage.setItem(key, "1");
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [contextKind, locale, open, pathname, t]);

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
    setPendingAction(null);
    setToolEvents([]);
  }

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, loading]);

  const prompts = (locale === "en" ? SUGGESTED_PROMPTS_BY_CONTEXT_EN : SUGGESTED_PROMPTS_BY_CONTEXT_FR)[contextKind];
  const contextLabel = t(`globalAssistant.context.${contextKind}`, fallbackTitle || "Coach IA");
  const buttonLabel = t("globalAssistant.buttonLabel", "Coach IA");

  async function toggleHistory() {
    const nextOpen = !historyOpen;
    setHistoryOpen(nextOpen);
    if (!nextOpen) return;
    try {
      const response = await fetch("/api/assistant/history?view=threads&limit=30", { cache: "no-store" });
      const data = await response.json();
      setThreads(Array.isArray(data.threads) ? data.threads : []);
    } catch {
      setThreads([]);
    }
  }

  async function openHistoryThread(thread: HistoryThread) {
    setHistoryLoading(true);
    try {
      const response = await fetch(`/api/assistant/history?context=${encodeURIComponent(thread.contextKind)}&ref=${encodeURIComponent(thread.contextRef)}&limit=200`, { cache: "no-store" });
      const data = await response.json();
      const restored = Array.isArray(data.messages) ? data.messages.filter((message: Message) => message?.role && typeof message.content === "string") : [];
      setMessages(restored);
      setRestoredCount(restored.length);
      setViewingThread(thread);
      setHistoryOpen(false);
    } finally {
      setHistoryLoading(false);
    }
  }

  function returnToCurrentContext() {
    setViewingThread(null);
    const url = `/api/assistant/history?context=${encodeURIComponent(contextKind)}&ref=${encodeURIComponent(contextRef)}&limit=100`;
    setHistoryLoading(true);
    fetch(url, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { messages: [] })
      .then((data) => setMessages(Array.isArray(data.messages) ? data.messages : []))
      .finally(() => setHistoryLoading(false));
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files).slice(0, Math.max(0, 5 - attachments.length))) {
        const form = new FormData();
        form.append("file", file);
        form.append("contextKind", contextKind);
        form.append("contextRef", contextRef);
        const response = await fetch("/api/assistant/files", { method: "POST", body: form });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Envoi du fichier impossible.");
        setAttachments((current) => [...current, data.attachment]);
      }
    } catch (uploadError) {
      setError((uploadError as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) audioChunksRef.current.push(event.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setVoiceBusy(true);
        try {
          const audio = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
          const form = new FormData();
          form.append("audio", audio, "voice.webm");
          const response = await fetch("/api/assistant/transcribe", { method: "POST", body: form });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Transcription indisponible.");
          setInput((current) => `${current}${current ? " " : ""}${data.text || ""}`);
        } catch (voiceError) {
          setError((voiceError as Error).message);
        } finally {
          setVoiceBusy(false);
        }
      };
      recorder.start();
      setRecording(true);
    } catch {
      setError("Autorise le microphone pour utiliser le chat vocal.");
    }
  }

  async function speak(text: string) {
    setVoiceBusy(true);
    try {
      const response = await fetch("/api/assistant/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error("api_unavailable");
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      audio.onended = () => { URL.revokeObjectURL(url); setVoiceBusy(false); };
      await audio.play();
    } catch {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = locale === "en" ? "en-US" : "fr-FR";
        utterance.onend = () => setVoiceBusy(false);
        window.speechSynthesis.speak(utterance);
      } else setVoiceBusy(false);
    }
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim() || (attachments.length ? (locale === "en" ? "Analyze the attached file(s)." : "Analyse le ou les fichiers joints.") : "");
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");
    setErrorCta(null);
    setPendingAction(null);
    setToolEvents([]);
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          pathname,
          provider: providerChoice || undefined,
          model: modelChoice || undefined,
          attachmentIds: attachments.map((attachment) => attachment.id)
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || t("globalAssistant.errorGeneric", "Assistant indisponible."));
        setErrorCta(json?.cta || null);
        return;
      }
      setMessages([...next, { role: "assistant", content: json.reply || "" }]);
      setMeta({ provider: json.provider, model: json.model, context: json.context });
      setPendingAction(json.pendingAction || null);
      setToolEvents(Array.isArray(json.toolEvents) ? json.toolEvents : []);
      setAttachments([]);
    } catch {
      setError(t("globalAssistant.errorNetwork", "Problème réseau."));
    } finally {
      setLoading(false);
    }
  }

  async function confirmPendingAction() {
    if (!pendingAction || loading) return;
    const confirmation: Message = { role: "user", content: `Je confirme : ${pendingAction.reason}` };
    const next = [...messages, confirmation];
    setMessages(next);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          pathname,
          provider: providerChoice || undefined,
          model: modelChoice || undefined,
          confirmedAction: pendingAction
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || t("globalAssistant.errorGeneric", "Assistant indisponible."));
        return;
      }
      setMessages([...next, { role: "assistant", content: json.reply || "Action terminee." }]);
      setMeta({ provider: json.provider, model: json.model, context: json.context });
      setPendingAction(json.pendingAction || null);
      setToolEvents(Array.isArray(json.toolEvents) ? json.toolEvents : []);
    } catch {
      setError(t("globalAssistant.errorNetwork", "Probleme reseau."));
    } finally {
      setLoading(false);
    }
  }

  function cancelPendingAction() {
    setPendingAction(null);
    setToolEvents([]);
    setMessages((current) => [...current, { role: "assistant", content: "Action annulee. Aucune modification n'a ete effectuee." }]);
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
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          {nudge ? (
            <button type="button" onClick={() => { setOpen(true); setNudge(""); }} className="max-w-[280px] rounded-2xl rounded-br-md border border-[#4F8EF7]/25 bg-[var(--surface-1)] px-4 py-3 text-left text-[12px] text-[var(--text-primary)] shadow-xl hover:border-[#4F8EF7]/50 transition-colors">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#7aa8ff] mb-1">{buttonLabel}</span>
              {nudge}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => { setOpen(true); setNudge(""); }}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF] hover:brightness-110 text-white shadow-[0_10px_30px_rgba(79,142,247,0.35)] px-4 py-3 transition-all"
            aria-label={t("globalAssistant.open", "Ouvrir l'assistant IA")}
          >
            <span className="relative inline-flex items-center justify-center w-4 h-4">
              <span className="absolute inset-0 rounded-full bg-white/25" style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
              <span className="relative w-2 h-2 rounded-full bg-white" />
            </span>
            <iconify-icon icon="lucide:sparkles" style={{ fontSize: "16px" }} />
            <span className="text-[13px] font-semibold hidden sm:inline">{buttonLabel}</span>
          </button>
        </div>
      ) : (
        <div className="fixed bottom-6 right-6 z-40 w-[min(420px,calc(100vw-3rem))] h-[min(650px,calc(100vh-6rem))] flex flex-col rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] shadow-[0_25px_60px_rgba(15,23,42,0.4)] overflow-hidden">
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
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <select
                value={providerChoice && modelChoice ? `${providerChoice}|${modelChoice}` : ""}
                onChange={(event) => {
                  const [provider, ...modelParts] = event.target.value.split("|");
                  setProviderChoice(provider as ProviderChoice);
                  setModelChoice(modelParts.join("|"));
                }}
                className="h-7 max-w-[145px] text-[10px] bg-[var(--overlay-2)] border border-[var(--border-3)] rounded-md px-1.5 text-[var(--muted-2)] focus:outline-none focus:border-[#4F8EF7]"
                aria-label={t("globalAssistant.model", "Modèle IA")}
                title={t("globalAssistant.model", "Modèle IA disponible selon tes clés")}
              >
                {!providers.length ? <option value="">Configurer une clé</option> : null}
                {providers.map((provider) => (
                  <optgroup key={provider.id} label={`${provider.label} · ${provider.source === "user" ? "ma clé" : "espace"}`}>
                    {provider.models.map((model) => <option key={model.id} value={`${provider.id}|${model.id}`}>{model.label}</option>)}
                  </optgroup>
                ))}
              </select>
              <button
                type="button"
                onClick={toggleHistory}
                className="w-7 h-7 inline-flex items-center justify-center rounded-md text-[var(--muted-3)] hover:text-[var(--text-primary)] hover:bg-[var(--overlay-4)] transition-colors"
                aria-label="Voir tous les historiques"
                title="Voir tous les historiques"
              >
                <iconify-icon icon="lucide:history" style={{ fontSize: "14px" }} />
              </button>
              {messages.length > 0 && !viewingThread ? (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="w-7 h-7 inline-flex items-center justify-center rounded-md text-[var(--muted-3)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  aria-label={t("globalAssistant.clearHistory", "Effacer l'historique")}
                  title={t("globalAssistant.clearHistory", "Effacer l'historique")}
                >
                  <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px" }} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 inline-flex items-center justify-center rounded-md text-[var(--muted-3)] hover:text-[var(--text-primary)] hover:bg-[var(--overlay-4)] transition-colors"
                aria-label={t("globalAssistant.closeChat", "Fermer le chat (l'historique reste sauvegardé)")}
                title={t("globalAssistant.closeChat", "Fermer le chat (l'historique reste sauvegardé)")}
              >
                <iconify-icon icon="lucide:x" style={{ fontSize: "15px" }} />
              </button>
            </div>
          </div>

          {historyOpen ? (
            <div className="absolute inset-x-0 top-[53px] bottom-0 z-20 bg-[var(--surface-1)] p-3 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[13px] font-semibold text-[var(--text-primary)]">Conversations récentes</div>
                  <div className="text-[10px] text-[var(--muted-4)]">Tes échanges sont classés par page.</div>
                </div>
                <button type="button" onClick={() => setHistoryOpen(false)} className="w-8 h-8 rounded-lg hover:bg-[var(--overlay-4)] text-[var(--muted-3)]"><iconify-icon icon="lucide:x" /></button>
              </div>
              <div className="space-y-2">
                {threads.map((thread) => (
                  <button key={`${thread.contextKind}:${thread.contextRef}`} type="button" onClick={() => openHistoryThread(thread)} className="w-full rounded-xl border border-[var(--border-2)] bg-[var(--overlay-2)] p-3 text-left hover:border-[#4F8EF7]/40 hover:bg-[var(--overlay-4)] transition-colors">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--text-primary)]">
                      <iconify-icon icon={CONTEXT_ICONS[thread.contextKind]} style={{ color: "#7aa8ff" }} />
                      <span className="capitalize">{thread.contextKind}</span>
                      {thread.contextRef ? <span className="truncate text-[var(--muted-3)]">· {thread.contextRef}</span> : null}
                      <span className="ml-auto text-[9px] font-normal text-[var(--muted-4)]">{thread.messageCount} msg</span>
                    </div>
                    <div className="mt-1.5 truncate text-[11px] text-[var(--muted-3)]">{thread.preview}</div>
                    <div className="mt-1 text-[9px] text-[var(--muted-5)]">{new Date(thread.updatedAt).toLocaleString(locale === "en" ? "en-US" : "fr-FR")}</div>
                  </button>
                ))}
                {!threads.length ? <div className="py-10 text-center text-[12px] text-[var(--muted-4)]">Aucun historique pour le moment.</div> : null}
              </div>
            </div>
          ) : null}

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 font-body-readable text-[13px] text-[var(--text-primary)]">
            {viewingThread ? (
              <div className="sticky top-0 z-10 rounded-lg border border-[#4F8EF7]/25 bg-[var(--surface-1)] p-2 text-[10px] text-[var(--muted-3)] flex items-center gap-2 shadow-sm">
                <iconify-icon icon="lucide:book-open-check" style={{ color: "#7aa8ff" }} />
                <span className="truncate flex-1">Historique {viewingThread.contextKind}{viewingThread.contextRef ? ` · ${viewingThread.contextRef}` : ""}</span>
                <button type="button" onClick={returnToCurrentContext} className="font-semibold text-[#7aa8ff]">Page actuelle</button>
              </div>
            ) : null}
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
                    : "mr-8 rounded-xl bg-[var(--overlay-4)] text-[var(--text-primary)] px-3 py-2"
                }
              >
                {m.role === "assistant" ? (
                  <RichTextRenderer content={m.content} format="markdown" className="text-[var(--text-primary)]" />
                ) : (
                  m.content
                )}
                {m.role === "assistant" ? (
                  <button type="button" onClick={() => speak(m.content)} disabled={voiceBusy} className="mt-2 flex items-center gap-1 text-[10px] text-[var(--muted-4)] hover:text-[#7aa8ff] disabled:opacity-40" aria-label="Écouter la réponse">
                    <iconify-icon icon="lucide:volume-2" style={{ fontSize: "11px" }} /> Écouter
                  </button>
                ) : null}
              </div>
            ))}
            {toolEvents.length ? (
              <div className="space-y-1.5">
                {toolEvents.map((event, index) => (
                  <div key={`${event.tool}-${index}`} className="rounded-lg border border-[var(--border-3)] bg-[var(--overlay-2)] px-3 py-2 text-[11px] flex items-start gap-2">
                    <iconify-icon
                      icon={event.status === "completed" ? "lucide:check-circle-2" : event.status === "failed" ? "lucide:circle-alert" : "lucide:shield-question"}
                      style={{ fontSize: "13px", color: event.status === "completed" ? "#34d399" : event.status === "failed" ? "#f87171" : "#fbbf24", marginTop: "1px" }}
                    />
                    <div>
                      <div className="font-mono text-[10px] text-[var(--muted-2)]">{event.tool}</div>
                      <div className="text-[var(--muted-4)]">{event.summary}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {pendingAction ? (
              <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 space-y-3">
                <div className="flex items-start gap-2">
                  <iconify-icon icon="lucide:shield-check" style={{ fontSize: "16px", color: "#fbbf24" }} />
                  <div>
                    <div className="text-[12px] font-semibold text-amber-100">Confirmation requise</div>
                    <div className="text-[11px] text-amber-100/75 mt-1">{pendingAction.reason}</div>
                    <div className="font-mono text-[10px] text-amber-200/60 mt-1">{pendingAction.tool}</div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={cancelPendingAction} disabled={loading} className="px-3 py-1.5 rounded-lg border border-[var(--border-3)] text-[11px] text-[var(--muted-2)] hover:text-[var(--text-primary)]">
                    Annuler
                  </button>
                  <button type="button" onClick={confirmPendingAction} disabled={loading} className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-[11px] font-semibold hover:bg-amber-300">
                    Confirmer
                  </button>
                </div>
              </div>
            ) : null}
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
            {attachments.length ? (
              <div className="flex flex-wrap gap-1.5 px-1 pb-2">
                {attachments.map((attachment) => (
                  <span key={attachment.id} className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[#4F8EF7]/20 bg-[#4F8EF7]/10 px-2 py-1 text-[10px] text-[#9bbcff]">
                    <iconify-icon icon="lucide:paperclip" />
                    <span className="max-w-[210px] truncate">{attachment.file_name}</span>
                    <button type="button" onClick={() => setAttachments((current) => current.filter((item) => item.id !== attachment.id))} aria-label="Retirer le fichier"><iconify-icon icon="lucide:x" /></button>
                  </span>
                ))}
              </div>
            ) : null}
            {attachments.some((attachment) => attachment.warning) ? (
              <div className="mx-1 mb-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1.5 text-[10px] leading-relaxed text-amber-300">
                {attachments.filter((attachment) => attachment.warning).map((attachment) => (
                  <div key={attachment.id}>
                    <span className="font-semibold">{attachment.file_name}</span> — {attachment.warning}
                  </div>
                ))}
              </div>
            ) : null}
            {viewingThread ? (
              <button type="button" onClick={returnToCurrentContext} className="w-full rounded-lg border border-[#4F8EF7]/25 bg-[#4F8EF7]/10 py-2 text-[11px] font-semibold text-[#9bbcff]">Revenir à la page actuelle pour continuer</button>
            ) : (
            <div className="flex items-end gap-2">
              <input ref={fileInputRef} type="file" multiple accept=".txt,.md,.csv,.tsv,.json,.html,.css,.js,.ts,.tsx,.yml,.yaml,.sql,.xml,.pdf,.docx,image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => uploadFiles(event.target.files)} />
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading || uploading || attachments.length >= 5} className="rounded-lg border border-[var(--border-3)] bg-[var(--overlay-2)] h-8 w-8 flex items-center justify-center text-[var(--muted-3)] hover:text-[#7aa8ff] disabled:opacity-40" aria-label="Joindre un fichier" title="Joindre un fichier (10 Mo max)">
                  <iconify-icon icon={uploading ? "lucide:loader" : "lucide:paperclip"} style={{ fontSize: "13px", animation: uploading ? "spin 1s linear infinite" : undefined }} />
                </button>
                <button type="button" onClick={toggleRecording} disabled={loading || voiceBusy} className={`rounded-lg border h-8 w-8 flex items-center justify-center transition-colors disabled:opacity-40 ${recording ? "border-red-400 bg-red-500/15 text-red-400" : "border-[var(--border-3)] bg-[var(--overlay-2)] text-[var(--muted-3)] hover:text-[#7aa8ff]"}`} aria-label={recording ? "Arrêter l'enregistrement" : "Dicter un message"} title={recording ? "Arrêter" : "Dicter un message"}>
                  <iconify-icon icon={recording ? "lucide:square" : voiceBusy ? "lucide:loader" : "lucide:mic"} style={{ fontSize: "13px", animation: voiceBusy ? "spin 1s linear infinite" : undefined }} />
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={2}
                maxLength={2000}
                placeholder={t("globalAssistant.placeholder", "Ta question…")}
                className="flex-1 resize-none rounded-lg bg-[var(--overlay-2)] border border-[var(--border-3)] px-3 py-2 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--muted-5)] focus:outline-none focus:border-[#4F8EF7]"
                disabled={loading || recording}
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={loading || (!input.trim() && !attachments.length)}
                className="rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#9B6DFF] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white h-9 w-9 flex items-center justify-center"
                aria-label={t("globalAssistant.send", "Envoyer")}
              >
                <iconify-icon icon="lucide:send" style={{ fontSize: "14px" }} />
              </button>
            </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
