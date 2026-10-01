export interface FieldError {
  field: string;
  message: string;
}

export type Validation<T> =
  { ok: true; value: T } | { ok: false; errors: FieldError[] };

export function invalid(errors: FieldError[]): Validation<never> {
  return { ok: false, errors };
}
