import { describe, expect, it } from "vitest";
import { runNetSalary } from "../../src/application/tools/run-net-salary";
import {
  applyRateHalfUp,
  divideHalfUp,
  roundHalfUp,
} from "../../src/domain/common/money";
import { parseLocalizedNumber } from "../../src/domain/common/parse-number";
import { matchesSearch } from "../../src/domain/common/search";
import { calculatePercentage } from "../../src/domain/finance/percentage/calculate-percentage";
import { validatePercentage } from "../../src/domain/finance/percentage/percentage.validation";
import { calculateCredit } from "../../src/domain/finance/credit/calculate-credit";
import { validateCredit } from "../../src/domain/finance/credit/credit.validation";
import { calculatePrima } from "../../src/domain/labor/prima/calculate-prima";
import { validatePrima } from "../../src/domain/labor/prima/prima.validation";
import {
  activeLaborRules,
  solidarityRate,
} from "../../src/domain/labor/rules/labor-rules";
import { calculateNetSalary } from "../../src/domain/labor/salary/calculate-net-salary";
import { validateNetSalary } from "../../src/domain/labor/salary/salary.validation";
import { calculateSettlement } from "../../src/domain/labor/settlement/calculate-settlement";
import { validateSettlement } from "../../src/domain/labor/settlement/settlement.validation";
import { calculateFuelCost } from "../../src/domain/vehicles/fuel/calculate-fuel-cost";
import { validateFuelCost } from "../../src/domain/vehicles/fuel/fuel.validation";
import { calculateTripCost } from "../../src/domain/vehicles/trip/calculate-trip-cost";
import { laborCases } from "../fixtures/labor-cases";

const wage = activeLaborRules.minimumMonthlyWagePesos;

describe("money rounding", () => {
  it("rounds halves up and keeps exact pesos", () => {
    expect(roundHalfUp(0)).toBe(0);
    expect(roundHalfUp(0.5)).toBe(1);
    expect(roundHalfUp(1.5)).toBe(2);
    expect(roundHalfUp(70036.2)).toBe(70036);
    expect(applyRateHalfUp(wage, 4, 100)).toBe(70_036);
    expect(divideHalfUp(1_800_000 * 180, 360)).toBe(900_000);
  });
});

describe("localized numbers", () => {
  it("reads Colombian thousands and decimals", () => {
    expect(parseLocalizedNumber("1.750.905")).toBe(1_750_905);
    expect(parseLocalizedNumber("16.000")).toBe(16_000);
    expect(parseLocalizedNumber("40.5")).toBe(40.5);
    expect(parseLocalizedNumber("1,5")).toBe(1.5);
    expect(parseLocalizedNumber("1.234,56")).toBe(1234.56);
    expect(parseLocalizedNumber("")).toBeNull();
    expect(parseLocalizedNumber("abc")).toBeNull();
  });
});

describe("net salary", () => {
  it("estimates the 2026 minimum wage after health and pension", () => {
    const result = calculateNetSalary({
      grossMonthlyPesos: laborCases.minimumWage.grossMonthlyPesos,
    });
    expect(result.healthPesos).toBe(laborCases.minimumWage.healthPesos);
    expect(result.pensionPesos).toBe(laborCases.minimumWage.pensionPesos);
    expect(result.solidarityPesos).toBe(0);
    expect(result.estimatedNetPesos).toBe(
      laborCases.minimumWage.estimatedNetPesos,
    );
    expect(result.belowMinimumWage).toBe(false);
  });

  it("applies solidarity brackets without inventing a rate below 4 minimum wages", () => {
    expect(solidarityRate(4 * wage - 1).numerator).toBe(0);
    expect(solidarityRate(4 * wage)).toEqual({
      numerator: 10,
      denominator: 1000,
    });
    expect(solidarityRate(16 * wage - 1)).toEqual({
      numerator: 10,
      denominator: 1000,
    });
    expect(solidarityRate(16 * wage)).toEqual({
      numerator: 12,
      denominator: 1000,
    });
    expect(solidarityRate(20 * wage)).toEqual({
      numerator: 18,
      denominator: 1000,
    });
    expect(solidarityRate(20 * wage + 1)).toEqual({
      numerator: 20,
      denominator: 1000,
    });
  });

  it("caps the contribution base at 25 minimum wages", () => {
    const result = calculateNetSalary({ grossMonthlyPesos: 26 * wage });
    expect(result.ibcWasCapped).toBe(true);
    expect(result.ibcPesos).toBe(25 * wage);
    expect(result.healthPesos).toBe(wage);
    expect(result.estimatedNetPesos).toBe(
      26 * wage - result.totalDeductionsPesos,
    );
  });

  it("rejects zero, negative and empty input", () => {
    expect(validateNetSalary({ grossMonthlyPesos: 0 }).ok).toBe(false);
    expect(validateNetSalary({ grossMonthlyPesos: -1 }).ok).toBe(false);
    const form = new FormData();
    form.set("grossMonthly", "");
    expect(runNetSalary(form).ok).toBe(false);
  });

  it("parses a grouped salary from the form", () => {
    const form = new FormData();
    form.set("grossMonthly", "1.750.905");
    const outcome = runNetSalary(form);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.result.estimatedNetPesos).toBe(1_610_833);
    }
  });
});

