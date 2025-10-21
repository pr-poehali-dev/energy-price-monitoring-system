import { useState, useEffect } from 'react';
import type { Region, ZoneStat, PriceHistoryPoint } from '@/components/energy/types';
import { API_URL } from '@/components/energy/types';
import { getCitiesForRegion } from '@/utils/citiesData';
import { formatDateForChart } from '@/utils/dateFormatter';

export function useEnergyData(language: 'ru' | 'en') {
  const [regions, setRegions] = useState<Region[]>([]);
  const [zoneStats, setZoneStats] = useState<ZoneStat[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regionHistory, setRegionHistory] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedAnalyticsRegions, setSelectedAnalyticsRegions] = useState<number[]>([]);
  const [multiRegionData, setMultiRegionData] = useState<any[]>([]);
  const [multiRegionLoading, setMultiRegionLoading] = useState(false);
  const [allRegionsHistory, setAllRegionsHistory] = useState<Map<number, PriceHistoryPoint[]>>(new Map());

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      
      const formattedRegions = data.regions.map((r: any) => ({
        id: r.id,
        name: r.name,
        zone: r.zone,
        population: parseFloat(r.population),
        current_price: parseFloat(r.current_price),
        change: r.change,
        last_updated: r.last_updated,
        cities: getCitiesForRegion(r.name)
      }));
      
      const formattedZones = data.zones.map((z: any) => ({
        zone: z.zone,
        avg_price: parseFloat(z.avg_price),
        region_count: z.region_count
      }));
      
      setRegions(formattedRegions);
      setZoneStats(formattedZones);
      if (formattedRegions.length > 0) {
        setSelectedRegion(formattedRegions[0]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegionHistory = async (regionId: number, days: number) => {
    try {
      setHistoryLoading(true);
      const response = await fetch(`${API_URL}?region_id=${regionId}&days=${days}`);
      const data = await response.json();
      const history = data.history || [];
      setRegionHistory(history);
      
      setAllRegionsHistory(prev => {
        const newMap = new Map(prev);
        newMap.set(regionId, history);
        return newMap;
      });
    } catch (error) {
      console.error('Failed to fetch region history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };
  
  const fetchAllRegionsHistory = async (days: number) => {
    try {
      const historyMap = new Map<number, PriceHistoryPoint[]>();
      
      const batchSize = 10;
      const batches = [];
      
      for (let i = 0; i < regions.length; i += batchSize) {
        batches.push(regions.slice(i, i + batchSize));
      }
      
      for (const batch of batches) {
        const promises = batch.map(region =>
          fetch(`${API_URL}?region_id=${region.id}&days=${days}`)
            .then(r => r.json())
            .then(data => ({ id: region.id, history: data.history || [] }))
            .catch(err => {
              console.error(`Failed to fetch history for region ${region.id}:`, err);
              return { id: region.id, history: [] };
            })
        );
        
        const results = await Promise.all(promises);
        
        results.forEach(({ id, history }) => {
          if (history.length > 0) {
            historyMap.set(id, history);
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`Loaded history for ${historyMap.size} regions out of ${regions.length}`);
      setAllRegionsHistory(historyMap);
    } catch (error) {
      console.error('Failed to fetch all regions history:', error);
    }
  };
  
  const fetchMultiRegionHistory = async (regionIds: number[], days: number) => {
    try {
      setMultiRegionLoading(true);
      
      const promises = regionIds.map(id => 
        fetch(`${API_URL}?region_id=${id}&days=${days}`).then(r => r.json())
      );
      
      const results = await Promise.all(promises);
      
      const allDates: string[] = [];
      results.forEach(result => {
        const history = result.history || [];
        history.forEach((point: any) => {
          allDates.push(point.recorded_at);
        });
      });
      
      const dateMap = new Map<string, any>();
      
      results.forEach((result, idx) => {
        const regionId = regionIds[idx];
        const history = result.history || [];
        
        history.forEach((point: any) => {
          const date = formatDateForChart(point.recorded_at, allDates, language);
          
          if (!dateMap.has(date)) {
            dateMap.set(date, { date, timestamp: new Date(point.recorded_at).getTime() });
          }
          
          const entry = dateMap.get(date);
          entry[`region_${regionId}`] = parseFloat(point.price);
        });
      });
      
      const chartData = Array.from(dateMap.values())
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(({ timestamp, ...rest }) => rest);
      
      setMultiRegionData(chartData);
    } catch (error) {
      console.error('Failed to fetch multi-region history:', error);
    } finally {
      setMultiRegionLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (regions.length > 0) {
      fetchAllRegionsHistory(730);
    }
  }, [regions]);

  return {
    regions,
    zoneStats,
    selectedRegion,
    setSelectedRegion,
    regionHistory,
    loading,
    historyLoading,
    selectedAnalyticsRegions,
    setSelectedAnalyticsRegions,
    multiRegionData,
    setMultiRegionData,
    multiRegionLoading,
    allRegionsHistory,
    fetchRegionHistory,
    fetchMultiRegionHistory
  };
}
