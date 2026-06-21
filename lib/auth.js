const DEFAULT_ROLE = "user";

function normalizeRole(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

export function getUserRole(user) {
  // Never trust user_metadata for authorization decisions.
  const appRole = normalizeRole(user?.app_metadata?.role);
  if (appRole) {
    return appRole;
  }

  return DEFAULT_ROLE;
}

export function userHasRole(user, allowedRoles = [DEFAULT_ROLE]) {
  if (!user) {
    return false;
  }

  const role = getUserRole(user);
  const normalizedAllowedRoles = allowedRoles
    .map((value) => normalizeRole(value))
    .filter(Boolean);

  if (!normalizedAllowedRoles.length) {
    return role === DEFAULT_ROLE;
  }

  return normalizedAllowedRoles.includes(role);
}