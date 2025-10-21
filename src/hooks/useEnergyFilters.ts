import { useState, useEffect, useMemo } from 'react';
import type { Region, Filters } from '@/components/energy/types';

export function useEnergyFilters(regions: Region[]) {
  const maxPrice = useMemo(() => 
    regions.length > 0 ? Math.max(...regions.map(r => r.current_price)) : 10,
    [regions]
  );

  const [filters, setFilters] = useState<Filters>({
    zones: [],
    searchQuery: '',
    period: 'all',
    tariffType: 'all',
    tariffStructure: 'all',
    timeZone: 'all',
    consumerType: 'all',
    priceRange: [0, maxPrice],
    displayMode: 'average'
  });

  useEffect(() => {
    if (maxPrice > 0 && filters.priceRange[1] === 0) {
      setFilters(prev => ({ ...prev, priceRange: [0, maxPrice] }));
    }
  }, [maxPrice]);

  const filteredRegions = useMemo(() => {
    return regions.filter(region => {
      if (filters.zones.length > 0 && !filters.zones.includes(region.zone)) {
        return false;
      }
      
      if (filters.searchQuery && !region.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      if (filters.tariffType !== 'all') {
        if (filters.tariffType === 'growing' && region.change <= 0) return false;
        if (filters.tariffType === 'decreasing' && region.change >= 0) return false;
        if (filters.tariffType === 'stable' && Math.abs(region.change) > 2) return false;
      }
      
      if (region.current_price < filters.priceRange[0] || region.current_price > filters.priceRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [regions, filters]);

  const resetFilters = () => {
    setFilters({
      zones: [],
      searchQuery: '',
      period: 'all',
      tariffType: 'all',
      tariffStructure: 'all',
      timeZone: 'all',
      consumerType: 'all',
      priceRange: [0, maxPrice],
      displayMode: 'average'
    });
  };

  return {
    filters,
    setFilters,
    filteredRegions,
    resetFilters,
    maxPrice
  };
}
