export function normalizeText(value: unknown, fallback = ""): string {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function normalizeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

export function isMissingSchemaError(error: unknown, tableNames: string[] = []): boolean {
  const err = error as { code?: string; message?: string } | null;
  const code = typeof err?.code === "string" ? err.code : "";
  const message = typeof err?.message === "string" ? err.message.toLowerCase() : "";
  const tables = Array.isArray(tableNames) ? tableNames : [];

  return (
    code === "PGRST205" ||
    code === "42P01" ||
    tables.some((name) => message.includes(name)) ||
    message.includes("schema cache")
  );
}

export function normalizeStringArray(value: unknown, limit = 8): string[] {
  return normalizeArray<unknown>(value)
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, limit);
}

export interface NextStep {
  label: string;
  state: string;
}

export function normalizeNextSteps(value: unknown): NextStep[] {
  return normalizeArray<unknown>(value)
    .map((step): NextStep | null => {
      if (!step || typeof step !== "object") {
        return null;
      }
      const label = normalizeText((step as Record<string, unknown>).label);
      if (!label) {
        return null;
      }
      const state = normalizeText((step as Record<string, unknown>).state, "locked");
      return { label, state };
    })
    .filter(Boolean);
}

export function parseCount(value: unknown): number | null {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? Math.floor(numeric) : null;
}
