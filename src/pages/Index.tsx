import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import StatsCards from '@/components/energy/StatsCards';
import OverviewTab from '@/components/energy/OverviewTab';
import RegionsTab from '@/components/energy/RegionsTab';
import AnalyticsTab from '@/components/energy/AnalyticsTab';
import CompareTab from '@/components/energy/CompareTab';
import FilterPanel from '@/components/energy/FilterPanel';
import type { Region, ZoneStat, PriceHistoryPoint, Filters } from '@/components/energy/types';
import { API_URL } from '@/components/energy/types';
import { getCitiesForRegion } from '@/utils/citiesData';

export default function Index() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [zoneStats, setZoneStats] = useState<ZoneStat[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regionHistory, setRegionHistory] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const maxPrice = useMemo(() => 
    regions.length > 0 ? Math.max(...regions.map(r => r.current_price)) : 10,
    [regions]
  );

  const [filters, setFilters] = useState<Filters>({
    zones: [],
    searchQuery: '',
    period: '180',
    tariffType: 'all',
    priceRange: [0, maxPrice]
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      fetchRegionHistory(selectedRegion.id, parseInt(filters.period));
    }
  }, [selectedRegion, filters.period]);

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
      setRegionHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch region history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const calculateTrend = (history: PriceHistoryPoint[]) => {
    if (history.length < 2) return 'стабильно';
    const sorted = [...history].sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
    const first = parseFloat(sorted[0].price.toString());
    const last = parseFloat(sorted[sorted.length - 1].price.toString());
    const change = ((last - first) / first) * 100;
    
    if (change > 2) return 'растёт';
    if (change < -2) return 'снижается';
    return 'стабильно';
  };

  const getChartData = () => {
    if (regionHistory.length === 0) return [];
    
    const sorted = [...regionHistory]
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
      .slice(-6);
    
    return sorted.map((point, idx) => ({
      month: new Date(point.recorded_at).toLocaleDateString('ru-RU', { month: 'short' }),
      price: parseFloat(point.price.toString()),
      index: idx
    }));
  };

  const resetFilters = () => {
    setFilters({
      zones: [],
      searchQuery: '',
      period: '180',
      tariffType: 'all',
      priceRange: [0, maxPrice]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (!selectedRegion) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
              <Icon name="Zap" className="text-primary" size={36} />
              Мониторинг цен на электроэнергию
            </h1>
            <p className="text-muted-foreground mt-1">Актуальные данные по всем регионам РФ</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-4 py-2 text-sm font-mono">
              <Icon name="Calendar" size={16} className="mr-2" />
              Обновлено: {new Date().toLocaleDateString('ru-RU')}
            </Badge>
          </div>
        </header>

        <StatsCards regions={filteredRegions} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-5 md:inline-flex">
            <TabsTrigger value="overview" className="gap-2">
              <Icon name="LayoutDashboard" size={16} />
              <span className="hidden md:inline">Обзор</span>
            </TabsTrigger>
            <TabsTrigger value="regions" className="gap-2">
              <Icon name="Map" size={16} />
              <span className="hidden md:inline">Регионы</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="LineChart" size={16} />
              <span className="hidden md:inline">Аналитика</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <Icon name="BarChart3" size={16} />
              <span className="hidden md:inline">Сравнение</span>
            </TabsTrigger>
            <TabsTrigger value="filters" className="gap-2">
              <Icon name="SlidersHorizontal" size={16} />
              <span className="hidden md:inline">Фильтры</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              regions={filteredRegions}
              zoneStats={zoneStats}
              regionHistory={regionHistory}
              historyLoading={historyLoading}
              getChartData={getChartData}
            />
          </TabsContent>

          <TabsContent value="regions">
            <RegionsTab 
              regions={filteredRegions}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab 
              regions={filteredRegions}
              regionHistory={regionHistory}
              historyLoading={historyLoading}
              calculateTrend={calculateTrend}
              getChartData={getChartData}
            />
          </TabsContent>

          <TabsContent value="compare">
            <CompareTab zoneStats={zoneStats} />
          </TabsContent>

          <TabsContent value="filters">
            <FilterPanel 
              filters={filters}
              onFiltersChange={setFilters}
              zoneStats={zoneStats}
              maxPrice={maxPrice}
              onReset={resetFilters}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