describe("prima", () => {
  it("returns half the base for a full semester", () => {
    expect(
      calculatePrima({
        ordinaryMonthlySalaryPesos: 1_800_000,
        transportAllowancePesos: 0,
        daysWorked: 180,
      }).primaPesos,
    ).toBe(900_000);
  });

  it("includes transport and rejects a day outside the commercial year", () => {
    expect(
      calculatePrima({
        ordinaryMonthlySalaryPesos: 1_000_000,
        transportAllowancePesos: 200_000,
        daysWorked: 360,
      }).primaPesos,
    ).toBe(1_200_000);
    expect(
      validatePrima({
        ordinaryMonthlySalaryPesos: 1_000_000,
        transportAllowancePesos: 0,
        daysWorked: 0,
      }).ok,
    ).toBe(false);
    expect(
      validatePrima({
        ordinaryMonthlySalaryPesos: 1_000_000,
        transportAllowancePesos: 0,
        daysWorked: 361,
      }).ok,
    ).toBe(false);
    expect(
      validatePrima({
        ordinaryMonthlySalaryPesos: 1_000_000,
        transportAllowancePesos: 0,
        daysWorked: 10.5,
      }).ok,
    ).toBe(false);
  });
});

describe("settlement", () => {
  it("settles one commercial year and a partial period", () => {
    const year = calculateSettlement({
      ordinaryMonthlySalaryPesos: 3_600_000,
      transportAllowancePesos: 0,
      daysInPeriod: 360,
      unpaidWorkedDays: 0,
    });
    expect(year.severancePesos).toBe(3_600_000);
    expect(year.severanceInterestPesos).toBe(432_000);
    expect(year.primaPesos).toBe(3_600_000);
    expect(year.vacationPesos).toBe(1_800_000);
    expect(year.totalPesos).toBe(9_432_000);

    const partial = calculateSettlement({
      ordinaryMonthlySalaryPesos: 1_200_000,
      transportAllowancePesos: 200_000,
      daysInPeriod: 180,
      unpaidWorkedDays: 10,
    });
    expect(partial.severancePesos).toBe(700_000);
    expect(partial.severanceInterestPesos).toBe(42_000);
    expect(partial.primaPesos).toBe(700_000);
    expect(partial.vacationPesos).toBe(300_000);
    expect(partial.unpaidSalaryPesos).toBe(400_000);
    expect(partial.totalPesos).toBe(2_142_000);
  });

  it("rejects unpaid days above a 30-day month", () => {
    expect(
      validateSettlement({
        ordinaryMonthlySalaryPesos: 1_000_000,
        transportAllowancePesos: 0,
        daysInPeriod: 30,
        unpaidWorkedDays: 31,
      }).ok,
    ).toBe(false);
  });
});

describe("fuel and trip", () => {
  it("prices a gallon trip without a default fuel price", () => {
    const result = calculateFuelCost({
      distanceKm: 100,
      consumption: 40,
      consumptionUnit: "km-per-gallon",
      pricePesos: 16_000,
      priceUnit: "cop-per-gallon",
      trips: 1,
      passengers: 2,
      tripsPerMonth: 20,
    });
    expect(result.gallons).toBe(2.5);
    expect(result.totalCostPesos).toBe(40_000);
    expect(result.costPerPassengerPesos).toBe(20_000);
    expect(result.costPerKmPesos).toBe(400);
    expect(result.monthlyCostPesos).toBe(800_000);
    expect(result.mixedUnits).toBe(false);
  });

  it("allows zero distance and rejects a zero price", () => {
    const zero = calculateFuelCost({
      distanceKm: 0,
      consumption: 40,
      consumptionUnit: "km-per-gallon",
      pricePesos: 16_000,
      priceUnit: "cop-per-gallon",
      trips: 1,
      passengers: 1,
      tripsPerMonth: null,
    });
    expect(zero.totalCostPesos).toBe(0);
    expect(
      validateFuelCost({
        distanceKm: 10,
        consumption: 40,
        consumptionUnit: "km-per-gallon",
        pricePesos: 0,
        priceUnit: "cop-per-gallon",
        trips: 1,
        passengers: 1,
        tripsPerMonth: null,
      }).ok,
    ).toBe(false);
  });

  it("doubles distance and tolls on a round trip", () => {
    const result = calculateTripCost({
      origin: "Bogotá",
      destination: "Villavicencio",
      distanceKm: 100,
      consumption: 40,
      consumptionUnit: "km-per-gallon",
      pricePesos: 16_000,
      priceUnit: "cop-per-gallon",
      tollsPesos: 20_000,
      passengers: 4,
      roundTrip: true,
    });
    expect(result.fuelCostPesos).toBe(80_000);
    expect(result.tollsPesos).toBe(40_000);
    expect(result.totalCostPesos).toBe(120_000);
    expect(result.costPerPassengerPesos).toBe(30_000);
    expect(result.totalDistanceKm).toBe(200);
  });
});

