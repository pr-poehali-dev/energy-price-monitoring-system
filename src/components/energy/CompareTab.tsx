import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ZoneStat } from './types';

interface CompareTabProps {
  zoneStats: ZoneStat[];
}

export default function CompareTab({ zoneStats }: CompareTabProps) {
  return (
    <Card className="p-6 animate-fade-in">
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
  );
}
