import type { Pesos } from "../../common/money";

export interface PrimaInput {
  ordinaryMonthlySalaryPesos: Pesos;
  transportAllowancePesos: Pesos;
  daysWorked: number;
}

export interface PrimaResult {
  ordinaryMonthlySalaryPesos: Pesos;
  transportAllowancePesos: Pesos;
  basePesos: Pesos;
  daysWorked: number;
  primaPesos: Pesos;
  verifiedAt: string;
}
