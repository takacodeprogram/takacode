import { describe, it, expect } from "vitest";
import {
  findGoalOption,
  buildOnboardingRecommendation,
  getOnboardingProfile,
  GOAL_OPTIONS
} from "./onboarding";

describe("findGoalOption", () => {
  it("finds an existing goal by key", () => {
    const goal = findGoalOption("website");
    expect(goal).toBeDefined();
    expect(goal!.key).toBe("website");
    expect(goal!.label).toBe("Site web");
    expect(goal!.icon).toBe("lucide:globe");
  });

  it("finds web_app goal", () => {
    const goal = findGoalOption("web_app");
    expect(goal).toBeDefined();
    expect(goal!.key).toBe("web_app");
    expect(goal!.label).toBe("Application web");
  });

  it("maps legacy key data_collection to data_analysis", () => {
    const goal = findGoalOption("data_collection");
    expect(goal).toBeDefined();
    expect(goal!.key).toBe("data_analysis");
    expect(goal!.label).toBe("Analyse et visualisation de donnees");
  });

  it("maps legacy key agritech to custom_projects", () => {
    const goal = findGoalOption("agritech");
    expect(goal).toBeDefined();
    expect(goal!.key).toBe("custom_projects");
    expect(goal!.label).toBe("Outils et projets personnalises");
  });

  it("returns website (DEFAULT_GOAL_KEY) for unknown key", () => {
    const goal = findGoalOption("nonexistent_key_xyz");
    expect(goal).toBeDefined();
    expect(goal!.key).toBe("website");
    expect(goal!.label).toBe("Site web");
  });

  it("returns website for empty string", () => {
    const goal = findGoalOption("");
    expect(goal).toBeDefined();
    expect(goal!.key).toBe("website");
  });

  it("finds the learn_explore goal", () => {
    const goal = findGoalOption("learn_explore");
    expect(goal).toBeDefined();
    expect(goal!.key).toBe("learn_explore");
  });

  it("finds the paid_ads goal", () => {
    const goal = findGoalOption("paid_ads");
    expect(goal).toBeDefined();
    expect(goal!.key).toBe("paid_ads");
    expect(goal!.label).toBe("Publicite payante et media buying");
  });
});

describe("buildOnboardingRecommendation", () => {
  it("returns a recommendation for website goal", () => {
    const rec = buildOnboardingRecommendation("website");
    expect(rec.parcoursTitle).toBe("Parcours Site Web");
    expect(rec.objective).toContain("premier site web");
    expect(rec.resources).toHaveLength(3);
    expect(rec.nextSteps).toHaveLength(3);
  });

  it("returns a recommendation for wordpress_nocode goal", () => {
    const rec = buildOnboardingRecommendation("wordpress_nocode");
    expect(rec.parcoursTitle).toBe("Parcours WordPress No-Code Elementor");
    expect(rec.parcoursMeta).toContain("8 semaines");
    expect(rec.goalKey).toBe("wordpress_nocode");
    expect(rec.goalLabel).toBe("WordPress No-Code Elementor");
  });

  it("returns full shape for every field", () => {
    const rec = buildOnboardingRecommendation("digital_business");
    expect(rec).toHaveProperty("goalKey");
    expect(rec).toHaveProperty("goalLabel");
    expect(rec).toHaveProperty("parcoursTitle");
    expect(rec).toHaveProperty("parcoursMeta");
    expect(rec).toHaveProperty("resources");
    expect(rec).toHaveProperty("objective");
    expect(rec).toHaveProperty("nextSession");
    expect(rec).toHaveProperty("nextSteps");
    expect(Array.isArray(rec.resources)).toBe(true);
    expect(Array.isArray(rec.nextSteps)).toBe(true);
  });

  it("uses default recommendation for unknown goal", () => {
    const rec = buildOnboardingRecommendation("nonexistent");
    // Falls back to DEFAULT_GOAL_KEY = "website"
    expect(rec.parcoursTitle).toBe("Parcours Site Web");
    expect(rec.goalKey).toBe("website");
  });

  it("returns a new array (not reference) for resources", () => {
    const rec = buildOnboardingRecommendation("web_app");
    const originalLength = rec.resources.length;
    rec.resources.push("Extra resource");
    // Should not affect the internal preset
    const rec2 = buildOnboardingRecommendation("web_app");
    expect(rec2.resources).toHaveLength(originalLength);
  });

  it("returns a new array (not reference) for nextSteps", () => {
    const rec = buildOnboardingRecommendation("mobile_app");
    const originalLength = rec.nextSteps.length;
    rec.nextSteps.pop();
    const rec2 = buildOnboardingRecommendation("mobile_app");
    expect(rec2.nextSteps).toHaveLength(originalLength);
  });

  it("handles all defined GOAL_OPTIONS without throwing", () => {
    for (const goal of GOAL_OPTIONS) {
      const rec = buildOnboardingRecommendation(goal.key);
      expect(rec.parcoursTitle).toBeTruthy();
      expect(rec.resources.length).toBeGreaterThan(0);
      expect(rec.nextSteps.length).toBeGreaterThan(0);
    }
  });
});

