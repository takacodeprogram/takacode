"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

const INPUT = "auth-input text-[12px] w-full";
const AREA = "auth-input text-[12px] w-full min-h-[80px] font-mono";

function slugIsValid(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function toLines(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function toJsonText(value, fallback) {
  try {
    if (value === undefined || value === null) {
      return fallback;
    }
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

const RESOURCES_PLACEHOLDER = '[\n  { "label": "Titre", "url": "https://...", "kind": "doc", "why": "...", "how": "..." }\n]';
const QUIZ_PLACEHOLDER = '[\n  { "q": "Question ?", "choices": ["A", "B", "C"], "answer": 1, "explanation": "..." }\n]';
const PROJECT_PLACEHOLDER = '{\n  "title": "...",\n  "brief": "...",\n  "steps": ["..."],\n  "deliverable": "..."\n}';

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{label}</span>
      {hint ? <span className="block text-[10px] text-[#666] mb-1">{hint}</span> : <span className="block mb-1" />}
      {children}
    </label>
  );
}

export default function LessonForm({ trackId, modules = [], lesson = null, defaultModuleId = "" }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const isEdit = Boolean(lesson);

  const [form, setForm] = useState(() => ({
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
    is_published: lesson ? lesson.is_published === true : true
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function buildPayload() {
    const objectives = form.objectives
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let resources;
    let quiz;
    let microProject;
    try {
      resources = JSON.parse(form.resources || "[]");
      if (!Array.isArray(resources)) throw new Error("resources doit être un tableau");
    } catch (e) {
      throw new Error(`Ressources JSON invalide: ${e.message}`);
    }
    try {
      quiz = JSON.parse(form.quiz || "[]");
      if (!Array.isArray(quiz)) throw new Error("quiz doit être un tableau");
    } catch (e) {
      throw new Error(`Quiz JSON invalide: ${e.message}`);
    }
    try {
      microProject = JSON.parse(form.micro_project || "{}");
      if (typeof microProject !== "object" || Array.isArray(microProject)) throw new Error("micro_project doit être un objet");
    } catch (e) {
      throw new Error(`Micro-projet JSON invalide: ${e.message}`);
    }

    return {
      module_id: form.module_id,
      title: form.title.trim() || "Leçon",
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
      is_published: form.is_published === true
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.module_id) {
      setError("Choisis un module.");
      return;
    }
    if (!form.title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    let payload;
    try {
      payload = buildPayload();
    } catch (e) {
      setError(e.message);
      return;
    }

    setSaving(true);

    if (isEdit) {
      const { error: updateError } = await supabase.from("track_lessons").update(payload).eq("id", lesson.id);
      setSaving(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setMessage("Leçon enregistrée.");
      router.refresh();
      return;
    }

    const slug = form.slug.trim().toLowerCase();
    if (!slugIsValid(slug)) {
      setError("Slug de leçon invalide (minuscules, chiffres, tirets).");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from("track_lessons").insert({ slug, ...payload });
    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push(`/admin/parcours/${trackId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Module">
          <select className={INPUT} value={form.module_id} onChange={(e) => setField("module_id", e.target.value)}>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
        </Field>
        {isEdit ? (
          <Field label="Slug"><input className={INPUT} value={form.slug} disabled /></Field>
        ) : (
          <Field label="Slug (url)"><input className={INPUT} value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="ex: bases-html" /></Field>
        )}
      </div>

      <Field label="Titre"><input className={INPUT} value={form.title} onChange={(e) => setField("title", e.target.value)} /></Field>
      <Field label="Introduction"><textarea className={`${INPUT} min-h-[64px]`} value={form.intro} onChange={(e) => setField("intro", e.target.value)} /></Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Pourquoi c'est important"><textarea className={`${INPUT} min-h-[64px]`} value={form.why_important} onChange={(e) => setField("why_important", e.target.value)} /></Field>
        <Field label="Comment travailler la lecon"><textarea className={`${INPUT} min-h-[64px]`} value={form.how_to_use} onChange={(e) => setField("how_to_use", e.target.value)} /></Field>
      </div>

      <Field label="Objectifs" hint="Un objectif par ligne"><textarea className={`${INPUT} min-h-[80px]`} value={form.objectives} onChange={(e) => setField("objectives", e.target.value)} /></Field>

      <Field label="Ressources (JSON)" hint="Tableau d'objets label/url/kind/why/how">
        <textarea className={AREA} value={form.resources} onChange={(e) => setField("resources", e.target.value)} placeholder={RESOURCES_PLACEHOLDER} />
      </Field>

      <Field label="Quiz (JSON)" hint="answer = index de la bonne réponse (commence à 0)">
        <textarea className={AREA} value={form.quiz} onChange={(e) => setField("quiz", e.target.value)} placeholder={QUIZ_PLACEHOLDER} />
      </Field>

      <Field label="Micro-projet (JSON)" hint="title/brief/steps/deliverable + validation: auto|ai|peer|mentor (défaut auto). Option requires_link: true">
        <textarea className={AREA} value={form.micro_project} onChange={(e) => setField("micro_project", e.target.value)} placeholder={PROJECT_PLACEHOLDER} />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="XP"><input type="number" min="0" className={INPUT} value={form.xp_reward} onChange={(e) => setField("xp_reward", e.target.value)} /></Field>
        <Field label="Duree (min)"><input type="number" min="1" className={INPUT} value={form.duration_minutes} onChange={(e) => setField("duration_minutes", e.target.value)} /></Field>
        <Field label="Ordre"><input type="number" min="1" className={INPUT} value={form.sort_order} onChange={(e) => setField("sort_order", e.target.value)} /></Field>
      </div>

      <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
        <input type="checkbox" checked={form.is_published} onChange={(e) => setField("is_published", e.target.checked)} /> Publiée
      </label>

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}
      {message ? <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">{message}</div> : null}

      <button type="submit" disabled={saving} className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`} style={{ padding: "10px 18px" }}>
        {saving ? "Enregistrement..." : isEdit ? "Enregistrer la leçon" : "Créer la leçon"}
        <iconify-icon icon="lucide:save" style={{ fontSize: "13px" }} />
      </button>
    </form>
  );
}
