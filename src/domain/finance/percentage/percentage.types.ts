export type PercentageMode =
  "part" | "increase" | "discount" | "difference" | "ratio";

export interface PercentageInput {
  mode: PercentageMode;
  base: number | null;
  percent: number | null;
  initial: number | null;
  final: number | null;
}

export interface PercentageResult {
  mode: PercentageMode;
  result: number;
  explanation: "amount" | "percent";
}
