import type { Pesos } from "../../common/money";

export type RateKind =
  "effective-annual" | "nominal-monthly" | "nominal-annual-monthly";

export type RateConversion =
  | "zero"
  | "effective-annual-to-monthly"
  | "nominal-monthly"
  | "nominal-annual-divided-by-12";

export interface CreditInput {
  principalPesos: Pesos;
  ratePercent: number;
  rateKind: RateKind;
  termMonths: number;
}

export interface AmortizationRow {
  period: number;
  openingBalancePesos: Pesos;
  paymentPesos: Pesos;
  interestPesos: Pesos;
  principalPesos: Pesos;
  closingBalancePesos: Pesos;
}

export interface CreditResult {
  principalPesos: Pesos;
  ratePercent: number;
  rateKind: RateKind;
  conversion: RateConversion;
  periodicMonthlyRate: number;
  termMonths: number;
  installmentPesos: Pesos;
  totalPaidPesos: Pesos;
  totalInterestPesos: Pesos;
  schedule: AmortizationRow[];
}
