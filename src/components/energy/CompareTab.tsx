import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ZoneStat, Region } from './types';
import { exportRegionsToExcel, exportRegionsToCSV } from '@/utils/exportData';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompareTabProps {
  zoneStats: ZoneStat[];
  regions: Region[];
}

export default function CompareTab({ zoneStats, regions }: CompareTabProps) {
  const { t } = useLanguage();
  const sortedRegionsByPrice = [...regions].sort((a, b) => b.current_price - a.current_price);
  const sortedRegionsByChange = [...regions].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  return (
    <div className="space-y-6 animate-fade-in">
    <Tabs defaultValue="zones" className="space-y-6">
      <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
        <TabsTrigger value="zones" className="gap-2">
          <Icon name="Map" size={16} />
          {t('compare.byDistricts')}
        </TabsTrigger>
        <TabsTrigger value="regions" className="gap-2">
          <Icon name="MapPin" size={16} />
          {t('compare.byRegions')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="zones">
        <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">{t('compare.comparison')}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              {t('regions.export')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportRegionsToExcel(regions)}>
              <Icon name="FileSpreadsheet" size={16} className="mr-2" />
              {t('export.excel')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportRegionsToCSV(regions)}>
              <Icon name="FileText" size={16} className="mr-2" />
              {t('export.csv')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          <Bar dataKey="avgPrice" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name={t('compare.avgPrice')} />
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
            <p className="text-xs text-muted-foreground">{zone.region_count} {t('regions.count')}</p>
          </div>
        ))}
      </div>
        </Card>
      </TabsContent>

      <TabsContent value="regions">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{t('compare.mostExpensive')}</h3>
              <Icon name="TrendingUp" className="text-destructive" size={20} />
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {sortedRegionsByPrice.map((region, idx) => (
                <div key={region.id} className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{region.name}</p>
                    <p className="text-xs text-muted-foreground">{region.zone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-mono font-bold">{region.current_price.toFixed(2)} ₽</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Icon 
                        name={region.change > 0 ? "TrendingUp" : "TrendingDown"} 
                        size={12} 
                        className={region.change > 0 ? 'text-destructive' : 'text-secondary'}
                      />
                      <span className={`text-xs ${region.change > 0 ? 'text-destructive' : 'text-secondary'}`}>
                        {Math.abs(region.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">{t('compare.cheapest')}</h3>
              <Icon name="TrendingDown" className="text-secondary" size={20} />
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {sortedRegionsByPrice.slice().reverse().map((region, idx) => (
                <div key={region.id} className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{region.name}</p>
                    <p className="text-xs text-muted-foreground">{region.zone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-mono font-bold">{region.current_price.toFixed(2)} ₽</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Icon 
                        name={region.change > 0 ? "TrendingUp" : "TrendingDown"} 
                        size={12} 
                        className={region.change > 0 ? 'text-destructive' : 'text-secondary'}
                      />
                      <span className={`text-xs ${region.change > 0 ? 'text-destructive' : 'text-secondary'}`}>
                        {Math.abs(region.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Наибольшие изменения цен</h3>
              <Icon name="Activity" className="text-primary" size={20} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedRegionsByChange.slice(0, 15).map((region) => (
                <div key={region.id} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{region.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{region.zone}</p>
                    </div>
                    <Badge variant={region.change > 0 ? "destructive" : "secondary"} className="ml-2">
                      {region.change > 0 ? '+' : ''}{region.change}%
                    </Badge>
                  </div>
                  <p className="text-lg font-mono font-bold">{region.current_price.toFixed(2)} ₽</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
    </div>
  );
}