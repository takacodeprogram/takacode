export function normalizeText(value, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function isMissingSchemaError(error, tableNames = []) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";
  const tables = Array.isArray(tableNames) ? tableNames : [];

  return (
    code === "PGRST205" ||
    code === "42P01" ||
    tables.some((name) => message.includes(name)) ||
    message.includes("schema cache")
  );
}

export function normalizeStringArray(value, limit = 8) {
  return normalizeArray(value)
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, limit);
}

export function normalizeNextSteps(value) {
  return normalizeArray(value)
    .map((step) => {
      if (!step || typeof step !== "object") {
        return null;
      }
      const label = normalizeText(step.label);
      if (!label) {
        return null;
      }
      const state = normalizeText(step.state, "locked");
      return { label, state };
    })
    .filter(Boolean);
}

export function parseCount(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? Math.floor(numeric) : null;
}
