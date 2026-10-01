import { isIntegerPesos } from "../../common/money";
import {
  invalid,
  type FieldError,
  type Validation,
} from "../../common/validation";
import { activeLaborRules } from "../rules/labor-rules";
import type { PrimaInput } from "./prima.types";

const MAX_MONEY = 10_000_000_000;

export function validatePrima(input: PrimaInput): Validation<PrimaInput> {
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
  } else if (input.transportAllowancePesos > MAX_MONEY) {
    errors.push({
      field: "transportAllowance",
      message: "Ingresa un auxilio de transporte menor.",
    });
  }

  if (
    !Number.isInteger(input.daysWorked) ||
    input.daysWorked < 1 ||
    input.daysWorked > activeLaborRules.commercialYearDays
  ) {
    errors.push({
      field: "daysWorked",
      message:
        "Ingresa entre 1 y 360 días. El año comercial de esta estimación tiene 360 días.",
    });
  }

  if (errors.length > 0) {
    return invalid(errors);
  }

  return { ok: true, value: input };
}
