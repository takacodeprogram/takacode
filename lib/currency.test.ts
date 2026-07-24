import { describe, it, expect } from "vitest";
import {
  CURRENCIES,
  getCurrency,
  formatCurrency,
  suggestCurrency,
  getAfricanCurrencies,
  DEFAULT_CURRENCY
} from "./currency";
import type { Currency } from "./currency";

describe("CURRENCIES", () => {
  it("has exactly 15 currencies", () => {
    expect(CURRENCIES).toHaveLength(15);
  });

  it("includes all expected major currencies", () => {
    const codes = CURRENCIES.map((c) => c.code);
    expect(codes).toContain("EUR");
    expect(codes).toContain("USD");
    expect(codes).toContain("GBP");
    expect(codes).toContain("XOF");
    expect(codes).toContain("XAF");
    expect(codes).toContain("NGN");
    expect(codes).toContain("MAD");
  });

  it("each currency has all required fields", () => {
    for (const currency of CURRENCIES) {
      expect(currency.code).toBeTruthy();
      expect(currency.symbol).toBeTruthy();
      expect(currency.name).toBeTruthy();
      expect(currency.nameFr).toBeTruthy();
      expect(Array.isArray(currency.countryCodes)).toBe(true);
      expect(currency.countryCodes.length).toBeGreaterThan(0);
    }
  });

  it("no duplicate currency codes", () => {
    const codes = CURRENCIES.map((c) => c.code);
    const unique = new Set(codes);
    expect(unique.size).toBe(CURRENCIES.length);
  });

  it("EUR is the first currency", () => {
    expect(CURRENCIES[0].code).toBe("EUR");
    expect(CURRENCIES[0].symbol).toBe("€");
  });

  it("includes all African currencies", () => {
    const africanCodes = getAfricanCurrencies().map((c) => c.code);
    expect(africanCodes).toContain("XOF");
    expect(africanCodes).toContain("XAF");
    expect(africanCodes).toContain("NGN");
    expect(africanCodes).toContain("GHS");
    expect(africanCodes).toContain("KES");
  });
});

describe("getCurrency", () => {
  it("returns EUR for valid code", () => {
    const currency = getCurrency("EUR");
    expect(currency.code).toBe("EUR");
    expect(currency.symbol).toBe("€");
  });

  it("returns currency for lowercase code", () => {
    const currency = getCurrency("eur");
    expect(currency.code).toBe("EUR");
  });

  it("returns XOF for code xof", () => {
    const currency = getCurrency("XOF");
    expect(currency.code).toBe("XOF");
    expect(currency.symbol).toBe("CFA");
  });

  it("falls back to EUR for unknown code", () => {
    const currency = getCurrency("XYZ");
    expect(currency.code).toBe("EUR");
    expect(currency.symbol).toBe("€");
  });

  it("falls back to EUR for empty string", () => {
    const currency = getCurrency("");
    expect(currency.code).toBe("EUR");
  });

  it("returns NGN for Nigerian Naira", () => {
    const currency = getCurrency("NGN");
    expect(currency.code).toBe("NGN");
    expect(currency.symbol).toBe("₦");
    expect(currency.countryCodes).toContain("NG");
  });
});

describe("formatCurrency", () => {
  it("formats EUR correctly", () => {
    const result = formatCurrency(100, "EUR");
    expect(result).toContain("€");
    expect(result).toContain("100");
  });

  it("formats with two decimal places", () => {
    const result = formatCurrency(99.5, "EUR");
    expect(result).toBe("€99,50");
  });

  it("formats zero correctly", () => {
    const result = formatCurrency(0, "EUR");
    expect(result).toBe("€0,00");
  });

  it("formats large numbers with thousands separator", () => {
    const result = formatCurrency(1500, "EUR");
    expect(result).toContain("€");
    expect(result).toContain("1");
    expect(result).toContain("500");
  });

  it("formats with CFA symbol for XOF", () => {
    const result = formatCurrency(5000, "XOF");
    expect(result).toContain("CFA");
  });

  it("formats with $ for USD", () => {
    const result = formatCurrency(50, "USD");
    expect(result).toContain("$");
  });

  it("formats with ₦ for NGN", () => {
    const result = formatCurrency(10000, "NGN");
    expect(result).toContain("₦");
  });

  it("formats fractional amounts", () => {
    const result = formatCurrency(0.01, "EUR");
    expect(result).toBe("€0,01");
  });
});

describe("suggestCurrency", () => {
  it("returns EUR for FR", () => {
    expect(suggestCurrency("FR")).toBe("EUR");
  });

  it("returns EUR for lowercase fr", () => {
    expect(suggestCurrency("fr")).toBe("EUR");
  });

  it("returns XOF for SN (Senegal)", () => {
    expect(suggestCurrency("SN")).toBe("XOF");
  });

  it("returns XOF for CI (Cote d'Ivoire)", () => {
    expect(suggestCurrency("CI")).toBe("XOF");
  });

  it("returns XAF for CM (Cameroon)", () => {
    expect(suggestCurrency("CM")).toBe("XAF");
  });

  it("returns NGN for NG (Nigeria)", () => {
    expect(suggestCurrency("NG")).toBe("NGN");
  });

  it("returns GHS for GH (Ghana)", () => {
    expect(suggestCurrency("GH")).toBe("GHS");
  });

  it("returns MAD for MA (Morocco)", () => {
    expect(suggestCurrency("MA")).toBe("MAD");
  });

  it("returns KES for KE (Kenya)", () => {
    expect(suggestCurrency("KE")).toBe("KES");
  });

  it("returns USD for US", () => {
    expect(suggestCurrency("US")).toBe("USD");
  });

  it("returns EUR for unknown country", () => {
    expect(suggestCurrency("XX")).toBe("EUR");
    expect(suggestCurrency("")).toBe("EUR");
  });

  it("returns EUR for empty string", () => {
    expect(suggestCurrency("")).toBe("EUR");
  });
});

describe("getAfricanCurrencies", () => {
  it("returns at least 11 currencies", () => {
    const african = getAfricanCurrencies();
    expect(african.length).toBeGreaterThanOrEqual(11);
  });

  it("does not include EUR, USD, GBP", () => {
    const codes = getAfricanCurrencies().map((c) => c.code);
    expect(codes).not.toContain("EUR");
    expect(codes).not.toContain("USD");
    expect(codes).not.toContain("GBP");
  });

  it("includes XOF and XAF", () => {
    const codes = getAfricanCurrencies().map((c) => c.code);
    expect(codes).toContain("XOF");
    expect(codes).toContain("XAF");
  });

  it("all returned currencies have African country codes", () => {
    const african = getAfricanCurrencies();
    for (const currency of african) {
      expect(currency.countryCodes.length).toBeGreaterThan(0);
    }
  });
});

describe("DEFAULT_CURRENCY", () => {
  it("is EUR", () => {
    expect(DEFAULT_CURRENCY.code).toBe("EUR");
    expect(DEFAULT_CURRENCY.symbol).toBe("€");
  });

  it("has all required fields", () => {
    expect(DEFAULT_CURRENCY.code).toBeTruthy();
    expect(DEFAULT_CURRENCY.symbol).toBeTruthy();
    expect(DEFAULT_CURRENCY.name).toBe("Euro");
    expect(DEFAULT_CURRENCY.nameFr).toBe("Euro");
  });
});
