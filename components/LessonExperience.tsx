"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import type { Lesson } from "../lib/curriculum";
import CelebrationOverlay from "./effects/CelebrationOverlay";
import { GlossaryText } from "./GlossaryTooltip";
import { playPop } from "./effects/sound";
import CodeEditor from "./CodeEditor";
import { useToast } from "./Toast";

interface LessonQuizQuestion {
  question: string;
  choices: string[];
}

interface LessonMicroProject {
  title: string;
  brief?: string;
  steps: string[];
  deliverable?: string;
  validation?: string;
}

interface LessonResource {
  url: string;
  kind: string;
  label: string;
  why?: string;
  how?: string;
}

interface LessonProgress {
  status?: string;
  quizPassed?: boolean;
  projectSubmission?: string;
  projectSubmittedAt?: string;
  reviewStatus?: string;
  reviewFeedback?: string;
  xpAwarded?: number;
  quizScore?: number;
  quizTotal?: number;
}

interface LessonData {
  id: string;
  title: string;
  intro?: string;
  whyImportant?: string;
  howToUse?: string;
  objectives: string[];
  resources: LessonResource[];
  quiz?: LessonQuizQuestion[];
  microProject?: LessonMicroProject;
  progress?: LessonProgress;
}

interface Props {
  lesson: Lesson;
  trackSlug: string;
  previousLessonSlug: string;
  nextLessonSlug: string;
  nextLessonTitle: string;
}

interface QuizFeedbackItem {
  correctChoice?: string;
  correct: boolean;
  explanation?: string;
}

interface QuizApiResponse {
  passed?: boolean;
  score?: number;
  total?: number;
  status?: string;
  xpAwarded?: number;
  feedback?: QuizFeedbackItem[];
  error?: string;
}

interface ProjectApiResponse {
  error?: string;
  status?: string;
  reviewStatus?: string;
  reviewFeedback?: string;
  xpAwarded?: number;
  aiReview?: {
    available?: boolean;
    failed?: boolean;
    feedback?: string;
  };
}

interface CelebrationState {
  open: boolean;
  variant: "success" | "fail";
  title: string;
  message: string;
  xp: number;
  ctaLabel: string;
  ctaAction: string;
  shareText: string;
}

interface WhyImportantItem {
  label: string;
  detail: string;
}

const CLOSED_CELEBRATION: CelebrationState = { open: false, variant: "success", title: "", message: "", xp: 0, ctaLabel: "", ctaAction: "", shareText: "" };

