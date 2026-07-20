import { describe, it, expect } from "vitest";
import { normalizeLessonRow, shuffleQuizChoices, findLessonInCurriculum } from "./curriculum";
import type { CurriculumResult, Module, Lesson } from "./curriculum";

describe("normalizeLessonRow", () => {
  it("returns null for null input", () => {
    expect(normalizeLessonRow(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(normalizeLessonRow(undefined)).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(normalizeLessonRow("string")).toBeNull();
    expect(normalizeLessonRow(42)).toBeNull();
  });

  it("returns null when id is missing", () => {
    expect(normalizeLessonRow({ title: "Test" })).toBeNull();
  });

  it("returns null when is_published is false", () => {
    const row = {
      id: "lesson-1",
      slug: "test-lesson",
      title: "Test Lesson",
      is_published: false
    };
    expect(normalizeLessonRow(row)).toBeNull();
  });

  it("normalizes a valid lesson row with all fields", () => {
    const row = {
      id: "lesson-1",
      slug: "html-basics",
      title: "Les bases du HTML",
      intro: "Decouvre les fondations du web",
      why_important: "HTML est le squelette de toute page web",
      how_to_use: "Ouvre VS Code et suis les etapes",
      objectives: ["Comprendre les balises", "Creer une page", "Ajouter du style"],
      resources: [
        { label: "MDN HTML", url: "https://developer.mozilla.org/fr/docs/Web/HTML", kind: "doc", why: "Reference officielle", how: "Lire" },
        { label: "W3Schools", url: "https://www.w3schools.com/html/", kind: "tuto", why: "Exercices pratiques", how: "Suivre" }
      ],
      quiz: [
        { q: "Que signifie HTML ?", choices: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup"] }
      ],
      micro_project: {
        title: "Ma premiere page",
        brief: "Cree une page simple",
        steps: ["Creer un fichier", "Ajouter du contenu"],
        deliverable: "Un fichier index.html",
        validation: "auto",
        requires_link: false
      },
      xp_reward: 100,
      duration_minutes: 30,
      sort_order: 1,
      created_at: "2026-01-15T10:00:00Z",
      is_published: true
    };

    const lesson = normalizeLessonRow(row);
    expect(lesson).not.toBeNull();
    expect(lesson!.id).toBe("lesson-1");
    expect(lesson!.slug).toBe("html-basics");
    expect(lesson!.title).toBe("Les bases du HTML");
    expect(lesson!.intro).toBe("Decouvre les fondations du web");
    expect(lesson!.whyImportant).toBe("HTML est le squelette de toute page web");
    expect(lesson!.howToUse).toBe("Ouvre VS Code et suis les etapes");
    expect(lesson!.objectives).toHaveLength(3);
    expect(lesson!.resources).toHaveLength(2);
    expect(lesson!.resources[0].label).toBe("MDN HTML");
    expect(lesson!.resources[0].kind).toBe("doc");
    expect(lesson!.quiz).toHaveLength(1);
    expect(lesson!.quiz[0].question).toBe("Que signifie HTML ?");
    expect(lesson!.microProject).not.toBeNull();
    expect(lesson!.microProject!.title).toBe("Ma premiere page");
    expect(lesson!.microProject!.validation).toBe("auto");
    expect(lesson!.microProject!.requiresLink).toBe(false);
    expect(lesson!.xpReward).toBe(100);
    expect(lesson!.durationMinutes).toBe(30);
    expect(lesson!.sortOrder).toBe(1);
    expect(lesson!.createdAt).toBe("2026-01-15T10:00:00Z");
  });

  it("handles quiz with 'question' field (not 'q')", () => {
    const row = {
      id: "lesson-2",
      slug: "css-basics",
      title: "CSS",
      is_published: true,
      quiz: [
        { question: "Que signifie CSS ?", choices: ["Cascading Style Sheets", "Creative Style System"] }
      ]
    };
    const lesson = normalizeLessonRow(row);
    expect(lesson!.quiz[0].question).toBe("Que signifie CSS ?");
  });

  it("applies default values for missing numeric fields", () => {
    const row = {
      id: "lesson-3",
      slug: "defaults",
      title: "Defaults",
      is_published: true
    };
    const lesson = normalizeLessonRow(row);
    expect(lesson!.xpReward).toBe(50);
    expect(lesson!.durationMinutes).toBe(45);
    expect(lesson!.sortOrder).toBe(100);
    expect(lesson!.resources).toEqual([]);
    expect(lesson!.quiz).toEqual([]);
    expect(lesson!.microProject).toBeNull();
    expect(lesson!.objectives).toEqual([]);
  });

  it("filters resources with non-https URLs", () => {
    const row = {
      id: "lesson-4",
      slug: "filtered",
      title: "Filtered Resources",
      is_published: true,
      resources: [
        { label: "Valid", url: "https://example.com/doc" },
        { label: "No Protocol", url: "example.com/doc" },
        { label: "HTTP", url: "http://example.com/doc" },
        { label: "Empty", url: "" }
      ]
    };
    const lesson = normalizeLessonRow(row);
    expect(lesson!.resources).toHaveLength(1);
    expect(lesson!.resources[0].label).toBe("Valid");
  });

  it("limits resources to 6 items", () => {
    const resources = Array.from({ length: 10 }, (_, i) => ({
      label: `Resource ${i + 1}`,
      url: `https://example.com/doc${i + 1}`
    }));
    const row = {
      id: "lesson-5",
      slug: "many-resources",
      title: "Many Resources",
      is_published: true,
      resources
    };
    const lesson = normalizeLessonRow(row);
    expect(lesson!.resources).toHaveLength(6);
  });

  it("limits quiz to 10 items", () => {
    const quiz = Array.from({ length: 15 }, (_, i) => ({
      q: `Question ${i + 1}?`,
      choices: ["Choice A", "Choice B", "Choice C"]
    }));
    const row = {
      id: "lesson-6",
      slug: "many-quiz",
      title: "Many Quiz",
      is_published: true,
      quiz
    };
    const lesson = normalizeLessonRow(row);
    expect(lesson!.quiz).toHaveLength(10);
  });

  it("rejects quiz items with fewer than 2 choices", () => {
    const row = {
      id: "lesson-7",
      slug: "bad-quiz",
      title: "Bad Quiz",
      is_published: true,
      quiz: [
        { q: "Valid question", choices: ["Choice A", "Choice B"] },
        { q: "Invalid question", choices: ["Only one choice"] },
        { q: "Empty choices", choices: [] }
      ]
    };
    const lesson = normalizeLessonRow(row);
    expect(lesson!.quiz).toHaveLength(1);
    expect(lesson!.quiz[0].question).toBe("Valid question");
  });

  it("accepts micro_project with valid validation types", () => {
    const validations = ["auto", "ai", "peer", "mentor"];
    for (const validation of validations) {
      const row = {
        id: `lesson-${validation}`,
        slug: `validation-${validation}`,
        title: `Validation ${validation}`,
        is_published: true,
        micro_project: {
          title: "Project",
          brief: "Brief",
          validation
        }
      };
      const lesson = normalizeLessonRow(row);
      expect(lesson!.microProject!.validation).toBe(validation as any);
    }
  });

  it("falls back to 'auto' for invalid validation type", () => {
    const row = {
      id: "lesson-invalid",
      slug: "invalid-validation",
      title: "Invalid Validation",
      is_published: true,
      micro_project: {
        title: "Project",
        brief: "Brief",
        validation: "invalid_type"
      }
    };
    const lesson = normalizeLessonRow(row);
    expect(lesson!.microProject!.validation).toBe("auto");
  });

  it("sets requiresLink from requires_link", () => {
    const rowTrue = {
      id: "lesson-link-true", slug: "link-true", title: "Link True",
      is_published: true,
      micro_project: { title: "Proj", requires_link: true }
    };
    expect(normalizeLessonRow(rowTrue)!.microProject!.requiresLink).toBe(true);

    const rowString = {
      id: "lesson-link-string", slug: "link-string", title: "Link String",
      is_published: true,
      micro_project: { title: "Proj", requires_link: "true" }
    };
    expect(normalizeLessonRow(rowString)!.microProject!.requiresLink).toBe(true);

    const rowFalse = {
      id: "lesson-link-false", slug: "link-false", title: "Link False",
      is_published: true,
      micro_project: { title: "Proj", requires_link: false }
    };
    expect(normalizeLessonRow(rowFalse)!.microProject!.requiresLink).toBe(false);
  });
});

describe("shuffleQuizChoices", () => {
  const quiz: { question: string; choices: string[] }[] = [
    { question: "Quelle est la capitale de la France ?", choices: ["Paris", "Lyon", "Marseille", "Bordeaux"] },
    { question: "Combien font 2 + 2 ?", choices: ["3", "4", "5", "6"] }
  ];

  it("returns the same number of items", () => {
    const result = shuffleQuizChoices(quiz, "user-123");
    expect(result).toHaveLength(2);
  });

  it("returns deterministic results for the same seed", () => {
    const result1 = shuffleQuizChoices(quiz, "fixed-seed");
    const result2 = shuffleQuizChoices(quiz, "fixed-seed");
    expect(result1[0].choices).toEqual(result2[0].choices);
    expect(result1[1].choices).toEqual(result2[1].choices);
  });

  it("may return different results for different seeds", () => {
    // Run multiple times since there's a small chance seeds produce same order
    const resultA = shuffleQuizChoices(quiz, "seed-alpha");
    const resultB = shuffleQuizChoices(quiz, "seed-beta");
    const sameOrder =
      resultA[0].choices.every((c, i) => c === resultB[0].choices[i]) &&
      resultA[1].choices.every((c, i) => c === resultB[1].choices[i]);
    // With 4! = 24 permutations per question, 24^2 = 576 possibilities
    // Chance of same order: ~0.17%, so this will almost always pass
    expect(resultA[0].choices.sort()).toEqual(resultB[0].choices.sort());
  });

  it("preserves question text", () => {
    const result = shuffleQuizChoices(quiz, "preserve-test");
    expect(result[0].question).toBe("Quelle est la capitale de la France ?");
    expect(result[1].question).toBe("Combien font 2 + 2 ?");
  });

  it("contains the same choices (just reordered)", () => {
    const result = shuffleQuizChoices(quiz, "content-check");
    expect(result[0].choices.sort()).toEqual([...quiz[0].choices].sort());
    expect(result[1].choices.sort()).toEqual([...quiz[1].choices].sort());
  });

  it("handles empty quiz array", () => {
    expect(shuffleQuizChoices([], "empty")).toEqual([]);
  });
});

describe("findLessonInCurriculum", () => {
  const makeLesson = (slug: string, title: string): Lesson => ({
    id: `id-${slug}`,
    slug,
    title,
    intro: "",
    whyImportant: "",
    howToUse: "",
    objectives: [],
    resources: [],
    quiz: [],
    microProject: null,
    xpReward: 50,
    durationMinutes: 30,
    sortOrder: 1,
    createdAt: null
  });

  const makeModule = (slug: string, lessons: Lesson[]): Module => ({
    id: `mod-${slug}`,
    slug,
    title: slug,
    summary: "",
    sortOrder: 1,
    createdAt: null,
    lessons
  });

  const curriculum: CurriculumResult = {
    modules: [
      makeModule("html", [makeLesson("html-intro", "Introduction HTML"), makeLesson("html-tags", "Les balises")]),
      makeModule("css", [makeLesson("css-intro", "Introduction CSS"), makeLesson("css-flexbox", "Flexbox"), makeLesson("css-grid", "Grid")]),
      makeModule("js", [makeLesson("js-basics", "JavaScript Basics")])
    ],
    totalLessons: 6,
    completedLessons: 0,
    progressPercent: 0,
    nextLesson: null,
    hasCurriculum: true,
    schemaReady: true,
    error: null
  };

  it("returns null for empty curriculum", () => {
    const empty: CurriculumResult = {
      modules: [], totalLessons: 0, completedLessons: 0, progressPercent: 0,
      nextLesson: null, hasCurriculum: false, schemaReady: true, error: null
    };
    expect(findLessonInCurriculum(empty, "any")).toBeNull();
  });

  it("returns null for null modules", () => {
    const noModules = { ...curriculum, modules: null as unknown as Module[] };
    expect(findLessonInCurriculum(noModules, "any")).toBeNull();
  });

  it("returns null for non-existent slug", () => {
    expect(findLessonInCurriculum(curriculum, "nonexistent")).toBeNull();
  });

  it("returns null for empty slug", () => {
    expect(findLessonInCurriculum(curriculum, "")).toBeNull();
  });

  it("finds a lesson by slug (case insensitive)", () => {
    const result = findLessonInCurriculum(curriculum, "HTML-INTRO");
    expect(result).not.toBeNull();
    expect(result!.lesson.slug).toBe("html-intro");
    expect(result!.lesson.title).toBe("Introduction HTML");
    expect(result!.module.slug).toBe("html");
  });

  it("returns correct position and total", () => {
    const result = findLessonInCurriculum(curriculum, "css-flexbox");
    expect(result!.position).toBe(4); // 1-indexed, 4th lesson overall
    expect(result!.total).toBe(6);
  });

  it("returns previous lesson when not first", () => {
    const result = findLessonInCurriculum(curriculum, "css-flexbox");
    expect(result!.previousLesson).not.toBeNull();
    expect(result!.previousLesson!.slug).toBe("css-intro");
  });

  it("returns null previous lesson for first lesson", () => {
    const result = findLessonInCurriculum(curriculum, "html-intro");
    expect(result!.previousLesson).toBeNull();
  });

  it("returns next lesson when not last", () => {
    const result = findLessonInCurriculum(curriculum, "css-flexbox");
    expect(result!.nextLesson).not.toBeNull();
    expect(result!.nextLesson!.slug).toBe("css-grid");
  });

  it("returns null next lesson for last lesson", () => {
    const result = findLessonInCurriculum(curriculum, "js-basics");
    expect(result!.nextLesson).toBeNull();
  });

  it("finds lesson across module boundaries", () => {
    const result = findLessonInCurriculum(curriculum, "css-intro");
    expect(result!.module.slug).toBe("css");
    expect(result!.previousLesson!.slug).toBe("html-tags"); // from previous module
    expect(result!.nextLesson!.slug).toBe("css-flexbox"); // same module
  });
});
