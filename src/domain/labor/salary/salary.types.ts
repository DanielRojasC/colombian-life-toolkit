import type { Pesos } from "../../common/money";
import type { RateFraction } from "../rules/labor-rules";

export interface NetSalaryInput {
  grossMonthlyPesos: Pesos;
}

export interface NetSalaryResult {
  grossMonthlyPesos: Pesos;
  ibcPesos: Pesos;
  ibcWasCapped: boolean;
  belowMinimumWage: boolean;
  healthPesos: Pesos;
  pensionPesos: Pesos;
  solidarityPesos: Pesos;
  solidarityRate: RateFraction;
  totalDeductionsPesos: Pesos;
  estimatedNetPesos: Pesos;
  rulesVersionId: string;
  verifiedAt: string;
}
