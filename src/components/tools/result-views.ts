import type { RateFraction } from "../../domain/labor/rules/labor-rules";
import type { NetSalaryResult } from "../../domain/labor/salary/salary.types";
import type { PrimaResult } from "../../domain/labor/prima/prima.types";
import type { SettlementResult } from "../../domain/labor/settlement/settlement.types";
import type { FuelCostResult } from "../../domain/vehicles/fuel/fuel.types";
import type { TripCostResult } from "../../domain/vehicles/trip/trip.types";
import type { CreditResult } from "../../domain/finance/credit/credit.types";
import type { PercentageResult } from "../../domain/finance/percentage/percentage.types";
import {
  formatCurrency,
  formatDistance,
  formatFuel,
  formatNumber,
  formatPercentage,
  formatPreciseNumber,
} from "../../utils/format";
import { buildCopyText, type ResultView } from "./result-view";

function formatFraction(rate: RateFraction): string {
  return formatPercentage((rate.numerator / rate.denominator) * 100);
}

export function netSalaryView(result: NetSalaryResult): ResultView {
  const rows = [
    { label: "Salario bruto", value: formatCurrency(result.grossMonthlyPesos) },
    {
      label: "Ingreso base de cotización",
      value: formatCurrency(result.ibcPesos),
    },
    { label: "Salud (4 %)", value: formatCurrency(result.healthPesos) },
    { label: "Pensión (4 %)", value: formatCurrency(result.pensionPesos) },
    {
      label: `Fondo de solidaridad (${formatFraction(result.solidarityRate)})`,
      value: formatCurrency(result.solidarityPesos),
    },
    {
      label: "Total descuentos estimados",
      value: formatCurrency(result.totalDeductionsPesos),
    },
  ];
  const notes = [
    "No incluye retención en la fuente, libranzas, embargos ni aportes que no sean de salud, pensión y fondo de solidaridad.",
  ];
  if (result.ibcWasCapped) {
    notes.push(
      "El ingreso supera 25 salarios mínimos. La cotización se estimó sobre ese tope, no sobre todo el salario.",
    );
  }
  if (result.belowMinimumWage) {
    notes.push(
      "El valor es menor que el salario mínimo. En una nómina real la base de cotización no puede ser inferior a un salario mínimo, así que el descuento puede ser mayor.",
    );
  }

  const title = "Salario estimado después de seguridad social";
  const value = formatCurrency(result.estimatedNetPesos);
  const formula = "Estimado = salario − salud − pensión − fondo de solidaridad";
  return {
    title,
    value,
    rows,
    notes,
    formula,
    copyText: buildCopyText(title, value, rows, formula),
  };
}

export function primaView(result: PrimaResult): ResultView {
  const rows = [
    {
      label: "Salario",
      value: formatCurrency(result.ordinaryMonthlySalaryPesos),
    },
    {
      label: "Auxilio de transporte",
      value: formatCurrency(result.transportAllowancePesos),
    },
    { label: "Base", value: formatCurrency(result.basePesos) },
    { label: "Días", value: formatNumber(result.daysWorked) },
  ];
  const title = "Prima estimada";
  const value = formatCurrency(result.primaPesos);
  const formula = "Prima = (salario + auxilio de transporte) × días ÷ 360";
  return {
    title,
    value,
    rows,
    notes: [
      "180 días equivalen a la prima de un semestre: la mitad de la base mensual.",
    ],
    formula,
    copyText: buildCopyText(title, value, rows, formula),
  };
}

export function settlementView(result: SettlementResult): ResultView {
  const rows = [
    { label: "Cesantías", value: formatCurrency(result.severancePesos) },
    {
      label: "Intereses de cesantías",
      value: formatCurrency(result.severanceInterestPesos),
    },
    { label: "Prima", value: formatCurrency(result.primaPesos) },
    { label: "Vacaciones", value: formatCurrency(result.vacationPesos) },
    {
      label: "Salario pendiente",
      value: formatCurrency(result.unpaidSalaryPesos),
    },
  ];
  const title = "Liquidación estimada del periodo";
  const value = formatCurrency(result.totalPesos);
  const formula =
    "Cesantías y prima = (salario + auxilio) × días ÷ 360. Intereses = cesantías × 12 % × días ÷ 360. Vacaciones = salario × días ÷ 720.";
  return {
    title,
    value,
    rows,
    notes: [
      "No incluye indemnización, retención en la fuente, préstamos ni salario integral.",
      "El auxilio de transporte entra en cesantías y prima. No entra en vacaciones ni en el salario pendiente.",
    ],
    formula,
    copyText: buildCopyText(title, value, rows, formula),
  };
}

export function fuelView(result: FuelCostResult): ResultView {
  const rows = [
    {
      label: "Combustible",
      value: `${formatFuel(result.gallons, "gal")} (${formatFuel(result.liters, "L")})`,
    },
    { label: "Distancia total", value: formatDistance(result.totalDistanceKm) },
    {
      label: "Costo por persona",
      value: formatCurrency(result.costPerPassengerPesos),
    },
    {
      label: "Costo por kilómetro",
      value: formatCurrency(result.costPerKmPesos),
    },
  ];
  if (result.monthlyCostPesos !== null) {
    rows.push({
      label: "Estimación mensual de un recorrido",
      value: formatCurrency(result.monthlyCostPesos),
    });
  }

  const notes = [
    "La estimación mensual multiplica un solo recorrido por los viajes al mes. No multiplica otra vez los viajes de este cálculo.",
  ];
  if (result.mixedUnits) {
    notes.push(
      "Mezclaste galones y litros. La conversión usa el galón líquido de EE. UU.: 3,785411784 litros.",
    );
  }

  const title = "Costo estimado de combustible";
  const value = formatCurrency(result.totalCostPesos);
  const formula = "Costo = distancia ÷ rendimiento × precio × viajes";
  return {
    title,
    value,
    rows,
    notes,
    formula,
    copyText: buildCopyText(title, value, rows, formula),
  };
}

