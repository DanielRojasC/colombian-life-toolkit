import { isIntegerPesos } from "../../common/money";
import {
  invalid,
  type FieldError,
  type Validation,
} from "../../common/validation";
import {
  MAX_CONSUMPTION,
  MAX_DISTANCE_KM,
  MAX_PASSENGERS,
  MAX_TRIPS,
  MAX_UNIT_PRICE_PESOS,
} from "./fuel.constants";
import type { ConsumptionUnit, FuelCostInput, PriceUnit } from "./fuel.types";

const consumptionUnits: readonly ConsumptionUnit[] = [
  "km-per-gallon",
  "km-per-liter",
];
const priceUnits: readonly PriceUnit[] = ["cop-per-gallon", "cop-per-liter"];

export function validateFuelCost(
  input: FuelCostInput,
): Validation<FuelCostInput> {
  const errors: FieldError[] = [];

  if (
    !Number.isFinite(input.distanceKm) ||
    input.distanceKm < 0 ||
    input.distanceKm > MAX_DISTANCE_KM
  ) {
    errors.push({
      field: "distanceKm",
      message: "Ingresa una distancia entre 0 y 100.000 km.",
    });
  }

  if (
    !Number.isFinite(input.consumption) ||
    input.consumption <= 0 ||
    input.consumption > MAX_CONSUMPTION
  ) {
    errors.push({
      field: "consumption",
      message: "Ingresa un consumo mayor que cero.",
    });
  }

  if (!consumptionUnits.includes(input.consumptionUnit)) {
    errors.push({
      field: "consumptionUnit",
      message: "Elige la unidad del consumo.",
    });
  }

  if (
    !isIntegerPesos(input.pricePesos) ||
    input.pricePesos <= 0 ||
    input.pricePesos > MAX_UNIT_PRICE_PESOS
  ) {
    errors.push({
      field: "price",
      message: "Ingresa un precio mayor que cero.",
    });
  }

  if (!priceUnits.includes(input.priceUnit)) {
    errors.push({ field: "priceUnit", message: "Elige la unidad del precio." });
  }

  if (
    !Number.isInteger(input.trips) ||
    input.trips < 1 ||
    input.trips > MAX_TRIPS
  ) {
    errors.push({
      field: "trips",
      message: "Ingresa un número de viajes entre 1 y 1.000.",
    });
  }

  if (
    !Number.isInteger(input.passengers) ||
    input.passengers < 1 ||
    input.passengers > MAX_PASSENGERS
  ) {
    errors.push({
      field: "passengers",
      message: "Ingresa entre 1 y 100 pasajeros.",
    });
  }

  if (
    input.tripsPerMonth !== null &&
    (!Number.isInteger(input.tripsPerMonth) ||
      input.tripsPerMonth < 1 ||
      input.tripsPerMonth > MAX_TRIPS)
  ) {
    errors.push({
      field: "tripsPerMonth",
      message: "Si estimas el mes, ingresa entre 1 y 1.000 viajes.",
    });
  }

  if (errors.length > 0) {
    return invalid(errors);
  }

  return { ok: true, value: input };
}