function LessonSteps({ hasQuiz, hasProject, quizDone, projectDone, completed }: { hasQuiz: boolean; hasProject: boolean; quizDone: boolean; projectDone: boolean; completed: boolean }) {
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

const ERROR_MESSAGES: Record<string, string> = {
  not_authenticated: "Ta session a expiré. Reconnecte-toi pour continuer.",
  lesson_not_found: "Cette leçon n'est plus disponible.",
  module_locked: "Ce module est encore verrouillé : termine d'abord les modules précédents.",
  invalid_answers: "Réponds à toutes les questions avant de valider.",
  submission_too_short: "Décris ton travail un peu plus en détail (20 caractères minimum).",
  submission_too_long: "Ta soumission est trop longue (5000 caractères maximum).",
  invalid_payload: "Requête invalide. Recharge la page et réessaie.",
  network: "Impossible de contacter le serveur. Vérifie ta connexion et réessaie."
};

function toErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || "Une erreur est survenue. Réessaie dans un instant.";
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-venite-italic text-[12px] tracking-widest text-[#4F8EF7] mb-3">{children}</h2>;
}

export default function LessonExperience({ lesson, trackSlug, previousLessonSlug, nextLessonSlug, nextLessonTitle }: Props) {
  const router = useRouter();
  const supabaseClient = useMemo(() => createClient(), []);
  const { toast } = useToast();

  const initialProgress = lesson.progress || null;
  const hasQuiz = Array.isArray(lesson.quiz) && lesson.quiz.length > 0;
  const hasProject = Boolean(lesson.microProject);

  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(hasQuiz ? lesson.quiz!.length : 0).fill(null));
  const [quizResult, setQuizResult] = useState<QuizApiResponse | null>(null);
  const [quizPassed, setQuizPassed] = useState<boolean>(Boolean(initialProgress?.quizPassed));
  const [quizError, setQuizError] = useState<string>("");
  const [quizSubmitting, setQuizSubmitting] = useState<boolean>(false);

  const initialSubmission = useMemo(() => {
    if (!initialProgress?.projectSubmission) return { code: "", link: "", fileUrl: "", fileName: "" };
    try {
      const parsed = JSON.parse(initialProgress.projectSubmission);
      if (parsed && typeof parsed === "object" && "code" in parsed) return parsed;
    } catch {}
    return { code: initialProgress.projectSubmission, link: "", fileUrl: "", fileName: "" };
  }, [initialProgress?.projectSubmission]);
  const [projectText, setProjectText] = useState<string>(initialSubmission.code);
  const [projectLink, setProjectLink] = useState<string>(initialSubmission.link);
  const [projectFileUrl, setProjectFileUrl] = useState<string>(initialSubmission.fileUrl);
  const [projectFileName, setProjectFileName] = useState<string>(initialSubmission.fileName);
  const [projectSubmitted, setProjectSubmitted] = useState<boolean>(Boolean(initialProgress?.projectSubmittedAt));
  const [projectError, setProjectError] = useState<string>("");
  const [projectSubmitting, setProjectSubmitting] = useState<boolean>(false);
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const [reviewStatus, setReviewStatus] = useState<string>(initialProgress?.reviewStatus || "none");
  const [reviewFeedback, setReviewFeedback] = useState<string>(initialProgress?.reviewFeedback || "");

  const validationMode = lesson.microProject?.validation || "auto";
  const isReviewMode = ["peer", "mentor", "ai"].includes(validationMode);

  const [status, setStatus] = useState<string>(initialProgress?.status || "in_progress");
  const [xpAwarded, setXpAwarded] = useState<number>(Number(initialProgress?.xpAwarded) || 0);
  const [celebration, setCelebration] = useState<CelebrationState>(CLOSED_CELEBRATION);
  const [failCount, setFailCount] = useState<number>(0);
  const [bankQuestions, setBankQuestions] = useState<{ id: string; prompt: string; choices: string[] }[] | null>(null);
  const [bankQuestionsLoading, setBankQuestionsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!hasQuiz) {
      setBankQuestionsLoading(false);
      return;
    }
    let cancelled = false;
    async function loadQuestions() {
      try {
        const res = await fetch(`/api/lessons/quiz-questions?lessonId=${lesson.id}`);
        const data = await res.json();
        if (!cancelled && data.questions && data.questions.length > 0) {
          setBankQuestions(data.questions);
        }
      } catch {
        // Fall back to legacy quiz JSON
      } finally {
        if (!cancelled) setBankQuestionsLoading(false);
      }
    }
    loadQuestions();
    return () => { cancelled = true; };
  }, [lesson.id, hasQuiz]);

  const displayQuestions = useMemo(() => {
    if (bankQuestions && bankQuestions.length > 0) return bankQuestions;
    if (lesson.quiz && lesson.quiz.length > 0) return lesson.quiz;
    return null;
  }, [bankQuestions, lesson.quiz]);

  // Reset answers when displayQuestions changes
  useEffect(() => {
    if (displayQuestions && displayQuestions.length !== answers.length) {
      setAnswers(new Array(displayQuestions.length).fill(null));
    }
  }, [displayQuestions?.length]);

  function parseWhyImportant(text: string): WhyImportantItem[] {
    if (!text) return [];
    const segments = text.split(/[.]+\s*/).filter((s) => s.trim().length > 0);
    return segments.map((s) => {
      const colonIdx = s.indexOf(":");
      if (colonIdx > 0) {
        return { label: s.slice(0, colonIdx).trim(), detail: s.slice(colonIdx + 1).trim() };
      }
      return { label: "", detail: s.trim() };
    });
  }

  function parseHowToUse(text: string): string[] {
    if (!text) return [];
    const raw = text
      .replace(/puis/gi, "\n")
      .split(/[\n.]+\s*/)
      .filter((s) => s.trim().length > 0);
    return raw.map((s) => s.trim());
  }

  function closeCelebration() {
    setCelebration((current) => ({ ...current, open: false }));
    router.refresh();
  }

  const isCompleted = status === "completed";
  const awaitingReview = isReviewMode && projectSubmitted && !isCompleted;
  const allAnswered = useMemo(() => {
    if (!displayQuestions) return false;
    return answers.every((value) => value !== null);
  }, [answers, displayQuestions]);

  function selectAnswer(questionIndex: number, choiceIndex: number) {
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
      const useBank = bankQuestions && bankQuestions.length > 0;
      const response = await fetch("/api/lessons/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          answers: useBank
            ? answers.map((choiceIndex, questionIndex) => {
                const q = bankQuestions[questionIndex];
                return choiceIndex === null
                  ? { questionId: q.id, choice: "" }
                  : { questionId: q.id, choice: q.choices[choiceIndex] };
              })
            : answers.map((choiceIndex, questionIndex) =>
                choiceIndex === null ? null : lesson.quiz[questionIndex]?.choices[choiceIndex] || null
              )
        })
      });

      const data: QuizApiResponse | null = await response.json().catch(() => null);

      if (!response.ok || !data || data.error) {
        setQuizError(toErrorMessage(data?.error || ""));
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
          title: nextLessonSlug ? "LECON VALIDEE !" : "PARCOURS TERMINE !",
          message: nextLessonSlug
            ? "Bravo, tu progresses. Continue sur ta lancée !"
            : "Félicitations, tu as terminé toutes les leçons de ce parcours !",
          xp: Number(data.xpAwarded) || 0,
          ctaLabel: nextLessonSlug ? "Leçon suivante" : "",
          ctaAction: nextLessonSlug ? "next" : "",
          shareText: nextLessonSlug
            ? `Je viens de valider la leçon "${lesson.title}" sur TakaCode ! 🚀`
            : "J'ai terminé un parcours complet sur TakaCode ! 🏆"
        });
      } else if (data.passed) {
        setCelebration({
          open: true,
          variant: "success",
          title: "QUIZ VALIDE !",
          message: hasProject ? "Excellent. Termine le micro-projet pour valider la leçon." : "Excellent travail !",
          xp: 0,
          ctaLabel: "",
          ctaAction: "",
          shareText: ""
        });
      } else {
        const newFailCount = failCount + 1;
        setFailCount(newFailCount);

        const failMessages = [
          `Score ${data.score}/${data.total} — il te faut 70%. Relis les ressources et réessaie, tu y es presque !`,
          `Score ${data.score}/${data.total} — Concentre-toi sur les notions clés dans les ressources ci-dessous.`,
          `Score ${data.score}/${data.total} — Les réponses justes sont surlignées en vert. Inspire-t-en pour le prochain essai.`
        ];
        const failMessage = failMessages[Math.min(newFailCount - 1, failMessages.length - 1)];

        setCelebration({
          open: true,
          variant: "fail",
          title: newFailCount >= 3 ? "NE LACHE PAS !" : "PRESQUE !",
          message: failMessage + (lesson.resources.length ? " N'hésite pas à rouvrir les ressources." : ""),
          xp: 0,
          ctaLabel: "Réessayer",
          ctaAction: "retry",
          shareText: ""
        });
      }
    } catch {
      setQuizError(toErrorMessage("network"));
    } finally {
      setQuizSubmitting(false);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast("Le fichier depasse 5 Mo.", "error");
      return;
    }

    setFileUploading(true);
    try {
      const userId = (await supabaseClient.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("Non connecte");
      const ext = file.name.split(".").pop() || "";
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabaseClient.storage.from("project-files").upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabaseClient.storage.from("project-files").getPublicUrl(fileName);
      setProjectFileUrl(publicUrl);
      setProjectFileName(file.name);
      toast("Fichier uploade.", "success");
    } catch (err) {
      toast("Echec de l'upload.", "error");
    }
    setFileUploading(false);
    event.target.value = "";
  }

  function retryQuiz() {
    setQuizResult(null);
    setQuizError("");
    if (displayQuestions) {
      setAnswers(new Array(displayQuestions.length).fill(null));
    }
  }

  async function submitProject() {
    if (projectSubmitting) {
      return;
    }

    setProjectSubmitting(true);
    setProjectError("");

    const submissionPayload = JSON.stringify({
      code: projectText.trim(),
      link: projectLink.trim(),
      fileUrl: projectFileUrl,
      fileName: projectFileName
    });

    try {
      const response = await fetch("/api/lessons/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, submission: submissionPayload })
      });

      const data: ProjectApiResponse | null = await response.json().catch(() => null);

      if (!response.ok || !data || data.error) {
        setProjectError(toErrorMessage(data?.error || ""));
        return;
      }

      setProjectSubmitted(true);
      if (data.reviewStatus) {
        setReviewStatus(data.reviewStatus);
      }
      if (data.reviewFeedback) {
        setReviewFeedback(data.reviewFeedback);
      }

      if (data.status === "completed") {
        setStatus("completed");
        setReviewStatus("approved");
        setXpAwarded(Number(data.xpAwarded) || 0);

        const isAI = data.aiReview?.available === true;
        const aiComment = data.aiReview?.feedback || "";
        const successMessage = nextLessonSlug
          ? "Ton micro-projet est enregistré. Bravo, continue !"
          : "Félicitations, tu as terminé tout le parcours !";
        const messageWithAI = isAI && aiComment
          ? `L'IA a validé ton travail.\n\n${aiComment}\n\n${successMessage}`
          : successMessage;

        setCelebration({
          open: true,
          variant: "success",
          title: nextLessonSlug ? "LECON VALIDEE !" : "PARCOURS TERMINE !",
          message: messageWithAI,
          xp: Number(data.xpAwarded) || 0,
          ctaLabel: nextLessonSlug ? "Leçon suivante" : "",
          ctaAction: nextLessonSlug ? "next" : "",
          shareText: nextLessonSlug
            ? `Je viens de valider la leçon "${lesson.title}" sur TakaCode ! 🚀`
            : "J'ai terminé un parcours complet sur TakaCode ! 🏆"
        });
      } else if (data.reviewStatus === "changes_requested") {
        playPop();
        const aiComment = data.reviewFeedback || data.aiReview?.feedback || "";
        const baseMessage = "Des améliorations ont été demandées. ";

        let message: string;
        if (data.aiReview?.available === false) {
          message = "L'IA n'est pas disponible. Ton projet est en attente de validation manuelle par un pair ou un mentor. Tu peux continuer en attendant.";
        } else if (aiComment) {
          message = `${baseMessage}\n\n${aiComment}`;
        } else {
          message = `${baseMessage}Retraite ton projet en fonction des remarques et re-soumets.`;
        }

        setCelebration({
          open: true,
          variant: "fail",
          title: "AMELIORATIONS DEMANDEES",
          message,
          xp: 0,
          ctaLabel: "",
          ctaAction: "",
          shareText: ""
        });
      } else if (data.reviewStatus === "pending") {
        playPop();
        const isAI = data.aiReview?.available === true;
        const isUnavailable = data.aiReview?.available === false;

        let title: string, message: string;
        if (isUnavailable) {
          title = "En attente de revue";
          message = (data.aiReview?.failed
            ? "La review IA n'a pas abouti (service surchargé ou momentanément indisponible). Ton projet part en revue manuelle par un pair ou un mentor. "
            : "L'IA n'est pas disponible. Ton projet est en attente de validation manuelle par un pair ou un mentor. ") +
            (nextLessonSlug
              ? "Pas besoin d'attendre : continue la suite, l'XP arrive une fois validé."
              : "Tu recevras l'XP une fois le retour validé.");
        } else if (validationMode === "peer") {
          title = "Soumis pour revue !";
          message = "Un autre membre va relire ton travail et te donner un retour. " +
            (nextLessonSlug
              ? "Pas besoin d'attendre : continue la suite, l'XP arrive une fois validé."
              : "Tu recevras l'XP une fois le retour validé.");
        } else {
          title = "Soumis pour revue !";
          message = "Ton travail part en revue. " +
            (nextLessonSlug
              ? "Pas besoin d'attendre : continue la suite, l'XP arrive une fois validé."
              : "Tu recevras l'XP une fois le retour validé.");
        }

        setCelebration({
          open: true,
          variant: "success",
          title,
          message,
          xp: 0,
          ctaLabel: nextLessonSlug ? "Continuer" : "",
          ctaAction: nextLessonSlug ? "next" : "",
          shareText: ""
        });
      } else {
        playPop();
        setCelebration({
          open: true,
          variant: "success",
          title: "Projet soumis !",
          message: hasQuiz && !quizPassed ? "Valide le quiz pour terminer la leçon." : "Beau travail, c'est enregistré.",
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
              Leçon validée{xpAwarded > 0 ? ` : +${xpAwarded} XP gagnés` : ""}
            </span>
          </div>
          {nextLessonSlug ? (
            <Link
              href={`/parcours/${trackSlug}/lecon/${nextLessonSlug}`}
              className="btn-secondary inline-flex items-center gap-2 text-[12px]"
              style={{ padding: "9px 14px" }}
            >
              Leçon suivante{nextLessonTitle ? ` : ${nextLessonTitle}` : ""}
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
            </Link>
          ) : (
            <Link
              href={`/parcours/${trackSlug}`}
              className="btn-secondary inline-flex items-center gap-2 text-[12px]"
              style={{ padding: "9px 14px" }}
            >
              Parcours terminé, retour au programme
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
            </Link>
          )}
        </div>
      ) : awaitingReview ? (
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <iconify-icon icon="lucide:hourglass" style={{ fontSize: "18px", color: "#c4b5fd" }} />
            <span className="font-body-readable text-[12px] text-violet-100">
              {reviewStatus === "changes_requested"
                ? "Des améliorations ont été demandées sur ce micro-projet. Tu peux continuer en attendant de le retravailler."
                : "Micro-projet envoyé en revue. Tu peux continuer : l'XP et la validation arrivent après l'approbation."}
            </span>
          </div>
          {nextLessonSlug ? (
            <Link
              href={`/parcours/${trackSlug}/lecon/${nextLessonSlug}`}
              className="btn-secondary inline-flex items-center gap-2 text-[12px]"
              style={{ padding: "9px 14px" }}
            >
              Continuer{nextLessonTitle ? ` : ${nextLessonTitle}` : ""}
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-4">
        {lesson.intro ? (
          <GlossaryText as="p" className="font-body-readable text-[13px] text-[#a5a5a5] leading-relaxed" text={lesson.intro} />
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lesson.whyImportant ? (() => {
            const whyItems = parseWhyImportant(lesson.whyImportant);
            return (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 transition-colors duration-200 hover:border-amber-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <iconify-icon icon="lucide:lightbulb" style={{ fontSize: "15px", color: "#fbbf24" }} />
                  <div className="font-venite-italic text-[11px] tracking-widest text-amber-200/80">POURQUOI C'EST IMPORTANT</div>
                </div>
                <div className="space-y-2">
                  {whyItems.map((item, idx) => (
                    <div key={`why-${idx}`} className="flex items-start gap-2 leading-snug">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-amber-200/70 text-[8px] font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="font-body-readable text-[11px] text-[#c7c7c7] leading-snug">
                        {item.label ? (
                          <><span className="text-amber-100 font-semibold">{item.label}</span> : <GlossaryText text={item.detail} as="span" /></>
                        ) : (
                          <GlossaryText text={item.detail} as="span" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })() : null}
          {lesson.howToUse ? (() => {
            const howSteps = parseHowToUse(lesson.howToUse);
            return (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-4 transition-colors duration-200 hover:border-blue-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <iconify-icon icon="lucide:list-checks" style={{ fontSize: "15px", color: "#6ec3ff" }} />
                  <div className="font-venite-italic text-[11px] tracking-widest text-blue-200/80">COMMENT TRAVAILLER</div>
                </div>
                <div className="space-y-2.5">
                  {howSteps.map((step, idx) => (
                    <div key={`how-${idx}`} className="flex items-start gap-2.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200 text-[9px] font-semibold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <GlossaryText as="span" className="font-body-readable text-[11px] text-[#c7c7c7] leading-snug pt-0.5" text={step} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })() : null}
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

      {hasQuiz && displayQuestions ? (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <SectionTitle>MINI QUIZ</SectionTitle>
            {bankQuestions ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 -mt-3">
                Banque de questions
              </span>
            ) : null}
            {quizPassed ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 -mt-3">
                Quiz valide
              </span>
            ) : null}
          </div>

          {bankQuestionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 animate-pulse">
                  <div className="h-3 w-3/4 bg-white/[0.06] rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-8 bg-white/[0.04] rounded-lg" />
                    <div className="h-8 bg-white/[0.04] rounded-lg w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : quizPassed && !quizResult ? (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 font-body-readable text-[12px] text-[#b3b3b3]">
              Tu as déjà validé ce quiz
              {initialProgress?.quizTotal ? ` (${initialProgress.quizScore}/${initialProgress.quizTotal})` : ""}.
            </div>
          ) : (
            <div className="space-y-3">
              {displayQuestions.map((question, questionIndex) => {
                const feedback = quizResult?.feedback?.[questionIndex] || null;
                const prompt = (question as { prompt?: string; question?: string }).prompt || (question as { question?: string }).question || "";

                return (
                  <div key={`quiz-${questionIndex}`} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <div className="font-body-readable text-[12px] text-white mb-3">
                      {questionIndex + 1}. {prompt}
                    </div>
                    <div className="space-y-2">
                      {question.choices.map((choice: string, choiceIndex: number) => {
                        const isSelected = answers[questionIndex] === choiceIndex;
                        const isCorrectChoice = feedback && feedback.correctChoice === choice;
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
                      Réessayer
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
                  {quizSubmitting ? "Correction..." : "Valider mes réponses"}
                  <iconify-icon icon="lucide:check" style={{ fontSize: "13px" }} />
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}

      {hasProject ? (
        <div>
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">              <SectionTitle>MICRO PROJET</SectionTitle>
            {isReviewMode ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-200 -mt-3">
                {validationMode === "peer" ? "Revue par les pairs" : validationMode === "mentor" ? "Revue mentor" : "Validation IA"}
              </span>
            ) : null}
            {reviewStatus === "changes_requested" ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-100 -mt-3">Améliorations demandées</span>
            ) : null}
            {reviewStatus === "approved" || isCompleted ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 -mt-3">Valide</span>
            ) : projectSubmitted && !isReviewMode ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 -mt-3">Soumis</span>
            ) : null}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
            <div>
              <div className="font-body-readable text-[12px] text-white font-semibold mb-1">{lesson.microProject!.title}</div>
              {lesson.microProject!.brief ? (
                <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed">{lesson.microProject!.brief}</p>
              ) : null}
            </div>

            {lesson.microProject!.steps.length ? (
              <div className="space-y-2">
                {lesson.microProject!.steps.map((step, stepIndex) => (
                  <div key={`project-step-${step}`} className="flex items-center gap-2.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200 text-[10px] font-semibold">
                      {stepIndex + 1}
                    </span>
                    <span className="font-body-readable text-[11px] text-[#c7c7c7] leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {lesson.microProject!.deliverable ? (
              <p className="font-body-readable text-[11px] text-[#9b9b9b] leading-snug">
                <span className="text-[#7a7a7a]">Livrable attendu : </span>
                {lesson.microProject!.deliverable}
              </p>
            ) : null}

            {isReviewMode && reviewStatus === "pending" ? (
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3.5 py-2.5 text-[12px] text-amber-100 font-body-readable inline-flex items-center gap-2">
                <iconify-icon icon="lucide:clock" style={{ fontSize: "14px" }} />
                {validationMode === "ai"
                  ? "En attente de revue IA ou manuelle."
                  : validationMode === "peer"
                    ? "En attente d'une revue par les pairs."
                    : "En attente d'une revue mentor."}
              </div>
            ) : null}

            {reviewStatus === "changes_requested" && reviewFeedback ? (
              <div className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-3.5 py-2.5">
                <div className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold mb-1 inline-flex items-center gap-1.5">
                  <iconify-icon icon="lucide:message-square" style={{ fontSize: "12px" }} />
                  Améliorations demandées
                </div>
                <p className="font-body-readable text-[12px] text-blue-100/90 leading-relaxed">{reviewFeedback}</p>
              </div>
            ) : null}

            <CodeEditor
              value={projectText}
              onChange={setProjectText}
              language={lesson.microProject?.validation === "ai" ? "html" : "text"}
              minHeight="150px"
              placeholder="Colle ici ton code, ta description, ou tout livrable texte..."
              readOnly={reviewStatus === "pending"}
              maxLength={5000}
            />

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-[#666] uppercase tracking-widest font-semibold">Lien (optionnel)</label>
                <input
                  value={projectLink}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectLink(e.target.value)}
                  placeholder="https://github.com/ton-repo, https://ton-site.com..."
                  disabled={reviewStatus === "pending"}
                  className="w-full mt-1 rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2 font-body-readable text-[12px] text-[#d0d0d0] placeholder:text-[#555] focus:outline-none focus:border-blue-400/40 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.08] bg-[#0f0f0f] text-[11px] text-[#aaa] cursor-pointer hover:border-blue-400/40 transition-all disabled:opacity-60">
                <iconify-icon icon="lucide:upload" style={{ fontSize: "13px" }} />
                {fileUploading ? "Upload..." : "Joindre un fichier"}
                <input type="file" onChange={handleFileUpload} disabled={reviewStatus === "pending" || fileUploading} className="hidden" accept=".png,.jpg,.jpeg,.gif,.pdf,.html,.css,.js,.zip,.gz" />
              </label>
              {projectFileUrl ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <iconify-icon icon="lucide:check-circle" style={{ fontSize: "12px" }} />
                  <a href={projectFileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[200px]">{projectFileName || "Voir le fichier"}</a>
                  <button type="button" onClick={() => { setProjectFileUrl(""); setProjectFileName(""); }} className="text-red-400 hover:text-red-300">
                    <iconify-icon icon="lucide:x" style={{ fontSize: "12px" }} />
                  </button>
                </div>
              ) : null}
            </div>

            {projectText.trim().length > 0 && projectText.trim().length < 50 && !projectSubmitted ? (
              <div className="flex items-start gap-2 text-[11px] text-amber-100/80 font-body-readable">
                <iconify-icon icon="lucide:info" style={{ fontSize: "13px", color: "#fbbf24", marginTop: "1px" }} />
                <span>Ton livrable est assez court. Assure-toi d'avoir bien inclus tout ce qui est demande (lien, explications, etc.).</span>
              </div>
            ) : null}

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
                      ? "Mettre à jour ma soumission"
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
            Leçon précédente
          </Link>
        ) : (
          <span />
        )}

        {(isCompleted || awaitingReview) && nextLessonSlug ? (
          <Link
            href={`/parcours/${trackSlug}/lecon/${nextLessonSlug}`}
            className="btn-secondary inline-flex items-center gap-2 text-[12px]"
            style={{ padding: "9px 14px" }}
          >
            Leçon suivante
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
