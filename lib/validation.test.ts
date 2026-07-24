import { describe, it, expect } from "vitest";
import {
  aiReviewSchema,
  projectSubmissionSchema,
  quizSubmissionSchema,
  quizQuestionsQuerySchema,
  firstEuroSchema,
  trackRecommendationQuerySchema,
  UUID,
  validatePayload,
  validateQueryParams,
  parseAndValidateBody
} from "./validation";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("UUID schema", () => {
  it("accepts a valid UUID v4", () => {
    expect(UUID.safeParse(VALID_UUID).success).toBe(true);
  });

  it("rejects invalid UUIDs", () => {
    expect(UUID.safeParse("not-a-uuid").success).toBe(false);
    expect(UUID.safeParse("").success).toBe(false);
    expect(UUID.safeParse("123").success).toBe(false);
    expect(UUID.safeParse("550e8400-e29b-41d4-a716-44665544000Z").success).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(UUID.safeParse(null).success).toBe(false);
    expect(UUID.safeParse(undefined).success).toBe(false);
    expect(UUID.safeParse(123).success).toBe(false);
  });
});

describe("aiReviewSchema", () => {
  it("accepts valid lessonId and userId", () => {
    const result = aiReviewSchema.safeParse({
      lessonId: VALID_UUID,
      userId: VALID_UUID
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing fields", () => {
    expect(aiReviewSchema.safeParse({}).success).toBe(false);
    expect(aiReviewSchema.safeParse({ lessonId: VALID_UUID }).success).toBe(false);
    expect(aiReviewSchema.safeParse({ userId: VALID_UUID }).success).toBe(false);
  });

  it("rejects invalid UUIDs", () => {
    expect(aiReviewSchema.safeParse({ lessonId: "bad", userId: VALID_UUID }).success).toBe(false);
  });

  it("rejects extra fields silently (strip)", () => {
    const result = aiReviewSchema.safeParse({
      lessonId: VALID_UUID,
      userId: VALID_UUID,
      extraField: "should be stripped"
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect("extraField" in result.data).toBe(false);
    }
  });
});

describe("projectSubmissionSchema", () => {
  it("accepts valid submission", () => {
    const result = projectSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      submission: "Mon travail de projet"
    });
    expect(result.success).toBe(true);
  });

  it("accepts submission with optional projectId", () => {
    const result = projectSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      submission: "Mon travail",
      projectId: VALID_UUID
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.projectId).toBe(VALID_UUID);
    }
  });

  it("rejects empty submission", () => {
    const result = projectSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      submission: ""
    });
    expect(result.success).toBe(false);
  });

  it("rejects submission that is too long", () => {
    const result = projectSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      submission: "x".repeat(50001)
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing lessonId", () => {
    const result = projectSubmissionSchema.safeParse({
      submission: "Mon travail"
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid projectId UUID", () => {
    const result = projectSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      submission: "Mon travail",
      projectId: "not-a-uuid"
    });
    expect(result.success).toBe(false);
  });

  it("allows submission without projectId", () => {
    const result = projectSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      submission: "Mon travail"
    });
    expect(result.success).toBe(true);
  });
});

describe("quizSubmissionSchema", () => {
  const validAnswers = [
    { questionId: "q1", choice: "Paris" },
    { questionId: "q2", choice: "42" }
  ];

  it("accepts valid quiz submission", () => {
    const result = quizSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      answers: validAnswers
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty answers array", () => {
    const result = quizSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      answers: []
    });
    expect(result.success).toBe(false);
  });

  it("rejects answers with empty questionId", () => {
    const result = quizSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      answers: [{ questionId: "", choice: "Paris" }]
    });
    expect(result.success).toBe(false);
  });

  it("rejects answers with empty choice", () => {
    const result = quizSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      answers: [{ questionId: "q1", choice: "" }]
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing answers", () => {
    const result = quizSubmissionSchema.safeParse({
      lessonId: VALID_UUID
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 50 answers", () => {
    const manyAnswers = Array.from({ length: 51 }, (_, i) => ({
      questionId: `q${i}`,
      choice: "Choice"
    }));
    const result = quizSubmissionSchema.safeParse({
      lessonId: VALID_UUID,
      answers: manyAnswers
    });
    expect(result.success).toBe(false);
  });
});

