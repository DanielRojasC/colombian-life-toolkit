import { divideHalfUp } from "../../common/money";
import { activeLaborRules } from "../rules/labor-rules";
import type { SettlementInput, SettlementResult } from "./settlement.types";

/**
 * Estimates one settlement period for an ordinary private-sector salary.
 * Cesantías and prima use salary plus transport over a 360-day year.
 * Vacation pay uses salary only: 15 days per 360-day year, so divisor 720.
 * Severance interest is 12% annual, proportional to the same day count,
 * applied to the already rounded severance amount.
 */
export function calculateSettlement(input: SettlementInput): SettlementResult {
  const rules = activeLaborRules;
  const socialBase =
    input.ordinaryMonthlySalaryPesos + input.transportAllowancePesos;
  const severancePesos = divideHalfUp(
    socialBase * input.daysInPeriod,
    rules.commercialYearDays,
  );
  const severanceInterestPesos = divideHalfUp(
    severancePesos *
      input.daysInPeriod *
      rules.severanceInterestAnnualRate.numerator,
    rules.commercialYearDays * rules.severanceInterestAnnualRate.denominator,
  );
  const primaPesos = divideHalfUp(
    socialBase * input.daysInPeriod,
    rules.commercialYearDays,
  );
  const vacationPesos = divideHalfUp(
    input.ordinaryMonthlySalaryPesos * input.daysInPeriod,
    rules.commercialYearDays * 2,
  );
  const unpaidSalaryPesos = divideHalfUp(
    input.ordinaryMonthlySalaryPesos * input.unpaidWorkedDays,
    rules.monthDays,
  );

  return {
    ordinaryMonthlySalaryPesos: input.ordinaryMonthlySalaryPesos,
    transportAllowancePesos: input.transportAllowancePesos,
    daysInPeriod: input.daysInPeriod,
    unpaidWorkedDays: input.unpaidWorkedDays,
    severancePesos,
    severanceInterestPesos,
    primaPesos,
    vacationPesos,
    unpaidSalaryPesos,
    totalPesos:
      severancePesos +
      severanceInterestPesos +
      primaPesos +
      vacationPesos +
      unpaidSalaryPesos,
    verifiedAt: rules.verifiedAt,
  };
}
