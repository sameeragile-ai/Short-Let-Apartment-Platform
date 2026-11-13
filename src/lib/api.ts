import { FurnitureCategory, LagosArea } from '../types';

export async function simulatedRequest<T>(
  payload: T,
  simulateError = false,
  delayMs = 380
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  if (simulateError) {
    throw new Error('Network timeout connecting to Lagos payment gateway. Please retry.');
  }
  return payload;
}

export function estimatePropertyValuation(area: LagosArea, bedrooms: number): {
  propertyValueNgn: number;
  estimatedMonthlyGrossNgn: number;
  nightlyRateNgn: number;
} {
  const basePerBedroom: Record<LagosArea, number> = {
    'Banana Island': 155000,
    Ikoyi: 135000,
    'Victoria Island': 115000,
    'Lekki Phase 1': 85000,
    'Ikeja GRA': 75000,
    Yaba: 55000,
  };
  const nightlyRateNgn = basePerBedroom[area] * bedrooms + 35000;
  const estimatedMonthlyGrossNgn = Math.round(nightlyRateNgn * 24);
  const propertyValueNgn = estimatedMonthlyGrossNgn * 48;
  return { propertyValueNgn, estimatedMonthlyGrossNgn, nightlyRateNgn };
}

export const FURNITURE_CATEGORIES: Array<'All' | FurnitureCategory> = [
  'All',
  'Living',
  'Bedroom',
  'Dining',
  'Lighting',
  'Décor',
  'Outdoor',
];

export const LAGOS_AREAS: Array<'All' | LagosArea> = [
  'All',
  'Ikoyi',
  'Victoria Island',
  'Lekki Phase 1',
  'Banana Island',
  'Ikeja GRA',
  'Yaba',
];
