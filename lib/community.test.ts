import { describe, it, expect } from "vitest";
import { normalizeProject, normalizeComment } from "./community";
import type { CommunityProject, ProjectComment } from "./community";

describe("normalizeProject (community)", () => {
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
      user_id: "user-abc",
      title: "Mon site vitrine",
      description: "Un site pro pour mon activite",
      objective: "Publier un site responsive",
      live_url: "https://monsite.com",
      repo_url: "https://github.com/user/mon-site",
      author: "Jean Dupont",
      avatar_url: "https://avatars.com/jean.jpg",
      author_id: "user-abc",
      track: "Parcours Site Web",
      first_euro_at: "2026-08-15T10:00:00Z",
      has_declared_first_euro: true,
      like_count: 12,
      repo_is_public: true
    };

    const project = normalizeProject(row);
    expect(project).not.toBeNull();
    expect(project!.id).toBe("proj-001");
    expect(project!.userId).toBe("user-abc");
    expect(project!.title).toBe("Mon site vitrine");
    expect(project!.description).toBe("Un site pro pour mon activite");
    expect(project!.objective).toBe("Publier un site responsive");
    expect(project!.liveUrl).toBe("https://monsite.com");
    expect(project!.repoUrl).toBe("https://github.com/user/mon-site");
    expect(project!.author).toBe("Jean Dupont");
    expect(project!.avatarUrl).toBe("https://avatars.com/jean.jpg");
    expect(project!.authorId).toBe("user-abc");
    expect(project!.track).toBe("Parcours Site Web");
    expect(project!.firstEuroAt).toBe("2026-08-15T10:00:00Z");
    expect(project!.hasDeclaredFirstEuro).toBe(true);
    expect(project!.likeCount).toBe(12);
    expect(project!.repoIsPublic).toBe(true);
  });

  it("has sensible defaults for missing fields", () => {
    const row = { id: "proj-002" };
    const project = normalizeProject(row);
    expect(project!.title).toBe("Projet");
    expect(project!.description).toBe("");
    expect(project!.objective).toBe("");
    expect(project!.liveUrl).toBe("");
    expect(project!.repoUrl).toBe("");
    expect(project!.author).toBe("Membre anonyme");
    expect(project!.avatarUrl).toBe("");
    expect(project!.authorId).toBe("");
    expect(project!.track).toBe("");
    expect(project!.firstEuroAt).toBeNull();
    expect(project!.hasDeclaredFirstEuro).toBe(false);
    expect(project!.likeCount).toBe(0);
    expect(project!.repoIsPublic).toBe(true);
  });

  it("uses 'Membre anonyme' for empty author", () => {
    expect(normalizeProject({ id: "p1", author: "" })!.author).toBe("Membre anonyme");
    expect(normalizeProject({ id: "p2", author: "   " })!.author).toBe("Membre anonyme");
    expect(normalizeProject({ id: "p3" })!.author).toBe("Membre anonyme");
  });

  it("trims the author name", () => {
    const project = normalizeProject({ id: "p4", author: "  John Doe  " });
    expect(project!.author).toBe("John Doe");
  });

  it("converts like_count to string as number", () => {
    expect(normalizeProject({ id: "p5", like_count: "15" })!.likeCount).toBe(0);
  });

  it("repoIsPublic defaults to true", () => {
    expect(normalizeProject({ id: "p6", repo_is_public: true })!.repoIsPublic).toBe(true);
    expect(normalizeProject({ id: "p7" })!.repoIsPublic).toBe(true);
    expect(normalizeProject({ id: "p8", repo_is_public: null })!.repoIsPublic).toBe(true);
  });

  it("repoIsPublic is false only when explicitly false", () => {
    expect(normalizeProject({ id: "p9", repo_is_public: false })!.repoIsPublic).toBe(false);
  });

  it("handles first_euro_at as non-string gracefully", () => {
    expect(normalizeProject({ id: "p10", first_euro_at: 123 })!.firstEuroAt).toBeNull();
    expect(normalizeProject({ id: "p11", first_euro_at: null })!.firstEuroAt).toBeNull();
  });
});

