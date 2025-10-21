import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Region, PriceHistoryPoint } from './types';

interface AnalyticsTabProps {
  regions: Region[];
  regionHistory: PriceHistoryPoint[];
  historyLoading: boolean;
  calculateTrend: (history: PriceHistoryPoint[]) => string;
  getChartData: () => any[];
  period: string;
  onPeriodChange: (period: string) => void;
}

export default function AnalyticsTab({ 
  regions, 
  regionHistory, 
  historyLoading,
  calculateTrend,
  getChartData,
  period,
  onPeriodChange
}: AnalyticsTabProps) {
  const getPeriodLabel = (days: string) => {
    switch(days) {
      case '30': return '1 месяц';
      case '90': return '3 месяца';
      case '180': return '6 месяцев';
      case '365': return '1 год';
      case '730': return '2 года';
      case '1095': return '3 года';
      default: return days + ' дней';
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Исторические данные цен</h3>
          <Icon name="Calendar" className="text-primary" size={20} />
        </div>
        
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-muted-foreground">Период:</span>
          <Button 
            size="sm" 
            variant={period === '30' ? 'default' : 'outline'}
            onClick={() => onPeriodChange('30')}
          >
            1 месяц
          </Button>
          <Button 
            size="sm" 
            variant={period === '90' ? 'default' : 'outline'}
            onClick={() => onPeriodChange('90')}
          >
            3 месяца
          </Button>
          <Button 
            size="sm" 
            variant={period === '180' ? 'default' : 'outline'}
            onClick={() => onPeriodChange('180')}
          >
            6 месяцев
          </Button>
          <Button 
            size="sm" 
            variant={period === '365' ? 'default' : 'outline'}
            onClick={() => onPeriodChange('365')}
          >
            1 год
          </Button>
          <Button 
            size="sm" 
            variant={period === '730' ? 'default' : 'outline'}
            onClick={() => onPeriodChange('730')}
          >
            2 года
          </Button>
          <Button 
            size="sm" 
            variant={period === '1095' ? 'default' : 'outline'}
            onClick={() => onPeriodChange('1095')}
          >
            3 года
          </Button>
        </div>
        <div className="mb-4 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Тренд за {getPeriodLabel(period)}</p>
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
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
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