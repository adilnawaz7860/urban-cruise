import type { Destination } from "@/types";

export type HotelCategory = "budget" | "standard" | "luxury";
export type MealPlan = "none" | "breakfast" | "halfBoard" | "fullBoard";
export type Transportation = "none" | "shared" | "private";

export const HOTEL_RATES: Record<HotelCategory, number> = {
  budget: 1500,
  standard: 3000,
  luxury: 6000,
};

export const MEAL_RATES: Record<MealPlan, number> = {
  none: 0,
  breakfast: 300,
  halfBoard: 700,
  fullBoard: 1200,
};

export const TRANSPORT_RATES: Record<Transportation, number> = {
  none: 0,
  shared: 800, // per traveler, per day
  private: 2800, // flat per day
};

export const FLIGHT_COST = 6500;

/** Relative cost-of-travel multiplier per destination. */
export const DESTINATION_FACTORS: Record<string, number> = {
  goa: 1,
  kashmir: 1.1,
  kerala: 1.05,
  rajasthan: 1,
  himachal: 1,
  andaman: 1.2,
};

export interface CalculatorInput {
  destination: Destination;
  travelers: number;
  days: number;
  hotelCategory: HotelCategory;
  flightsIncluded: boolean;
  mealPlan: MealPlan;
  transportation: Transportation;
}

export interface CalculatorResult {
  accommodation: number;
  meals: number;
  transport: number;
  flights: number;
  total: number;
  perPerson: number;
}

export function calculateTripCost(input: CalculatorInput): CalculatorResult {
  const { destination, travelers, days, hotelCategory, flightsIncluded, mealPlan, transportation } =
    input;

  const nights = Math.max(days - 1, 1);
  const factor = DESTINATION_FACTORS[destination.id] ?? 1;

  const accommodation = Math.round(HOTEL_RATES[hotelCategory] * factor * nights * travelers);
  const meals = Math.round(MEAL_RATES[mealPlan] * factor * days * travelers);
  const transport =
    transportation === "shared"
      ? Math.round(TRANSPORT_RATES.shared * days * travelers)
      : transportation === "private"
        ? Math.round(TRANSPORT_RATES.private * factor * days)
        : 0;
  const flights = flightsIncluded
    ? Math.round(FLIGHT_COST * factor * travelers)
    : 0;

  const total = accommodation + meals + transport + flights;
  const perPerson = Math.round(total / Math.max(travelers, 1));

  return { accommodation, meals, transport, flights, total, perPerson };
}
