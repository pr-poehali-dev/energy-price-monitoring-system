import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Region } from './types';

interface RussiaMapProps {
  regions: Region[];
  onSelectRegion: (region: Region) => void;
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

export default function RussiaMap({ regions, onSelectRegion }: RussiaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getColorByPrice = (price: number) => {
    if (price < 4) return '#10b981';
    if (price < 4.5) return '#84cc16';
    if (price < 5) return '#eab308';
    if (price < 5.5) return '#f97316';
    return '#ef4444';
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const minPrice = Math.min(...regions.map(r => r.current_price));
  const maxPrice = Math.max(...regions.map(r => r.current_price));
  const avgPrice = regions.reduce((sum, r) => sum + r.current_price, 0) / regions.length;

  const sortedByPrice = [...regions].sort((a, b) => a.current_price - b.current_price);
  const topCheap = sortedByPrice.slice(0, 5);
  const topExpensive = sortedByPrice.slice(-5).reverse();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Карта России</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Интерактивная визуализация тарифов по регионам
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Диапазон цен (₽/кВт⋅ч)</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono">{minPrice.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">—</span>
                <span className="text-xs font-mono">{maxPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-3 rounded-full flex overflow-hidden">
              <div className="flex-1" style={{ background: 'linear-gradient(to right, #10b981, #84cc16, #eab308, #f97316, #ef4444)' }}></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Низкие тарифы</span>
              <span>Высокие тарифы</span>
            </div>
          </div>

          <div className="relative bg-muted/20 rounded-lg overflow-hidden border" onMouseMove={handleMouseMove}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 250,
                center: [95, 63]
              }}
              className="w-full h-[500px]"
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => {
                  const russia = geographies.find(geo => geo.properties.name === 'Russia');
                  if (!russia) return null;
                  
                  return (
                    <Geography
                      geography={russia}
                      fill={getColorByPrice(avgPrice)}
                      stroke="#ffffff"
                      strokeWidth={1}
                      style={{
                        default: { outline: 'none' },
                        hover: { 
                          fill: '#3b82f6',
                          outline: 'none',
                          cursor: 'pointer'
                        },
                        pressed: { outline: 'none' }
                      }}
                    />
                  );
                }}
              </Geographies>
            </ComposableMap>

            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-center bg-background/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <p className="text-4xl font-bold">{avgPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Средний тариф РФ</p>
                <p className="text-xs text-muted-foreground mt-2">₽/кВт⋅ч</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Общая визуализация территории России • Подробности по регионам справа
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h4 className="font-semibold text-sm">5 самых дешёвых</h4>
          </div>
          <div className="space-y-2">
            {topCheap.map((region, idx) => (
              <div
                key={region.id}
                onClick={() => onSelectRegion(region)}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="p-2 rounded border hover:border-primary cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                      <p className="text-xs font-medium truncate">{region.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{region.zone}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: getColorByPrice(region.current_price) }}>
                      {region.current_price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">₽/кВт⋅ч</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <h4 className="font-semibold text-sm">5 самых дорогих</h4>
          </div>
          <div className="space-y-2">
            {topExpensive.map((region, idx) => (
              <div
                key={region.id}
                onClick={() => onSelectRegion(region)}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="p-2 rounded border hover:border-primary cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                      <p className="text-xs font-medium truncate">{region.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{region.zone}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: getColorByPrice(region.current_price) }}>
                      {region.current_price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">₽/кВт⋅ч</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {hoveredRegion && (
          <Card className="p-4 border-primary">
            <div className="space-y-3">
              <div>
                <p className="font-semibold">{hoveredRegion.name}</p>
                <p className="text-xs text-muted-foreground">{hoveredRegion.zone}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{hoveredRegion.current_price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">₽/кВт⋅ч</span>
              </div>
              <Badge variant={hoveredRegion.change > 0 ? 'destructive' : 'secondary'}>
                {hoveredRegion.change > 0 ? '↑' : '↓'} {Math.abs(hoveredRegion.change).toFixed(2)}%
              </Badge>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
