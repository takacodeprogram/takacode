import type { SupabaseClient } from "@supabase/supabase-js";
import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { getOwnProject, listOwnProjects } from "./userProjects";

export type AgentToolName =
  | "get_my_projects"
  | "get_project"
  | "search_web"
  | "update_project"
  | "list_mcp_tools"
  | "call_mcp_tool";

export interface AgentToolCall {
  tool: AgentToolName;
  arguments: Record<string, unknown>;
  reason?: string;
}

export interface AgentToolEvent {
  tool: string;
  status: "completed" | "confirmation_required" | "failed";
  summary: string;
}

export interface PendingAgentAction extends AgentToolCall {
  reason: string;
}

export const AGENT_TOOL_CATALOG = [
  { name: "get_my_projects", mode: "read", description: "Lister les projets de l'utilisateur.", arguments: { limit: "number optionnel" } },
  { name: "get_project", mode: "read", description: "Lire un projet appartenant a l'utilisateur.", arguments: { projectId: "uuid" } },
  { name: "search_web", mode: "read", description: "Rechercher des informations recentes sur internet.", arguments: { query: "string" } },
  {
    name: "update_project",
    mode: "confirmation",
    description: "Modifier un projet de l'utilisateur apres confirmation explicite.",
    arguments: { projectId: "uuid", changes: "title, description, objective, status, deadline, repoUrl, liveUrl ou revenueModel" }
  },
  { name: "list_mcp_tools", mode: "read", description: "Lister les outils exposes par les serveurs MCP autorises.", arguments: { serverId: "string optionnel" } },
  {
    name: "call_mcp_tool",
    mode: "confirmation",
    description: "Appeler un outil MCP externe apres confirmation explicite.",
    arguments: { serverId: "string", toolName: "string", arguments: "object" }
  }
] as const;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WRITE_TOOLS = new Set<AgentToolName>(["update_project", "call_mcp_tool"]);

interface McpServerConfig {
  id: string;
  name: string;
  url: string;
  headers: Record<string, string>;
}

function cleanObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function compact(value: unknown, max = 12_000): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function requiresConfirmation(tool: AgentToolName): boolean {
  return WRITE_TOOLS.has(tool);
}

export function parseAgentToolCall(text: string): AgentToolCall | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)?.[1] || trimmed;
  try {
    const value = JSON.parse(fenced) as Record<string, unknown>;
    const tool = String(value.tool || "") as AgentToolName;
    if (!AGENT_TOOL_CATALOG.some((entry) => entry.name === tool)) return null;
    return { tool, arguments: cleanObject(value.arguments), reason: String(value.reason || "").slice(0, 500) };
  } catch {
    return null;
  }
}

function readMcpServers(): McpServerConfig[] {
  const raw = process.env.AI_MCP_SERVERS_JSON || "[]";
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item): McpServerConfig[] => {
      const rec = cleanObject(item);
      const id = String(rec.id || "").trim();
      const name = String(rec.name || id).trim();
      const url = String(rec.url || "").trim();
      if (!id || !/^[a-z0-9_-]{1,50}$/i.test(id) || !url) return [];
      try {
        const parsedUrl = new URL(url);
        const privateHost = parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1" || parsedUrl.hostname === "::1";
        if (parsedUrl.protocol !== "https:" && !(process.env.AI_MCP_ALLOW_INSECURE === "true" && privateHost)) return [];
      } catch {
        return [];
      }
      const headers = Object.fromEntries(
        Object.entries(cleanObject(rec.headers)).map(([key, value]) => [key, String(value)]).slice(0, 20)
      );
      return [{ id, name, url, headers }];
    }).slice(0, 10);
  } catch {
    return [];
  }
}

async function withMcpClient<T>(server: McpServerConfig, operation: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({ name: "takacode-agent", version: "1.0.0" }, { capabilities: {} });
  const transport = new StreamableHTTPClientTransport(new URL(server.url), {
    requestInit: { headers: server.headers },
    reconnectionOptions: { maxReconnectionDelay: 2_000, initialReconnectionDelay: 250, reconnectionDelayGrowFactor: 1.5, maxRetries: 1 }
  });
  try {
    await client.connect(transport);
    return await operation(client);
  } finally {
    await client.close().catch(() => undefined);
  }
}

