import type { Pesos } from "../../common/money";

export interface SettlementInput {
  ordinaryMonthlySalaryPesos: Pesos;
  transportAllowancePesos: Pesos;
  daysInPeriod: number;
  unpaidWorkedDays: number;
}

export interface SettlementResult {
  ordinaryMonthlySalaryPesos: Pesos;
  transportAllowancePesos: Pesos;
  daysInPeriod: number;
  unpaidWorkedDays: number;
  severancePesos: Pesos;
  severanceInterestPesos: Pesos;
  primaPesos: Pesos;
  vacationPesos: Pesos;
  unpaidSalaryPesos: Pesos;
  totalPesos: Pesos;
  verifiedAt: string;
}
