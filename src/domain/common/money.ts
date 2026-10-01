/** Whole Colombian pesos. Fractional results are rounded at a defined step. */
export type Pesos = number;

const MAX_PESOS = 10_000_000_000_000;

export function isIntegerPesos(value: number): value is Pesos {
  return Number.isSafeInteger(value) && value >= 0 && value <= MAX_PESOS;
}

/** Half-up rounding for a non-negative finite number. */
export function roundHalfUp(value: number): Pesos {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("roundHalfUp expects a finite non-negative number");
  }

  const rounded = Math.floor(value + 0.5);
  if (!isIntegerPesos(rounded) && rounded !== 0) {
    throw new Error("rounded amount is outside the supported range");
  }

  return rounded;
}

/**
 * Applies numerator/denominator to an integer peso amount and rounds half up.
 * 4% is numerator 4 and denominator 100.
 */
export function applyRateHalfUp(
  amountPesos: Pesos,
  numerator: number,
  denominator: number,
): Pesos {
  if (!isIntegerPesos(amountPesos) && amountPesos !== 0) {
    throw new Error("amount must be a non-negative integer peso value");
  }

  if (
    !Number.isInteger(numerator) ||
    !Number.isInteger(denominator) ||
    numerator < 0 ||
    denominator <= 0
  ) {
    throw new Error("rate must be a non-negative integer fraction");
  }

  const product = amountPesos * numerator;
  if (!Number.isSafeInteger(product)) {
    throw new Error("amount is too large to apply the rate safely");
  }

  return Math.floor((product + Math.floor(denominator / 2)) / denominator);
}

/** Divides a non-negative integer by a positive integer and rounds half up. */
export function divideHalfUp(numerator: number, denominator: number): Pesos {
  if (
    !Number.isInteger(numerator) ||
    numerator < 0 ||
    !Number.isSafeInteger(numerator)
  ) {
    throw new Error("numerator must be a non-negative safe integer");
  }

  if (!Number.isInteger(denominator) || denominator <= 0) {
    throw new Error("denominator must be a positive integer");
  }

  return Math.floor((numerator + Math.floor(denominator / 2)) / denominator);
}
