import {
  parseLocalizedNumber,
  toIntegerPesos,
} from "../../domain/common/parse-number";
import type { FieldError } from "../../domain/common/validation";
import { calculateSettlement } from "../../domain/labor/settlement/calculate-settlement";
import type { SettlementResult } from "../../domain/labor/settlement/settlement.types";
import { validateSettlement } from "../../domain/labor/settlement/settlement.validation";
import { readText, type ToolOutcome } from "./form-values";

function readRequiredMoney(
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

function readDayCount(
  formData: FormData,
  field: string,
  min: number,
  max: number,
  message: string,
): { days: number } | { error: FieldError } {
  const raw = readText(formData, field);
  if (raw.trim() === "" && min === 0) {
    return { days: 0 };
  }

  const parsed = parseLocalizedNumber(raw);
  if (
    parsed === null ||
    !Number.isInteger(parsed) ||
    parsed < min ||
    parsed > max
  ) {
    return { error: { field, message } };
  }

  return { days: parsed };
}

export function runSettlement(
  formData: FormData,
): ToolOutcome<SettlementResult> {
  const salary = readRequiredMoney(
    formData,
    "ordinarySalary",
    "Ingresa el salario mensual.",
  );
  const transportRaw = readText(formData, "transportAllowance");
  const transport =
    transportRaw.trim() === ""
      ? { pesos: 0 }
      : readRequiredMoney(
          formData,
          "transportAllowance",
          "Ingresa un auxilio de transporte válido.",
        );
  const period = readDayCount(
    formData,
    "daysInPeriod",
    1,
    360,
    "Ingresa un número entero de días entre 1 y 360.",
  );
  const unpaid = readDayCount(
    formData,
    "unpaidWorkedDays",
    0,
    30,
    "Ingresa entre 0 y 30 días de salario pendiente.",
  );

  const errors: FieldError[] = [];
  if ("error" in salary) errors.push(salary.error);
  if ("error" in transport) errors.push(transport.error);
  if ("error" in period) errors.push(period.error);
  if ("error" in unpaid) errors.push(unpaid.error);
  if (
    errors.length > 0 ||
    !("pesos" in salary) ||
    !("pesos" in transport) ||
    !("days" in period) ||
    !("days" in unpaid)
  ) {
    return { ok: false, errors };
  }

  const validation = validateSettlement({
    ordinaryMonthlySalaryPesos: salary.pesos,
    transportAllowancePesos: transport.pesos,
    daysInPeriod: period.days,
    unpaidWorkedDays: unpaid.days,
  });
  if (!validation.ok) {
    return validation;
  }

  return { ok: true, result: calculateSettlement(validation.value) };
}