describe("credit", () => {
  it("keeps a zero-interest loan and a closed balance", () => {
    const zero = calculateCredit({
      principalPesos: 1_200_000,
      ratePercent: 0,
      rateKind: "effective-annual",
      termMonths: 12,
    });
    expect(zero.totalInterestPesos).toBe(0);
    expect(zero.totalPaidPesos).toBe(1_200_000);
    expect(zero.schedule.at(-1)?.closingBalancePesos).toBe(0);

    const monthly = calculateCredit({
      principalPesos: 1_000_000,
      ratePercent: 1,
      rateKind: "nominal-monthly",
      termMonths: 12,
    });
    const nominal = calculateCredit({
      principalPesos: 1_000_000,
      ratePercent: 12,
      rateKind: "nominal-annual-monthly",
      termMonths: 12,
    });
    const effective = calculateCredit({
      principalPesos: 1_000_000,
      ratePercent: 12,
      rateKind: "effective-annual",
      termMonths: 12,
    });
    expect(monthly.installmentPesos).toBe(nominal.installmentPesos);
    expect(effective.installmentPesos).toBeLessThan(nominal.installmentPesos);
    expect(
      monthly.schedule.reduce((sum, row) => sum + row.principalPesos, 0),
    ).toBe(1_000_000);
    expect(monthly.schedule.at(-1)?.closingBalancePesos).toBe(0);
    expect(monthly.conversion).toBe("nominal-monthly");
    expect(nominal.conversion).toBe("nominal-annual-divided-by-12");
    expect(effective.conversion).toBe("effective-annual-to-monthly");
  });

  it("rejects a negative rate and a zero term", () => {
    expect(
      validateCredit({
        principalPesos: 1000,
        ratePercent: -1,
        rateKind: "effective-annual",
        termMonths: 12,
      }).ok,
    ).toBe(false);
    expect(
      validateCredit({
        principalPesos: 1000,
        ratePercent: 1,
        rateKind: "effective-annual",
        termMonths: 0,
      }).ok,
    ).toBe(false);
  });
});

describe("percentages", () => {
  it("covers part, increase, discount, difference and ratio", () => {
    expect(
      calculatePercentage({
        mode: "part",
        base: 500_000,
        percent: 20,
        initial: null,
        final: null,
      }).result,
    ).toBe(100_000);
    expect(
      calculatePercentage({
        mode: "increase",
        base: 100,
        percent: 10,
        initial: null,
        final: null,
      }).result,
    ).toBe(110);
    expect(
      calculatePercentage({
        mode: "discount",
        base: 200_000,
        percent: 10,
        initial: null,
        final: null,
      }).result,
    ).toBe(180_000);
    expect(
      calculatePercentage({
        mode: "difference",
        base: null,
        percent: null,
        initial: 100,
        final: 150,
      }).result,
    ).toBe(50);
    expect(
      calculatePercentage({
        mode: "ratio",
        base: null,
        percent: null,
        initial: 25,
        final: 200,
      }).result,
    ).toBe(12.5);
  });

  it("rejects a discount above 100 and division by zero", () => {
    expect(
      validatePercentage({
        mode: "discount",
        base: 100,
        percent: 101,
        initial: null,
        final: null,
      }).ok,
    ).toBe(false);
    expect(
      validatePercentage({
        mode: "difference",
        base: null,
        percent: null,
        initial: 0,
        final: 10,
      }).ok,
    ).toBe(false);
    expect(
      validatePercentage({
        mode: "ratio",
        base: null,
        percent: null,
        initial: 10,
        final: 0,
      }).ok,
    ).toBe(false);
  });
});

describe("search", () => {
  it("ignores accents and requires every word", () => {
    expect(matchesSearch("pensión salario", ["pension", "salario neto"])).toBe(
      true,
    );
    expect(matchesSearch("gasolina peaje", ["combustible"])).toBe(false);
  });
});
