import { applyRateHalfUp } from "../../common/money";
import {
  activeLaborRules,
  contributionBase,
  solidarityRate,
} from "../rules/labor-rules";
import type { NetSalaryInput, NetSalaryResult } from "./salary.types";

export function calculateNetSalary(input: NetSalaryInput): NetSalaryResult {
  const rules = activeLaborRules;
  const base = contributionBase(input.grossMonthlyPesos, rules);
  const solidarity = solidarityRate(base.ibcPesos, rules);
  const healthPesos = applyRateHalfUp(
    base.ibcPesos,
    rules.healthEmployeeRate.numerator,
    rules.healthEmployeeRate.denominator,
  );
  const pensionPesos = applyRateHalfUp(
    base.ibcPesos,
    rules.pensionEmployeeRate.numerator,
    rules.pensionEmployeeRate.denominator,
  );
  const solidarityPesos = applyRateHalfUp(
    base.ibcPesos,
    solidarity.numerator,
    solidarity.denominator,
  );
  const totalDeductionsPesos = healthPesos + pensionPesos + solidarityPesos;

  return {
    grossMonthlyPesos: input.grossMonthlyPesos,
    ibcPesos: base.ibcPesos,
    ibcWasCapped: base.capped,
    belowMinimumWage: base.belowMinimumWage,
    healthPesos,
    pensionPesos,
    solidarityPesos,
    solidarityRate: solidarity,
    totalDeductionsPesos,
    estimatedNetPesos: input.grossMonthlyPesos - totalDeductionsPesos,
    rulesVersionId: rules.version.id,
    verifiedAt: rules.verifiedAt,
  };
}
