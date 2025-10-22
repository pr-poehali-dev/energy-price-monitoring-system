import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import PredictionCard from './PredictionCard';
import { predictPrices } from '@/utils/pricePredictor';
import type { Region, PriceHistoryPoint } from './types';
import { useTranslateNames } from '@/hooks/useTranslateNames';
import { useLanguage } from '@/contexts/LanguageContext';

interface ForecastTabProps {
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  regionHistory: PriceHistoryPoint[];
  historyLoading: boolean;
  allRegionsHistory: Map<number, PriceHistoryPoint[]>;
  fetchAllRegionsHistory: (days: number) => Promise<void>;
}

export default function ForecastTab({ 
  regions, 
  selectedRegion, 
  onSelectRegion,
  regionHistory,
  historyLoading,
  allRegionsHistory,
  fetchAllRegionsHistory
}: ForecastTabProps) {
  const { translateRegionName } = useTranslateNames();
  const { t } = useLanguage();
  const [daysAhead] = useState(90);
  const [selectedTariff, setSelectedTariff] = useState<'all' | 'single' | 'two_zone' | 'three_zone'>('all');
  const [selectedTimeZone, setSelectedTimeZone] = useState<'all' | 'day' | 'night' | 'peak' | 'half_peak'>('all');
  const [isLoadingAllHistory, setIsLoadingAllHistory] = useState(false);

  useEffect(() => {
    if (allRegionsHistory.size === 0 && regions.length > 0 && !isLoadingAllHistory) {
      setIsLoadingAllHistory(true);
      fetchAllRegionsHistory(90).finally(() => setIsLoadingAllHistory(false));
    }
  }, [allRegionsHistory.size, regions.length, fetchAllRegionsHistory, isLoadingAllHistory]);

  // Рассчитываем прогноз для всех регионов
  const regionPredictions = regions
    .filter(r => r.id !== selectedRegion.id)
    .map(region => {
      let history = allRegionsHistory.get(region.id);
      if (!history || history.length < 3) {
        return null;
      }
      
      // Агрегируем мультитарифы - берём среднее за год/день
      const groupedByDate = new Map<string, { prices: number[], point: typeof history[0] }>();
      history.forEach(point => {
        const dateKey = point.recorded_at.split('T')[0];
        if (!groupedByDate.has(dateKey)) {
          groupedByDate.set(dateKey, { prices: [], point });
        }
        groupedByDate.get(dateKey)!.prices.push(parseFloat(point.price.toString()));
      });
      
      history = Array.from(groupedByDate.values()).map(({ prices, point }) => ({
        ...point,
        price: prices.reduce((sum, p) => sum + p, 0) / prices.length
      })).sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
      
      if (history.length < 3) {
        return null;
      }
      
      const prediction = predictPrices(history, daysAhead);
      if (prediction.predictions.length === 0) {
        return null;
      }
      
      const currentPrice = parseFloat(history[history.length - 1]?.price?.toString() || '0');
      const predictedPrice = prediction.predictions[prediction.predictions.length - 1]?.predictedPrice || currentPrice;
      const changePercent = ((predictedPrice - currentPrice) / currentPrice) * 100;
      
      return {
        region,
        currentPrice,
        predictedPrice,
        changePercent,
        trend: changePercent > 0 ? 'rising' as const : 'falling' as const
      };
    })
    .filter((item): item is { region: Region; currentPrice: number; predictedPrice: number; changePercent: number; trend: 'rising' | 'falling' } => item !== null);

  const topRisingPredictions = regionPredictions
    .filter(p => p.trend === 'rising')
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topFallingPredictions = regionPredictions
    .filter(p => p.trend === 'falling')
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);
  
  console.log('📊 Predictions stats:', {
    total: regionPredictions.length,
    rising: topRisingPredictions.length,
    falling: topFallingPredictions.length,
    allTrends: regionPredictions.map(p => ({ name: p.region.name, trend: p.trend, change: p.changePercent.toFixed(1) }))
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{t('forecast.selectRegion')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('forecast.basedOnHistory')}
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
                <SelectValue placeholder={t('forecast.selectForForecast')} />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id.toString()}>
                    {translateRegionName(region.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('forecast.tariffType')}</label>
              <Select value={selectedTariff} onValueChange={(value: any) => setSelectedTariff(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('tariff.allTariffs')}</SelectItem>
                  <SelectItem value="single">{t('tariff.single')}</SelectItem>
                  <SelectItem value="two_zone">{t('tariff.twoZone')} ({t('tariff.day')}/{t('tariff.night')})</SelectItem>
                  <SelectItem value="three_zone">{t('tariff.threeZone')} ({t('tariff.peak')}/{t('tariff.halfPeak')}/{t('tariff.night')})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedTariff === 'two_zone' || selectedTariff === 'three_zone') && (
              <div>
                <label className="text-sm font-medium mb-2 block">{t('filters.timeZone')}</label>
                <Select value={selectedTimeZone} onValueChange={(value: any) => setSelectedTimeZone(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('timeZone.all')}</SelectItem>
                    {selectedTariff === 'two_zone' && (
                      <>
                        <SelectItem value="day">{t('tariff.day')}</SelectItem>
                        <SelectItem value="night">{t('tariff.night')}</SelectItem>
                      </>
                    )}
                    {selectedTariff === 'three_zone' && (
                      <>
                        <SelectItem value="peak">{t('tariff.peak')}</SelectItem>
                        <SelectItem value="half_peak">{t('tariff.halfPeak')}</SelectItem>
                        <SelectItem value="night">{t('tariff.night')}</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </Card>

      {historyLoading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center">
            <Icon name="Loader2" className="animate-spin text-primary mb-4" size={48} />
            <p className="text-muted-foreground">{t('forecast.loading')}</p>
          </div>
        </Card>
      ) : (
        <>
          <PredictionCard
            regionHistory={regionHistory}
            regionName={translateRegionName(selectedRegion.name)}
            currentPrice={selectedRegion.current_price}
            daysAhead={daysAhead}
            tariffType={selectedTariff}
            timeZone={selectedTimeZone}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="TrendingUp" className="text-destructive" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">{t('forecast.growthForecast')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('forecast.likelyIncrease')}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {isLoadingAllHistory ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Icon name="Loader2" className="animate-spin text-primary mb-3" size={32} />
                    <p className="text-sm text-muted-foreground">{t('forecast.loadingHistory')}</p>
                  </div>
                ) : topRisingPredictions.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="Info" className="mx-auto mb-3 text-muted-foreground" size={32} />
                    <p className="text-sm text-muted-foreground">{t('forecast.noRisingRegions')}</p>
                  </div>
                ) : (
                  topRisingPredictions.map((item, idx) => (
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
                          <p className="font-medium text-sm">{translateRegionName(item.region.name)}</p>
                          <p className="text-xs text-muted-foreground">
                            Текущая: {item.currentPrice.toFixed(2)} ₽
                          </p>
                        </div>
                      </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-xs">
                        <Icon name="TrendingUp" size={12} className="mr-1" />
                        +{item.changePercent.toFixed(1)}%
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
                {isLoadingAllHistory ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Icon name="Loader2" className="animate-spin text-primary mb-3" size={32} />
                    <p className="text-sm text-muted-foreground">{t('forecast.loadingHistory')}</p>
                  </div>
                ) : topFallingPredictions.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="Info" className="mx-auto mb-3 text-muted-foreground" size={32} />
                    <p className="text-sm text-muted-foreground">{t('forecast.noFallingRegions')}</p>
                  </div>
                ) : (
                  topFallingPredictions.map((item, idx) => (
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
                          <p className="font-medium text-sm">{translateRegionName(item.region.name)}</p>
                          <p className="text-xs text-muted-foreground">
                            Текущая: {item.currentPrice.toFixed(2)} ₽
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-secondary text-secondary-foreground text-xs">
                          <Icon name="TrendingDown" size={12} className="mr-1" />
                          {item.changePercent.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
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