export function tripView(result: TripCostResult): ResultView {
  const route = [result.origin, result.destination]
    .filter((part) => part.length > 0)
    .join(" → ");
  const rows = [
    { label: "Combustible", value: formatCurrency(result.fuelCostPesos) },
    { label: "Peajes", value: formatCurrency(result.tollsPesos) },
    {
      label: "Distancia considerada",
      value: formatDistance(result.totalDistanceKm),
    },
    {
      label: "Costo por pasajero",
      value: formatCurrency(result.costPerPassengerPesos),
    },
    {
      label: "Costo por kilómetro",
      value: formatCurrency(result.costPerKmPesos),
    },
    {
      label: "Combustible estimado",
      value: `${formatFuel(result.gallons, "gal")} (${formatFuel(result.liters, "L")})`,
    },
  ];
  const notes = [
    result.roundTrip
      ? "Ida y vuelta duplica la distancia y los peajes que escribiste. Si el regreso tiene otros peajes, suma los dos trayectos y elige solo ida."
      : "Solo ida: se usan la distancia y los peajes tal como los ingresaste.",
  ];
  if (result.mixedUnits) {
    notes.push(
      "Mezclaste galones y litros. La conversión usa el galón líquido de EE. UU.: 3,785411784 litros.",
    );
  }

  const title =
    route.length > 0 ? `Costo estimado: ${route}` : "Costo estimado del viaje";
  const value = formatCurrency(result.totalCostPesos);
  const formula = "Total = combustible + peajes";
  return {
    title,
    value,
    rows,
    notes,
    formula,
    copyText: buildCopyText(title, value, rows, formula),
  };
}

const conversionCopy = {
  zero: "La tasa es 0 %, así que la cuota reparte el monto sin intereses.",
  "nominal-monthly":
    "Usamos la tasa tal como la escribiste: corresponde a cada mes.",
  "nominal-annual-divided-by-12":
    "Dividimos la tasa nominal anual entre 12. Esa es la definición de una tasa nominal mes vencido. No la convertimos a efectiva.",
  "effective-annual-to-monthly":
    "Convertimos la tasa efectiva anual a tasa del mes con (1 + tasa) ^ (1/12) − 1.",
} as const;

export function creditView(result: CreditResult): ResultView {
  const rows = [
    {
      label: "Cuota de referencia",
      value: formatCurrency(result.installmentPesos),
    },
    { label: "Total pagado", value: formatCurrency(result.totalPaidPesos) },
    { label: "Intereses", value: formatCurrency(result.totalInterestPesos) },
    { label: "Plazo", value: `${formatNumber(result.termMonths)} meses` },
    {
      label: "Tasa mensual usada",
      value: formatPercentage(result.periodicMonthlyRate * 100),
    },
  ];
  const title = "Cuota mensual estimada";
  const value = formatCurrency(result.installmentPesos);
  const formula = "Cuota = monto × i × (1 + i) ^ n ÷ ((1 + i) ^ n − 1)";
  return {
    title,
    value,
    rows,
    notes: [
      conversionCopy[result.conversion],
      "Cada interés se redondea al peso. La última cuota ajusta el saldo para que termine en cero. No incluye seguros ni comisiones.",
      "Si la última cuota cambia, es el ajuste del redondeo, no un cobro adicional oculto.",
    ],
    formula,
    copyText: buildCopyText(title, value, rows, formula),
    table: {
      caption: "Tabla de amortización estimada",
      columns: ["Mes", "Cuota", "Interés", "Capital", "Saldo"],
      rows: result.schedule.map((row) => [
        String(row.period),
        formatCurrency(row.paymentPesos),
        formatCurrency(row.interestPesos),
        formatCurrency(row.principalPesos),
        formatCurrency(row.closingBalancePesos),
      ]),
    },
  };
}

export function percentageView(result: PercentageResult): ResultView {
  const titles = {
    part: "Porcentaje del valor",
    increase: "Valor con incremento",
    discount: "Valor con descuento",
    difference: "Diferencia porcentual",
    ratio: "Porcentaje entre los dos valores",
  } as const;
  const formulas = {
    part: "Resultado = valor × porcentaje ÷ 100",
    increase: "Resultado = valor × (1 + porcentaje ÷ 100)",
    discount: "Resultado = valor × (1 − porcentaje ÷ 100)",
    difference:
      "Diferencia = (valor final − valor inicial) ÷ valor inicial × 100",
    ratio: "Porcentaje = primer valor ÷ segundo valor × 100",
  } as const;
  const title = titles[result.mode];
  const value =
    result.explanation === "percent"
      ? formatPercentage(result.result)
      : formatNumber(result.result);
  const precise = formatPreciseNumber(result.result);
  const rows =
    precise === value.replace("\u00a0%", "").trim()
      ? []
      : [{ label: "Valor sin redondear la vista", value: precise }];
  return {
    title,
    value,
    rows,
    notes: [
      "El resultado usa los números que escribiste. No asume IVA ni otra tarifa.",
    ],
    formula: formulas[result.mode],
    copyText: buildCopyText(title, value, rows, formulas[result.mode]),
  };
}
