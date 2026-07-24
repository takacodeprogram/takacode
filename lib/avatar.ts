export const AVATAR_STYLES = ["fun-emoji", "bottts", "adventurer", "thumbs", "big-smile", "micah"];

export function dicebearUrl(style: string, seed: string): string {
  const safeStyle = AVATAR_STYLES.includes(style) ? style : "fun-emoji";
  const safeSeed = encodeURIComponent(String(seed || "takacode").slice(0, 40));
  return `https://api.dicebear.com/9.x/${safeStyle}/svg?seed=${safeSeed}`;
}

export function resolveAvatarUrl(profileAvatarUrl: unknown, googleAvatarUrl: unknown): string {
  const fromProfile = typeof profileAvatarUrl === "string" ? profileAvatarUrl.trim() : "";
  if (/^https:\/\//i.test(fromProfile)) {
    return fromProfile;
  }
  const fromGoogle = typeof googleAvatarUrl === "string" ? googleAvatarUrl.trim() : "";
  if (/^https:\/\//i.test(fromGoogle)) {
    return fromGoogle;
  }
  return "";
}

export function getInitials(value: unknown): string {
  const tokens = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!tokens.length) return "ME";
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0]}${tokens[tokens.length - 1][0]}`.toUpperCase();
}
