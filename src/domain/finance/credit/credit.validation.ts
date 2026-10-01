import { isIntegerPesos } from "../../common/money";
import {
  invalid,
  type FieldError,
  type Validation,
} from "../../common/validation";
import type { CreditInput, RateKind } from "./credit.types";

const MAX_PRINCIPAL = 10_000_000_000;
const MAX_TERM_MONTHS = 600;
const MAX_RATE_PERCENT = 300;
const rateKinds: readonly RateKind[] = [
  "effective-annual",
  "nominal-monthly",
  "nominal-annual-monthly",
];

export function validateCredit(input: CreditInput): Validation<CreditInput> {
  const errors: FieldError[] = [];

  if (
    !isIntegerPesos(input.principalPesos) ||
    input.principalPesos <= 0 ||
    input.principalPesos > MAX_PRINCIPAL
  ) {
    errors.push({
      field: "principal",
      message: "Ingresa un monto mayor que cero.",
    });
  }

  if (
    !Number.isFinite(input.ratePercent) ||
    input.ratePercent < 0 ||
    input.ratePercent > MAX_RATE_PERCENT
  ) {
    errors.push({
      field: "ratePercent",
      message:
        "Ingresa una tasa entre 0 % y 300 %. Revisa si es mensual o anual.",
    });
  }

  if (!rateKinds.includes(input.rateKind)) {
    errors.push({ field: "rateKind", message: "Elige el tipo de tasa." });
  }

  if (
    !Number.isInteger(input.termMonths) ||
    input.termMonths < 1 ||
    input.termMonths > MAX_TERM_MONTHS
  ) {
    errors.push({
      field: "termMonths",
      message: "Ingresa un plazo entre 1 y 600 meses.",
    });
  }

  if (errors.length > 0) {
    return invalid(errors);
  }

  return { ok: true, value: input };
}
