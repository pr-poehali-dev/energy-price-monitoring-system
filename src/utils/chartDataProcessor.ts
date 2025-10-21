import type { PriceHistoryPoint, Filters } from '@/components/energy/types';
import { formatDateForChart } from '@/utils/dateFormatter';

export function processChartData(
  regionHistory: PriceHistoryPoint[],
  filters: Filters,
  language: 'ru' | 'en'
) {
  if (regionHistory.length === 0) return [];
  
  let filteredByTariff = regionHistory;
  
  if (filters.tariffStructure !== 'all') {
    filteredByTariff = filteredByTariff.filter(p => p.tariff_type === filters.tariffStructure);
  }
  
  if (filters.timeZone && filters.timeZone !== 'all') {
    filteredByTariff = filteredByTariff.filter(p => p.time_zone === filters.timeZone);
  }
  
  if (filters.consumerType !== 'all') {
    filteredByTariff = filteredByTariff.filter(p => p.consumer_type === filters.consumerType);
  }
  
  const sorted = [...filteredByTariff]
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
  
  let filtered = sorted;
  
  if (filters.period !== 'all') {
    const daysFilter = parseInt(filters.period);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysFilter);
    filtered = sorted.filter(point => new Date(point.recorded_at) >= cutoffDate);
  }
  const allDates = filtered.map(p => p.recorded_at);
  
  if (filters.tariffStructure === 'all' && filters.displayMode === 'average') {
    const grouped = new Map<string, { prices: number[], date: string, timestamp: number }>();
    
    filtered.forEach((point) => {
      const dateOnly = point.recorded_at.split('T')[0];
      
      if (!grouped.has(dateOnly)) {
        const displayDate = formatDateForChart(point.recorded_at, allDates, language);
        grouped.set(dateOnly, { 
          prices: [],
          date: displayDate,
          timestamp: new Date(point.recorded_at).getTime()
        });
      }
      
      const entry = grouped.get(dateOnly)!;
      entry.prices.push(parseFloat(point.price.toString()));
    });
    
    return Array.from(grouped.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ prices, date }) => ({
        date,
        price: prices.reduce((sum, p) => sum + p, 0) / prices.length
      }));
  }
  
  if (filters.tariffStructure === 'all' && filters.displayMode === 'zones') {
    const grouped = new Map<string, any>();
    
    filtered.forEach((point) => {
      const dateOnly = point.recorded_at.split('T')[0];
      
      if (!grouped.has(dateOnly)) {
        const displayDate = formatDateForChart(point.recorded_at, allDates, language);
        grouped.set(dateOnly, { 
          date: displayDate,
          timestamp: new Date(point.recorded_at).getTime()
        });
      }
      
      const entry = grouped.get(dateOnly)!;
      const price = parseFloat(point.price.toString());
      
      if (point.time_zone) {
        entry[point.time_zone] = price;
      }
    });
    
    return Array.from(grouped.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ timestamp, ...rest }) => rest);
  }
  
  const grouped = new Map<string, any>();
  
  filtered.forEach((point) => {
    const dateOnly = point.recorded_at.split('T')[0];
    const groupKey = point.time_zone ? `${dateOnly}_${point.time_zone}` : dateOnly;
    
    if (!grouped.has(groupKey)) {
      const displayDate = formatDateForChart(point.recorded_at, allDates, language);
      grouped.set(groupKey, { 
        date: displayDate,
        timestamp: new Date(point.recorded_at).getTime()
      });
    }
    
    const entry = grouped.get(groupKey)!;
    const price = parseFloat(point.price.toString());
    
    if (point.time_zone) {
      entry[point.time_zone] = price;
    } else {
      entry.price = price;
    }
    
    entry.tariff = point.tariff_type;
    entry.consumer = point.consumer_type;
  });
  
  return Array.from(grouped.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ timestamp, ...rest }) => rest);
}

export function calculateTrend(history: PriceHistoryPoint[]) {
  if (history.length < 2) return 'стабильно';
  const sorted = [...history].sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
  const first = parseFloat(sorted[0].price.toString());
  const last = parseFloat(sorted[sorted.length - 1].price.toString());
  const change = ((last - first) / first) * 100;
  
  if (change > 2) return 'растёт';
  if (change < -2) return 'снижается';
  return 'стабильно';
}
