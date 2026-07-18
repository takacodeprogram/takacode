"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { useToast } from "../Toast";
import { analyzeQuiz, balanceQuizAnswers } from "../../lib/quizQuality";
import MicroProjectBuilder from "./MicroProjectBuilder";
import QuestionBankEditor from "./QuestionBankEditor";
import ResourcesEditor from "./ResourcesEditor";

interface Module {
  id: string;
  title: string;
}

interface LessonData {
  id: string;
  module_id?: string;
  slug?: string;
  title?: string;
  intro?: string;
  why_important?: string;
  how_to_use?: string;
  objectives?: string[];
  resources?: unknown;
  quiz?: unknown;
  micro_project?: unknown;
  xp_reward?: number;
  duration_minutes?: number;
  sort_order?: number;
  is_published?: boolean;
}

interface LessonFormProps {
  trackId: string;
  modules?: Module[];
  lesson?: LessonData | null;
  defaultModuleId?: string;
  userId?: string;
}

const INPUT = "auth-input text-[12px] w-full";
const AREA = "auth-input text-[12px] w-full min-h-[80px] font-mono";

function slugIsValid(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function toLines(value: string[] | undefined): string {
  return Array.isArray(value) ? value.join("\n") : "";
}

function toJsonText(value: unknown, fallback: string): string {
  try {
    if (value === undefined || value === null) {
      return fallback;
    }
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

const QUIZ_PLACEHOLDER = '[\n  { "q": "Question ?", "choices": ["A", "B", "C"], "answer": 1, "explanation": "..." }\n]';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{label}</span>
      {hint ? <span className="block text-[10px] text-[#666] mb-1">{hint}</span> : <span className="block mb-1" />}
      {children}
    </label>
  );
}

export default function LessonForm({ trackId, modules = [], lesson = null, defaultModuleId = "", userId = "" }: LessonFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const isEdit = Boolean(lesson);

  const [form, setForm] = useState<Record<string, string>>(() => ({
    module_id: lesson?.module_id || defaultModuleId || (modules[0]?.id ?? ""),
    slug: lesson?.slug || "",
    title: lesson?.title || "",
    intro: lesson?.intro || "",
    why_important: lesson?.why_important || "",
    how_to_use: lesson?.how_to_use || "",
    objectives: toLines(lesson?.objectives),
    resources: toJsonText(lesson?.resources, "[]"),
    quiz: toJsonText(lesson?.quiz, "[]"),
    micro_project: toJsonText(lesson?.micro_project, "{}"),
    xp_reward: String(lesson?.xp_reward ?? 50),
    duration_minutes: String(lesson?.duration_minutes ?? 45),
    sort_order: String(lesson?.sort_order ?? 100),
    is_published: String(lesson ? lesson.is_published === true : true)
  }));
  const [saving, setSaving] = useState<boolean>(false);

  const quizQuality = useMemo(() => {
    try {
      return analyzeQuiz(JSON.parse(form.quiz || "[]"));
    } catch {
      return analyzeQuiz(null);
    }
  }, [form.quiz]);

  function setField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function buildPayload() {
    const objectives = form.objectives
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let resources: unknown;
    let quiz: unknown;
    let microProject: unknown;
    try {
      resources = JSON.parse(form.resources || "[]");
      if (!Array.isArray(resources)) throw new Error("resources doit être un tableau");
    } catch (e) {
      throw new Error(`Ressources JSON invalide: ${(e as Error).message}`);
    }
    try {
      quiz = balanceQuizAnswers(JSON.parse(form.quiz || "[]"));
    } catch (e) {
      throw new Error(`Quiz JSON invalide: ${(e as Error).message}`);
    }
    try {
      microProject = JSON.parse(form.micro_project || "{}");
      if (typeof microProject !== "object" || Array.isArray(microProject)) throw new Error("micro_project doit être un objet");
    } catch (e) {
      throw new Error(`Micro-projet JSON invalide: ${(e as Error).message}`);
    }

    return {
      module_id: form.module_id,
      title: form.title.trim() || "Lecon",
      intro: form.intro.trim(),
      why_important: form.why_important.trim(),
      how_to_use: form.how_to_use.trim(),
      objectives,
      resources,
      quiz,
      micro_project: microProject,
      xp_reward: Math.max(0, Number.parseInt(form.xp_reward, 10) || 0),
      duration_minutes: Math.max(1, Number.parseInt(form.duration_minutes, 10) || 45),
      sort_order: Math.max(1, Number.parseInt(form.sort_order, 10) || 100),
      is_published: form.is_published === "true"
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.module_id) {
      toast("Choisis un module.", "error");
      return;
    }
    if (!form.title.trim()) {
      toast("Le titre est obligatoire.", "error");
      return;
    }

    let payload: ReturnType<typeof buildPayload>;
    try {
      payload = buildPayload();
    } catch (e) {
      toast((e as Error).message, "error");
      return;
    }

    setSaving(true);

    if (isEdit) {
      const { error: updateError } = await supabase.from("track_lessons").update(payload).eq("id", lesson!.id);
      setSaving(false);
      if (updateError) {
        toast(updateError.message, "error");
        return;
      }
      toast("Leçon enregistrée.", "success");
      router.refresh();
      return;
    }

    const slug = form.slug.trim().toLowerCase();
    if (!slugIsValid(slug)) {
      toast("Slug de leçon invalide (minuscules, chiffres, tirets).", "error");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from("track_lessons").insert({ slug, ...payload });
    setSaving(false);
    if (insertError) {
      toast(insertError.message, "error");
      return;
    }
    router.push(`/admin/parcours/${trackId}`);
  }

  return (
    <div className="space-y-6">
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Module">
          <select className={INPUT} value={form.module_id} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("module_id", e.target.value)}>
            {modules.map((module: Module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
        </Field>
        {isEdit ? (
          <Field label="Slug"><input className={INPUT} value={form.slug} disabled /></Field>
        ) : (
          <Field label="Slug (url)"><input className={INPUT} value={form.slug} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("slug", e.target.value)} placeholder="ex: bases-html" /></Field>
        )}
      </div>

      <Field label="Titre"><input className={INPUT} value={form.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("title", e.target.value)} /></Field>
      <Field label="Introduction"><textarea className={`${INPUT} min-h-[64px]`} value={form.intro} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("intro", e.target.value)} /></Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Pourquoi c'est important"><textarea className={`${INPUT} min-h-[64px]`} value={form.why_important} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("why_important", e.target.value)} /></Field>
        <Field label="Comment travailler la lecon"><textarea className={`${INPUT} min-h-[64px]`} value={form.how_to_use} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("how_to_use", e.target.value)} /></Field>
      </div>

      <Field label="Objectifs" hint="Un objectif par ligne"><textarea className={`${INPUT} min-h-[80px]`} value={form.objectives} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("objectives", e.target.value)} /></Field>

      <ResourcesEditor value={form.resources} onChange={(val: string) => setField("resources", val)} />

      <Field label="Quiz (JSON)" hint="answer = index de la bonne réponse (commence à 0)">
        <textarea className={AREA} value={form.quiz} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("quiz", e.target.value)} placeholder={QUIZ_PLACEHOLDER} />
      </Field>

      <div className={`rounded-xl border px-4 py-3 ${quizQuality.valid ? "border-blue-500/20 bg-blue-500/[0.06]" : "border-red-500/25 bg-red-500/10"}`} aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <iconify-icon icon={quizQuality.valid ? "lucide:badge-check" : "lucide:circle-alert"} style={{ fontSize: "14px", color: quizQuality.valid ? "#6ec3ff" : "#fca5a5" }} />
            <span className="font-venite-italic text-[11px] text-white">QUALITE DU QUIZ</span>
          </div>
          <span className="text-[10px] text-[#8d8d8d] font-body-readable">
            {quizQuality.questionCount} question{quizQuality.questionCount > 1 ? "s" : ""}
          </span>
        </div>

        {quizQuality.answerDistribution.length ? (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {quizQuality.answerDistribution.map((count, index) => (
              <span key={`answer-position-${index}`} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] text-[#a5a5a5] font-body-readable">
                Position {index + 1} : {count || 0}
              </span>
            ))}
          </div>
        ) : null}

        {quizQuality.issues.length ? (
          <div className="space-y-1.5">
            {quizQuality.issues.slice(0, 6).map((issue, index) => (
              <p key={`${issue.message}-${index}`} className={`text-[11px] leading-relaxed font-body-readable ${issue.level === "error" ? "text-red-200" : "text-amber-100"}`}>
                {issue.level === "error" ? "A corriger" : "Conseil"} : {issue.message}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-blue-100 font-body-readable">Structure valide. Les bonnes reponses seront reparties automatiquement entre les positions.</p>
        )}
      </div>

      <MicroProjectBuilder value={form.micro_project} onChange={(val: string) => setField("micro_project", val)} />

      <div className="grid grid-cols-3 gap-3">
        <Field label="XP"><input type="number" min="0" className={INPUT} value={form.xp_reward} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("xp_reward", e.target.value)} /></Field>
        <Field label="Duree (min)"><input type="number" min="1" className={INPUT} value={form.duration_minutes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("duration_minutes", e.target.value)} /></Field>
        <Field label="Ordre"><input type="number" min="1" className={INPUT} value={form.sort_order} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("sort_order", e.target.value)} /></Field>
      </div>

      <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
        <input type="checkbox" checked={form.is_published === "true"} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("is_published", e.target.checked ? "true" : "false")} /> Publiée
      </label>

      <button type="submit" disabled={saving} className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`} style={{ padding: "10px 18px" }}>
        {saving ? "Enregistrement..." : isEdit ? "Enregistrer la leçon" : "Créer la leçon"}
        <iconify-icon icon="lucide:save" style={{ fontSize: "13px" }} />
      </button>
    </form>
    {isEdit && userId ? (
      <QuestionBankEditor
        lessonId={lesson!.id}
        userId={userId}
        objectives={lesson?.objectives || []}
        resources={Array.isArray(lesson?.resources) ? lesson.resources as ResourceOption[] : []}
      />
    ) : null}
    </div>
  );
}

interface ResourceOption {
  label?: string;
  url?: string;
}