async function listMcpTools(serverId?: string): Promise<unknown> {
  const servers = readMcpServers().filter((server) => !serverId || server.id === serverId);
  if (!servers.length) return { servers: [], message: "Aucun serveur MCP autorise n'est configure." };
  const results = [];
  for (const server of servers) {
    try {
      const listed = await withMcpClient(server, (client) => client.listTools(undefined, { timeout: 8_000 }));
      results.push({
        serverId: server.id,
        serverName: server.name,
        tools: listed.tools.slice(0, 50).map((tool) => ({ name: tool.name, description: tool.description || "", inputSchema: tool.inputSchema }))
      });
    } catch (error) {
      results.push({ serverId: server.id, serverName: server.name, error: (error as Error).message.slice(0, 300) });
    }
  }
  return { servers: results };
}

async function callMcpTool(args: Record<string, unknown>): Promise<unknown> {
  const serverId = String(args.serverId || "");
  const toolName = String(args.toolName || "");
  const server = readMcpServers().find((entry) => entry.id === serverId);
  if (!server) throw new Error("Serveur MCP non autorise.");
  if (!toolName || toolName.length > 100) throw new Error("Nom d'outil MCP invalide.");
  const listed = await withMcpClient(server, async (client) => {
    const tools = await client.listTools(undefined, { timeout: 8_000 });
    if (!tools.tools.some((tool) => tool.name === toolName)) throw new Error("Outil MCP introuvable sur ce serveur.");
    return client.callTool({ name: toolName, arguments: cleanObject(args.arguments) }, undefined, { timeout: 20_000 });
  });
  return listed;
}

async function searchWeb(query: string): Promise<unknown> {
  const q = query.trim().slice(0, 300);
  if (!q) throw new Error("Requete de recherche vide.");
  const tavilyKey = process.env.TAVILY_API_KEY || "";
  if (tavilyKey) {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: tavilyKey, query: q, search_depth: "basic", max_results: 5, include_answer: true }),
      signal: AbortSignal.timeout(12_000)
    });
    if (!response.ok) throw new Error(`Tavily HTTP ${response.status}`);
    const data = await response.json() as Record<string, unknown>;
    return { answer: data.answer || "", results: Array.isArray(data.results) ? data.results.slice(0, 5) : [] };
  }
  const braveKey = process.env.BRAVE_SEARCH_API_KEY || "";
  if (braveKey) {
    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=5`, {
      headers: { Accept: "application/json", "X-Subscription-Token": braveKey },
      signal: AbortSignal.timeout(12_000)
    });
    if (!response.ok) throw new Error(`Brave Search HTTP ${response.status}`);
    const data = await response.json() as any;
    return { results: (data?.web?.results || []).slice(0, 5).map((item: any) => ({ title: item.title, url: item.url, description: item.description })) };
  }
  const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`, {
    signal: AbortSignal.timeout(10_000)
  });
  if (!response.ok) throw new Error(`DuckDuckGo HTTP ${response.status}`);
  const data = await response.json() as any;
  const related = Array.isArray(data.RelatedTopics)
    ? data.RelatedTopics.flatMap((item: any) => Array.isArray(item.Topics) ? item.Topics : [item]).slice(0, 5)
    : [];
  return {
    answer: data.AbstractText || "",
    source: data.AbstractURL || "",
    results: related.map((item: any) => ({ title: item.Text || "", url: item.FirstURL || "" }))
  };
}

