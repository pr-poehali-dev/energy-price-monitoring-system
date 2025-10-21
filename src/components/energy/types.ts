export interface City {
  name: string;
  price: number;
  population: number;
}

export interface Region {
  id: number;
  name: string;
  zone: string;
  population: number;
  current_price: number;
  change: number;
  last_updated?: string;
  cities?: City[];
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

export interface Filters {
  zones: string[];
  searchQuery: string;
  period: '30' | '90' | '180' | '365' | '730' | '1095';
  tariffType: 'all' | 'growing' | 'decreasing' | 'stable';
  priceRange: [number, number];
}

export type PeriodOption = '30' | '90' | '180' | '365' | '730' | '1095';

export const PERIOD_LABELS: Record<PeriodOption, string> = {
  '30': '1 месяц',
  '90': '3 месяца',
  '180': '6 месяцев',
  '365': '1 год',
  '730': '2 года',
  '1095': '3 года'
};

export const API_URL = 'https://functions.poehali.dev/0959059f-a220-4107-9cca-d2f58650ddf8';