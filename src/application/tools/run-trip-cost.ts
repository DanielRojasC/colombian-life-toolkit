import {
  parseLocalizedNumber,
  toIntegerPesos,
  toPositiveInteger,
} from "../../domain/common/parse-number";
import type { FieldError } from "../../domain/common/validation";
import { calculateTripCost } from "../../domain/vehicles/trip/calculate-trip-cost";
import type { TripCostResult } from "../../domain/vehicles/trip/trip.types";
import { validateTripCost } from "../../domain/vehicles/trip/trip.validation";
import type {
  ConsumptionUnit,
  PriceUnit,
} from "../../domain/vehicles/fuel/fuel.types";
import { readChoice, readText, type ToolOutcome } from "./form-values";

const consumptionUnits = [
  "km-per-gallon",
  "km-per-liter",
] as const satisfies readonly ConsumptionUnit[];
const priceUnits = [
  "cop-per-gallon",
  "cop-per-liter",
] as const satisfies readonly PriceUnit[];

export function runTripCost(formData: FormData): ToolOutcome<TripCostResult> {
  const errors: FieldError[] = [];
  const distance = parseLocalizedNumber(readText(formData, "distanceKm"));
  const consumption = parseLocalizedNumber(readText(formData, "consumption"));
  const priceParsed = parseLocalizedNumber(readText(formData, "price"));
  const price = priceParsed === null ? null : toIntegerPesos(priceParsed);
  const tollsRaw = readText(formData, "tolls");
  const tollsParsed =
    tollsRaw.trim() === "" ? 0 : parseLocalizedNumber(tollsRaw);
  const tolls = tollsParsed === null ? null : toIntegerPesos(tollsParsed);
  const passengersParsed = parseLocalizedNumber(
    readText(formData, "passengers"),
  );
  const passengers =
    passengersParsed === null ? null : toPositiveInteger(passengersParsed, 100);
  const consumptionUnit = readChoice(
    formData,
    "consumptionUnit",
    consumptionUnits,
  );
  const priceUnit = readChoice(formData, "priceUnit", priceUnits);
  const direction = readChoice(formData, "direction", [
    "one-way",
    "round-trip",
  ] as const);

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
  if (tolls === null)
    errors.push({
      field: "tolls",
      message: "Ingresa un valor de peajes válido.",
    });
  if (passengers === null)
    errors.push({
      field: "passengers",
      message: "Ingresa un número entero de pasajeros.",
    });
  if (consumptionUnit === null)
    errors.push({
      field: "consumptionUnit",
      message: "Elige la unidad del consumo.",
    });
  if (priceUnit === null)
    errors.push({ field: "priceUnit", message: "Elige la unidad del precio." });
  if (direction === null)
    errors.push({
      field: "direction",
      message: "Elige si el viaje es de ida o de ida y vuelta.",
    });

  if (
    errors.length > 0 ||
    distance === null ||
    consumption === null ||
    price === null ||
    tolls === null ||
    passengers === null ||
    consumptionUnit === null ||
    priceUnit === null ||
    direction === null
  ) {
    return { ok: false, errors };
  }

  const validation = validateTripCost({
    origin: readText(formData, "origin"),
    destination: readText(formData, "destination"),
    distanceKm: distance,
    consumption,
    consumptionUnit,
    pricePesos: price,
    priceUnit,
    tollsPesos: tolls,
    passengers,
    roundTrip: direction === "round-trip",
  });
  if (!validation.ok) {
    return validation;
  }

  return { ok: true, result: calculateTripCost(validation.value) };
}
