import { roundHalfUp, type Pesos } from "../../common/money";
import type {
  AmortizationRow,
  CreditInput,
  CreditResult,
  RateConversion,
} from "./credit.types";

function monthlyRate(input: CreditInput): {
  rate: number;
  conversion: RateConversion;
} {
  if (input.ratePercent === 0) {
    return { rate: 0, conversion: "zero" };
  }

  const decimal = input.ratePercent / 100;
  if (input.rateKind === "nominal-monthly") {
    return { rate: decimal, conversion: "nominal-monthly" };
  }

  if (input.rateKind === "nominal-annual-monthly") {
    return { rate: decimal / 12, conversion: "nominal-annual-divided-by-12" };
  }

  return {
    rate: (1 + decimal) ** (1 / 12) - 1,
    conversion: "effective-annual-to-monthly",
  };
}

function fixedInstallment(
  principal: Pesos,
  monthly: number,
  termMonths: number,
): Pesos {
  if (monthly === 0) {
    return roundHalfUp(principal / termMonths);
  }

  const growth = (1 + monthly) ** termMonths;
  return roundHalfUp((principal * monthly * growth) / (growth - 1));
}

export function calculateCredit(input: CreditInput): CreditResult {
  const { rate, conversion } = monthlyRate(input);
  const regularInstallment = fixedInstallment(
    input.principalPesos,
    rate,
    input.termMonths,
  );
  const schedule: AmortizationRow[] = [];
  let balance = input.principalPesos;

  for (let period = 1; period <= input.termMonths; period += 1) {
    const openingBalancePesos = balance;
    const interestPesos = roundHalfUp(openingBalancePesos * rate);
    const isLast = period === input.termMonths;
    let paymentPesos = isLast
      ? openingBalancePesos + interestPesos
      : regularInstallment;
    let principalPesos = paymentPesos - interestPesos;

    if (!isLast && principalPesos > openingBalancePesos) {
      principalPesos = openingBalancePesos;
      paymentPesos = principalPesos + interestPesos;
    }

    if (principalPesos < 0) {
      throw new Error("installment does not cover interest");
    }

    balance = openingBalancePesos - principalPesos;
    schedule.push({
      period,
      openingBalancePesos,
      paymentPesos,
      interestPesos,
      principalPesos,
      closingBalancePesos: balance,
    });
  }

  const totalPaidPesos = schedule.reduce(
    (sum, row) => sum + row.paymentPesos,
    0,
  );

  return {
    principalPesos: input.principalPesos,
    ratePercent: input.ratePercent,
    rateKind: input.rateKind,
    conversion,
    periodicMonthlyRate: rate,
    termMonths: input.termMonths,
    installmentPesos: schedule[0]?.paymentPesos ?? 0,
    totalPaidPesos,
    totalInterestPesos: totalPaidPesos - input.principalPesos,
    schedule,
  };
}
