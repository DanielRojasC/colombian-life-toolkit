import { isIntegerPesos } from "../../common/money";
import {
  invalid,
  type FieldError,
  type Validation,
} from "../../common/validation";
import { validateFuelCost } from "../fuel/fuel.validation";
import type { TripCostInput } from "./trip.types";

const MAX_LABEL = 80;
const MAX_TOLLS = 100_000_000;

export function validateTripCost(
  input: TripCostInput,
): Validation<TripCostInput> {
  const errors: FieldError[] = [];

  if (input.origin.trim().length > MAX_LABEL) {
    errors.push({
      field: "origin",
      message: "El origen debe tener 80 caracteres o menos.",
    });
  }

  if (input.destination.trim().length > MAX_LABEL) {
    errors.push({
      field: "destination",
      message: "El destino debe tener 80 caracteres o menos.",
    });
  }

  if (!isIntegerPesos(input.tollsPesos) || input.tollsPesos > MAX_TOLLS) {
    errors.push({
      field: "tolls",
      message: "Ingresa un valor de peajes igual o mayor que cero.",
    });
  }

  const fuelValidation = validateFuelCost({
    distanceKm: input.distanceKm,
    consumption: input.consumption,
    consumptionUnit: input.consumptionUnit,
    pricePesos: input.pricePesos,
    priceUnit: input.priceUnit,
    trips: 1,
    passengers: input.passengers,
    tripsPerMonth: null,
  });

  if (!fuelValidation.ok) {
    errors.push(
      ...fuelValidation.errors.filter((error) => error.field !== "trips"),
    );
  }

  if (errors.length > 0) {
    return invalid(errors);
  }

  return {
    ok: true,
    value: {
      ...input,
      origin: input.origin.trim(),
      destination: input.destination.trim(),
    },
  };
}
