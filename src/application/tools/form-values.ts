import type { FieldError } from "../../domain/common/validation";

export type ToolOutcome<T> =
  { ok: true; result: T } | { ok: false; errors: FieldError[] };

export function readText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export function readChoice<T extends string>(
  formData: FormData,
  field: string,
  allowed: readonly T[],
): T | null {
  const value = readText(formData, field);
  return allowed.find((item) => item === value) ?? null;
}