function validateProjectChanges(raw: unknown): Record<string, string | null> {
  const input = cleanObject(raw);
  const allowed: Record<string, { column: string; max: number }> = {
    title: { column: "title", max: 160 },
    description: { column: "description", max: 8_000 },
    objective: { column: "objective", max: 2_000 },
    status: { column: "status", max: 20 },
    deadline: { column: "deadline", max: 10 },
    repoUrl: { column: "repo_url", max: 500 },
    liveUrl: { column: "live_url", max: 500 },
    revenueModel: { column: "revenue_model", max: 2_000 }
  };
  const output: Record<string, string | null> = {};
  for (const [key, value] of Object.entries(input)) {
    const rule = allowed[key];
    if (!rule) continue;
    const text = value === null ? "" : String(value).trim().slice(0, rule.max);
    output[rule.column] = rule.column === "deadline" && !text ? null : text;
  }
  if (output.status && !["idea", "in_progress", "published", "archived"].includes(output.status)) delete output.status;
  return output;
}

export async function executeAgentTool(
  supabase: SupabaseClient,
  userId: string,
  call: AgentToolCall,
  confirmed = false
): Promise<{ result: string; event: AgentToolEvent; pendingAction?: PendingAgentAction }> {
  if (requiresConfirmation(call.tool) && !confirmed) {
    const reason = call.reason || (call.tool === "update_project" ? "Modifier ton projet" : "Appeler un outil MCP externe");
    return {
      result: "Confirmation utilisateur requise.",
      event: { tool: call.tool, status: "confirmation_required", summary: reason },
      pendingAction: { ...call, reason }
    };
  }

  try {
    let value: unknown;
    if (call.tool === "get_my_projects") {
      const limit = Math.max(1, Math.min(Number(call.arguments.limit) || 10, 20));
      const projects = await listOwnProjects(supabase, userId, { limit });
      value = projects.projects;
    } else if (call.tool === "get_project") {
      const projectId = String(call.arguments.projectId || "");
      if (!UUID_RE.test(projectId)) {
        const { projects } = await listOwnProjects(supabase, userId, { limit: 20 });
        const exactMatch = projects.find((p) => p.title.toLowerCase() === projectId.toLowerCase());
        const partialMatch = exactMatch || projects.find((p) => p.title.toLowerCase().includes(projectId.toLowerCase()));
        if (partialMatch) {
          value = partialMatch;
        } else {
          throw new Error(`Aucun projet trouve avec le titre ou l'ID '${projectId}'. Utilisez get_my_projects.`);
        }
      } else {
        value = (await getOwnProject(supabase, userId, projectId)).project;
        if (!value) throw new Error("Projet introuvable.");
      }
    } else if (call.tool === "search_web") {
      value = await searchWeb(String(call.arguments.query || ""));
    } else if (call.tool === "list_mcp_tools") {
      value = await listMcpTools(String(call.arguments.serverId || "") || undefined);
    } else if (call.tool === "call_mcp_tool") {
      value = await callMcpTool(call.arguments);
    } else if (call.tool === "update_project") {
      let projectId = String(call.arguments.projectId || "");
      if (!UUID_RE.test(projectId)) {
        const { projects } = await listOwnProjects(supabase, userId, { limit: 20 });
        const exactMatch = projects.find((p) => p.title.toLowerCase() === projectId.toLowerCase());
        const partialMatch = exactMatch || projects.find((p) => p.title.toLowerCase().includes(projectId.toLowerCase()));
        if (partialMatch) {
          projectId = partialMatch.id;
        } else {
          throw new Error(`Aucun projet trouve avec le titre ou l'ID '${projectId}'. Utilisez get_my_projects.`);
        }
      }
      const changes = validateProjectChanges(call.arguments.changes);
      if (!Object.keys(changes).length) throw new Error("Aucune modification valide.");
      const { data, error } = await supabase
        .from("user_projects")
        .update(changes)
        .eq("id", projectId)
        .eq("user_id", userId)
        .select("id, title, description, objective, status, deadline, repo_url, live_url, revenue_model, updated_at")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Projet introuvable ou non autorise.");
      value = data;
    }
    return { result: compact(value), event: { tool: call.tool, status: "completed", summary: `${call.tool} termine` } };
  } catch (error) {
    const message = (error as Error).message.slice(0, 400);
    return { result: `Erreur outil: ${message}`, event: { tool: call.tool, status: "failed", summary: message } };
  }
}
