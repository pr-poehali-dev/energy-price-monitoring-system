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
    
    'tariff.day': 'День',
    'tariff.night': 'Ночь',
    'tariff.peak': 'Пик',
    'tariff.halfPeak': 'Полупик',
    'tariff.price': 'Цена',
    
    'prediction.title': 'Прогноз цен',
    'prediction.insufficientData': 'Недостаточно данных для прогноза',
    'prediction.minDataPoints': 'Требуется минимум 10 точек данных',
    'prediction.period.oneMonth': '1 месяц',
    'prediction.period.threeMonths': '3 месяца',
    'prediction.period.sixMonths': '6 месяцев',
    'prediction.period.oneYear': '1 год',
    'prediction.trend': 'Тренд',
    'prediction.strength': 'Сила',
    'prediction.modelAccuracy': 'Точность модели',
    'prediction.forecastIn': 'Прогноз через',
    'prediction.days': 'дней',
    'prediction.fromCurrent': 'от текущей',
    'prediction.today': 'Сегодня',
    'prediction.actualPrice': 'Фактическая цена',
    'prediction.forecast': 'Прогноз',
    'prediction.actual': 'Фактическая',
    'prediction.confidence.high': 'Высокая точность',
    'prediction.confidence.medium': 'Средняя точность',
    'prediction.confidence.low': 'Низкая точность',
    'prediction.veryHighAccuracy': 'Очень высокая точность',
    'prediction.highAccuracy': 'Высокая точность',
    'prediction.mediumAccuracy': 'Средняя точность',
    'prediction.lowAccuracy': 'Низкая точность',
    
    'trend.stable': 'Цены стабильны',
    'trend.risingSlightly': 'Цены незначительно растут',
    'trend.risingModerately': 'Цены умеренно растут',
    'trend.risingNoticeably': 'Цены заметно растут',
    'trend.risingSignificantly': 'Цены значительно растут',
    'trend.fallingSlightly': 'Цены незначительно снижаются',
    'trend.fallingModerately': 'Цены умеренно снижаются',
    'trend.fallingNoticeably': 'Цены заметно снижаются',
    'trend.fallingSignificantly': 'Цены значительно снижаются',
  },
  en: {
    'app.title': 'Electricity Price Monitor',
    'app.subtitle': 'Live data across all Russian regions',
    'app.updated': 'Last updated',
    
    'stats.avgPrice': 'National Average',
    'stats.maxPrice': 'Highest',
    'stats.minPrice': 'Lowest',
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
    
    'overview.priceDynamics': 'Price Dynamics by Region',
    'overview.avgPricesByZone': 'Average Prices by Federal District',
    'overview.allRegionsByChange': 'All Regions Sorted by Price Change',
    'overview.selectRegion': 'Select a region',
    
    'export.button': 'Export',
    'export.excel': 'Excel (.xlsx)',
    'export.csv': 'CSV (.csv)',
    'export.csvSuccess': 'CSV file successfully downloaded',
    'export.excelSuccess': 'Excel file successfully downloaded',
    
    'prediction.title': 'Price Forecast',
    'prediction.selectRegion': 'Select a region to forecast',
    'prediction.subtitle': 'ML-powered forecasts based on historical trends',
    'prediction.insufficientData': 'Insufficient historical data',
    'prediction.minDataPoints': 'At least 10 data points required for forecasting',
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
    'prediction.aboutTitle': 'About this forecast',
    'prediction.aboutText': 'Predictions use linear regression on historical pricing data. Accuracy decreases for longer time horizons. Treat forecasts as directional guidance, not precise values.',
    'prediction.risingTitle': 'Expected Price Increases',
    'prediction.risingSubtitle': 'Regions likely to see higher prices',
    'prediction.fallingTitle': 'Expected Price Decreases',
    'prediction.fallingSubtitle': 'Regions likely to see lower prices',
    'prediction.current': 'Current',
    'prediction.howItWorks': 'How does forecasting work?',
    'prediction.method': 'Methodology',
    'prediction.methodText': 'We apply linear regression to historical pricing data to identify trends and project future values.',
    'prediction.accuracy': 'Accuracy',
    'prediction.accuracyText': 'Forecast quality depends on data volume and price stability. Near-term forecasts (1 month) are typically more reliable than long-term projections (3-6 months).',
    'prediction.limitations': 'Limitations',
    'prediction.limitationsText': 'Our models don\'t account for external shocks like policy changes, seasonal variations, or unexpected events. Use forecasts for planning purposes, not as absolute predictions.',
    
    'trend.stable': 'Stable prices',
    'trend.risingSlightly': 'Slight upward trend',
    'trend.risingModerately': 'Moderate price increase',
    'trend.risingNoticeably': 'Notable price increase',
    'trend.risingSignificantly': 'Significant price increase',
    'trend.fallingSlightly': 'Slight downward trend',
    'trend.fallingModerately': 'Moderate price decrease',
    'trend.fallingNoticeably': 'Notable price decrease',
    'trend.fallingSignificantly': 'Significant price decrease',
    
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
    'analytics.period': 'Time Period',
    'analytics.trendFor': 'Trend analysis for',
    'analytics.selectRegions': 'Select regions',
    'analytics.compareRegions': 'Compare regions',
    'analytics.maxRegions': 'Up to 10 regions can be compared simultaneously',
    'analytics.highestGrowth': 'Largest Increase',
    'analytics.biggestDecline': 'Largest Decrease',
    'analytics.dataPoints': 'data points',
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
    
    'tariff.day': 'Day',
    'tariff.night': 'Night',
    'tariff.peak': 'Peak',
    'tariff.halfPeak': 'Semi-peak',
    'tariff.price': 'Price',
    
    'prediction.period.oneMonth': '1 month',
    'prediction.period.threeMonths': '3 months',
    'prediction.period.sixMonths': '6 months',
    'prediction.period.oneYear': '1 year',
    'prediction.strength': 'Strength',
    'prediction.actualPrice': 'Actual Price',
    'prediction.confidence.high': 'High confidence',
    'prediction.confidence.medium': 'Medium confidence',
    'prediction.confidence.low': 'Low confidence',
    'prediction.veryHighAccuracy': 'Very high confidence',
    
    // Federal Districts
    'zone.Центральный': 'Central',
    'zone.Северо-Западный': 'Northwestern',
    'zone.Южный': 'Southern',
    'zone.Северо-Кавказский': 'North Caucasian',
    'zone.Приволжский': 'Volga',
    'zone.Уральский': 'Ural',
    'zone.Сибирский': 'Siberian',
    'zone.Дальневосточный': 'Far Eastern',
    
    // Regions - Central District
    'region.Москва': 'Moscow',
    'region.Московская область': 'Moscow Region',
    'region.Белгородская область': 'Belgorod Region',
    'region.Брянская область': 'Bryansk Region',
    'region.Владимирская область': 'Vladimir Region',
    'region.Воронежская область': 'Voronezh Region',
    'region.Ивановская область': 'Ivanovo Region',
    'region.Калужская область': 'Kaluga Region',
    'region.Костромская область': 'Kostroma Region',
    'region.Курская область': 'Kursk Region',
    'region.Липецкая область': 'Lipetsk Region',
    'region.Орловская область': 'Oryol Region',
    'region.Рязанская область': 'Ryazan Region',
    'region.Смоленская область': 'Smolensk Region',
    'region.Тамбовская область': 'Tambov Region',
    'region.Тверская область': 'Tver Region',
    'region.Тульская область': 'Tula Region',
    'region.Ярославская область': 'Yaroslavl Region',
    
    // Northwestern District
    'region.Санкт-Петербург': 'Saint Petersburg',
    'region.Ленинградская область': 'Leningrad Region',
    'region.Архангельская область': 'Arkhangelsk Region',
    'region.Вологодская область': 'Vologda Region',
    'region.Калининградская область': 'Kaliningrad Region',
    'region.Республика Карелия': 'Republic of Karelia',
    'region.Республика Коми': 'Komi Republic',
    'region.Мурманская область': 'Murmansk Region',
    'region.Новгородская область': 'Novgorod Region',
    'region.Псковская область': 'Pskov Region',
    'region.Ненецкий АО': 'Nenets Autonomous Okrug',
    
    // Southern District
    'region.Ростовская область': 'Rostov Region',
    'region.Астраханская область': 'Astrakhan Region',
    'region.Волгоградская область': 'Volgograd Region',
    'region.Республика Адыгея': 'Republic of Adygea',
    'region.Республика Калмыкия': 'Republic of Kalmykia',
    'region.Краснодарский край': 'Krasnodar Krai',
    'region.Республика Крым': 'Republic of Crimea',
    'region.Севастополь': 'Sevastopol',
    
    // North Caucasian District
    'region.Ставропольский край': 'Stavropol Krai',
    'region.Республика Дагестан': 'Republic of Dagestan',
    'region.Республика Ингушетия': 'Republic of Ingushetia',
    'region.Кабардино-Балкарская Республика': 'Kabardino-Balkarian Republic',
    'region.Карачаево-Черкесская Республика': 'Karachay-Cherkess Republic',
    'region.Республика Северная Осетия — Алания': 'Republic of North Ossetia-Alania',
    'region.Чеченская Республика': 'Chechen Republic',
    
    // Volga District
    'region.Республика Башкортостан': 'Republic of Bashkortostan',
    'region.Республика Марий Эл': 'Mari El Republic',
    'region.Республика Мордовия': 'Republic of Mordovia',
    'region.Республика Татарстан': 'Republic of Tatarstan',
    'region.Удмуртская Республика': 'Udmurt Republic',
    'region.Чувашская Республика': 'Chuvash Republic',
    'region.Кировская область': 'Kirov Region',
    'region.Нижегородская область': 'Nizhny Novgorod Region',
    'region.Оренбургская область': 'Orenburg Region',
    'region.Пензенская область': 'Penza Region',
    'region.Пермский край': 'Perm Krai',
    'region.Самарская область': 'Samara Region',
    'region.Саратовская область': 'Saratov Region',
    'region.Ульяновская область': 'Ulyanovsk Region',
    
    // Ural District
    'region.Курганская область': 'Kurgan Region',
    'region.Свердловская область': 'Sverdlovsk Region',
    'region.Тюменская область': 'Tyumen Region',
    'region.Ханты-Мансийский АО — Югра': 'Khanty-Mansi Autonomous Okrug',
    'region.Челябинская область': 'Chelyabinsk Region',
    'region.Ямало-Ненецкий АО': 'Yamalo-Nenets Autonomous Okrug',
    
    // Siberian District
    'region.Республика Алтай': 'Altai Republic',
    'region.Республика Тыва': 'Tuva Republic',
    'region.Республика Хакасия': 'Republic of Khakassia',
    'region.Алтайский край': 'Altai Krai',
    'region.Красноярский край': 'Krasnoyarsk Krai',
    'region.Иркутская область': 'Irkutsk Region',
    'region.Кемеровская область': 'Kemerovo Region',
    'region.Новосибирская область': 'Novosibirsk Region',
    'region.Омская область': 'Omsk Region',
    'region.Томская область': 'Tomsk Region',
    'region.Забайкальский край': 'Zabaykalsky Krai',
    
    // Far Eastern District
    'region.Республика Бурятия': 'Republic of Buryatia',
    'region.Республика Саха (Якутия)': 'Sakha Republic (Yakutia)',
    'region.Камчатский край': 'Kamchatka Krai',
    'region.Приморский край': 'Primorsky Krai',
    'region.Хабаровский край': 'Khabarovsk Krai',
    'region.Амурская область': 'Amur Region',
    'region.Магаданская область': 'Magadan Region',
    'region.Сахалинская область': 'Sakhalin Region',
    'region.Еврейская АО': 'Jewish Autonomous Oblast',
    'region.Чукотский АО': 'Chukotka Autonomous Okrug',
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