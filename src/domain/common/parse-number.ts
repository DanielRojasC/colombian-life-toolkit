import { isIntegerPesos, roundHalfUp, type Pesos } from "./money";

/**
 * Parses a number typed with Colombian or plain decimal notation.
 * Dots grouping thousands (1.750.905 or 16.000) are treated as thousands.
 * A comma is a decimal separator (15,6). A single dot with 1 or 2 fraction
 * digits is a decimal point (40.5, 1.50).
 */
export function parseLocalizedNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/\s+/g, "").replace(/\$/g, "");
  if (trimmed === "" || !/^[\d.,]+$/.test(trimmed)) {
    return null;
  }

  const lastComma = trimmed.lastIndexOf(",");
  const lastDot = trimmed.lastIndexOf(".");
  let normalized: string;

  if (lastComma !== -1 && lastDot !== -1) {
    normalized =
      lastComma > lastDot
        ? trimmed.replaceAll(".", "").replace(",", ".")
        : trimmed.replaceAll(",", "");
  } else if (lastComma !== -1) {
    const commaCount = trimmed.split(",").length - 1;
    if (commaCount > 1) {
      return null;
    }

    normalized = `${trimmed.slice(0, lastComma)}.${trimmed.slice(lastComma + 1)}`;
  } else if (lastDot !== -1) {
    const parts = trimmed.split(".");
    const fraction = parts[parts.length - 1] ?? "";
    if (parts.length > 2) {
      if (!parts.slice(1).every((part) => part.length === 3)) {
        return null;
      }
      normalized = parts.join("");
    } else if (fraction.length === 3) {
      normalized = parts.join("");
    } else {
      normalized = trimmed;
    }
  } else {
    normalized = trimmed;
  }

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function toIntegerPesos(value: number): Pesos | null {
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  const rounded = roundHalfUp(value);
  return isIntegerPesos(rounded) ? rounded : null;
}

export function toPositiveInteger(value: number, max: number): number | null {
  if (!Number.isInteger(value) || value < 1 || value > max) {
    return null;
  }

  return value;
}
