import { describe, it, expect } from "vitest";
import { statusLabel, normalizeProject, PROJECT_STATUS } from "./userProjects";

describe("statusLabel", () => {
  it("returns correct label for each status value", () => {
    for (const entry of PROJECT_STATUS) {
      expect(statusLabel(entry.value)).toBe(entry.label);
    }
  });

  it("returns 'En cours' for unknown value", () => {
    expect(statusLabel("unknown")).toBe("En cours");
    expect(statusLabel("cancelled")).toBe("En cours");
    expect(statusLabel("random")).toBe("En cours");
  });

  it("returns 'En cours' for empty string", () => {
    expect(statusLabel("")).toBe("En cours");
  });

  it("is case sensitive", () => {
    expect(statusLabel("IDEA")).toBe("En cours");
    expect(statusLabel("In_Progress")).toBe("En cours");
  });
});

describe("normalizeProject", () => {
  it("returns null for null input", () => {
    expect(normalizeProject(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(normalizeProject(undefined)).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(normalizeProject("string")).toBeNull();
    expect(normalizeProject(42)).toBeNull();
    expect(normalizeProject(true)).toBeNull();
  });

  it("returns correct shape for a valid row", () => {
    const row = {
      id: "proj-001",
      track_id: "track-abc",
      title: "Mon site vitrine",
      description: "Un site pro pour mon activité",
      objective: "Publier un site vitrine responsive",
      status: "published",
      deadline: "2026-09-01",
      repo_url: "https://github.com/user/mon-site",
      live_url: "https://monsite.com",
      revenue_model: "subscription",
      template_id: "tpl-123",
      first_euro_at: "2026-08-15T10:00:00Z",
      has_declared_first_euro: true,
      repo_is_public: true,
      description_format: "html",
      created_at: "2026-07-01T08:00:00Z",
      updated_at: "2026-08-20T14:00:00Z",
      track: [{ title: "Parcours Site Web", slug: "site-web" }]
    };

    const project = normalizeProject(row);
    expect(project).not.toBeNull();
    expect(project!.id).toBe("proj-001");
    expect(project!.trackId).toBe("track-abc");
    expect(project!.title).toBe("Mon site vitrine");
    expect(project!.description).toBe("Un site pro pour mon activité");
    expect(project!.status).toBe("published");
    expect(project!.deadline).toBe("2026-09-01");
    expect(project!.repoUrl).toBe("https://github.com/user/mon-site");
    expect(project!.liveUrl).toBe("https://monsite.com");
    expect(project!.trackTitle).toBe("Parcours Site Web");
    expect(project!.trackSlug).toBe("site-web");
    expect(project!.revenueModel).toBe("subscription");
    expect(project!.templateId).toBe("tpl-123");
    expect(project!.firstEuroAt).toBe("2026-08-15T10:00:00Z");
    expect(project!.hasDeclaredFirstEuro).toBe(true);
    expect(project!.repoIsPublic).toBe(true);
    expect(project!.descriptionFormat).toBe("html");
    expect(project!.updatedAt).toBe("2026-08-20T14:00:00Z");
    expect(project!.publishedAt).toBe("2026-07-01T08:00:00Z");
  });

  it("handles track as an object (not array)", () => {
    const row = {
      id: "proj-002",
      track: { title: "Parcours App Web", slug: "app-web" }
    };
    const project = normalizeProject(row);
    expect(project!.trackTitle).toBe("Parcours App Web");
    expect(project!.trackSlug).toBe("app-web");
  });

  it("handles missing track data gracefully", () => {
    const row = {
      id: "proj-003",
      track: null
    };
    const project = normalizeProject(row);
    expect(project!.trackTitle).toBe("");
    expect(project!.trackSlug).toBe("");
  });

  it("handles completely missing track field", () => {
    const row = {
      id: "proj-004"
    };
    const project = normalizeProject(row);
    expect(project!.trackTitle).toBe("");
    expect(project!.trackSlug).toBe("");
  });

  it("has sensible defaults for missing fields", () => {
    const row = { id: "proj-005" };
    const project = normalizeProject(row);
    expect(project!.title).toBe("");
    expect(project!.description).toBe("");
    expect(project!.objective).toBe("");
    expect(project!.status).toBe("in_progress");
    expect(project!.trackId).toBe("");
    expect(project!.deadline).toBe("");
    expect(project!.repoUrl).toBe("");
    expect(project!.liveUrl).toBe("");
    expect(project!.updatedAt).toBeNull();
    expect(project!.publishedAt).toBeNull();
    expect(project!.revenueModel).toBe("");
    expect(project!.templateId).toBe("");
    expect(project!.firstEuroAt).toBeNull();
    expect(project!.hasDeclaredFirstEuro).toBe(false);
    expect(project!.descriptionFormat).toBe("text");
  });

  it("repoIsPublic defaults to true when not false", () => {
    const row1 = { id: "p1", repo_is_public: true };
    expect(normalizeProject(row1)!.repoIsPublic).toBe(true);

    const row2 = { id: "p2" };
    expect(normalizeProject(row2)!.repoIsPublic).toBe(true);

    const row3 = { id: "p3", repo_is_public: null };
    expect(normalizeProject(row3)!.repoIsPublic).toBe(true);
  });

  it("repoIsPublic is false only when explicitly false", () => {
    const row = { id: "p4", repo_is_public: false };
    expect(normalizeProject(row)!.repoIsPublic).toBe(false);
  });

  it("falls back to first element when track is an array", () => {
    const row = {
      id: "proj-006",
      track: [
        { title: "First Track", slug: "first" },
        { title: "Second Track", slug: "second" }
      ]
    };
    const project = normalizeProject(row);
    expect(project!.trackTitle).toBe("First Track");
    expect(project!.trackSlug).toBe("first");
  });
});
