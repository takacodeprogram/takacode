const DEFAULT_MESSAGE = "Une erreur est survenue. Reessaie dans un instant.";

function toLower(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function includesAny(text, values) {
  return values.some((value) => text.includes(value));
}

export function sanitizeAuthEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function isValidAuthEmail(value) {
  const normalized = sanitizeAuthEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function toAuthErrorMessage(error, fallbackMessage = DEFAULT_MESSAGE) {
  if (!error) {
    return "";
  }

  const code = toLower(error.code);
  const message = typeof error.message === "string" ? error.message.trim() : "";
  const lowerMessage = toLower(message);
  const status = Number(error.status) || 0;

  if (status === 429 || includesAny(lowerMessage, ["rate limit", "too many requests", "security purposes"])) {
    return "Trop de tentatives. Patiente quelques minutes puis reessaie.";
  }

  if (code === "invalid_credentials" || includesAny(lowerMessage, ["invalid login credentials", "invalid credentials"])) {
    return "Email ou mot de passe incorrect.";
  }

  if (includesAny(lowerMessage, ["email not confirmed", "email is not confirmed"])) {
    return "Confirme ton email avant de te connecter.";
  }

  if (code === "user_already_exists" || includesAny(lowerMessage, ["user already registered", "already been registered"])) {
    return "Un compte existe deja avec cet email. Connecte-toi ou reinitialise ton mot de passe.";
  }

  if (includesAny(lowerMessage, ["signups not allowed", "signup is disabled", "not allowed for this instance"])) {
    return "Les inscriptions sont temporairement desactivees.";
  }

  if (includesAny(lowerMessage, ["password should be", "weak password"])) {
    return "Mot de passe trop faible. Utilise au moins 10 caracteres avec majuscule, chiffre et symbole.";
  }

  if (includesAny(lowerMessage, ["auth session missing", "session has expired", "token has expired", "otp_expired"])) {
    return "Le lien de reinitialisation est invalide ou expire. Demande un nouveau lien.";
  }

  if (includesAny(lowerMessage, ["invalid grant", "invalid token", "otp verification failed", "token not found"])) {
    return "Lien invalide. Demande un nouveau lien de reinitialisation.";
  }

  if (includesAny(lowerMessage, ["failed to fetch", "network", "fetch failed", "network request failed"])) {
    return "Probleme reseau. Verifie ta connexion internet puis reessaie.";
  }

  return message || fallbackMessage || DEFAULT_MESSAGE;
}
