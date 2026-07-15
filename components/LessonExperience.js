"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CelebrationOverlay from "./effects/CelebrationOverlay";
import { playPop } from "./effects/sound";

const CLOSED_CELEBRATION = { open: false, variant: "success", title: "", message: "", xp: 0, ctaLabel: "", ctaAction: "", shareText: "" };

function LessonSteps({ hasQuiz, hasProject, quizDone, projectDone, completed }) {
  const steps = [
    { label: "Ressources", done: true },
    ...(hasQuiz ? [{ label: "Quiz", done: quizDone }] : []),
    ...(hasProject ? [{ label: "Micro-projet", done: projectDone }] : []),
    { label: "Validee", done: completed }
  ];

  const currentIndex = steps.findIndex((step) => !step.done);

  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-5">
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        return (
          <div key={step.label} className="flex items-center gap-1.5">
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors",
                step.done
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : isCurrent
                    ? "border-blue-500/35 bg-blue-500/10 text-blue-100 step-active"
                    : "border-white/[0.1] bg-white/[0.02] text-[#777]"
              ].join(" ")}
            >
              <iconify-icon icon={step.done ? "lucide:check" : isCurrent ? "lucide:dot" : "lucide:circle"} style={{ fontSize: "11px" }} />
              {step.label}
            </span>
            {index < steps.length - 1 ? <span className="h-px w-3 bg-white/[0.1]" /> : null}
          </div>
        );
      })}
    </div>
  );
}

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
  const [reviewStatus, setReviewStatus] = useState(initialProgress?.reviewStatus || "none");
  const [reviewFeedback, setReviewFeedback] = useState(initialProgress?.reviewFeedback || "");

  const validationMode = lesson.microProject?.validation || "auto";
  const isReviewMode = ["peer", "mentor", "ai"].includes(validationMode);

  const [status, setStatus] = useState(initialProgress?.status || "in_progress");
  const [xpAwarded, setXpAwarded] = useState(Number(initialProgress?.xpAwarded) || 0);
  const [celebration, setCelebration] = useState(CLOSED_CELEBRATION);

  function closeCelebration() {
    setCelebration((current) => ({ ...current, open: false }));
  }

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
        setCelebration({
          open: true,
          variant: "success",
          title: nextLessonSlug ? "Lecon validee !" : "Parcours termine !",
          message: nextLessonSlug
            ? "Bravo, tu progresses. Continue sur ta lancee !"
            : "Felicitations, tu as termine toutes les lecons de ce parcours !",
          xp: Number(data.xpAwarded) || 0,
          ctaLabel: nextLessonSlug ? "Lecon suivante" : "",
          ctaAction: nextLessonSlug ? "next" : "",
          shareText: nextLessonSlug
            ? `Je viens de valider la lecon "${lesson.title}" sur TakaCode ! 🚀`
            : "J'ai termine un parcours complet sur TakaCode ! 🏆"
        });
      } else if (data.passed) {
        setCelebration({
          open: true,
          variant: "success",
          title: "Quiz valide !",
          message: hasProject ? "Excellent. Termine le micro-projet pour valider la lecon." : "Excellent travail !",
          xp: 0,
          ctaLabel: "",
          ctaAction: ""
        });
      } else {
        setCelebration({
          open: true,
          variant: "fail",
          title: "Presque !",
          message: `Score ${data.score}/${data.total} — il te faut 70%. Relis les ressources et reessaie, tu y es presque !`,
          xp: 0,
          ctaLabel: "Reessayer",
          ctaAction: "retry"
        });
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
      if (data.reviewStatus) {
        setReviewStatus(data.reviewStatus);
      }

      if (data.status === "completed") {
        setStatus("completed");
        setReviewStatus("approved");
        setXpAwarded(Number(data.xpAwarded) || 0);
        router.refresh();
        setCelebration({
          open: true,
          variant: "success",
          title: nextLessonSlug ? "Lecon validee !" : "Parcours termine !",
          message: nextLessonSlug
            ? "Ton micro-projet est enregistre. Bravo, continue !"
            : "Felicitations, tu as termine tout le parcours !",
          xp: Number(data.xpAwarded) || 0,
          ctaLabel: nextLessonSlug ? "Lecon suivante" : "",
          ctaAction: nextLessonSlug ? "next" : "",
          shareText: nextLessonSlug
            ? `Je viens de valider la lecon "${lesson.title}" sur TakaCode ! 🚀`
            : "J'ai termine un parcours complet sur TakaCode ! 🏆"
        });
      } else if (data.reviewStatus === "pending") {
        playPop();
        setCelebration({
          open: true,
          variant: "success",
          title: "Soumis pour revue !",
          message:
            validationMode === "peer"
              ? "Un autre membre va relire ton travail et te donner un retour."
              : "Ton travail part en revue. Tu seras valide apres le retour.",
          xp: 0,
          ctaLabel: "",
          ctaAction: "",
          shareText: ""
        });
      } else {
        playPop();
        setCelebration({
          open: true,
          variant: "success",
          title: "Projet soumis !",
          message: hasQuiz && !quizPassed ? "Valide le quiz pour terminer la lecon." : "Beau travail, c'est enregistre.",
          xp: 0,
          ctaLabel: "",
          ctaAction: "",
          shareText: ""
        });
      }
    } catch {
      setProjectError(toErrorMessage("network"));
    } finally {
      setProjectSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <LessonSteps
        hasQuiz={hasQuiz}
        hasProject={hasProject}
        quizDone={quizPassed}
        projectDone={projectSubmitted}
        completed={isCompleted}
      />

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
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            <SectionTitle>MICRO PROJET</SectionTitle>
            {isReviewMode ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-200 -mt-3">
                {validationMode === "peer" ? "Revue par les pairs" : validationMode === "mentor" ? "Revue mentor" : "Validation IA"}
              </span>
            ) : null}
            {reviewStatus === "approved" || isCompleted ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 -mt-3">Valide</span>
            ) : projectSubmitted && !isReviewMode ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 -mt-3">Soumis</span>
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

            {isReviewMode && reviewStatus === "pending" ? (
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3.5 py-2.5 text-[12px] text-amber-100 font-body-readable inline-flex items-center gap-2">
                <iconify-icon icon="lucide:clock" style={{ fontSize: "14px" }} />
                {validationMode === "peer" ? "En attente d'une revue par les pairs." : "En attente d'une revue mentor."}
              </div>
            ) : null}

            {reviewStatus === "changes_requested" && reviewFeedback ? (
              <div className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-3.5 py-2.5">
                <div className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold mb-1 inline-flex items-center gap-1.5">
                  <iconify-icon icon="lucide:message-square" style={{ fontSize: "12px" }} />
                  Ameliorations demandees
                </div>
                <p className="font-body-readable text-[12px] text-blue-100/90 leading-relaxed">{reviewFeedback}</p>
              </div>
            ) : null}

            <textarea
              value={projectText}
              onChange={(event) => setProjectText(event.target.value)}
              rows={6}
              maxLength={5000}
              disabled={reviewStatus === "pending"}
              placeholder="Colle ici ton livrable : code, lien, description de ce que tu as construit..."
              className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 font-body-readable text-[12px] text-[#d0d0d0] leading-relaxed placeholder:text-[#555] focus:outline-none focus:border-blue-400/40 disabled:opacity-60"
            />

            {projectError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{projectError}</div>
            ) : null}

            {reviewStatus !== "pending" ? (
              <button
                type="button"
                onClick={submitProject}
                disabled={projectSubmitting || projectText.trim().length < 20}
                className={`btn-secondary inline-flex items-center gap-2 text-[12px] ${
                  projectSubmitting || projectText.trim().length < 20 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ padding: "10px 16px" }}
              >
                {projectSubmitting
                  ? "Envoi..."
                  : reviewStatus === "changes_requested"
                    ? "Re-soumettre"
                    : projectSubmitted
                      ? "Mettre a jour ma soumission"
                      : isReviewMode
                        ? "Soumettre pour revue"
                        : "Soumettre mon micro projet"}
                <iconify-icon icon="lucide:send" style={{ fontSize: "13px" }} />
              </button>
            ) : null}
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

      <CelebrationOverlay
        open={celebration.open}
        variant={celebration.variant}
        title={celebration.title}
        message={celebration.message}
        xp={celebration.xp}
        ctaLabel={celebration.ctaLabel}
        shareText={celebration.shareText}
        onClose={closeCelebration}
        onCta={() => {
          closeCelebration();
          if (celebration.ctaAction === "retry") {
            retryQuiz();
          } else if (celebration.ctaAction === "next" && nextLessonSlug) {
            router.push(`/parcours/${trackSlug}/lecon/${nextLessonSlug}`);
          }
        }}
      />
    </div>
  );
}
