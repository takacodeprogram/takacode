import { describe, it, expect } from "vitest";
import { GRADES, getGradeProgress } from "./grades";

describe("GRADES", () => {
  it("has exactly 5 grades", () => {
    expect(GRADES).toHaveLength(5);
  });

  it("starts with Starter at 0 points", () => {
    expect(GRADES[0].key).toBe("Starter");
    expect(GRADES[0].min).toBe(0);
  });

  it("ends with Legend at 3000 points", () => {
    expect(GRADES[4].key).toBe("Legend");
    expect(GRADES[4].min).toBe(3000);
  });

  it("has strictly increasing min points", () => {
    for (let i = 1; i < GRADES.length; i++) {
      expect(GRADES[i].min).toBeGreaterThan(GRADES[i - 1].min);
    }
  });

  it("each grade has a non-empty label, icon, and perk", () => {
    for (const grade of GRADES) {
      expect(grade.label).toBeTruthy();
      expect(grade.icon).toMatch(/^lucide:/);
      expect(grade.perk).toBeTruthy();
    }
  });
});

describe("getGradeProgress", () => {
  it("returns Starter at 0 points", () => {
    const result = getGradeProgress(0);
    expect(result.points).toBe(0);
    expect(result.current.key).toBe("Starter");
    expect(result.next?.key).toBe("Starter+");
    expect(result.percent).toBe(0);
    expect(result.pointsToNext).toBe(250);
  });

  it("returns Starter for negative points", () => {
    const result = getGradeProgress(-100);
    expect(result.points).toBe(0);
    expect(result.current.key).toBe("Starter");
  });

  it("returns Starter for NaN", () => {
    const result = getGradeProgress(NaN);
    expect(result.points).toBe(0);
    expect(result.current.key).toBe("Starter");
  });

  it("returns Starter for Infinity", () => {
    const result = getGradeProgress(Infinity);
    expect(result.points).toBe(0);
    expect(result.current.key).toBe("Starter");
  });

  it("returns Starter+ at exactly 250 points", () => {
    const result = getGradeProgress(250);
    expect(result.current.key).toBe("Starter+");
    expect(result.next?.key).toBe("Builder");
    expect(result.percent).toBe(0);
    expect(result.pointsToNext).toBe(450);
  });

  it("returns Builder at exactly 700 points", () => {
    const result = getGradeProgress(700);
    expect(result.current.key).toBe("Builder");
    expect(result.next?.key).toBe("Master");
  });

  it("returns Master at exactly 1500 points", () => {
    const result = getGradeProgress(1500);
    expect(result.current.key).toBe("Master");
    expect(result.next?.key).toBe("Legend");
  });

  it("returns Legend at exactly 3000 points", () => {
    const result = getGradeProgress(3000);
    expect(result.current.key).toBe("Legend");
    expect(result.next).toBeNull();
    expect(result.percent).toBe(100);
    expect(result.pointsToNext).toBe(0);
  });

  it("returns Legend above 3000 points", () => {
    const result = getGradeProgress(5000);
    expect(result.current.key).toBe("Legend");
    expect(result.next).toBeNull();
    expect(result.percent).toBe(100);
    expect(result.pointsToNext).toBe(0);
  });

  it("calculates correct percentage between Starter and Starter+", () => {
    const result = getGradeProgress(125); // half of 250
    expect(result.current.key).toBe("Starter");
    expect(result.percent).toBe(50);
    expect(result.pointsToNext).toBe(125);
  });

  it("calculates correct percentage between Starter+ and Builder", () => {
    const result = getGradeProgress(475); // Starter+ min=250, Builder min=700, so (475-250)/(700-250) = 225/450 = 50%
    expect(result.current.key).toBe("Starter+");
    expect(result.percent).toBe(50);
    expect(result.pointsToNext).toBe(225);
  });

  it("never exceeds 100%", () => {
    // Almost at Legend
    const result = getGradeProgress(2999);
    expect(result.current.key).toBe("Master");
    expect(result.percent).toBeLessThanOrEqual(100);
  });

  it("rounds percent down (floor)", () => {
    // 1/450 = 0.22%, should floor to 0
    const result = getGradeProgress(251);
    expect(result.current.key).toBe("Starter+");
    expect(result.percent).toBe(0);
  });
});
