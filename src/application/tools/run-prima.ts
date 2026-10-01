import {
  parseLocalizedNumber,
  toIntegerPesos,
  toPositiveInteger,
} from "../../domain/common/parse-number";
import type { FieldError } from "../../domain/common/validation";
import { calculatePrima } from "../../domain/labor/prima/calculate-prima";
import type { PrimaResult } from "../../domain/labor/prima/prima.types";
import { validatePrima } from "../../domain/labor/prima/prima.validation";
import { readText, type ToolOutcome } from "./form-values";

function readMoney(
  formData: FormData,
  field: string,
  emptyMessage: string,
): { pesos: number } | { error: FieldError } {
  const raw = readText(formData, field);
  if (raw.trim() === "") {
    return { error: { field, message: emptyMessage } };
  }

  const parsed = parseLocalizedNumber(raw);
  const pesos = parsed === null ? null : toIntegerPesos(parsed);
  if (pesos === null) {
    return { error: { field, message: "Ingresa un valor válido." } };
  }

  return { pesos };
}

function readOptionalMoney(
  formData: FormData,
  field: string,
): { pesos: number } | { error: FieldError } {
  const raw = readText(formData, field);
  if (raw.trim() === "") {
    return { pesos: 0 };
  }

  return readMoney(formData, field, "");
}

export function runPrima(formData: FormData): ToolOutcome<PrimaResult> {
  const salary = readMoney(
    formData,
    "ordinarySalary",
    "Ingresa el salario del periodo.",
  );
  const transport = readOptionalMoney(formData, "transportAllowance");
  const errors: FieldError[] = [];
  if ("error" in salary) errors.push(salary.error);
  if ("error" in transport) errors.push(transport.error);

  const daysParsed = parseLocalizedNumber(readText(formData, "daysWorked"));
  const days = daysParsed === null ? null : toPositiveInteger(daysParsed, 360);
  if (days === null) {
    errors.push({
      field: "daysWorked",
      message: "Ingresa un número entero de días entre 1 y 360.",
    });
  }

  if (
    errors.length > 0 ||
    !("pesos" in salary) ||
    !("pesos" in transport) ||
    days === null
  ) {
    return { ok: false, errors };
  }

  const validation = validatePrima({
    ordinaryMonthlySalaryPesos: salary.pesos,
    transportAllowancePesos: transport.pesos,
    daysWorked: days,
  });
  if (!validation.ok) {
    return validation;
  }

  return { ok: true, result: calculatePrima(validation.value) };
}
