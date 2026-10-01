import {
  invalid,
  type FieldError,
  type Validation,
} from "../../common/validation";
import type { PercentageInput, PercentageMode } from "./percentage.types";

const modes: readonly PercentageMode[] = [
  "part",
  "increase",
  "discount",
  "difference",
  "ratio",
];
const MAX_ABS = 1_000_000_000_000;

function isUsable(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && Math.abs(value) <= MAX_ABS;
}

export function validatePercentage(
  input: PercentageInput,
): Validation<PercentageInput> {
  if (!modes.includes(input.mode)) {
    return invalid([{ field: "mode", message: "Elige qué quieres calcular." }]);
  }

  const errors: FieldError[] = [];
  const needsAmount =
    input.mode === "part" ||
    input.mode === "increase" ||
    input.mode === "discount";

  if (needsAmount) {
    if (!isUsable(input.base) || input.base < 0) {
      errors.push({ field: "base", message: "Ingresa un valor válido." });
    }

    if (
      !isUsable(input.percent) ||
      input.percent < 0 ||
      (input.mode === "discount" && input.percent > 100)
    ) {
      errors.push({
        field: "percent",
        message:
          input.mode === "discount"
            ? "Ingresa un descuento entre 0 % y 100 %."
            : "Ingresa un porcentaje válido.",
      });
    }
  }

  if (input.mode === "difference" || input.mode === "ratio") {
    if (!isUsable(input.initial)) {
      errors.push({ field: "initial", message: "Ingresa el primer valor." });
    }

    if (!isUsable(input.final)) {
      errors.push({ field: "final", message: "Ingresa el segundo valor." });
    } else if (input.mode === "difference" && input.initial === 0) {
      errors.push({
        field: "initial",
        message:
          "El valor inicial no puede ser cero para calcular la diferencia.",
      });
    } else if (input.mode === "ratio" && input.final === 0) {
      errors.push({
        field: "final",
        message: "El segundo valor no puede ser cero.",
      });
    }
  }

  if (errors.length > 0) {
    return invalid(errors);
  }

  return { ok: true, value: input };
}
