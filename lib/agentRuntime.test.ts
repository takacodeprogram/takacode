import { describe, expect, it, vi } from "vitest";
import { runAgent } from "./agentRuntime";

describe("runAgent", () => {
  it("suspend une modification jusqu'a la confirmation utilisateur", async () => {
    const ask = vi.fn().mockResolvedValue({
      text: JSON.stringify({
        tool: "update_project",
        arguments: {
          projectId: "550e8400-e29b-41d4-a716-446655440000",
          changes: { objective: "Lancer la beta" }
        },
        reason: "Mettre a jour l'objectif du projet"
      }),
      provider: "mistral",
      model: "mistral-large-latest"
    });

    const result = await runAgent({
      supabase: {} as never,
      userId: "user-id",
      system: "Coach",
      messages: [{ role: "user", content: "Change mon objectif" }],
      ask
    });

    expect(result.pendingAction?.tool).toBe("update_project");
    expect(result.toolEvents).toEqual([
      expect.objectContaining({ tool: "update_project", status: "confirmation_required" })
    ]);
    expect(ask).toHaveBeenCalledOnce();
  });
});
