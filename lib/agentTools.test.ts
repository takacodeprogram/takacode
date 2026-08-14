import { describe, expect, it } from "vitest";
import { executeAgentTool, parseAgentToolCall, requiresConfirmation } from "./agentTools";

describe("agent tools", () => {
  it("parse un appel outil JSON strict", () => {
    expect(parseAgentToolCall('{"tool":"search_web","arguments":{"query":"Next.js 16"},"reason":"Verifier"}'))
      .toEqual({ tool: "search_web", arguments: { query: "Next.js 16" }, reason: "Verifier" });
  });

  it("ignore le texte ordinaire et les outils inconnus", () => {
    expect(parseAgentToolCall("Voici ma reponse")).toBeNull();
    expect(parseAgentToolCall('{"tool":"delete_everything","arguments":{}}')).toBeNull();
  });

  it("demande confirmation pour les ecritures et MCP", () => {
    expect(requiresConfirmation("update_project")).toBe(true);
    expect(requiresConfirmation("call_mcp_tool")).toBe(true);
    expect(requiresConfirmation("search_web")).toBe(false);
  });

  it("n'execute jamais une ecriture avant confirmation", async () => {
    const result = await executeAgentTool({} as never, "user-id", {
      tool: "update_project",
      arguments: { projectId: "550e8400-e29b-41d4-a716-446655440000", changes: { title: "Nouveau" } },
      reason: "Renommer le projet"
    });
    expect(result.pendingAction?.tool).toBe("update_project");
    expect(result.event.status).toBe("confirmation_required");
  });
});
