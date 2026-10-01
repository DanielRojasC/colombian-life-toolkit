import {
  parseLocalizedNumber,
  toIntegerPesos,
} from "../../domain/common/parse-number";
import { calculateNetSalary } from "../../domain/labor/salary/calculate-net-salary";
import type { NetSalaryResult } from "../../domain/labor/salary/salary.types";
import { validateNetSalary } from "../../domain/labor/salary/salary.validation";
import { readText, type ToolOutcome } from "./form-values";

export function runNetSalary(formData: FormData): ToolOutcome<NetSalaryResult> {
  const parsed = parseLocalizedNumber(readText(formData, "grossMonthly"));
  const pesos = parsed === null ? null : toIntegerPesos(parsed);
  if (pesos === null) {
    return {
      ok: false,
      errors: [
        { field: "grossMonthly", message: "Ingresa un salario válido." },
      ],
    };
  }

  const validation = validateNetSalary({ grossMonthlyPesos: pesos });
  if (!validation.ok) {
    return validation;
  }

  return { ok: true, result: calculateNetSalary(validation.value) };
}
