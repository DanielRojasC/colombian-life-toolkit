import type { PercentageInput, PercentageResult } from "./percentage.types";

export function calculatePercentage(input: PercentageInput): PercentageResult {
  if (input.mode === "part" && input.base !== null && input.percent !== null) {
    return {
      mode: input.mode,
      result: (input.base * input.percent) / 100,
      explanation: "amount",
    };
  }

  if (
    input.mode === "increase" &&
    input.base !== null &&
    input.percent !== null
  ) {
    return {
      mode: input.mode,
      result: (input.base * (100 + input.percent)) / 100,
      explanation: "amount",
    };
  }

  if (
    input.mode === "discount" &&
    input.base !== null &&
    input.percent !== null
  ) {
    return {
      mode: input.mode,
      result: (input.base * (100 - input.percent)) / 100,
      explanation: "amount",
    };
  }

  if (
    input.mode === "difference" &&
    input.initial !== null &&
    input.final !== null
  ) {
    return {
      mode: input.mode,
      result: ((input.final - input.initial) / input.initial) * 100,
      explanation: "percent",
    };
  }

  if (
    input.mode === "ratio" &&
    input.initial !== null &&
    input.final !== null
  ) {
    return {
      mode: input.mode,
      result: (input.initial / input.final) * 100,
      explanation: "percent",
    };
  }

  throw new Error("percentage input was not validated");
}
