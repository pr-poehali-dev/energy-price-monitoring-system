import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const API_URL = 'https://functions.poehali.dev/0959059f-a220-4107-9cca-d2f58650ddf8';

interface Region {
  id: number;
  name: string;
  zone: string;
  population: number;
  current_price: number;
  change: number;
  last_updated?: string;
}

interface ZoneStat {
  zone: string;
  avg_price: number;
  region_count: number;
}

interface PriceHistoryPoint {
  price: number;
  recorded_at: string;
}

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

  const avgPrice = regions.length > 0 
    ? (regions.reduce((sum, r) => sum + r.current_price, 0) / regions.length).toFixed(2)
    : '0.00';
  
  const maxPriceRegion = regions.reduce((max, r) => r.current_price > max.current_price ? r : max, regions[0] || { current_price: 0, name: '-' });
  const minPriceRegion = regions.reduce((min, r) => r.current_price < min.current_price ? r : min, regions[0] || { current_price: 0, name: '-' });

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-scale-in">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Средняя цена РФ</p>
                <p className="text-3xl font-bold font-mono mt-1">{avgPrice} ₽</p>
                <p className="text-xs text-muted-foreground mt-1">за кВт⋅ч</p>
              </div>
              <Icon name="TrendingUp" className="text-secondary" size={32} />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-secondary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Макс. цена</p>
                <p className="text-3xl font-bold font-mono mt-1">{maxPriceRegion.current_price.toFixed(2)} ₽</p>
                <p className="text-xs text-muted-foreground mt-1">{maxPriceRegion.name}</p>
              </div>
              <Icon name="ArrowUpCircle" className="text-destructive" size={32} />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-chart-2/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Мин. цена</p>
                <p className="text-3xl font-bold font-mono mt-1">{minPriceRegion.current_price.toFixed(2)} ₽</p>
                <p className="text-xs text-muted-foreground mt-1">{minPriceRegion.name}</p>
              </div>
              <Icon name="ArrowDownCircle" className="text-secondary" size={32} />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-chart-4/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Регионов</p>
                <p className="text-3xl font-bold font-mono mt-1">{regions.length}</p>
                <p className="text-xs text-muted-foreground mt-1">отслеживается</p>
              </div>
              <Icon name="MapPin" className="text-chart-4" size={32} />
            </div>
          </Card>
        </div>

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

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Динамика цен по регионам</h3>
                  <Icon name="TrendingUp" className="text-primary" size={20} />
                </div>
                {historyLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Icon name="Loader2" className="animate-spin text-primary" size={32} />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                      <Line type="monotone" dataKey="price" stroke="hsl(var(--chart-1))" strokeWidth={3} name="Цена (₽)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Средние цены по округам</h3>
                  <Icon name="BarChart3" className="text-secondary" size={20} />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={zoneStats.map(z => ({ zone: z.zone, avgPrice: z.avg_price }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="zone" stroke="hsl(var(--muted-foreground))" angle={-15} textAnchor="end" height={80} fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="avgPrice" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} name="Средняя цена (₽/кВт⋅ч)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Топ регионов по изменению цены</h3>
                <Icon name="Activity" className="text-chart-4" size={20} />
              </div>
              <div className="space-y-3">
                {regions
                  .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
                  .slice(0, 5)
                  .map((region) => (
                    <div key={region.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-4">
                        <Icon name="MapPin" className="text-primary" size={20} />
                        <div>
                          <p className="font-medium">{region.name}</p>
                          <p className="text-sm text-muted-foreground">{region.zone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-mono font-semibold">{region.current_price.toFixed(2)} ₽</p>
                        <Badge variant={region.change > 0 ? "destructive" : "default"} className="mt-1">
                          <Icon name={region.change > 0 ? "TrendingUp" : "TrendingDown"} size={12} className="mr-1" />
                          {Math.abs(region.change)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="regions" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Все регионы</h3>
                  <Badge variant="outline">{regions.length} регионов</Badge>
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {regions.map((region) => (
                    <div
                      key={region.id}
                      onClick={() => setSelectedRegion(region)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedRegion.id === region.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon name="MapPin" className={selectedRegion.id === region.id ? 'text-primary' : 'text-muted-foreground'} size={18} />
                          <div>
                            <p className="font-medium">{region.name}</p>
                            <p className="text-xs text-muted-foreground">{region.zone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-mono font-bold">{region.current_price.toFixed(2)} ₽</p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <Icon 
                              name={region.change > 0 ? "TrendingUp" : "TrendingDown"} 
                              size={14} 
                              className={region.change > 0 ? 'text-destructive' : 'text-secondary'}
                            />
                            <span className={`text-xs font-medium ${region.change > 0 ? 'text-destructive' : 'text-secondary'}`}>
                              {Math.abs(region.change)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="Info" className="text-primary" size={24} />
                  <h3 className="text-xl font-semibold">Детали региона</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-2xl font-bold mb-1">{selectedRegion.name}</p>
                    <Badge variant="outline">{selectedRegion.zone}</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Текущая цена</p>
                      <p className="text-4xl font-mono font-bold">{selectedRegion.current_price.toFixed(2)} ₽</p>
                      <p className="text-sm text-muted-foreground mt-1">за кВт⋅ч</p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Изменение</p>
                        <Icon 
                          name={selectedRegion.change > 0 ? "TrendingUp" : "TrendingDown"} 
                          className={selectedRegion.change > 0 ? 'text-destructive' : 'text-secondary'}
                          size={18}
                        />
                      </div>
                      <p className={`text-2xl font-bold ${selectedRegion.change > 0 ? 'text-destructive' : 'text-secondary'}`}>
                        {selectedRegion.change > 0 ? '+' : ''}{selectedRegion.change}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">за последний месяц</p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Users" size={16} className="text-muted-foreground" />
                        <p className="text-sm font-medium">Население</p>
                      </div>
                      <p className="text-xl font-semibold">{selectedRegion.population} млн</p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Zap" size={16} className="text-muted-foreground" />
                        <p className="text-sm font-medium">Ежемесячный расход</p>
                      </div>
                      <p className="text-xl font-semibold">{(selectedRegion.population * 450).toFixed(0)} МВт⋅ч</p>
                      <p className="text-xs text-muted-foreground mt-1">ориентировочно</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Исторические данные цен</h3>
                <Icon name="Calendar" className="text-primary" size={20} />
              </div>
              <div className="mb-4 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Тренд за 180 дней</p>
                    <p className="text-2xl font-bold mt-1">{calculateTrend(regionHistory)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">История цен</p>
                    <p className="text-2xl font-bold mt-1">{regionHistory.length} точек</p>
                  </div>
                </div>
              </div>
              {historyLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <Icon name="Loader2" className="animate-spin text-primary" size={48} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={getChartData()}>
                  <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} name="Цена (₽)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="TrendingUp" className="text-destructive" size={24} />
                  <h3 className="text-xl font-semibold">Самый высокий рост</h3>
                </div>
                <div className="space-y-3">
                  {regions
                    .filter(r => r.change > 0)
                    .sort((a, b) => b.change - a.change)
                    .slice(0, 3)
                    .map((region, idx) => (
                      <div key={region.id} className="flex items-center gap-4 p-4 rounded-lg bg-destructive/10">
                        <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{region.name}</p>
                          <p className="text-sm text-muted-foreground">{region.current_price.toFixed(2)} ₽</p>
                        </div>
                        <Badge variant="destructive">+{region.change.toFixed(1)}%</Badge>
                      </div>
                    ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="TrendingDown" className="text-secondary" size={24} />
                  <h3 className="text-xl font-semibold">Самое большое снижение</h3>
                </div>
                <div className="space-y-3">
                  {regions
                    .filter(r => r.change < 0)
                    .sort((a, b) => a.change - b.change)
                    .slice(0, 3)
                    .map((region, idx) => (
                      <div key={region.id} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{region.name}</p>
                          <p className="text-sm text-muted-foreground">{region.current_price.toFixed(2)} ₽</p>
                        </div>
                        <Badge className="bg-secondary text-secondary-foreground">{region.change.toFixed(1)}%</Badge>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compare" className="animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Сравнение тарифов по федеральным округам</h3>
                <Icon name="BarChart3" className="text-primary" size={20} />
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={zoneStats.map(z => ({ zone: z.zone, avgPrice: z.avg_price, regions: z.region_count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="zone" stroke="hsl(var(--muted-foreground))" angle={-25} textAnchor="end" height={120} fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Цена (₽/кВт⋅ч)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="avgPrice" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Средняя цена" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {zoneStats.slice(0, 3).map((zone, idx) => (
                  <div key={zone.zone} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-chart-1' : idx === 1 ? 'bg-chart-2' : 'bg-chart-4'}`} />
                      <p className="font-medium text-sm">{zone.zone}</p>
                    </div>
                    <p className="text-2xl font-mono font-bold mb-1">{zone.avg_price.toFixed(2)} ₽</p>
                    <p className="text-xs text-muted-foreground">{zone.region_count} регионов</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}