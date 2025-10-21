import type { PriceHistoryPoint } from '@/components/energy/types';

export interface PredictionPoint {
  date: string;
  predictedPrice: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface PredictionResult {
  predictions: PredictionPoint[];
  trend: 'rising' | 'falling' | 'stable';
  trendStrength: number;
  accuracy: number;
}

export const predictPrices = (
  history: PriceHistoryPoint[],
  daysAhead: number = 90
): PredictionResult => {
  if (history.length < 10) {
    return {
      predictions: [],
      trend: 'stable',
      trendStrength: 0,
      accuracy: 0
    };
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  const xValues: number[] = [];
  const yValues: number[] = [];
  
  sortedHistory.forEach((point, index) => {
    xValues.push(index);
    yValues.push(parseFloat(point.price.toString()));
  });

  const { slope, intercept } = linearRegression(xValues, yValues);
  
  const lastDate = new Date(sortedHistory[sortedHistory.length - 1].recorded_at);
  const predictions: PredictionPoint[] = [];
  
  const avgDaysBetweenPoints = calculateAverageDaysBetween(sortedHistory);
  
  for (let i = 1; i <= Math.ceil(daysAhead / avgDaysBetweenPoints); i++) {
    const futureIndex = sortedHistory.length + i;
    const predictedPrice = slope * futureIndex + intercept;
    
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + (i * avgDaysBetweenPoints));
    
    const daysFromNow = i * avgDaysBetweenPoints;
    let confidence: 'high' | 'medium' | 'low';
    if (daysFromNow <= 30) confidence = 'high';
    else if (daysFromNow <= 60) confidence = 'medium';
    else confidence = 'low';
    
    predictions.push({
      date: futureDate.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: 'short'
      }),
      predictedPrice: Math.max(0, predictedPrice),
      confidence
    });
  }

  const avgPrice = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
  const trendStrength = Math.abs(slope / avgPrice) * 100;
  
  let trend: 'rising' | 'falling' | 'stable';
  if (Math.abs(slope) < avgPrice * 0.001) trend = 'stable';
  else if (slope > 0) trend = 'rising';
  else trend = 'falling';

  const rSquared = calculateRSquared(xValues, yValues, slope, intercept);
  const baseAccuracy = rSquared * 100;
  
  // Точность уменьшается с увеличением периода прогноза
  const decayFactor = Math.exp(-daysAhead / 180); // Экспоненциальное затухание
  const accuracy = Math.round(baseAccuracy * decayFactor);

  return {
    predictions,
    trend,
    trendStrength: Math.round(trendStrength * 100) / 100,
    accuracy
  };
};

const linearRegression = (x: number[], y: number[]) => {
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

const calculateRSquared = (x: number[], y: number[], slope: number, intercept: number): number => {
  const yMean = y.reduce((sum, val) => sum + val, 0) / y.length;
  
  let ssTotal = 0;
  let ssResidual = 0;
  
  for (let i = 0; i < x.length; i++) {
    const predicted = slope * x[i] + intercept;
    ssTotal += Math.pow(y[i] - yMean, 2);
    ssResidual += Math.pow(y[i] - predicted, 2);
  }
  
  return 1 - (ssResidual / ssTotal);
};

const calculateAverageDaysBetween = (history: PriceHistoryPoint[]): number => {
  if (history.length < 2) return 1;
  
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );
  
  let totalDays = 0;
  for (let i = 1; i < sortedHistory.length; i++) {
    const diff = new Date(sortedHistory[i].recorded_at).getTime() - 
                 new Date(sortedHistory[i - 1].recorded_at).getTime();
    totalDays += diff / (1000 * 60 * 60 * 24);
  }
  
  return Math.max(1, Math.round(totalDays / (sortedHistory.length - 1)));
};

export const getTrendDescription = (
  trend: 'rising' | 'falling' | 'stable', 
  strength: number,
  t: (key: string) => string
): string => {
  if (trend === 'stable') {
    return t('trend.stable');
  }
  
  if (trend === 'rising') {
    if (strength < 1) return t('trend.risingSlightly');
    if (strength < 3) return t('trend.risingModerately');
    if (strength < 5) return t('trend.risingNoticeably');
    return t('trend.risingSignificantly');
  } else {
    if (strength < 1) return t('trend.fallingSlightly');
    if (strength < 3) return t('trend.fallingModerately');
    if (strength < 5) return t('trend.fallingNoticeably');
    return t('trend.fallingSignificantly');
  }
};

export const getAccuracyDescription = (accuracy: number, t: (key: string) => string): string => {
  if (accuracy >= 85) return t('prediction.veryHighAccuracy');
  if (accuracy >= 70) return t('prediction.highAccuracy');
  if (accuracy >= 50) return t('prediction.mediumAccuracy');
  return t('prediction.lowAccuracy');
};