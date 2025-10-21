import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ru: {
    'app.title': 'Мониторинг цен на электроэнергию',
    'app.subtitle': 'Актуальные данные по всем регионам РФ',
    'app.updated': 'Обновлено',
    
    'stats.avgPrice': 'Средняя цена РФ',
    'stats.maxPrice': 'Макс. цена',
    'stats.minPrice': 'Мин. цена',
    'stats.regions': 'Регионов',
    'stats.tracked': 'отслеживается',
    'stats.perKwh': 'за кВт⋅ч',
    
    'tabs.overview': 'Обзор',
    'tabs.forecast': 'Прогноз',
    'tabs.map': 'Карта',
    'tabs.regions': 'Регионы',
    'tabs.analytics': 'Аналитика',
    'tabs.compare': 'Сравнение',
    'tabs.filters': 'Фильтры',
    
    'overview.priceDynamics': 'Динамика цен по регионам',
    'overview.avgPricesByZone': 'Средние цены по округам',
    'overview.allRegionsByChange': 'Все регионы по изменению цены',
    'overview.selectRegion': 'Выберите регион',
    
    'export.button': 'Экспорт',
    'export.excel': 'Excel (.xlsx)',
    'export.csv': 'CSV (.csv)',
    'export.csvSuccess': 'Файл CSV успешно скачан',
    'export.excelSuccess': 'Файл Excel успешно скачан',
    
    'prediction.title': 'Прогноз цен',
    'prediction.selectRegion': 'Выберите регион для прогноза',
    'prediction.subtitle': 'Прогнозирование на основе исторических данных',
    'prediction.insufficientData': 'Недостаточно данных для прогноза',
    'prediction.minDataPoints': 'Требуется минимум 10 точек данных',
    'prediction.trend': 'Тренд',
    'prediction.modelAccuracy': 'Точность модели',
    'prediction.forecastIn': 'Прогноз через',
    'prediction.days': 'дней',
    'prediction.fromCurrent': 'от текущей',
    'prediction.actual': 'Фактическая',
    'prediction.forecast': 'Прогноз',
    'prediction.today': 'Сегодня',
    'prediction.highAccuracy': 'Высокая точность',
    'prediction.mediumAccuracy': 'Средняя точность',
    'prediction.lowAccuracy': 'Низкая точность',
    'prediction.aboutTitle': 'О прогнозе:',
    'prediction.aboutText': 'Прогноз основан на линейной регрессии исторических данных. Чем дальше в будущее, тем ниже точность. Используйте прогноз как ориентир, а не абсолютное значение.',
    'prediction.risingTitle': 'Прогноз роста цен',
    'prediction.risingSubtitle': 'Регионы с вероятным повышением',
    'prediction.fallingTitle': 'Прогноз снижения цен',
    'prediction.fallingSubtitle': 'Регионы с вероятным снижением',
    'prediction.current': 'Текущая',
    'prediction.howItWorks': 'Как работает прогноз?',
    'prediction.method': 'Метод:',
    'prediction.methodText': 'Используется линейная регрессия для анализа исторических данных и выявления трендов.',
    'prediction.accuracy': 'Точность:',
    'prediction.accuracyText': 'Зависит от количества данных и стабильности цен. Прогнозы на ближайший месяц обычно более точные, чем на 3-6 месяцев вперёд.',
    'prediction.limitations': 'Ограничения:',
    'prediction.limitationsText': 'Прогноз не учитывает внешние факторы (законы, сезонность, форс-мажоры). Используйте как ориентир для планирования, а не абсолютное значение.',
    
    'trend.stable': 'Цены стабильны',
    'trend.risingSlightly': 'Цены незначительно растут',
    'trend.risingModerately': 'Цены умеренно растут',
    'trend.risingNoticeably': 'Цены заметно растут',
    'trend.risingSignificantly': 'Цены значительно растут',
    'trend.fallingSlightly': 'Цены незначительно снижаются',
    'trend.fallingModerately': 'Цены умеренно снижаются',
    'trend.fallingNoticeably': 'Цены заметно снижаются',
    'trend.fallingSignificantly': 'Цены значительно снижаются',
    
    'regions.all': 'Все регионы',
    'regions.of': 'из',
    'regions.search': 'Поиск региона...',
    'regions.sorting': 'Сортировка:',
    'regions.byName': 'По названию',
    'regions.byPriceAsc': 'По цене ↑',
    'regions.byPriceDesc': 'По цене ↓',
    'regions.byChangeAsc': 'По изменению ↑',
    'regions.byChangeDesc': 'По изменению ↓',
    
    'analytics.historicalData': 'Исторические данные цен',
    'analytics.period': 'Период:',
    'analytics.trendFor': 'Тренд за',
    'analytics.selectRegions': 'Выбрать регионы',
    'analytics.compareRegions': 'Сравнить регионы',
    'analytics.maxRegions': 'Максимум 10 регионов одновременно',
    'analytics.highestGrowth': 'Самый высокий рост',
    'analytics.biggestDecline': 'Самое большое снижение',
    'analytics.dataPoints': 'точек',
    'analytics.historyData': 'История цен',
    
    'compare.byZones': 'По округам',
    'compare.byRegions': 'По регионам',
    'compare.zoneComparison': 'Сравнение тарифов по федеральным округам',
    'compare.avgPrice': 'Средняя цена',
    
    'filters.title': 'Фильтры и настройки',
    'filters.zones': 'Федеральные округа',
    'filters.selectAll': 'Выбрать все',
    'filters.deselectAll': 'Сбросить все',
    'filters.tariffType': 'Тип тарифа',
    'filters.all': 'Все',
    'filters.growing': 'Растущие',
    'filters.decreasing': 'Снижающиеся',
    'filters.stable': 'Стабильные',
    'filters.priceRange': 'Диапазон цен',
    'filters.period': 'Период анализа',
    'filters.reset': 'Сбросить фильтры',
    
    'common.loading': 'Загрузка данных...',
    'common.price': 'Цена',
    'common.change': 'Изменение',
    'common.region': 'Регион',
    'common.zone': 'Федеральный округ',
    'common.population': 'Население',
    'common.date': 'Дата',
    'common.strength': 'Сила',
  },
  en: {
    'app.title': 'Electricity Price Monitoring',
    'app.subtitle': 'Real-time data across all Russian regions',
    'app.updated': 'Updated',
    
    'stats.avgPrice': 'Russia Avg Price',
    'stats.maxPrice': 'Max Price',
    'stats.minPrice': 'Min Price',
    'stats.regions': 'Regions',
    'stats.tracked': 'tracked',
    'stats.perKwh': 'per kWh',
    
    'tabs.overview': 'Overview',
    'tabs.forecast': 'Forecast',
    'tabs.map': 'Map',
    'tabs.regions': 'Regions',
    'tabs.analytics': 'Analytics',
    'tabs.compare': 'Compare',
    'tabs.filters': 'Filters',
    
    'overview.priceDynamics': 'Regional Price Dynamics',
    'overview.avgPricesByZone': 'Average Prices by District',
    'overview.allRegionsByChange': 'All Regions by Price Change',
    'overview.selectRegion': 'Select Region',
    
    'export.button': 'Export',
    'export.excel': 'Excel (.xlsx)',
    'export.csv': 'CSV (.csv)',
    'export.csvSuccess': 'CSV file downloaded successfully',
    'export.excelSuccess': 'Excel file downloaded successfully',
    
    'prediction.title': 'Price Forecast',
    'prediction.selectRegion': 'Select region for forecast',
    'prediction.subtitle': 'Forecasting based on historical data',
    'prediction.insufficientData': 'Insufficient data for forecast',
    'prediction.minDataPoints': 'Minimum 10 data points required',
    'prediction.trend': 'Trend',
    'prediction.modelAccuracy': 'Model Accuracy',
    'prediction.forecastIn': 'Forecast in',
    'prediction.days': 'days',
    'prediction.fromCurrent': 'from current',
    'prediction.actual': 'Actual',
    'prediction.forecast': 'Forecast',
    'prediction.today': 'Today',
    'prediction.highAccuracy': 'High accuracy',
    'prediction.mediumAccuracy': 'Medium accuracy',
    'prediction.lowAccuracy': 'Low accuracy',
    'prediction.aboutTitle': 'About forecast:',
    'prediction.aboutText': 'Forecast is based on linear regression of historical data. The further into the future, the lower the accuracy. Use forecast as a guide, not an absolute value.',
    'prediction.risingTitle': 'Price Growth Forecast',
    'prediction.risingSubtitle': 'Regions with likely increase',
    'prediction.fallingTitle': 'Price Decline Forecast',
    'prediction.fallingSubtitle': 'Regions with likely decrease',
    'prediction.current': 'Current',
    'prediction.howItWorks': 'How does forecasting work?',
    'prediction.method': 'Method:',
    'prediction.methodText': 'Linear regression is used to analyze historical data and identify trends.',
    'prediction.accuracy': 'Accuracy:',
    'prediction.accuracyText': 'Depends on data quantity and price stability. Forecasts for the next month are usually more accurate than 3-6 months ahead.',
    'prediction.limitations': 'Limitations:',
    'prediction.limitationsText': 'Forecast does not account for external factors (laws, seasonality, force majeure). Use as a guide for planning, not an absolute value.',
    
    'trend.stable': 'Prices are stable',
    'trend.risingSlightly': 'Prices rising slightly',
    'trend.risingModerately': 'Prices rising moderately',
    'trend.risingNoticeably': 'Prices rising noticeably',
    'trend.risingSignificantly': 'Prices rising significantly',
    'trend.fallingSlightly': 'Prices falling slightly',
    'trend.fallingModerately': 'Prices falling moderately',
    'trend.fallingNoticeably': 'Prices falling noticeably',
    'trend.fallingSignificantly': 'Prices falling significantly',
    
    'regions.all': 'All Regions',
    'regions.of': 'of',
    'regions.search': 'Search region...',
    'regions.sorting': 'Sorting:',
    'regions.byName': 'By Name',
    'regions.byPriceAsc': 'By Price ↑',
    'regions.byPriceDesc': 'By Price ↓',
    'regions.byChangeAsc': 'By Change ↑',
    'regions.byChangeDesc': 'By Change ↓',
    
    'analytics.historicalData': 'Historical Price Data',
    'analytics.period': 'Period:',
    'analytics.trendFor': 'Trend for',
    'analytics.selectRegions': 'Select Regions',
    'analytics.compareRegions': 'Compare Regions',
    'analytics.maxRegions': 'Maximum 10 regions at once',
    'analytics.highestGrowth': 'Highest Growth',
    'analytics.biggestDecline': 'Biggest Decline',
    'analytics.dataPoints': 'points',
    'analytics.historyData': 'Price History',
    
    'compare.byZones': 'By Districts',
    'compare.byRegions': 'By Regions',
    'compare.zoneComparison': 'Tariff Comparison by Federal Districts',
    'compare.avgPrice': 'Average Price',
    
    'filters.title': 'Filters & Settings',
    'filters.zones': 'Federal Districts',
    'filters.selectAll': 'Select All',
    'filters.deselectAll': 'Deselect All',
    'filters.tariffType': 'Tariff Type',
    'filters.all': 'All',
    'filters.growing': 'Growing',
    'filters.decreasing': 'Decreasing',
    'filters.stable': 'Stable',
    'filters.priceRange': 'Price Range',
    'filters.period': 'Analysis Period',
    'filters.reset': 'Reset Filters',
    
    'common.loading': 'Loading data...',
    'common.price': 'Price',
    'common.change': 'Change',
    'common.region': 'Region',
    'common.zone': 'Federal District',
    'common.population': 'Population',
    'common.date': 'Date',
    'common.strength': 'Strength',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'ru') ? saved : 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
