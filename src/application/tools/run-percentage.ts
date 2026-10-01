import { parseLocalizedNumber } from "../../domain/common/parse-number";
import type { FieldError } from "../../domain/common/validation";
import { calculatePercentage } from "../../domain/finance/percentage/calculate-percentage";
import type {
  PercentageMode,
  PercentageResult,
} from "../../domain/finance/percentage/percentage.types";
import { validatePercentage } from "../../domain/finance/percentage/percentage.validation";
import { readChoice, readText, type ToolOutcome } from "./form-values";

const modes = [
  "part",
  "increase",
  "discount",
  "difference",
  "ratio",
] as const satisfies readonly PercentageMode[];

function readOptionalNumber(formData: FormData, field: string): number | null {
  const raw = readText(formData, field);
  if (raw.trim() === "") {
    return null;
  }

  return parseLocalizedNumber(raw);
}

export function runPercentage(
  formData: FormData,
): ToolOutcome<PercentageResult> {
  const mode = readChoice(formData, "mode", modes);
  const errors: FieldError[] = [];
  if (mode === null) {
    errors.push({ field: "mode", message: "Elige qué quieres calcular." });
    return { ok: false, errors };
  }

  const input = {
    mode,
    base: readOptionalNumber(formData, "base"),
    percent: readOptionalNumber(formData, "percent"),
    initial: readOptionalNumber(formData, "initial"),
    final: readOptionalNumber(formData, "final"),
  };

  const validation = validatePercentage(input);
  if (!validation.ok) {
    return validation;
  }

  return { ok: true, result: calculatePercentage(validation.value) };
}
