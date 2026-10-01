export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("es-CO")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export function matchesSearch(query: string, fields: string[]): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery.length === 0) {
    return true;
  }

  const haystack = normalizeSearchText(fields.join(" "));
  return normalizedQuery.split(/\s+/).every((term) => haystack.includes(term));
}
