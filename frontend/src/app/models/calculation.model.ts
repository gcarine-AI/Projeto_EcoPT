export interface Calculation {
  id?: string;
  user_id?: string;
  car_km: number;
  flights: number;
  diet: 'vegan' | 'vegetariana' | 'omnivora';
  kwh: number;
  total_co2?: number;
  created_at?: number;
}

export interface ComparisonData {
  user_total: number;
  pt_average: number;
  eu_average: number;
  status: string;
  source?: string;
}
