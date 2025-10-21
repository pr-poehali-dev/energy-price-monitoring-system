import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { predictPrices, getTrendDescription, getAccuracyDescription } from '@/utils/pricePredictor';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PriceHistoryPoint } from './types';

interface PredictionCardProps {
  regionHistory: PriceHistoryPoint[];
  regionName: string;
  currentPrice: number;
  daysAhead?: number;
}

export default function PredictionCard({ 
  regionHistory, 
  regionName, 
  currentPrice,
  daysAhead: initialDaysAhead = 90 
}: PredictionCardProps) {
  const { t, language } = useLanguage();
  const [daysAhead, setDaysAhead] = useState(initialDaysAhead);
  
  if (regionHistory.length < 10) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="TrendingUp" className="text-chart-3" size={24} />
          <h3 className="text-xl font-semibold">{t('prediction.title')}</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="AlertCircle" className="mx-auto mb-3" size={48} />
          <p>{t('prediction.insufficientData')}</p>
          <p className="text-sm mt-2">{t('prediction.minDataPoints')}</p>
        </div>
      </Card>
    );
  }

  const prediction = predictPrices(regionHistory, daysAhead);
  
  const historicalData = regionHistory
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    .map(point => ({
      date: new Date(point.recorded_at).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { 
        day: '2-digit', 
        month: 'short' 
      }),
      actual: parseFloat(point.price.toString()),
      predicted: null as number | null
    }));

  const futureData = prediction.predictions.map(point => ({
    date: point.date,
    actual: null as number | null,
    predicted: point.predictedPrice,
    confidence: point.confidence
  }));

  const combinedData = [...historicalData.slice(-30), ...futureData];

  const getTrendIcon = () => {
    switch (prediction.trend) {
      case 'rising': return 'TrendingUp';
      case 'falling': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = () => {
    switch (prediction.trend) {
      case 'rising': return 'text-destructive';
      case 'falling': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const lastPrediction = prediction.predictions[prediction.predictions.length - 1];
  const priceChange = lastPrediction ? ((lastPrediction.predictedPrice - currentPrice) / currentPrice) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Icon name="TrendingUp" className="text-chart-3" size={24} />
          <div>
            <h3 className="text-xl font-semibold">{t('prediction.title')}</h3>
            <p className="text-sm text-muted-foreground">{regionName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={daysAhead === 30 ? 'default' : 'outline'}
            onClick={() => setDaysAhead(30)}
          >
            {t('prediction.period.oneMonth')}
          </Button>
          <Button
            size="sm"
            variant={daysAhead === 90 ? 'default' : 'outline'}
            onClick={() => setDaysAhead(90)}
          >
            {t('prediction.period.threeMonths')}
          </Button>
          <Button
            size="sm"
            variant={daysAhead === 180 ? 'default' : 'outline'}
            onClick={() => setDaysAhead(180)}
          >
            {t('prediction.period.sixMonths')}
          </Button>
          <Button
            size="sm"
            variant={daysAhead === 365 ? 'default' : 'outline'}
            onClick={() => setDaysAhead(365)}
          >
            {t('prediction.period.oneYear')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name={getTrendIcon()} className={getTrendColor()} size={20} />
            <p className="text-sm text-muted-foreground">{t('prediction.trend')}</p>
          </div>
          <p className="text-lg font-semibold">{getTrendDescription(prediction.trend, prediction.trendStrength, t)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('prediction.strength')}: {prediction.trendStrength}%</p>
        </div>

        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" className="text-primary" size={20} />
            <p className="text-sm text-muted-foreground">{t('prediction.modelAccuracy')}</p>
          </div>
          <p className="text-lg font-semibold">{prediction.accuracy}%</p>
          <p className="text-xs text-muted-foreground mt-1">{getAccuracyDescription(prediction.accuracy, t)}</p>
        </div>

        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Calendar" className="text-secondary" size={20} />
            <p className="text-sm text-muted-foreground">
              {t('prediction.forecastIn')} {daysAhead} {t('prediction.days')}
            </p>
          </div>
          <p className="text-lg font-semibold font-mono">
            {lastPrediction?.predictedPrice.toFixed(2)} ₽
          </p>
          <p className={`text-xs mt-1 ${priceChange > 0 ? 'text-destructive' : 'text-secondary'}`}>
            {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}% {t('prediction.fromCurrent')}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combinedData}>
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
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold mb-2">{data.date}</p>
                    {data.actual !== null && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">{t('prediction.actual')}: </span>
                        <span className="font-mono font-semibold">{data.actual.toFixed(2)} ₽</span>
                      </p>
                    )}
                    {data.predicted !== null && (
                      <>
                        <p className="text-sm">
                          <span className="text-muted-foreground">{t('prediction.forecast')}: </span>
                          <span className="font-mono font-semibold">{data.predicted.toFixed(2)} ₽</span>
                        </p>
                        {data.confidence && (
                          <Badge 
                            variant="outline" 
                            className="mt-2 text-xs"
                          >
                            {data.confidence === 'high' ? t('prediction.confidence.high') : 
                             data.confidence === 'medium' ? t('prediction.confidence.medium') : 
                             t('prediction.confidence.low')}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine 
            x={historicalData[historicalData.length - 1]?.date} 
            stroke="hsl(var(--muted-foreground))" 
            strokeDasharray="3 3"
            label={{ value: t('prediction.today'), position: 'top', fill: 'hsl(var(--muted-foreground))' }}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2} 
            name={t('prediction.actualPrice')} 
            dot={false}
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            name={t('prediction.forecast')} 
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-start gap-2">
          <Icon name="Info" className="text-muted-foreground mt-0.5" size={16} />
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold mb-1">О прогнозе:</p>
            <p>Прогноз основан на линейной регрессии исторических данных. Чем дальше в будущее, тем ниже точность. 
            Используйте прогноз как ориентир, а не абсолютное значение.</p>
          </div>
        </div>
      </div>
    </Card>
  );
}