describe("getOnboardingProfile", () => {
  it("returns default profile for null user", () => {
    const profile = getOnboardingProfile(null);
    expect(profile.goalKey).toBe("website");
    expect(profile.levelKey).toBe("beginner");
    expect(profile.projectClarityKey).toBe("explore");
    expect(profile.weeklyCommitmentKey).toBe("2_to_5");
    expect(profile.tools).toEqual([]);
    expect(profile.progress).toBeLessThanOrEqual(100);
    expect(profile.recommendation.parcoursTitle).toBe("Parcours Site Web");
  });

  it("returns default profile for undefined user", () => {
    const profile = getOnboardingProfile(undefined);
    expect(profile.goalKey).toBe("website");
  });

  it("extracts goal from onboarding_profile metadata", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "web_app",
          goal_label: "Application Web"
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.goalKey).toBe("web_app");
    expect(profile.goalLabel).toBe("Application Web");
  });

  it("falls back to the goal label when goal_label is missing", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "web_app"
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.goalLabel).toBe("Application web");
  });

  it("respects level_key from profile", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          level_key: "advanced"
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.levelKey).toBe("advanced");
    expect(profile.levelLabel).toBe("Je veux surtout me perfectionner");
  });

  it("extracts project clarity options", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          project_clarity: "clear_idea",
          project_clarity_label: "Oui, je sais"
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.projectClarityKey).toBe("clear_idea");
    expect(profile.projectClarityLabel).toBe("Oui, je sais");
  });

  it("extracts tools with max 12 items", () => {
    const manyTools = Array.from({ length: 20 }, (_, i) => `Tool ${i + 1}`);
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          tools: manyTools
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.tools).toHaveLength(12);
    expect(profile.tools[0]).toBe("Tool 1");
    expect(profile.tools[11]).toBe("Tool 12");
  });

  it("filters empty tool names", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          tools: ["React", "", "  ", "Node", null]
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.tools).toEqual(["React", "Node"]);
  });

  it("extracts weekly commitment", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          weekly_commitment: "gt_10"
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.weeklyCommitmentKey).toBe("gt_10");
    expect(profile.weeklyCommitmentLabel).toBe("Plus de 10h");
  });

  it("clamps progress between 0 and 100", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          progress: 150
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.progress).toBe(100);
  });

  it("rounds progress", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          progress: 33.7
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.progress).toBe(34);
  });

  it("progress falls back to 8 for NaN", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          progress: "not_a_number"
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.progress).toBe(8);
  });

  it("uses fallback recommendation when profile has no stored recommendation", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "mobile_app"
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.recommendation.parcoursTitle).toBe("Parcours Application Mobile");
    expect(profile.recommendation.nextSteps[0].state).toBe("done");
  });

  it("uses stored recommendation when available", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "mobile_app",
          recommendation: {
            parcours_title: "Parcours Mobile Custom",
            parcours_meta: "6 semaines - Expert",
            resources: ["Custom Doc"],
            objective: "Custom objective",
            next_session: "Vendredi 18h",
            next_steps: [{ label: "Custom step", state: "current" }]
          }
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.recommendation.parcoursTitle).toBe("Parcours Mobile Custom");
    expect(profile.recommendation.parcoursMeta).toBe("6 semaines - Expert");
    expect(profile.recommendation.resources).toEqual(["Custom Doc"]);
    expect(profile.recommendation.nextSteps[0].label).toBe("Custom step");
  });

  it("handles empty user_metadata gracefully", () => {
    const user = {};
    const profile = getOnboardingProfile(user);
    expect(profile.goalKey).toBe("website");
    expect(profile.tools).toEqual([]);
  });

  it("uses custom level_label when provided", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          level_key: "advanced",
          level_label: "Custom Expert Label"
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.levelLabel).toBe("Custom Expert Label");
  });

  it("extracts project_idea", () => {
    const user = {
      user_metadata: {
        onboarding_profile: {
          goal_key: "website",
          project_idea: "Create an e-commerce platform for local artisans"
        }
      }
    };
    const profile = getOnboardingProfile(user);
    expect(profile.projectIdea).toBe("Create an e-commerce platform for local artisans");
  });
});
