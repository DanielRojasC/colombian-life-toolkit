import {
  parseLocalizedNumber,
  toIntegerPesos,
  toPositiveInteger,
} from "../../domain/common/parse-number";
import type { FieldError } from "../../domain/common/validation";
import { calculateCredit } from "../../domain/finance/credit/calculate-credit";
import type {
  CreditResult,
  RateKind,
} from "../../domain/finance/credit/credit.types";
import { validateCredit } from "../../domain/finance/credit/credit.validation";
import { readChoice, readText, type ToolOutcome } from "./form-values";

const rateKinds = [
  "effective-annual",
  "nominal-monthly",
  "nominal-annual-monthly",
] as const satisfies readonly RateKind[];

export function runCredit(formData: FormData): ToolOutcome<CreditResult> {
  const errors: FieldError[] = [];
  const principalParsed = parseLocalizedNumber(readText(formData, "principal"));
  const principal =
    principalParsed === null ? null : toIntegerPesos(principalParsed);
  const ratePercent = parseLocalizedNumber(readText(formData, "ratePercent"));
  const termParsed = parseLocalizedNumber(readText(formData, "termMonths"));
  const termMonths =
    termParsed === null ? null : toPositiveInteger(termParsed, 600);
  const rateKind = readChoice(formData, "rateKind", rateKinds);

  if (principal === null)
    errors.push({ field: "principal", message: "Ingresa un monto válido." });
  if (ratePercent === null)
    errors.push({ field: "ratePercent", message: "Ingresa una tasa válida." });
  if (termMonths === null)
    errors.push({
      field: "termMonths",
      message: "Ingresa un plazo entero en meses.",
    });
  if (rateKind === null)
    errors.push({ field: "rateKind", message: "Elige el tipo de tasa." });

  if (
    errors.length > 0 ||
    principal === null ||
    ratePercent === null ||
    termMonths === null ||
    rateKind === null
  ) {
    return { ok: false, errors };
  }

  const validation = validateCredit({
    principalPesos: principal,
    ratePercent,
    rateKind,
    termMonths,
  });
  if (!validation.ok) {
    return validation;
  }

  try {
    return { ok: true, result: calculateCredit(validation.value) };
  } catch {
    return {
      ok: false,
      errors: [
        {
          field: "ratePercent",
          message:
            "No se pudo armar la cuota con esa tasa y ese plazo. Revisa el tipo de tasa.",
        },
      ],
    };
  }
}
