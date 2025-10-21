import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Region, PriceHistoryPoint } from './types';
import { PERIOD_LABELS } from './types';
import { exportMultiRegionHistoryToExcel, exportMultiRegionHistoryToCSV } from '@/utils/exportData';

interface AnalyticsTabProps {
  regions: Region[];
  regionHistory: PriceHistoryPoint[];
  historyLoading: boolean;
  calculateTrend: (history: PriceHistoryPoint[]) => string;
  getChartData: () => any[];
  period: string;
  onPeriodChange: (period: string) => void;
  selectedRegions: number[];
  onSelectedRegionsChange: (regionIds: number[]) => void;
  multiRegionData: any[];
  multiRegionLoading: boolean;
}

export default function AnalyticsTab({ 
  regions, 
  regionHistory, 
  historyLoading,
  calculateTrend,
  getChartData,
  period,
  onPeriodChange,
  selectedRegions,
  onSelectedRegionsChange,
  multiRegionData,
  multiRegionLoading
}: AnalyticsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  
  const filteredRegions = regions.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleRegion = (regionId: number) => {
    if (selectedRegions.includes(regionId)) {
      onSelectedRegionsChange(selectedRegions.filter(id => id !== regionId));
    } else {
      if (selectedRegions.length < 10) {
        onSelectedRegionsChange([...selectedRegions, regionId]);
      }
    }
  };
  
  const clearSelection = () => {
    onSelectedRegionsChange([]);
  };
  
  const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--destructive))',
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    '#8884d8',
    '#82ca9d'
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Исторические данные цен</h3>
          <div className="flex items-center gap-3">
            {selectedRegions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={multiRegionLoading || multiRegionData.length === 0}>
                    <Icon name="Download" size={16} className="mr-2" />
                    Экспорт
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportMultiRegionHistoryToExcel(multiRegionData, regions, selectedRegions)}>
                    <Icon name="FileSpreadsheet" size={16} className="mr-2" />
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportMultiRegionHistoryToCSV(multiRegionData, regions, selectedRegions)}>
                    <Icon name="FileText" size={16} className="mr-2" />
                    CSV (.csv)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Icon name="Calendar" className="text-primary" size={20} />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-muted-foreground">Период:</span>
          {Object.entries(PERIOD_LABELS).map(([value, label]) => (
            <Button 
              key={value}
              size="sm" 
              variant={period === value ? 'default' : 'outline'}
              onClick={() => onPeriodChange(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="mb-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant={showRegionSelector ? 'default' : 'outline'}
              onClick={() => setShowRegionSelector(!showRegionSelector)}
              className="w-full md:w-auto"
            >
              <Icon name="Filter" size={16} className="mr-2" />
              Выбрать регионы ({selectedRegions.length})
            </Button>
            {selectedRegions.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                <Icon name="X" size={16} className="mr-2" />
                Очистить
              </Button>
            )}
          </div>
          
          {showRegionSelector && (
            <Card className="p-4 border-2 border-primary/20">
              <div className="mb-3">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Поиск региона..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {filteredRegions.map((region) => (
                  <div 
                    key={region.id} 
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => toggleRegion(region.id)}
                  >
                    <Checkbox 
                      checked={selectedRegions.includes(region.id)}
                      onCheckedChange={() => toggleRegion(region.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{region.name}</p>
                      <p className="text-xs text-muted-foreground">{region.zone}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {region.current_price.toFixed(2)} ₽
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Максимум 10 регионов одновременно
              </p>
            </Card>
          )}
          
          {selectedRegions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedRegions.map((regionId) => {
                const region = regions.find(r => r.id === regionId);
                if (!region) return null;
                return (
                  <Badge key={regionId} variant="secondary" className="gap-2">
                    {region.name}
                    <Icon 
                      name="X" 
                      size={14} 
                      className="cursor-pointer hover:text-destructive" 
                      onClick={() => toggleRegion(regionId)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
          
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Тренд за {getPeriodLabel(period)}</p>
                <p className="text-2xl font-bold mt-1">{calculateTrend(regionHistory)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {selectedRegions.length > 0 ? `${selectedRegions.length} регионов` : 'История цен'}
                </p>
                <p className="text-2xl font-bold mt-1">
                  {selectedRegions.length > 0 ? multiRegionData.length : regionHistory.length} точек
                </p>
              </div>
            </div>
          </div>
        </div>
        {(historyLoading || multiRegionLoading) ? (
          <div className="h-[400px] flex items-center justify-center">
            <Icon name="Loader2" className="animate-spin text-primary" size={48} />
          </div>
        ) : selectedRegions.length > 0 ? (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={multiRegionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                angle={-25} 
                textAnchor="end" 
                height={70}
                fontSize={11}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Цена (₽/кВт⋅ч)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {selectedRegions.map((regionId, idx) => {
                const region = regions.find(r => r.id === regionId);
                return (
                  <Line 
                    key={regionId}
                    type="monotone" 
                    dataKey={`region_${regionId}`} 
                    stroke={CHART_COLORS[idx % CHART_COLORS.length]} 
                    strokeWidth={2}
                    name={region?.name || `Регион ${regionId}`}
                    dot={false}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                angle={-25} 
                textAnchor="end" 
                height={70}
                fontSize={11}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="price" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Цена (₽)" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="TrendingUp" className="text-destructive" size={24} />
            <h3 className="text-xl font-semibold">Самый высокий рост</h3>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {regions
              .filter(r => r.change > 0)
              .sort((a, b) => b.change - a.change)
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
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {regions
              .filter(r => r.change < 0)
              .sort((a, b) => a.change - b.change)
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
    </div>
  );
}