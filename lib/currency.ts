/**
 * Support multi-devise pour le système de "premier revenu".
 *
 * Le concept "premier euro" devient "premier revenu" avec choix de la devise.
 * Devises supportées : EUR, USD, GBP, XOF, XAF, GNF, MAD, DZD, TND, NGN, ZAR, GHS, KES, RWF, UGX.
 */

// ─── Types ──────────────────────────────────────────────────────

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  nameFr: string;
  /** Code pays pour le drapeau (emoji flag) */
  countryCodes: string[];
}

export interface RevenueDeclaration {
  amount: number;
  currency: string;
  declaredAt: string;
  projectId: string;
  note?: string;
}

// ─── Devises supportées ─────────────────────────────────────────

export const CURRENCIES: Currency[] = [
  { code: "EUR", symbol: "€", name: "Euro", nameFr: "Euro", countryCodes: ["FR", "DE", "ES", "IT", "PT", "BE", "NL"] },
  { code: "USD", symbol: "$", name: "US Dollar", nameFr: "Dollar US", countryCodes: ["US"] },
  { code: "GBP", symbol: "£", name: "British Pound", nameFr: "Livre sterling", countryCodes: ["GB"] },
  { code: "XOF", symbol: "CFA", name: "CFA Franc BCEAO", nameFr: "Franc CFA (UEMOA)", countryCodes: ["SN", "CI", "BF", "BJ", "ML", "NE", "TG", "GW"] },
  { code: "XAF", symbol: "CFA", name: "CFA Franc BEAC", nameFr: "Franc CFA (CEMAC)", countryCodes: ["CM", "GA", "CD", "CG", "GQ", "TD", "CF"] },
  { code: "GNF", symbol: "FG", name: "Guinean Franc", nameFr: "Franc guinéen", countryCodes: ["GN"] },
  { code: "MAD", symbol: "DH", name: "Moroccan Dirham", nameFr: "Dirham marocain", countryCodes: ["MA"] },
  { code: "DZD", symbol: "DA", name: "Algerian Dinar", nameFr: "Dinar algérien", countryCodes: ["DZ"] },
  { code: "TND", symbol: "DT", name: "Tunisian Dinar", nameFr: "Dinar tunisien", countryCodes: ["TN"] },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", nameFr: "Naira nigérian", countryCodes: ["NG"] },
  { code: "ZAR", symbol: "R", name: "South African Rand", nameFr: "Rand sud-africain", countryCodes: ["ZA"] },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", nameFr: "Cedi ghanéen", countryCodes: ["GH"] },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", nameFr: "Shilling kenyan", countryCodes: ["KE"] },
  { code: "RWF", symbol: "FRw", name: "Rwandan Franc", nameFr: "Franc rwandais", countryCodes: ["RW"] },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling", nameFr: "Shilling ougandais", countryCodes: ["UG"] }
];

// ─── Helpers ─────────────────────────────────────────────────────

/** Devise par défaut : Euro */
const DEFAULT_CURRENCY_CODE = "EUR";

/** Map code → Currency pour accès rapide */
const CURRENCY_MAP = new Map(CURRENCIES.map((c) => [c.code, c]));

export function getCurrency(code: string): Currency {
  return CURRENCY_MAP.get(code.toUpperCase()) || CURRENCY_MAP.get(DEFAULT_CURRENCY_CODE)!;
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = getCurrency(currencyCode);
  return `${currency.symbol}${amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Suggère une devise en fonction du code pays.
 * Utile pour pré-sélectionner la devise dans le formulaire de déclaration.
 */
export function suggestCurrency(countryCode: string): string {
  for (const currency of CURRENCIES) {
    if (currency.countryCodes.includes(countryCode.toUpperCase())) {
      return currency.code;
    }
  }
  return DEFAULT_CURRENCY_CODE;
}

/**
 * Liste des devises africaines (Mobile Money compatible).
 * Utilisé pour filtrer dans les formulaires.
 */
export function getAfricanCurrencies(): Currency[] {
  return CURRENCIES.filter((c) =>
    ["XOF", "XAF", "GNF", "MAD", "DZD", "TND", "NGN", "GHS", "KES", "RWF", "UGX", "ZAR"].includes(c.code)
  );
}

export const DEFAULT_CURRENCY = getCurrency(DEFAULT_CURRENCY_CODE);
