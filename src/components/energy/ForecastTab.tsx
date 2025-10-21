import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import PredictionCard from './PredictionCard';
import { predictPrices } from '@/utils/pricePredictor';
import type { Region, PriceHistoryPoint } from './types';

interface ForecastTabProps {
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  regionHistory: PriceHistoryPoint[];
  historyLoading: boolean;
}

export default function ForecastTab({ 
  regions, 
  selectedRegion, 
  onSelectRegion,
  regionHistory,
  historyLoading
}: ForecastTabProps) {
  const [daysAhead] = useState(90);

  const topRisingPredictions = regions
    .filter(r => r.id !== selectedRegion.id)
    .map(region => {
      if (!region.id) return null;
      return {
        region,
        trend: 'rising' as const
      };
    })
    .filter((item): item is { region: Region; trend: 'rising' } => item !== null)
    .slice(0, 5);

  const topFallingPredictions = regions
    .filter(r => r.id !== selectedRegion.id)
    .map(region => {
      if (!region.id) return null;
      return {
        region,
        trend: 'falling' as const
      };
    })
    .filter((item): item is { region: Region; trend: 'falling' } => item !== null)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold">Выберите регион для прогноза</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Прогнозирование на основе исторических данных
            </p>
          </div>
          <Select 
            value={selectedRegion.id.toString()} 
            onValueChange={(value) => {
              const region = regions.find(r => r.id === parseInt(value));
              if (region) onSelectRegion(region);
            }}
          >
            <SelectTrigger className="w-[300px]">
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
        </div>
      </Card>

      {historyLoading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center">
            <Icon name="Loader2" className="animate-spin text-primary mb-4" size={48} />
            <p className="text-muted-foreground">Загрузка данных для прогноза...</p>
          </div>
        </Card>
      ) : (
        <>
          <PredictionCard
            regionHistory={regionHistory}
            regionName={selectedRegion.name}
            currentPrice={selectedRegion.current_price}
            daysAhead={daysAhead}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="TrendingUp" className="text-destructive" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Прогноз роста цен</h3>
                  <p className="text-sm text-muted-foreground">
                    Регионы с вероятным повышением
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {topRisingPredictions.map((item, idx) => (
                  <div
                    key={item.region.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors cursor-pointer"
                    onClick={() => onSelectRegion(item.region)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.region.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Текущая: {item.region.current_price.toFixed(2)} ₽
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-xs">
                        <Icon name="TrendingUp" size={12} className="mr-1" />
                        +{item.region.change.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="TrendingDown" className="text-secondary" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">Прогноз снижения цен</h3>
                  <p className="text-sm text-muted-foreground">
                    Регионы с вероятным снижением
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {topFallingPredictions.map((item, idx) => (
                  <div
                    key={item.region.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => onSelectRegion(item.region)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.region.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Текущая: {item.region.current_price.toFixed(2)} ₽
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-secondary text-secondary-foreground text-xs">
                        <Icon name="TrendingDown" size={12} className="mr-1" />
                        {item.region.change.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-muted/30">
            <div className="flex items-start gap-3">
              <Icon name="Lightbulb" className="text-chart-3 mt-1" size={24} />
              <div>
                <h4 className="font-semibold mb-2">Как работает прогноз?</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong>Метод:</strong> Используется линейная регрессия для анализа исторических данных и выявления трендов.
                  </p>
                  <p>
                    <strong>Точность:</strong> Зависит от количества данных и стабильности цен. 
                    Прогнозы на ближайший месяц обычно более точные, чем на 3-6 месяцев вперёд.
                  </p>
                  <p>
                    <strong>Ограничения:</strong> Прогноз не учитывает внешние факторы (законы, сезонность, форс-мажоры). 
                    Используйте как ориентир для планирования, а не абсолютное значение.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
