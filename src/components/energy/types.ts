export interface Region {
  id: number;
  name: string;
  zone: string;
  population: number;
  current_price: number;
  change: number;
  last_updated?: string;
}

export interface ZoneStat {
  zone: string;
  avg_price: number;
  region_count: number;
}

export interface PriceHistoryPoint {
  price: number;
  recorded_at: string;
}

export const API_URL = 'https://functions.poehali.dev/0959059f-a220-4107-9cca-d2f58650ddf8';