describe("quizQuestionsQuerySchema", () => {
  it("accepts a valid lessonId", () => {
    const result = quizQuestionsQuerySchema.safeParse({ lessonId: "lesson-123" });
    expect(result.success).toBe(true);
  });

  it("rejects empty lessonId", () => {
    const result = quizQuestionsQuerySchema.safeParse({ lessonId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing lessonId", () => {
    const result = quizQuestionsQuerySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("firstEuroSchema", () => {
  it("accepts a valid projectId", () => {
    const result = firstEuroSchema.safeParse({ projectId: VALID_UUID });
    expect(result.success).toBe(true);
  });

  it("rejects missing projectId", () => {
    const result = firstEuroSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects invalid projectId", () => {
    const result = firstEuroSchema.safeParse({ projectId: "bad" });
    expect(result.success).toBe(false);
  });
});

describe("trackRecommendationQuerySchema", () => {
  it("defaults goal_key to empty string", () => {
    const result = trackRecommendationQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.goal_key).toBe("");
    }
  });

  it("accepts a valid goal_key", () => {
    const result = trackRecommendationQuerySchema.safeParse({ goal_key: "website" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.goal_key).toBe("website");
    }
  });

  it("accepts goal_key as empty string from params", () => {
    // simulate when query param is present but empty
    const result = trackRecommendationQuerySchema.safeParse({ goal_key: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      // default overrides empty string
      expect(result.data.goal_key).toBe("");
    }
  });
});

describe("validatePayload", () => {
  it("returns success for valid data", () => {
    const result = validatePayload(aiReviewSchema, {
      lessonId: VALID_UUID,
      userId: VALID_UUID
    });
    expect(result.success).toBe(true);
    expect(result.data).not.toBeNull();
    expect(result.response).toBeNull();
  });

  it("returns response for invalid data", () => {
    const result = validatePayload(aiReviewSchema, { lessonId: "bad" });
    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
    expect(result.response).not.toBeNull();
  });

  it("returns 400 response for invalid data", async () => {
    const result = validatePayload(aiReviewSchema, {});
    expect(result.success).toBe(false);
    const res = result.response!;
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("validation_failed");
    expect(Array.isArray(body.errors)).toBe(true);
  });

  it("returns errors with field paths", async () => {
    const result = validatePayload(aiReviewSchema, {});
    expect(result.success).toBe(false);
    const body = await result.response!.json();
    expect(body.error).toBe("validation_failed");
    expect(body.errors.length).toBeGreaterThanOrEqual(2);
    const paths = body.errors.map((e: { path: string }) => e.path).sort();
    expect(paths).toEqual(["lessonId", "userId"]);
  });
});

describe("parseAndValidateBody", () => {
  it("handles invalid JSON body", async () => {
    const badRequest = new Request("http://localhost", {
      method: "POST",
      body: "not valid json"
    });
    const result = await parseAndValidateBody(aiReviewSchema, badRequest);
    expect(result.success).toBe(false);
    expect(result.response).not.toBeNull();
    const body = await result.response!.json();
    expect(body.error).toBe("invalid_json");
  });
});

describe("validateQueryParams", () => {
  it("accepts valid query params", () => {
    const params = new URLSearchParams({ lessonId: "lesson-1" });
    const result = validateQueryParams(quizQuestionsQuerySchema, params);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lessonId).toBe("lesson-1");
    }
  });

  it("rejects invalid query params", () => {
    const params = new URLSearchParams({ lessonId: "" });
    const result = validateQueryParams(quizQuestionsQuerySchema, params);
    expect(result.success).toBe(false);
  });

  it("handles empty params", () => {
    const params = new URLSearchParams();
    const result = validateQueryParams(quizQuestionsQuerySchema, params);
    expect(result.success).toBe(false);
  });
});
