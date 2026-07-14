"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ERROR_MESSAGES = {
  not_authenticated: "Ta session a expire. Reconnecte-toi pour continuer.",
  lesson_not_found: "Cette lecon n'est plus disponible.",
  module_locked: "Ce module est encore verrouille : termine d'abord les modules precedents.",
  invalid_answers: "Reponds a toutes les questions avant de valider.",
  submission_too_short: "Decris ton travail un peu plus en detail (20 caracteres minimum).",
  submission_too_long: "Ta soumission est trop longue (5000 caracteres maximum).",
  invalid_payload: "Requete invalide. Recharge la page et reessaie.",
  network: "Impossible de contacter le serveur. Verifie ta connexion et reessaie."
};

function toErrorMessage(code) {
  return ERROR_MESSAGES[code] || "Une erreur est survenue. Reessaie dans un instant.";
}

function SectionTitle({ children }) {
  return <h2 className="font-venite-italic text-[12px] tracking-widest text-[#4F8EF7] mb-3">{children}</h2>;
}

export default function LessonExperience({ lesson, trackSlug, previousLessonSlug, nextLessonSlug, nextLessonTitle }) {
  const router = useRouter();

  const initialProgress = lesson.progress || null;
  const hasQuiz = Array.isArray(lesson.quiz) && lesson.quiz.length > 0;
  const hasProject = Boolean(lesson.microProject);

  const [answers, setAnswers] = useState(() => new Array(hasQuiz ? lesson.quiz.length : 0).fill(null));
  const [quizResult, setQuizResult] = useState(null);
  const [quizPassed, setQuizPassed] = useState(Boolean(initialProgress?.quizPassed));
  const [quizError, setQuizError] = useState("");
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  const [projectText, setProjectText] = useState(initialProgress?.projectSubmission || "");
  const [projectSubmitted, setProjectSubmitted] = useState(Boolean(initialProgress?.projectSubmittedAt));
  const [projectError, setProjectError] = useState("");
  const [projectSubmitting, setProjectSubmitting] = useState(false);

  const [status, setStatus] = useState(initialProgress?.status || "in_progress");
  const [xpAwarded, setXpAwarded] = useState(Number(initialProgress?.xpAwarded) || 0);

  const isCompleted = status === "completed";
  const allAnswered = useMemo(() => answers.every((value) => value !== null), [answers]);

  function selectAnswer(questionIndex, choiceIndex) {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = choiceIndex;
      return next;
    });
  }

  async function submitQuiz() {
    if (!allAnswered || quizSubmitting) {
      return;
    }

    setQuizSubmitting(true);
    setQuizError("");

    try {
      const response = await fetch("/api/lessons/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, answers })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || data.error) {
        setQuizError(toErrorMessage(data?.error));
        return;
      }

      setQuizResult(data);
      setQuizPassed((current) => current || data.passed === true);

      if (data.status === "completed") {
        setStatus("completed");
        setXpAwarded(Number(data.xpAwarded) || 0);
        router.refresh();
      }
    } catch {
      setQuizError(toErrorMessage("network"));
    } finally {
      setQuizSubmitting(false);
    }
  }

  function retryQuiz() {
    setQuizResult(null);
    setQuizError("");
    setAnswers(new Array(lesson.quiz.length).fill(null));
  }

  async function submitProject() {
    if (projectSubmitting) {
      return;
    }

    setProjectSubmitting(true);
    setProjectError("");

    try {
      const response = await fetch("/api/lessons/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, submission: projectText })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || data.error) {
        setProjectError(toErrorMessage(data?.error));
        return;
      }

      setProjectSubmitted(true);

      if (data.status === "completed") {
        setStatus("completed");
        setXpAwarded(Number(data.xpAwarded) || 0);
        router.refresh();
      }
    } catch {
      setProjectError(toErrorMessage("network"));
    } finally {
      setProjectSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {isCompleted ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <iconify-icon icon="lucide:badge-check" style={{ fontSize: "18px", color: "#6ee7b7" }} />
            <span className="font-body-readable text-[12px] text-emerald-100">
              Lecon validee{xpAwarded > 0 ? ` : +${xpAwarded} XP gagnes` : ""}
            </span>
          </div>
          {nextLessonSlug ? (
            <Link
              href={`/parcours/${trackSlug}/lecon/${nextLessonSlug}`}
              className="btn-secondary inline-flex items-center gap-2 text-[12px]"
              style={{ padding: "9px 14px" }}
            >
              Lecon suivante{nextLessonTitle ? ` : ${nextLessonTitle}` : ""}
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
            </Link>
          ) : (
            <Link
              href={`/parcours/${trackSlug}`}
              className="btn-secondary inline-flex items-center gap-2 text-[12px]"
              style={{ padding: "9px 14px" }}
            >
              Parcours termine, retour au programme
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
            </Link>
          )}
        </div>
      ) : null}

      <div className="space-y-4">
        {lesson.intro ? (
          <p className="font-body-readable text-[13px] text-[#a5a5a5] leading-relaxed">{lesson.intro}</p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lesson.whyImportant ? (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-2">POURQUOI C'EST IMPORTANT</div>
              <p className="font-body-readable text-[12px] text-[#b3b3b3] leading-relaxed">{lesson.whyImportant}</p>
            </div>
          ) : null}
          {lesson.howToUse ? (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="font-venite-italic text-[11px] tracking-widest text-[#888] mb-2">COMMENT TRAVAILLER CETTE LECON</div>
              <p className="font-body-readable text-[12px] text-[#b3b3b3] leading-relaxed">{lesson.howToUse}</p>
            </div>
          ) : null}
        </div>

        {lesson.objectives.length ? (
          <div>
            <SectionTitle>OBJECTIFS</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lesson.objectives.map((objective) => (
                <div
                  key={`objective-${objective}`}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200 inline-flex items-center justify-center">
                    <iconify-icon icon="lucide:target" style={{ fontSize: "11px" }} />
                  </span>
                  <span className="font-body-readable text-[11px] text-[#c7c7c7] leading-snug">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {lesson.resources.length ? (
        <div>
          <SectionTitle>RESSOURCES SELECTIONNEES</SectionTitle>
          <div className="space-y-2.5">
            {lesson.resources.map((resource) => (
              <a
                key={`resource-${resource.url}`}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 card-hover"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <iconify-icon
                    icon={resource.kind === "video" ? "lucide:play-circle" : resource.kind === "tool" ? "lucide:wrench" : resource.kind === "repo" ? "lucide:github" : "lucide:file-text"}
                    style={{ fontSize: "14px", color: "#89c7ff" }}
                  />
                  <span className="font-body-readable text-[12px] text-white font-semibold">{resource.label}</span>
                  <iconify-icon icon="lucide:external-link" style={{ fontSize: "11px", color: "#666" }} />
                </div>
                {resource.why ? (
                  <p className="font-body-readable text-[11px] text-[#9b9b9b] leading-snug mb-1">
                    <span className="text-[#7a7a7a]">Pourquoi : </span>
                    {resource.why}
                  </p>
                ) : null}
                {resource.how ? (
                  <p className="font-body-readable text-[11px] text-[#9b9b9b] leading-snug">
                    <span className="text-[#7a7a7a]">Comment : </span>
                    {resource.how}
                  </p>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {hasQuiz ? (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <SectionTitle>MINI QUIZ</SectionTitle>
            {quizPassed ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 -mt-3">
                Quiz valide
              </span>
            ) : null}
          </div>

          {quizPassed && !quizResult ? (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 font-body-readable text-[12px] text-[#b3b3b3]">
              Tu as deja valide ce quiz
              {initialProgress?.quizTotal ? ` (${initialProgress.quizScore}/${initialProgress.quizTotal})` : ""}.
            </div>
          ) : (
            <div className="space-y-3">
              {lesson.quiz.map((question, questionIndex) => {
                const feedback = quizResult?.feedback?.[questionIndex] || null;

                return (
                  <div key={`quiz-${questionIndex}`} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <div className="font-body-readable text-[12px] text-white mb-3">
                      {questionIndex + 1}. {question.question}
                    </div>
                    <div className="space-y-2">
                      {question.choices.map((choice, choiceIndex) => {
                        const isSelected = answers[questionIndex] === choiceIndex;
                        const isCorrectChoice = feedback && feedback.answer === choiceIndex;
                        const isWrongSelection = feedback && isSelected && !feedback.correct;

                        return (
                          <button
                            key={`quiz-${questionIndex}-choice-${choiceIndex}`}
                            type="button"
                            disabled={Boolean(quizResult) || quizSubmitting}
                            onClick={() => selectAnswer(questionIndex, choiceIndex)}
                            className={`w-full text-left rounded-lg border px-3 py-2.5 font-body-readable text-[11px] leading-snug transition-colors ${
                              isCorrectChoice
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                                : isWrongSelection
                                  ? "border-red-500/40 bg-red-500/10 text-red-200"
                                  : isSelected
                                    ? "border-blue-400/40 bg-blue-500/10 text-blue-100"
                                    : "border-white/[0.08] bg-[#0f0f0f] text-[#c7c7c7]"
                            }`}
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                    {feedback?.explanation ? (
                      <p className="font-body-readable text-[11px] text-[#9b9b9b] leading-snug mt-2.5">{feedback.explanation}</p>
                    ) : null}
                  </div>
                );
              })}

              {quizError ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{quizError}</div>
              ) : null}

              {quizResult ? (
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border ${
                      quizResult.passed
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-100"
                    }`}
                  >
                    Score : {quizResult.score}/{quizResult.total}
                    {quizResult.passed ? " - quiz valide" : " - 70% requis"}
                  </span>
                  {!quizResult.passed ? (
                    <button
                      type="button"
                      onClick={retryQuiz}
                      className="btn-secondary inline-flex items-center gap-2 text-[12px]"
                      style={{ padding: "9px 14px" }}
                    >
                      Reessayer
                      <iconify-icon icon="lucide:rotate-ccw" style={{ fontSize: "13px" }} />
                    </button>
                  ) : null}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={submitQuiz}
                  disabled={!allAnswered || quizSubmitting}
                  className={`btn-secondary inline-flex items-center gap-2 text-[12px] ${
                    !allAnswered || quizSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{ padding: "10px 16px" }}
                >
                  {quizSubmitting ? "Correction..." : "Valider mes reponses"}
                  <iconify-icon icon="lucide:check" style={{ fontSize: "13px" }} />
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}

      {hasProject ? (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <SectionTitle>MICRO PROJET</SectionTitle>
            {projectSubmitted ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 -mt-3">
                Soumis
              </span>
            ) : null}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
            <div>
              <div className="font-body-readable text-[12px] text-white font-semibold mb-1">{lesson.microProject.title}</div>
              {lesson.microProject.brief ? (
                <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed">{lesson.microProject.brief}</p>
              ) : null}
            </div>

            {lesson.microProject.steps.length ? (
              <div className="space-y-2">
                {lesson.microProject.steps.map((step, stepIndex) => (
                  <div key={`project-step-${step}`} className="flex items-center gap-2.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200 text-[10px] font-semibold">
                      {stepIndex + 1}
                    </span>
                    <span className="font-body-readable text-[11px] text-[#c7c7c7] leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {lesson.microProject.deliverable ? (
              <p className="font-body-readable text-[11px] text-[#9b9b9b] leading-snug">
                <span className="text-[#7a7a7a]">Livrable attendu : </span>
                {lesson.microProject.deliverable}
              </p>
            ) : null}

            <textarea
              value={projectText}
              onChange={(event) => setProjectText(event.target.value)}
              rows={6}
              maxLength={5000}
              placeholder="Colle ici ton livrable : code, lien, description de ce que tu as construit..."
              className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 font-body-readable text-[12px] text-[#d0d0d0] leading-relaxed placeholder:text-[#555] focus:outline-none focus:border-blue-400/40"
            />

            {projectError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{projectError}</div>
            ) : null}

            <button
              type="button"
              onClick={submitProject}
              disabled={projectSubmitting || projectText.trim().length < 20}
              className={`btn-secondary inline-flex items-center gap-2 text-[12px] ${
                projectSubmitting || projectText.trim().length < 20 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ padding: "10px 16px" }}
            >
              {projectSubmitting ? "Envoi..." : projectSubmitted ? "Mettre a jour ma soumission" : "Soumettre mon micro projet"}
              <iconify-icon icon="lucide:send" style={{ fontSize: "13px" }} />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2.5 flex-wrap pt-2">
        {previousLessonSlug ? (
          <Link
            href={`/parcours/${trackSlug}/lecon/${previousLessonSlug}`}
            className="btn-secondary inline-flex items-center gap-2 text-[12px]"
            style={{ padding: "9px 14px" }}
          >
            <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "13px" }} />
            Lecon precedente
          </Link>
        ) : (
          <span />
        )}

        {isCompleted && nextLessonSlug ? (
          <Link
            href={`/parcours/${trackSlug}/lecon/${nextLessonSlug}`}
            className="btn-secondary inline-flex items-center gap-2 text-[12px]"
            style={{ padding: "9px 14px" }}
          >
            Lecon suivante
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