describe("normalizeComment", () => {
  it("returns null for null input", () => {
    expect(normalizeComment(null)).toBeNull();
  });

  it("returns null for undefined input", () => {
    expect(normalizeComment(undefined)).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(normalizeComment("string")).toBeNull();
    expect(normalizeComment(42)).toBeNull();
  });

  it("returns correct shape for a valid comment row", () => {
    const row = {
      id: "comment-001",
      project_id: "proj-abc",
      user_id: "user-xyz",
      content: "Super projet !",
      parent_id: null,
      is_flagged: false,
      is_hidden: false,
      created_at: "2026-07-20T14:30:00Z",
      updated_at: "2026-07-20T14:30:00Z",
      author: "Marie",
      author_avatar: "https://avatars.com/marie.jpg",
      author_grade: "Builder"
    };

    const comment = normalizeComment(row);
    expect(comment).not.toBeNull();
    expect(comment!.id).toBe("comment-001");
    expect(comment!.projectId).toBe("proj-abc");
    expect(comment!.userId).toBe("user-xyz");
    expect(comment!.content).toBe("Super projet !");
    expect(comment!.parentId).toBeNull();
    expect(comment!.isFlagged).toBe(false);
    expect(comment!.isHidden).toBe(false);
    expect(comment!.createdAt).toBe("2026-07-20T14:30:00Z");
    expect(comment!.updatedAt).toBe("2026-07-20T14:30:00Z");
    expect(comment!.author).toBe("Marie");
    expect(comment!.authorAvatar).toBe("https://avatars.com/marie.jpg");
    expect(comment!.authorGrade).toBe("Builder");
  });

  it("has sensible defaults for missing fields", () => {
    const row = { id: "comment-002" };
    const comment = normalizeComment(row);
    expect(comment!.projectId).toBe("");
    expect(comment!.userId).toBe("");
    expect(comment!.content).toBe("");
    expect(comment!.parentId).toBeNull();
    expect(comment!.isFlagged).toBe(false);
    expect(comment!.isHidden).toBe(false);
    expect(comment!.createdAt).toBe("");
    expect(comment!.updatedAt).toBe("");
    expect(comment!.author).toBe("");
    expect(comment!.authorAvatar).toBe("");
    expect(comment!.authorGrade).toBe("");
  });

  it("treats missing parent_id as null", () => {
    const comment = normalizeComment({ id: "c1" });
    expect(comment!.parentId).toBeNull();
  });

  it("treats non-string parent_id as null", () => {
    const comment = normalizeComment({ id: "c2", parent_id: 123 });
    expect(comment!.parentId).toBeNull();
  });

  it("preserves a valid parent_id string", () => {
    const comment = normalizeComment({ id: "c3", parent_id: "parent-001" });
    expect(comment!.parentId).toBe("parent-001");
  });

  it("converts is_flagged and is_hidden to boolean", () => {
    const flaggedComment = normalizeComment({ id: "c4", is_flagged: true, is_hidden: false });
    expect(flaggedComment!.isFlagged).toBe(true);
    expect(flaggedComment!.isHidden).toBe(false);

    const hiddenComment = normalizeComment({ id: "c5", is_flagged: false, is_hidden: true });
    expect(hiddenComment!.isFlagged).toBe(false);
    expect(hiddenComment!.isHidden).toBe(true);
  });

  it("handles is_flagged/is_hidden as truthy values", () => {
    const comment = normalizeComment({ id: "c6", is_flagged: 1, is_hidden: "true" });
    expect(comment!.isFlagged).toBe(true);
    expect(comment!.isHidden).toBe(true);
  });

  it("accepts empty id string", () => {
    const comment = normalizeComment({ id: "" });
    expect(comment!.id).toBe("");
  });

  it("handles non-string author fields", () => {
    const comment = normalizeComment({
      id: "c7",
      author: 42,
      author_avatar: null,
      author_grade: undefined
    });
    expect(comment!.author).toBe("");
    expect(comment!.authorAvatar).toBe("");
    expect(comment!.authorGrade).toBe("");
  });
});
