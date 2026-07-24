export interface QuizQualityIssue {
  level: "error" | "warning";
  questionIndex?: number;
  message: string;
}

export interface QuizQualityReport {
  questionCount: number;
  answerDistribution: number[];
  issues: QuizQualityIssue[];
  valid: boolean;
}

type QuizRecord = Record<string, unknown>;

function questionLabel(index: number): string {
  return `Question ${index + 1}`;
}

function readQuiz(value: unknown): QuizRecord[] {
  return Array.isArray(value)
    ? value.filter((item): item is QuizRecord => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    : [];
}

export function analyzeQuiz(value: unknown): QuizQualityReport {
  if (!Array.isArray(value)) {
    return {
      questionCount: 0,
      answerDistribution: [],
      issues: [{ level: "error", message: "Le quiz doit etre un tableau JSON." }],
      valid: false
    };
  }

  const quiz = readQuiz(value);
  const issues: QuizQualityIssue[] = [];
  const answerDistribution: number[] = [];

  if (quiz.length !== value.length) {
    issues.push({ level: "error", message: "Chaque question doit etre un objet JSON." });
  }

  quiz.forEach((question, questionIndex) => {
    const prompt = typeof question.q === "string" ? question.q.trim() : typeof question.question === "string" ? question.question.trim() : "";
    const choices = Array.isArray(question.choices) ? question.choices : [];
    const normalizedChoices = choices.map((choice) => typeof choice === "string" ? choice.trim() : "");
    const answer = Number(question.answer);
    const explanation = typeof question.explanation === "string" ? question.explanation.trim() : "";

    if (!prompt) issues.push({ level: "error", questionIndex, message: `${questionLabel(questionIndex)} : enonce manquant.` });
    if (choices.length < 2 || choices.length > 6 || normalizedChoices.some((choice) => !choice)) {
      issues.push({ level: "error", questionIndex, message: `${questionLabel(questionIndex)} : ajoute entre 2 et 6 choix non vides.` });
    }
    if (new Set(normalizedChoices.map((choice) => choice.toLowerCase())).size !== normalizedChoices.length) {
      issues.push({ level: "error", questionIndex, message: `${questionLabel(questionIndex)} : certains choix sont en double.` });
    }
    if (!Number.isInteger(answer) || answer < 0 || answer >= choices.length) {
      issues.push({ level: "error", questionIndex, message: `${questionLabel(questionIndex)} : index de bonne reponse invalide.` });
    } else {
      answerDistribution[answer] = (answerDistribution[answer] || 0) + 1;
    }
    if (!explanation) {
      issues.push({ level: "warning", questionIndex, message: `${questionLabel(questionIndex)} : ajoute une explication pedagogique.` });
    }
  });

  if (quiz.length >= 3 && Math.max(0, ...answerDistribution) / quiz.length > 0.6) {
    issues.push({ level: "warning", message: "La position des bonnes reponses est trop repetitive. Elle sera equilibree a l'enregistrement." });
  }

  return {
    questionCount: quiz.length,
    answerDistribution,
    issues,
    valid: !issues.some((issue) => issue.level === "error")
  };
}

export function balanceQuizAnswers(value: unknown): QuizRecord[] {
  const report = analyzeQuiz(value);
  if (!report.valid) {
    throw new Error(report.issues.find((issue) => issue.level === "error")?.message || "Quiz invalide.");
  }

  return readQuiz(value).map((question, questionIndex) => {
    const choices = [...(question.choices as string[])];
    const currentAnswer = Number(question.answer);
    const correctChoice = choices[currentAnswer];
    const remaining = choices.filter((_, index) => index !== currentAnswer);
    const targetAnswer = questionIndex % choices.length;
    remaining.splice(targetAnswer, 0, correctChoice);

    return { ...question, choices: remaining, answer: targetAnswer };
  });
}

