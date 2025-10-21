import type { City } from '@/components/energy/types';

export const citiesByRegion: Record<string, City[]> = {
  'Москва': [
    { name: 'Москва (центр)', price: 5.47, population: 12.6 },
    { name: 'Москва (север)', price: 5.38, population: 3.2 },
    { name: 'Москва (юг)', price: 5.52, population: 3.8 },
    { name: 'Москва (восток)', price: 5.43, population: 2.9 },
    { name: 'Москва (запад)', price: 5.49, population: 2.7 }
  ],
  'Санкт-Петербург': [
    { name: 'Санкт-Петербург', price: 4.84, population: 5.6 },
    { name: 'Колпино', price: 4.79, population: 0.15 },
    { name: 'Пушкин', price: 4.87, population: 0.11 },
    { name: 'Кронштадт', price: 4.91, population: 0.04 },
    { name: 'Петергоф', price: 4.82, population: 0.08 }
  ],
  'Московская область': [
    { name: 'Балашиха', price: 5.92, population: 0.52 },
    { name: 'Подольск', price: 5.87, population: 0.31 },
    { name: 'Химки', price: 5.94, population: 0.26 },
    { name: 'Мытищи', price: 5.89, population: 0.25 },
    { name: 'Королёв', price: 5.91, population: 0.22 }
  ],
  'Ленинградская область': [
    { name: 'Гатчина', price: 5.21, population: 0.09 },
    { name: 'Выборг', price: 5.18, population: 0.08 },
    { name: 'Всеволожск', price: 5.24, population: 0.07 },
    { name: 'Сосновый Бор', price: 5.19, population: 0.07 },
    { name: 'Тихвин', price: 5.16, population: 0.06 }
  ],
  'Татарстан': [
    { name: 'Казань', price: 4.25, population: 1.26 },
    { name: 'Набережные Челны', price: 4.22, population: 0.53 },
    { name: 'Нижнекамск', price: 4.28, population: 0.24 },
    { name: 'Альметьевск', price: 4.19, population: 0.15 },
    { name: 'Зеленодольск', price: 4.27, population: 0.1 }
  ],
  'Свердловская область': [
    { name: 'Екатеринбург', price: 4.73, population: 1.54 },
    { name: 'Нижний Тагил', price: 4.68, population: 0.34 },
    { name: 'Каменск-Уральский', price: 4.76, population: 0.17 },
    { name: 'Первоуральск', price: 4.71, population: 0.12 },
    { name: 'Серов', price: 4.69, population: 0.09 }
  ],
  'Краснодарский край': [
    { name: 'Краснодар', price: 5.63, population: 1.04 },
    { name: 'Сочи', price: 5.71, population: 0.41 },
    { name: 'Новороссийск', price: 5.59, population: 0.28 },
    { name: 'Армавир', price: 5.65, population: 0.19 },
    { name: 'Ейск', price: 5.58, population: 0.08 }
  ],
  'Новосибирская область': [
    { name: 'Новосибирск', price: 4.91, population: 1.63 },
    { name: 'Бердск', price: 4.87, population: 0.1 },
    { name: 'Искитим', price: 4.93, population: 0.06 },
    { name: 'Куйбышев', price: 4.89, population: 0.04 },
    { name: 'Обь', price: 4.92, population: 0.03 }
  ],
  'Нижегородская область': [
    { name: 'Нижний Новгород', price: 5.34, population: 1.23 },
    { name: 'Дзержинск', price: 5.31, population: 0.23 },
    { name: 'Арзамас', price: 5.37, population: 0.1 },
    { name: 'Саров', price: 5.29, population: 0.09 },
    { name: 'Кстово', price: 5.36, population: 0.07 }
  ],
  'Челябинская область': [
    { name: 'Челябинск', price: 4.58, population: 1.2 },
    { name: 'Магнитогорск', price: 4.53, population: 0.41 },
    { name: 'Златоуст', price: 4.61, population: 0.17 },
    { name: 'Миасс', price: 4.56, population: 0.15 },
    { name: 'Копейск', price: 4.59, population: 0.14 }
  ]
};

export function getCitiesForRegion(regionName: string): City[] {
  return citiesByRegion[regionName] || [];
}
