import type { Pesos } from "../domain/common/money";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 2,
});

const preciseFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 4,
});

export function formatCurrency(pesos: Pesos): string {
  return currencyFormatter.format(pesos);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPreciseNumber(value: number): string {
  return preciseFormatter.format(value);
}

export function formatPercentage(value: number): string {
  return `${numberFormatter.format(value)}\u00a0%`;
}

export function formatDistance(kilometers: number): string {
  return `${numberFormatter.format(kilometers)}\u00a0km`;
}

export function formatFuel(quantity: number, unit: "gal" | "L"): string {
  const label = unit === "gal" ? "gal" : "L";
  return `${preciseFormatter.format(quantity)}\u00a0${label}`;
}

export function formatIsoDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    return isoDate;
  }

  return `${match[3]}/${match[2]}/${match[1]}`;
}
