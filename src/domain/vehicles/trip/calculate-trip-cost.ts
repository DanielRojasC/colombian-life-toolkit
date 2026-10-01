import { roundHalfUp } from "../../common/money";
import { calculateFuelCost } from "../fuel/calculate-fuel-cost";
import type { TripCostInput, TripCostResult } from "./trip.types";

/**
 * Round trip doubles both the entered distance and the entered tolls.
 * The caller must say so in the interface. If return tolls differ, the
 * person should enter the total tolls and choose one way.
 */
export function calculateTripCost(input: TripCostInput): TripCostResult {
  const multiplier = input.roundTrip ? 2 : 1;
  const totalDistanceKm = input.distanceKm * multiplier;
  const tollsPesos = input.tollsPesos * multiplier;
  const fuel = calculateFuelCost({
    distanceKm: totalDistanceKm,
    consumption: input.consumption,
    consumptionUnit: input.consumptionUnit,
    pricePesos: input.pricePesos,
    priceUnit: input.priceUnit,
    trips: 1,
    passengers: input.passengers,
    tripsPerMonth: null,
  });

  const totalCostPesos = fuel.totalCostPesos + tollsPesos;

  return {
    origin: input.origin,
    destination: input.destination,
    roundTrip: input.roundTrip,
    distanceKm: input.distanceKm,
    totalDistanceKm,
    fuelCostPesos: fuel.totalCostPesos,
    tollsPesos,
    totalCostPesos,
    costPerPassengerPesos: roundHalfUp(totalCostPesos / input.passengers),
    costPerKmPesos:
      totalDistanceKm === 0 ? 0 : roundHalfUp(totalCostPesos / totalDistanceKm),
    gallons: fuel.gallons,
    liters: fuel.liters,
    mixedUnits: fuel.mixedUnits,
  };
}
