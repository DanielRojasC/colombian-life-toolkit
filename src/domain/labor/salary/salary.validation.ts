import { isIntegerPesos } from "../../common/money";
import { invalid, type Validation } from "../../common/validation";
import type { NetSalaryInput } from "./salary.types";

const MAX_GROSS_PESOS = 10_000_000_000;

export function validateNetSalary(
  input: NetSalaryInput,
): Validation<NetSalaryInput> {
  if (
    !isIntegerPesos(input.grossMonthlyPesos) ||
    input.grossMonthlyPesos <= 0
  ) {
    return invalid([
      { field: "grossMonthly", message: "Ingresa un salario mayor que cero." },
    ]);
  }

  if (input.grossMonthlyPesos > MAX_GROSS_PESOS) {
    return invalid([
      {
        field: "grossMonthly",
        message: "Ingresa un salario menor para poder calcularlo.",
      },
    ]);
  }

  return { ok: true, value: input };
}
