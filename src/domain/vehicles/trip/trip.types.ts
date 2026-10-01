import type { ConsumptionUnit, PriceUnit } from "../fuel/fuel.types";

export interface TripCostInput {
  origin: string;
  destination: string;
  distanceKm: number;
  consumption: number;
  consumptionUnit: ConsumptionUnit;
  pricePesos: number;
  priceUnit: PriceUnit;
  tollsPesos: number;
  passengers: number;
  roundTrip: boolean;
}

export interface TripCostResult {
  origin: string;
  destination: string;
  roundTrip: boolean;
  distanceKm: number;
  totalDistanceKm: number;
  fuelCostPesos: number;
  tollsPesos: number;
  totalCostPesos: number;
  costPerPassengerPesos: number;
  costPerKmPesos: number;
  gallons: number;
  liters: number;
  mixedUnits: boolean;
}
