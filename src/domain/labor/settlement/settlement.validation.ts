import { isIntegerPesos } from "../../common/money";
import {
  invalid,
  type FieldError,
  type Validation,
} from "../../common/validation";
import { activeLaborRules } from "../rules/labor-rules";
import type { SettlementInput } from "./settlement.types";

const MAX_MONEY = 10_000_000_000;

export function validateSettlement(
  input: SettlementInput,
): Validation<SettlementInput> {
  const errors: FieldError[] = [];

  if (
    !isIntegerPesos(input.ordinaryMonthlySalaryPesos) ||
    input.ordinaryMonthlySalaryPesos <= 0
  ) {
    errors.push({
      field: "ordinarySalary",
      message: "Ingresa un salario mayor que cero.",
    });
  } else if (input.ordinaryMonthlySalaryPesos > MAX_MONEY) {
    errors.push({
      field: "ordinarySalary",
      message: "Ingresa un salario menor para poder calcularlo.",
    });
  }

  if (!isIntegerPesos(input.transportAllowancePesos)) {
    errors.push({
      field: "transportAllowance",
      message: "Ingresa un auxilio de transporte válido.",
    });
  }

  if (
    !Number.isInteger(input.daysInPeriod) ||
    input.daysInPeriod < 1 ||
    input.daysInPeriod > activeLaborRules.commercialYearDays
  ) {
    errors.push({
      field: "daysInPeriod",
      message: "Ingresa entre 1 y 360 días del periodo que quieres estimar.",
    });
  }

  if (
    !Number.isInteger(input.unpaidWorkedDays) ||
    input.unpaidWorkedDays < 0 ||
    input.unpaidWorkedDays > activeLaborRules.monthDays
  ) {
    errors.push({
      field: "unpaidWorkedDays",
      message: "Ingresa entre 0 y 30 días de salario pendiente.",
    });
  }

  if (errors.length > 0) {
    return invalid(errors);
  }

  return { ok: true, value: input };
}
