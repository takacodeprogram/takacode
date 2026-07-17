import type { SupabaseClient } from "@supabase/supabase-js";

export interface LeaderboardEntry {
  rank: number;
  publicName: string;
  points: number;
  grade: string;
  avatarUrl: string;
  countryCode: string;
}

interface LeaderboardResult {
  entries: LeaderboardEntry[];
  error: Error | null;
  schemaReady: boolean;
}

const COUNTRY_FLAGS: Record<string, string> = {
  af: "🇦🇫", al: "🇦🇱", dz: "🇩🇿", ad: "🇦🇩", ao: "🇦🇴", ar: "🇦🇷", am: "🇦🇲",
  au: "🇦🇺", at: "🇦🇹", az: "🇦🇿", bs: "🇧🇸", bh: "🇧🇭", bd: "🇧🇩", bb: "🇧🇧",
  by: "🇧🇾", be: "🇧🇪", bz: "🇧🇿", bj: "🇧🇯", bt: "🇧🇹", bo: "🇧🇴", ba: "🇧🇦",
  bw: "🇧🇼", br: "🇧🇷", bn: "🇧🇳", bg: "🇧🇬", bf: "🇧🇫", bi: "🇧🇮", kh: "🇰🇭",
  cm: "🇨🇲", ca: "🇨🇦", cv: "🇨🇻", cf: "🇨🇫", td: "🇹🇩", cl: "🇨🇱", cn: "🇨🇳",
  co: "🇨🇴", km: "🇰🇲", cd: "🇨🇩", cg: "🇨🇬", cr: "🇨🇷", hr: "🇭🇷", cu: "🇨🇺",
  cy: "🇨🇾", cz: "🇨🇿", dk: "🇩🇰", dj: "🇩🇯", dm: "🇩🇲", do: "🇩🇴", ec: "🇪🇨",
  eg: "🇪🇬", sv: "🇸🇻", gq: "🇬🇶", er: "🇪🇷", ee: "🇪🇪", et: "🇪🇹", fj: "🇫🇯",
  fi: "🇫🇮", fr: "🇫🇷", ga: "🇬🇦", gm: "🇬🇲", ge: "🇬🇪", de: "🇩🇪", gh: "🇬🇭",
  gr: "🇬🇷", gd: "🇬🇩", gt: "🇬🇹", gn: "🇬🇳", gw: "🇬🇼", gy: "🇬🇾", ht: "🇭🇹",
  hn: "🇭🇳", hu: "🇭🇺", is: "🇮🇸", in: "🇮🇳", id: "🇮🇩", ir: "🇮🇷", iq: "🇮🇶",
  ie: "🇮🇪", il: "🇮🇱", it: "🇮🇹", ci: "🇨🇮", jm: "🇯🇲", jp: "🇯🇵", jo: "🇯🇴",
  kz: "🇰🇿", ke: "🇰🇪", ki: "🇰🇮", kw: "🇰🇼", kg: "🇰🇬", la: "🇱🇦", lv: "🇱🇻",
  lb: "🇱🇧", ls: "🇱🇸", lr: "🇱🇷", ly: "🇱🇾", li: "🇱🇮", lt: "🇱🇹", lu: "🇱🇺",
  mg: "🇲🇬", mw: "🇲🇼", my: "🇲🇾", mv: "🇲🇻", ml: "🇲🇱", mt: "🇲🇹", mh: "🇲🇭",
  mr: "🇲🇷", mu: "🇲🇺", mx: "🇲🇽", fm: "🇫🇲", md: "🇲🇩", mc: "🇲🇨", mn: "🇲🇳",
  me: "🇲🇪", ma: "🇲🇦", mz: "🇲🇿", mm: "🇲🇲", na: "🇳🇦", nr: "🇳🇷", np: "🇳🇵",
  nl: "🇳🇱", nz: "🇳🇿", ni: "🇳🇮", ne: "🇳🇪", ng: "🇳🇬", kp: "🇰🇵", no: "🇳🇴",
  om: "🇴🇲", pk: "🇵🇰", pw: "🇵🇼", ps: "🇵🇸", pa: "🇵🇦", pg: "🇵🇬", py: "🇵🇾",
  pe: "🇵🇪", ph: "🇵🇭", pl: "🇵🇱", pt: "🇵🇹", qa: "🇶🇦", ro: "🇷🇴", ru: "🇷🇺",
  rw: "🇷🇼", kn: "🇰🇳", lc: "🇱🇨", vc: "🇻🇨", ws: "🇼🇸", sm: "🇸🇲", st: "🇸🇹",
  sa: "🇸🇦", sn: "🇸🇳", rs: "🇷🇸", sc: "🇸🇨", sl: "🇸🇱", sg: "🇸🇬", sk: "🇸🇰",
  si: "🇸🇮", sb: "🇸🇧", so: "🇸🇴", za: "🇿🇦", kr: "🇰🇷", ss: "🇸🇸", es: "🇪🇸",
  lk: "🇱🇰", sd: "🇸🇩", sr: "🇸🇷", sz: "🇸🇿", se: "🇸🇪", ch: "🇨🇭", sy: "🇸🇾",
  tw: "🇹🇼", tj: "🇹🇯", tz: "🇹🇿", th: "🇹🇭", tl: "🇹🇱", tg: "🇹🇬", to: "🇹🇴",
  tt: "🇹🇹", tn: "🇹🇳", tr: "🇹🇷", tm: "🇹🇲", tv: "🇹🇻", ug: "🇺🇬", ua: "🇺🇦",
  ae: "🇦🇪", gb: "🇬🇧", us: "🇺🇸", uy: "🇺🇾", uz: "🇺🇿", vu: "🇻🇺", va: "🇻🇦",
  ve: "🇻🇪", vn: "🇻🇳", ye: "🇾🇪", zm: "🇿🇲", zw: "🇿🇼",
  re: "🇷🇪", gf: "🇬🇫", mq: "🇲🇶", gp: "🇬🇵", nc: "🇳🇨", pf: "🇵🇫"
};

