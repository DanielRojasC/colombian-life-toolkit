export interface ResultRow {
  label: string;
  value: string;
}

export interface ResultTable {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
}

export interface ResultView {
  title: string;
  value: string;
  rows: readonly ResultRow[];
  notes: readonly string[];
  formula: string;
  copyText: string;
  table?: ResultTable;
}

export function buildCopyText(
  title: string,
  value: string,
  rows: readonly ResultRow[],
  formula: string,
): string {
  const lines = [
    title,
    value,
    ...rows.map((row) => `${row.label}: ${row.value}`),
    formula,
  ];
  return `${lines.filter((line) => line.length > 0).join("\n")}\n\nEstimación. No es asesoría legal, tributaria ni financiera.`;
}
