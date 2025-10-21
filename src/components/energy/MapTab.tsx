import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Region } from './types';
import { PERIOD_LABELS } from './types';

interface MapTabProps {
  regions: Region[];
  onSelectRegion: (region: Region) => void;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export default function MapTab({ regions, onSelectRegion, period = '90', onPeriodChange }: MapTabProps) {
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 12);
    }, 500);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const getColorByPrice = (price: number, animate: boolean = false) => {
    let adjustedPrice = price;
    
    if (animate && isAnimating) {
      const variation = Math.sin(animationStep * 0.5) * 0.3;
      adjustedPrice = price + variation;
    }

    if (adjustedPrice < 4) return 'hsl(var(--chart-2))';
    if (adjustedPrice < 4.5) return 'hsl(var(--chart-3))';
    if (adjustedPrice < 5) return 'hsl(var(--chart-4))';
    if (adjustedPrice < 5.5) return 'hsl(var(--chart-5))';
    return 'hsl(var(--destructive))';
  };

  const getAnimatedPrice = (basePrice: number) => {
    if (!isAnimating) return basePrice;
    const variation = Math.sin(animationStep * 0.5) * 0.15;
    return basePrice + variation;
  };

  const minPrice = Math.min(...regions.map(r => r.current_price));
  const maxPrice = Math.max(...regions.map(r => r.current_price));

  const sortedByPrice = [...regions].sort((a, b) => a.current_price - b.current_price);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Тепловая карта цен</h3>
              <p className="text-sm text-muted-foreground mt-1">Изменения за {PERIOD_LABELS[period as keyof typeof PERIOD_LABELS]}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isAnimating ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
              >
                <Icon name={isAnimating ? "Pause" : "Play"} size={16} className="mr-2" />
                {isAnimating ? 'Остановить' : 'Анимация'}
              </Button>
              <Icon name="Map" className="text-primary" size={24} />
            </div>
          </div>
          
          {onPeriodChange && (
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
          )}

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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-2">
            {regions.map((region) => {
              const animatedPrice = getAnimatedPrice(region.current_price);
              const color = getColorByPrice(animatedPrice, true);
              
              return (
                <div
                  key={region.id}
                  onClick={() => onSelectRegion(region)}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg hover:scale-105"
                  style={{
                    backgroundColor: `${color}15`,
                    borderColor: color,
                    transition: isAnimating ? 'all 0.5s ease-in-out' : 'all 0.2s'
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
                    <p 
                      className="text-xl font-mono font-bold" 
                      style={{ 
                        color,
                        transition: isAnimating ? 'color 0.5s ease-in-out' : 'color 0.2s'
                      }}
                    >
                      {animatedPrice.toFixed(2)}
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
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="TrendingDown" className="text-secondary" size={24} />
              <h3 className="text-lg font-semibold">Самые низкие цены</h3>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {sortedByPrice.map((region, idx) => (
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
            <div className="flex items-center gap-3 mb-4">
              <Icon name="TrendingUp" className="text-destructive" size={24} />
              <h3 className="text-lg font-semibold">Самые высокие цены</h3>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {sortedByPrice.slice().reverse().map((region, idx) => (
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
            <Card className="p-4 border-primary animate-fade-in">
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