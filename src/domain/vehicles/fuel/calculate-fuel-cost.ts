import { roundHalfUp } from "../../common/money";
import { US_LIQUID_GALLON_LITERS } from "./fuel.constants";
import type { FuelCostInput, FuelCostResult } from "./fuel.types";

function quantitiesForDistance(
  distanceKm: number,
  input: FuelCostInput,
): { gallons: number; liters: number } {
  if (input.consumptionUnit === "km-per-gallon") {
    const gallons = distanceKm / input.consumption;
    return { gallons, liters: gallons * US_LIQUID_GALLON_LITERS };
  }

  const liters = distanceKm / input.consumption;
  return { liters, gallons: liters / US_LIQUID_GALLON_LITERS };
}

function costForQuantities(
  quantities: { gallons: number; liters: number },
  input: FuelCostInput,
): number {
  if (input.priceUnit === "cop-per-gallon") {
    return quantities.gallons * input.pricePesos;
  }

  return quantities.liters * input.pricePesos;
}

export function calculateFuelCost(input: FuelCostInput): FuelCostResult {
  const totalDistanceKm = input.distanceKm * input.trips;
  const quantities = quantitiesForDistance(totalDistanceKm, input);
  const exactCost = costForQuantities(quantities, input);
  const totalCostPesos = roundHalfUp(exactCost);
  const oneTripQuantities = quantitiesForDistance(input.distanceKm, input);
  const monthlyCostPesos =
    input.tripsPerMonth === null
      ? null
      : roundHalfUp(
          costForQuantities(oneTripQuantities, input) * input.tripsPerMonth,
        );

  return {
    distanceKm: input.distanceKm,
    trips: input.trips,
    passengers: input.passengers,
    tripsPerMonth: input.tripsPerMonth,
    totalDistanceKm,
    gallons: quantities.gallons,
    liters: quantities.liters,
    totalCostPesos,
    costPerPassengerPesos: roundHalfUp(totalCostPesos / input.passengers),
    costPerKmPesos:
      totalDistanceKm === 0 ? 0 : roundHalfUp(totalCostPesos / totalDistanceKm),
    monthlyCostPesos,
    mixedUnits:
      (input.consumptionUnit === "km-per-gallon" &&
        input.priceUnit === "cop-per-liter") ||
      (input.consumptionUnit === "km-per-liter" &&
        input.priceUnit === "cop-per-gallon"),
  };
}
