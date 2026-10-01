export type ConsumptionUnit = "km-per-gallon" | "km-per-liter";
export type PriceUnit = "cop-per-gallon" | "cop-per-liter";

export interface FuelCostInput {
  distanceKm: number;
  consumption: number;
  consumptionUnit: ConsumptionUnit;
  pricePesos: number;
  priceUnit: PriceUnit;
  trips: number;
  passengers: number;
  tripsPerMonth: number | null;
}

export interface FuelCostResult {
  distanceKm: number;
  trips: number;
  passengers: number;
  tripsPerMonth: number | null;
  totalDistanceKm: number;
  gallons: number;
  liters: number;
  totalCostPesos: number;
  costPerPassengerPesos: number;
  costPerKmPesos: number;
  monthlyCostPesos: number | null;
  mixedUnits: boolean;
}
