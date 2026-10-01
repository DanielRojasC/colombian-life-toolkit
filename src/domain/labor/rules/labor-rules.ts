import type { SourceId } from "../../../infrastructure/sources/official-sources";

export interface RateFraction {
  numerator: number;
  denominator: number;
}

export interface RuleVersion {
  id: string;
  effectiveFrom: string;
  effectiveUntil?: string;
  sourceIds: readonly SourceId[];
}

export interface LaborRules {
  version: RuleVersion;
  verifiedAt: string;
  minimumMonthlyWagePesos: number;
  contributionCeilingMultiples: number;
  healthEmployeeRate: RateFraction;
  pensionTotalRate: RateFraction;
  pensionEmployeeShareOfTotal: RateFraction;
  pensionEmployeeRate: RateFraction;
  commercialYearDays: number;
  monthDays: number;
  primaDaysPerYear: number;
  severanceInterestAnnualRate: RateFraction;
  vacationDaysPerYear: number;
}

/**
 * Rules verified on 2026-10-01 against the cited official texts.
 * The pension employee rate is 25% of the 16% total, which is exactly 4%.
 * Solidarity brackets follow Ley 797 de 2003, artículo 7:
 * 1% from 4 SMMLV, plus 0.2 points from 16 up to 17, and so on,
 * until 1 extra point above 20 SMMLV. The 1% and the extra points are added.
 */
export const laborRules2026 = {
  version: {
    id: "co-labor-2026-10-01",
    effectiveFrom: "2026-01-01",
    sourceIds: [
      "decreto-1469-2025",
      "decreto-159-2026",
      "ley-797-2003",
      "decreto-4982-2007",
      "ley-100-salud",
      "ley-1122-2007",
      "cst-prima",
      "cst-cesantias",
      "ley-52-1975",
      "decreto-116-1976",
      "cst-vacaciones",
    ],
  },
  verifiedAt: "2026-10-01",
  minimumMonthlyWagePesos: 1_750_905,
  contributionCeilingMultiples: 25,
  healthEmployeeRate: { numerator: 4, denominator: 100 },
  pensionTotalRate: { numerator: 16, denominator: 100 },
  pensionEmployeeShareOfTotal: { numerator: 25, denominator: 100 },
  pensionEmployeeRate: { numerator: 4, denominator: 100 },
  commercialYearDays: 360,
  monthDays: 30,
  primaDaysPerYear: 30,
  severanceInterestAnnualRate: { numerator: 12, denominator: 100 },
  vacationDaysPerYear: 15,
} as const satisfies LaborRules;

export const activeLaborRules = laborRules2026;

export function contributionCeilingPesos(
  rules: LaborRules = activeLaborRules,
): number {
  return rules.minimumMonthlyWagePesos * rules.contributionCeilingMultiples;
}

export function contributionBase(
  grossPesos: number,
  rules: LaborRules = activeLaborRules,
): { ibcPesos: number; capped: boolean; belowMinimumWage: boolean } {
  const ceiling = contributionCeilingPesos(rules);
  const capped = grossPesos > ceiling;

  return {
    ibcPesos: capped ? ceiling : grossPesos,
    capped,
    belowMinimumWage: grossPesos < rules.minimumMonthlyWagePesos,
  };
}

/**
 * Worker solidarity rate on the contribution base.
 * Boundary reading used here, because the statute says "de 16 a 17" and
 * "superiores a 20":
 * [4, 16) 1%; [16, 17) 1.2%; [17, 18) 1.4%; [18, 19) 1.6%;
 * [19, 20] 1.8%; (20, infinity) 2%.
 */
export function solidarityRate(
  ibcPesos: number,
  rules: LaborRules = activeLaborRules,
): RateFraction {
  const wage = rules.minimumMonthlyWagePesos;
  const at = (multiple: number): number => wage * multiple;

  if (ibcPesos < at(4)) {
    return { numerator: 0, denominator: 1000 };
  }
  if (ibcPesos < at(16)) {
    return { numerator: 10, denominator: 1000 };
  }
  if (ibcPesos < at(17)) {
    return { numerator: 12, denominator: 1000 };
  }
  if (ibcPesos < at(18)) {
    return { numerator: 14, denominator: 1000 };
  }
  if (ibcPesos < at(19)) {
    return { numerator: 16, denominator: 1000 };
  }
  if (ibcPesos <= at(20)) {
    return { numerator: 18, denominator: 1000 };
  }

  return { numerator: 20, denominator: 1000 };
}
