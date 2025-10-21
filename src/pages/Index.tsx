import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import StatsCards from '@/components/energy/StatsCards';
import OverviewTab from '@/components/energy/OverviewTab';
import RegionsTab from '@/components/energy/RegionsTab';
import AnalyticsTab from '@/components/energy/AnalyticsTab';
import CompareTab from '@/components/energy/CompareTab';
import type { Region, ZoneStat, PriceHistoryPoint } from '@/components/energy/types';
import { API_URL } from '@/components/energy/types';

export default function Index() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [zoneStats, setZoneStats] = useState<ZoneStat[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regionHistory, setRegionHistory] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      fetchRegionHistory(selectedRegion.id);
    }
  }, [selectedRegion]);

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
        last_updated: r.last_updated
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

  const fetchRegionHistory = async (regionId: number) => {
    try {
      setHistoryLoading(true);
      const response = await fetch(`${API_URL}?region_id=${regionId}&days=180`);
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

        <StatsCards regions={regions} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
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
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab 
              regions={regions}
              zoneStats={zoneStats}
              regionHistory={regionHistory}
              historyLoading={historyLoading}
              getChartData={getChartData}
            />
          </TabsContent>

          <TabsContent value="regions">
            <RegionsTab 
              regions={regions}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab 
              regions={regions}
              regionHistory={regionHistory}
              historyLoading={historyLoading}
              calculateTrend={calculateTrend}
              getChartData={getChartData}
            />
          </TabsContent>

          <TabsContent value="compare">
            <CompareTab zoneStats={zoneStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
