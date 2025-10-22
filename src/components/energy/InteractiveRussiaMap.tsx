import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Region } from './types';

interface InteractiveRussiaMapProps {
  regions: Region[];
  onSelectRegion: (region: Region) => void;
}

export default function InteractiveRussiaMap({ regions, onSelectRegion }: InteractiveRussiaMapProps) {
  const getColorByPrice = (price: number) => {
    if (price < 4) return '#10b981';
    if (price < 4.5) return '#84cc16';
    if (price < 5) return '#eab308';
    if (price < 5.5) return '#f97316';
    return '#ef4444';
  };

  const minPrice = Math.min(...regions.map(r => r.current_price));
  const maxPrice = Math.max(...regions.map(r => r.current_price));

  const sortedByPrice = [...regions].sort((a, b) => a.current_price - b.current_price);
  const topCheap = sortedByPrice.slice(0, 5);
  const topExpensive = sortedByPrice.slice(-5).reverse();

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Карта регионов России</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Распределение цен на электроэнергию по регионам
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
            <span>Средние</span>
            <span>Высокие тарифы</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-3 text-green-600">🏆 Самые низкие тарифы</h4>
            <div className="space-y-2">
              {topCheap.map((region, idx) => (
                <div
                  key={region.id}
                  onClick={() => onSelectRegion(region)}
                  className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all"
                  style={{
                    backgroundColor: `${getColorByPrice(region.current_price)}15`,
                    borderColor: getColorByPrice(region.current_price),
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{region.name}</p>
                        <p className="text-xs text-muted-foreground">{region.zone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: getColorByPrice(region.current_price) }}>
                        {region.current_price.toFixed(2)} ₽
                      </p>
                      <Badge variant={region.change > 0 ? 'destructive' : 'secondary'} className="text-xs">
                        {region.change > 0 ? '↑' : '↓'} {Math.abs(region.change).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-red-600">📊 Самые высокие тарифы</h4>
            <div className="space-y-2">
              {topExpensive.map((region, idx) => (
                <div
                  key={region.id}
                  onClick={() => onSelectRegion(region)}
                  className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all"
                  style={{
                    backgroundColor: `${getColorByPrice(region.current_price)}15`,
                    borderColor: getColorByPrice(region.current_price),
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{region.name}</p>
                        <p className="text-xs text-muted-foreground">{region.zone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: getColorByPrice(region.current_price) }}>
                        {region.current_price.toFixed(2)} ₽
                      </p>
                      <Badge variant={region.change > 0 ? 'destructive' : 'secondary'} className="text-xs">
                        {region.change > 0 ? '↑' : '↓'} {Math.abs(region.change).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span className="text-muted-foreground">{'< 4.0 ₽'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#84cc16]"></div>
            <span className="text-muted-foreground">4.0 - 4.5 ₽</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#eab308]"></div>
            <span className="text-muted-foreground">4.5 - 5.0 ₽</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
            <span className="text-muted-foreground">5.0 - 5.5 ₽</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          💡 Кликните по региону для просмотра детальной информации
        </div>
      </div>
    </Card>
  );
}
