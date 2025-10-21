import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { Region, ZoneStat, PriceHistoryPoint, PeriodOption } from './types';
import { PERIOD_LABELS } from './types';
import { exportHistoryToExcel, exportHistoryToCSV, exportRegionsToExcel, exportRegionsToCSV } from '@/utils/exportData';
import PredictionCard from './PredictionCard';

interface OverviewTabProps {
  regions: Region[];
  zoneStats: ZoneStat[];
  regionHistory: PriceHistoryPoint[];
  historyLoading: boolean;
  getChartData: () => any[];
  selectedRegion: Region | null;
  onRegionChange: (regionId: number) => void;
  period: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
}

export default function OverviewTab({ 
  regions, 
  zoneStats, 
  regionHistory, 
  historyLoading,
  getChartData,
  selectedRegion,
  onRegionChange,
  period,
  onPeriodChange
}: OverviewTabProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Динамика цен по регионам</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={historyLoading || regionHistory.length === 0}>
                    <Icon name="Download" size={16} className="mr-2" />
                    Экспорт
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => selectedRegion && exportHistoryToExcel(regionHistory, selectedRegion.name)}>
                    <Icon name="FileSpreadsheet" size={16} className="mr-2" />
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => selectedRegion && exportHistoryToCSV(regionHistory, selectedRegion.name)}>
                    <Icon name="FileText" size={16} className="mr-2" />
                    CSV (.csv)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedRegion?.id.toString()} onValueChange={(value) => onRegionChange(parseInt(value))}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={period} onValueChange={onPeriodChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PERIOD_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {historyLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Icon name="Loader2" className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  angle={-25} 
                  textAnchor="end" 
                  height={60} 
                  fontSize={11}
                  interval="preserveStartEnd"
                  minTickGap={30}
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
          <h3 className="text-xl font-semibold">Все регионы по изменению цены</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Экспорт
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportRegionsToExcel(regions)}>
                <Icon name="FileSpreadsheet" size={16} className="mr-2" />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportRegionsToCSV(regions)}>
                <Icon name="FileText" size={16} className="mr-2" />
                CSV (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {regions
            .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
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

      {selectedRegion && regionHistory.length >= 10 && (
        <PredictionCard 
          regionHistory={regionHistory}
          regionName={selectedRegion.name}
          currentPrice={selectedRegion.current_price}
          daysAhead={90}
          historicalPeriodDays={parseInt(period)}
        />
      )}
    </div>
  );
}