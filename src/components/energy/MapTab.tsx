import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { Region } from './types';

interface MapTabProps {
  regions: Region[];
  onSelectRegion: (region: Region) => void;
}

export default function MapTab({ regions, onSelectRegion }: MapTabProps) {
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);

  const getColorByPrice = (price: number) => {
    if (price < 4) return 'hsl(var(--chart-2))';
    if (price < 4.5) return 'hsl(var(--chart-3))';
    if (price < 5) return 'hsl(var(--chart-4))';
    if (price < 5.5) return 'hsl(var(--chart-5))';
    return 'hsl(var(--destructive))';
  };

  const minPrice = Math.min(...regions.map(r => r.current_price));
  const maxPrice = Math.max(...regions.map(r => r.current_price));

  const sortedByPrice = [...regions].sort((a, b) => a.current_price - b.current_price);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Тепловая карта цен</h3>
              <p className="text-sm text-muted-foreground mt-1">Нажмите на регион для детальной информации</p>
            </div>
            <Icon name="Map" className="text-primary" size={24} />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Диапазон цен (₽/кВт⋅ч)</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono">{minPrice.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">—</span>
                <span className="text-xs font-mono">{maxPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-4 rounded-full flex overflow-hidden">
              <div className="flex-1 bg-gradient-to-r from-[hsl(var(--chart-2))] via-[hsl(var(--chart-4))] to-[hsl(var(--destructive))]"></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Низкие тарифы</span>
              <span>Высокие тарифы</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {regions.map((region) => (
              <div
                key={region.id}
                onClick={() => onSelectRegion(region)}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                style={{
                  backgroundColor: `${getColorByPrice(region.current_price)}15`,
                  borderColor: getColorByPrice(region.current_price)
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{region.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{region.zone}</p>
                  </div>
                  <Icon name="MapPin" size={14} className="text-muted-foreground ml-1 flex-shrink-0" />
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-mono font-bold" style={{ color: getColorByPrice(region.current_price) }}>
                    {region.current_price.toFixed(2)}
                  </p>
                  <span className="text-xs text-muted-foreground">₽</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Icon 
                    name={region.change > 0 ? "TrendingUp" : "TrendingDown"} 
                    size={12} 
                    className={region.change > 0 ? 'text-destructive' : 'text-secondary'}
                  />
                  <span className={`text-xs font-medium ${region.change > 0 ? 'text-destructive' : 'text-secondary'}`}>
                    {Math.abs(region.change)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="TrendingDown" className="text-secondary" size={24} />
              <h3 className="text-lg font-semibold">Самые низкие цены</h3>
            </div>
            <div className="space-y-3">
              {sortedByPrice.slice(0, 5).map((region, idx) => (
                <div 
                  key={region.id}
                  onClick={() => onSelectRegion(region)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{region.name}</p>
                    <p className="text-xs text-muted-foreground">{region.zone}</p>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {region.current_price.toFixed(2)} ₽
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="TrendingUp" className="text-destructive" size={24} />
              <h3 className="text-lg font-semibold">Самые высокие цены</h3>
            </div>
            <div className="space-y-3">
              {sortedByPrice.slice(-5).reverse().map((region, idx) => (
                <div 
                  key={region.id}
                  onClick={() => onSelectRegion(region)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{region.name}</p>
                    <p className="text-xs text-muted-foreground">{region.zone}</p>
                  </div>
                  <Badge variant="destructive" className="font-mono">
                    {region.current_price.toFixed(2)} ₽
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {hoveredRegion && (
            <Card className="p-4 border-primary">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Info" className="text-primary" size={18} />
                <p className="text-sm font-semibold">Быстрый просмотр</p>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="font-medium">{hoveredRegion.name}</p>
                  <p className="text-xs text-muted-foreground">{hoveredRegion.zone}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-mono font-bold">{hoveredRegion.current_price.toFixed(2)}</p>
                  <span className="text-sm text-muted-foreground">₽/кВт⋅ч</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon 
                    name={hoveredRegion.change > 0 ? "TrendingUp" : "TrendingDown"} 
                    size={14} 
                    className={hoveredRegion.change > 0 ? 'text-destructive' : 'text-secondary'}
                  />
                  <span className={`text-sm font-medium ${hoveredRegion.change > 0 ? 'text-destructive' : 'text-secondary'}`}>
                    {hoveredRegion.change > 0 ? '+' : ''}{hoveredRegion.change}%
                  </span>
                  <span className="text-xs text-muted-foreground">за месяц</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
