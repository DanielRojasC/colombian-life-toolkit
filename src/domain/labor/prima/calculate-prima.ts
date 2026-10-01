import { divideHalfUp } from "../../common/money";
import { activeLaborRules } from "../rules/labor-rules";
import type { PrimaInput, PrimaResult } from "./prima.types";

/**
 * Prima = (salario + auxilio de transporte) × días / 360.
 * Artículo 306 del CST: 30 días de salario por año, proporcional al tiempo.
 * 180 días de un semestre equivalen a la mitad de un salario base.
 */
export function calculatePrima(input: PrimaInput): PrimaResult {
  const basePesos =
    input.ordinaryMonthlySalaryPesos + input.transportAllowancePesos;
  const primaPesos = divideHalfUp(
    basePesos * input.daysWorked,
    activeLaborRules.commercialYearDays,
  );

  return {
    ordinaryMonthlySalaryPesos: input.ordinaryMonthlySalaryPesos,
    transportAllowancePesos: input.transportAllowancePesos,
    basePesos,
    daysWorked: input.daysWorked,
    primaPesos,
    verifiedAt: activeLaborRules.verifiedAt,
  };
}