export function getCountryFlag(code: string): string {
  const lower = code.toLowerCase().trim();
  return COUNTRY_FLAGS[lower] || "";
}

function normalizeEntry(row: unknown): LeaderboardEntry | null {
  if (!row || typeof row !== "object") {
    return null;
  }
  const r = row as Record<string, unknown>;
  return {
    rank: Number.isFinite(Number(r.rank)) ? Number(r.rank) : 0,
    publicName: typeof r.public_name === "string" && r.public_name.trim() ? r.public_name.trim() : "Membre anonyme",
    points: Number.isFinite(Number(r.points)) ? Number(r.points) : 0,
    grade: typeof r.grade === "string" && r.grade.trim() ? r.grade : "Starter",
    avatarUrl: typeof r.avatar_url === "string" ? r.avatar_url : "",
    countryCode: typeof r.country_code === "string" ? r.country_code : ""
  };
}

export async function getPublicLeaderboard(supabase: SupabaseClient, limit = 50): Promise<LeaderboardResult> {
  const { data, error } = await supabase.rpc("public_leaderboard", { p_limit: limit });

  if (error) {
    const message = typeof error.message === "string" ? error.message.toLowerCase() : "";
    const schemaReady = !(message.includes("function") || message.includes("does not exist"));
    return { entries: [], error, schemaReady };
  }

  const list = Array.isArray(data) ? data : [];
  return { entries: list.map(normalizeEntry).filter(Boolean) as LeaderboardEntry[], error: null, schemaReady: true };
}

export const COUNTRY_OPTIONS = [
  { code: "", label: "Non precise" },
  { code: "FR", label: "France" },
  { code: "BE", label: "Belgique" },
  { code: "CH", label: "Suisse" },
  { code: "CA", label: "Canada" },
  { code: "SN", label: "Senegal" },
  { code: "CI", label: "Cote d'Ivoire" },
  { code: "MA", label: "Maroc" },
  { code: "DZ", label: "Algerie" },
  { code: "TN", label: "Tunisie" },
  { code: "CM", label: "Cameroun" },
  { code: "CD", label: "RD Congo" },
  { code: "HT", label: "Haiti" },
  { code: "LU", label: "Luxembourg" },
  { code: "MC", label: "Monaco" },
  { code: "RE", label: "Reunion" },
  { code: "GF", label: "Guyane" },
  { code: "MQ", label: "Martinique" },
  { code: "GP", label: "Guadeloupe" },
  { code: "NC", label: "Nouvelle-Caledonie" },
  { code: "PF", label: "Polynesie" },
  { code: "BF", label: "Burkina Faso" },
  { code: "BJ", label: "Benin" },
  { code: "TD", label: "Tchad" },
  { code: "CG", label: "Congo" },
  { code: "GA", label: "Gabon" },
  { code: "GN", label: "Guinee" },
  { code: "ML", label: "Mali" },
  { code: "MR", label: "Mauritanie" },
  { code: "NE", label: "Niger" },
  { code: "RW", label: "Rwanda" },
  { code: "TG", label: "Togo" },
  { code: "GB", label: "Royaume-Uni" },
  { code: "US", label: "Etats-Unis" },
  { code: "DE", label: "Allemagne" },
  { code: "IT", label: "Italie" },
  { code: "ES", label: "Espagne" },
  { code: "PT", label: "Portugal" },
  { code: "NL", label: "Pays-Bas" },
  { code: "SE", label: "Suede" },
  { code: "NO", label: "Norvege" },
  { code: "DK", label: "Danemark" },
  { code: "PL", label: "Pologne" },
  { code: "UA", label: "Ukraine" },
  { code: "RO", label: "Roumanie" },
  { code: "RU", label: "Russie" },
  { code: "CN", label: "Chine" },
  { code: "IN", label: "Inde" },
  { code: "JP", label: "Japon" },
  { code: "KR", label: "Coree du Sud" },
  { code: "AU", label: "Australie" },
  { code: "BR", label: "Bresil" },
  { code: "MX", label: "Mexique" },
  { code: "AR", label: "Argentine" },
  { code: "CL", label: "Chili" },
  { code: "CO", label: "Colombie" },
  { code: "PE", label: "Perou" },
  { code: "EG", label: "Egypte" },
  { code: "ZA", label: "Afrique du Sud" },
  { code: "NG", label: "Nigeria" },
  { code: "KE", label: "Kenya" },
  { code: "MG", label: "Madagascar" },
  { code: "MU", label: "Maurice" },
  { code: "SC", label: "Seychelles" }
];