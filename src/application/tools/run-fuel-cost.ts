import {
  parseLocalizedNumber,
  toIntegerPesos,
  toPositiveInteger,
} from "../../domain/common/parse-number";
import type { FieldError } from "../../domain/common/validation";
import { calculateFuelCost } from "../../domain/vehicles/fuel/calculate-fuel-cost";
import type {
  ConsumptionUnit,
  FuelCostResult,
  PriceUnit,
} from "../../domain/vehicles/fuel/fuel.types";
import { validateFuelCost } from "../../domain/vehicles/fuel/fuel.validation";
import { readChoice, readText, type ToolOutcome } from "./form-values";

const consumptionUnits = [
  "km-per-gallon",
  "km-per-liter",
] as const satisfies readonly ConsumptionUnit[];
const priceUnits = [
  "cop-per-gallon",
  "cop-per-liter",
] as const satisfies readonly PriceUnit[];

export function runFuelCost(formData: FormData): ToolOutcome<FuelCostResult> {
  const errors: FieldError[] = [];
  const distance = parseLocalizedNumber(readText(formData, "distanceKm"));
  const consumption = parseLocalizedNumber(readText(formData, "consumption"));
  const priceParsed = parseLocalizedNumber(readText(formData, "price"));
  const price = priceParsed === null ? null : toIntegerPesos(priceParsed);
  const tripsParsed = parseLocalizedNumber(readText(formData, "trips"));
  const trips =
    tripsParsed === null ? null : toPositiveInteger(tripsParsed, 1000);
  const passengersParsed = parseLocalizedNumber(
    readText(formData, "passengers"),
  );
  const passengers =
    passengersParsed === null ? null : toPositiveInteger(passengersParsed, 100);
  const monthRaw = readText(formData, "tripsPerMonth");
  const monthParsed =
    monthRaw.trim() === "" ? null : parseLocalizedNumber(monthRaw);
  const tripsPerMonth =
    monthRaw.trim() === ""
      ? null
      : monthParsed === null
        ? null
        : toPositiveInteger(monthParsed, 1000);
  const consumptionUnit = readChoice(
    formData,
    "consumptionUnit",
    consumptionUnits,
  );
  const priceUnit = readChoice(formData, "priceUnit", priceUnits);

  if (distance === null)
    errors.push({
      field: "distanceKm",
      message: "Ingresa una distancia válida.",
    });
  if (consumption === null)
    errors.push({
      field: "consumption",
      message: "Ingresa un consumo válido.",
    });
  if (price === null)
    errors.push({ field: "price", message: "Ingresa un precio válido." });
  if (trips === null)
    errors.push({
      field: "trips",
      message: "Ingresa un número entero de viajes.",
    });
  if (passengers === null)
    errors.push({
      field: "passengers",
      message: "Ingresa un número entero de pasajeros.",
    });
  if (monthRaw.trim() !== "" && tripsPerMonth === null) {
    errors.push({
      field: "tripsPerMonth",
      message: "Ingresa un número entero de viajes al mes.",
    });
  }
  if (consumptionUnit === null)
    errors.push({
      field: "consumptionUnit",
      message: "Elige la unidad del consumo.",
    });
  if (priceUnit === null)
    errors.push({ field: "priceUnit", message: "Elige la unidad del precio." });

  if (
    errors.length > 0 ||
    distance === null ||
    consumption === null ||
    price === null ||
    trips === null ||
    passengers === null ||
    consumptionUnit === null ||
    priceUnit === null
  ) {
    return { ok: false, errors };
  }

  const validation = validateFuelCost({
    distanceKm: distance,
    consumption,
    consumptionUnit,
    pricePesos: price,
    priceUnit,
    trips,
    passengers,
    tripsPerMonth,
  });
  if (!validation.ok) {
    return validation;
  }

  return { ok: true, result: calculateFuelCost(validation.value) };
}
