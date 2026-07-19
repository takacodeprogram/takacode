"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { useToast } from "../Toast";

interface QuestionRow {
  id: string;
  prompt: string;
  choices: string[];
  correct_answer: number;
  explanation: string;
  objective: string;
  resource_url: string;
  difficulty: "foundation" | "standard" | "challenge";
  source: "manual" | "ai" | "legacy";
  status: "draft" | "approved" | "archived";
}

interface ResourceOption {
  label?: string;
  url?: string;
}

interface Props {
  lessonId: string;
  userId: string;
  objectives?: string[];
  resources?: ResourceOption[];
}

const SELECT = "id, prompt, choices, correct_answer, explanation, objective, resource_url, difficulty, source, status";
const INPUT = "auth-input text-[12px] w-full";

function normalizeRow(row: Record<string, unknown>): QuestionRow {
  return {
    id: String(row.id || ""),
    prompt: String(row.prompt || ""),
    choices: Array.isArray(row.choices) ? row.choices.map(String) : ["", "", ""],
    correct_answer: Number.isInteger(Number(row.correct_answer)) ? Number(row.correct_answer) : 0,
    explanation: String(row.explanation || ""),
    objective: String(row.objective || ""),
    resource_url: String(row.resource_url || ""),
    difficulty: (["foundation", "standard", "challenge"].includes(String(row.difficulty)) ? row.difficulty : "standard") as QuestionRow["difficulty"],
    source: (["manual", "ai", "legacy"].includes(String(row.source)) ? row.source : "manual") as QuestionRow["source"],
    status: (["draft", "approved", "archived"].includes(String(row.status)) ? row.status : "draft") as QuestionRow["status"]
  };
}

