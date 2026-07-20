import { z } from "zod";
import { NextResponse } from "next/server";

// ─── UUID pattern ───────────────────────────────────────────────
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const UUID = z.string().regex(uuidPattern, "Invalid UUID format");

// ─── Schemas API ────────────────────────────────────────────────

/** POST /api/lessons/ai-review */
export const aiReviewSchema = z.object({
  lessonId: UUID,
  userId: UUID
});

export type AiReviewInput = z.infer<typeof aiReviewSchema>;

/** POST /api/lessons/project */
export const projectSubmissionSchema = z.object({
  lessonId: UUID,
  submission: z.string().min(1, "Submission is required").max(50000, "Submission too long"),
  projectId: UUID.optional()
});

export type ProjectSubmissionInput = z.infer<typeof projectSubmissionSchema>;

/** POST /api/lessons/quiz */
export const quizAnswerSchema = z.object({
  questionId: z.string().min(1),
  choice: z.string().min(1)
});

export const quizSubmissionSchema = z.object({
  lessonId: UUID,
  answers: z.array(quizAnswerSchema).min(1, "At least one answer required").max(50, "Too many answers")
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;

/** GET /api/lessons/quiz-questions (query params) */
export const quizQuestionsQuerySchema = z.object({
  lessonId: z.string().min(1, "lessonId is required")
});

/** POST /api/projects/first-euro */
export const firstEuroSchema = z.object({
  projectId: UUID
});

export type FirstEuroInput = z.infer<typeof firstEuroSchema>;

/** GET /api/tracks/recommendation (query params) */
export const trackRecommendationQuerySchema = z.object({
  goal_key: z.string().optional().default("")
});

// ─── Helper ─────────────────────────────────────────────────────

type ValidationResult<T> =
  | { success: true; data: T; response: null }
  | { success: false; data: null; response: NextResponse };

/**
 * Valide un payload JSON parsé avec un schéma Zod.
 * Retourne soit les données validées, soit une réponse 400.
 */
export function validatePayload<T>(schema: z.ZodType<T>, payload: unknown): ValidationResult<T> {
  const result = schema.safeParse(payload);

  if (result.success) {
    return { success: true, data: result.data, response: null };
  }

  const errors = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));

  return {
    success: false,
    data: null,
    response: NextResponse.json(
      { error: "validation_failed", errors },
      { status: 400 }
    )
  };
}

/**
 * Extrait et valide le body JSON d'une requête.
 * Retourne soit les données validées, soit une réponse 400.
 */
export async function parseAndValidateBody<T>(
  schema: z.ZodType<T>,
  request: Request
): Promise<ValidationResult<T>> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return {
      success: false,
      data: null,
      response: NextResponse.json(
        { error: "invalid_json", errors: [{ path: "body", message: "Invalid JSON in request body" }] },
        { status: 400 }
      )
    };
  }

  return validatePayload(schema, payload);
}

/**
 * Valide les query params d'une requête GET avec un schéma Zod.
 * Retourne soit les données validées, soit une réponse 400.
 */
export function validateQueryParams<T>(
  schema: z.ZodType<T>,
  searchParams: URLSearchParams
): ValidationResult<T> {
  const raw: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    raw[key] = value;
  }

  return validatePayload(schema, raw);
}
