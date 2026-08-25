import { describe, it, expect } from "vitest";
import {
  computePlanProgress,
  orderPlanSteps,
  nextStep,
  type PlanStep,
  type StepStatus
} from "./projectPlan";

function step(overrides: Partial<PlanStep> & { title: string; status: StepStatus }): PlanStep {
  return {
    id: overrides.title,
    projectId: "p1",
    stepTemplateId: null,
    phaseSlug: "",
    phaseTitle: "",
    why: "",
    deliverableType: "other",
    acceptanceCriteria: [],
    position: 100,
    startedAt: null,
    completedAt: null,
    ...overrides
  };
}

describe("computePlanProgress", () => {
  it("returns 0 percent for an empty plan instead of dividing by zero", () => {
    expect(computePlanProgress([]).percent).toBe(0);
  });

  it("counts only completed steps", () => {
    const plan = [
      step({ title: "a", status: "done" }),
      step({ title: "b", status: "doing" }),
      step({ title: "c", status: "todo" }),
      step({ title: "d", status: "todo" })
    ];
    expect(computePlanProgress(plan)).toMatchObject({ total: 4, done: 1, percent: 25 });
  });

  it("takes skipped steps out of the denominator", () => {
    // 1 terminee sur 2 comptables : 50 %, et non 33 % sur 3 etapes.
    const plan = [
      step({ title: "a", status: "done" }),
      step({ title: "b", status: "todo" }),
      step({ title: "c", status: "skipped" })
    ];
    expect(computePlanProgress(plan)).toMatchObject({ total: 3, skipped: 1, percent: 50 });
  });

  it("does not report a fully skipped plan as complete", () => {
    const plan = [step({ title: "a", status: "skipped" }), step({ title: "b", status: "skipped" })];
    expect(computePlanProgress(plan).percent).toBe(0);
  });

  it("reports blocked steps without excluding them from the denominator", () => {
    const plan = [
      step({ title: "a", status: "done" }),
      step({ title: "b", status: "blocked" })
    ];
    expect(computePlanProgress(plan)).toMatchObject({ blocked: 1, percent: 50 });
  });
});

describe("orderPlanSteps", () => {
  it("orders by position", () => {
    const plan = [
      step({ title: "third", status: "todo", position: 3000 }),
      step({ title: "first", status: "todo", position: 1000 }),
      step({ title: "second", status: "todo", position: 2000 })
    ];
    expect(orderPlanSteps(plan).map((s) => s.title)).toEqual(["first", "second", "third"]);
  });

  it("stays deterministic when two steps share a position", () => {
    const plan = [
      step({ title: "beta", status: "todo", position: 1000 }),
      step({ title: "alpha", status: "todo", position: 1000 })
    ];
    expect(orderPlanSteps(plan).map((s) => s.title)).toEqual(["alpha", "beta"]);
  });

  it("does not mutate the input", () => {
    const plan = [
      step({ title: "b", status: "todo", position: 2000 }),
      step({ title: "a", status: "todo", position: 1000 })
    ];
    orderPlanSteps(plan);
    expect(plan.map((s) => s.title)).toEqual(["b", "a"]);
  });
});

describe("nextStep", () => {
  it("prefers a step already in progress over an earlier todo", () => {
    const plan = [
      step({ title: "early", status: "todo", position: 1000 }),
      step({ title: "started", status: "doing", position: 2000 })
    ];
    expect(nextStep(plan)?.title).toBe("started");
  });

  it("falls back to the first todo in plan order", () => {
    const plan = [
      step({ title: "later", status: "todo", position: 2000 }),
      step({ title: "sooner", status: "todo", position: 1000 })
    ];
    expect(nextStep(plan)?.title).toBe("sooner");
  });

  it("skips finished, skipped and blocked steps", () => {
    const plan = [
      step({ title: "done", status: "done", position: 1000 }),
      step({ title: "skipped", status: "skipped", position: 2000 }),
      step({ title: "blocked", status: "blocked", position: 3000 }),
      step({ title: "open", status: "todo", position: 4000 })
    ];
    expect(nextStep(plan)?.title).toBe("open");
  });

  it("returns null when nothing is left to do", () => {
    expect(nextStep([step({ title: "a", status: "done" })])).toBeNull();
  });
});