export default function QuestionBankEditor({ lessonId, userId, objectives = [], resources = [] }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const resourceOptions = resources.filter((resource) => typeof resource?.url === "string" && resource.url.trim());

  async function reload() {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("lesson_quiz_questions")
      .select(SELECT)
      .eq("lesson_id", lessonId)
      .order("created_at", { ascending: true });

    setLoading(false);
    if (loadError) {
      toast(loadError.message, "error");
      return;
    }
    setQuestions(((data || []) as Record<string, unknown>[]).map(normalizeRow));
  }

  useEffect(() => {
    void reload();
  }, [lessonId]);

  function updateQuestion(id: string, patch: Partial<QuestionRow>) {
    setQuestions((current) => current.map((question) => question.id === id ? { ...question, ...patch } : question));
  }

  function updateChoice(id: string, choiceIndex: number, value: string) {
    setQuestions((current) => current.map((question) => {
      if (question.id !== id) return question;
      const choices = [...question.choices];
      choices[choiceIndex] = value;
      return { ...question, choices };
    }));
  }

  async function addQuestion() {
    setBusyId("new");
    const { error: insertError } = await supabase.from("lesson_quiz_questions").insert({
      lesson_id: lessonId,
      prompt: "Nouvelle question a compléter",
      choices: ["Choix A", "Choix B", "Choix C"],
      correct_answer: 0,
      explanation: "",
      objective: objectives[0] || "",
      resource_url: resourceOptions[0]?.url || "",
      difficulty: "standard",
      source: "manual",
      status: "draft",
      created_by: userId,
      updated_by: userId
    });
    setBusyId("");
    if (insertError) {
      toast(insertError.message, "error");
      return;
    }
    await reload();
  }

  async function saveQuestion(question: QuestionRow) {
    const choices = question.choices.map((choice) => choice.trim());
    if (question.prompt.trim().length < 8 || choices.length < 2 || choices.some((choice) => !choice)) {
      toast("Complète l'énoncé et tous les choix avant d'enregistrer.", "error");
      return;
    }
    if (new Set(choices.map((choice) => choice.toLowerCase())).size !== choices.length) {
      toast("Les choix d'une question doivent être différents.", "error");
      return;
    }

    setBusyId(question.id);
    const { error: updateError } = await supabase
      .from("lesson_quiz_questions")
      .update({
        prompt: question.prompt.trim(),
        choices,
        correct_answer: Math.min(question.correct_answer, choices.length - 1),
        explanation: question.explanation.trim(),
        objective: question.objective.trim(),
        resource_url: question.resource_url.trim(),
        difficulty: question.difficulty,
        status: question.status,
        updated_by: userId
      })
      .eq("id", question.id);
    setBusyId("");
    if (updateError) {
      toast(updateError.message, "error");
      return;
    }
    toast("Question enregistree.", "success");
  }

  async function deleteQuestion(questionId: string) {
    if (!window.confirm("Supprimer cette question de la banque ?")) return;
    setBusyId(questionId);
    const { error: deleteError } = await supabase.from("lesson_quiz_questions").delete().eq("id", questionId);
    setBusyId("");
    if (deleteError) {
      toast(deleteError.message, "error");
      return;
    }
    setQuestions((current) => current.filter((question) => question.id !== questionId));
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-venite-italic text-[13px] text-white">BANQUE DE QUESTIONS</div>
          <p className="mt-1 font-body-readable text-[11px] text-[#777]">Chaque question doit verifier un objectif et s'appuyer sur une ressource de la lecon.</p>
        </div>
        <button type="button" onClick={addQuestion} disabled={busyId === "new"} className="btn-secondary inline-flex items-center gap-2 text-[11px]" style={{ padding: "9px 13px" }}>
          <iconify-icon icon="lucide:plus" style={{ fontSize: "12px" }} />
          Ajouter une question
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((item) => <div key={item} className="route-skeleton h-40 rounded-xl" />)}</div>
      ) : questions.length ? (
        <div className="space-y-4">
          {questions.map((question, questionIndex) => (
            <article key={question.id} className="rounded-xl border border-white/[0.07] bg-[#0d0d0d] p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-venite-italic text-[11px] text-blue-200">QUESTION {questionIndex + 1}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#666]">Source {question.source}</span>
              </div>

              <textarea className={`${INPUT} min-h-[72px]`} value={question.prompt} onChange={(event) => updateQuestion(question.id, { prompt: event.target.value })} aria-label={`Enonce de la question ${questionIndex + 1}`} />

              <div className="space-y-2">
                {question.choices.map((choice, choiceIndex) => (
                  <label key={`${question.id}-choice-${choiceIndex}`} className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                    <input type="radio" name={`correct-${question.id}`} checked={question.correct_answer === choiceIndex} onChange={() => updateQuestion(question.id, { correct_answer: choiceIndex })} />
                    <input className="min-w-0 flex-1 bg-transparent text-[11px] text-[#d1d1d1] outline-none" value={choice} onChange={(event) => updateChoice(question.id, choiceIndex, event.target.value)} aria-label={`Choix ${choiceIndex + 1}`} />
                    <span className="text-[9px] text-[#666]">{question.correct_answer === choiceIndex ? "Bonne réponse" : `Choix ${choiceIndex + 1}`}</span>
                  </label>
                ))}
              </div>

              <textarea className={`${INPUT} min-h-[64px]`} value={question.explanation} onChange={(event) => updateQuestion(question.id, { explanation: event.target.value })} placeholder="Explication pedagogique après correction" aria-label="Explication pedagogique" />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="space-y-1"><span className="text-[10px] text-[#777]">Objectif vérifie</span><select className={INPUT} value={question.objective} onChange={(event) => updateQuestion(question.id, { objective: event.target.value })}><option value="">Non rattache</option>{objectives.map((objective) => <option key={objective} value={objective}>{objective}</option>)}</select></label>
                <label className="space-y-1"><span className="text-[10px] text-[#777]">Ressource de référence</span><select className={INPUT} value={question.resource_url} onChange={(event) => updateQuestion(question.id, { resource_url: event.target.value })}><option value="">Non rattachee</option>{resourceOptions.map((resource) => <option key={resource.url} value={resource.url}>{resource.label || resource.url}</option>)}</select></label>
                <label className="space-y-1"><span className="text-[10px] text-[#777]">Difficulte</span><select className={INPUT} value={question.difficulty} onChange={(event) => updateQuestion(question.id, { difficulty: event.target.value as QuestionRow["difficulty"] })}><option value="foundation">Fondation</option><option value="standard">Standard</option><option value="challenge">Challenge</option></select></label>
                <label className="space-y-1"><span className="text-[10px] text-[#777]">Publication</span><select className={INPUT} value={question.status} onChange={(event) => updateQuestion(question.id, { status: event.target.value as QuestionRow["status"] })}><option value="draft">Brouillon</option><option value="approved">Validée</option><option value="archived">Archivee</option></select></label>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => saveQuestion(question)} disabled={busyId === question.id} className="btn-secondary text-[11px]" style={{ padding: "8px 12px" }}>Enregistrer</button>
                <button type="button" onClick={() => deleteQuestion(question.id)} disabled={busyId === question.id} className="px-2 py-1 text-[11px] text-red-400/80 hover:text-red-300">Supprimer</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/[0.1] px-4 py-8 text-center text-[12px] text-[#777] font-body-readable">Aucune question dans cette banque.</div>
      )}
    </section>
  );
}

