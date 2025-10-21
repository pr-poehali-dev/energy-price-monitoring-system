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
  ],
  'Ростовская область': [
    { name: 'Ростов-на-Дону', price: 5.12, population: 1.14 },
    { name: 'Таганрог', price: 5.08, population: 0.25 },
    { name: 'Шахты', price: 5.15, population: 0.23 },
    { name: 'Волгодонск', price: 5.09, population: 0.17 },
    { name: 'Новочеркасск', price: 5.13, population: 0.17 }
  ],
  'Башкортостан': [
    { name: 'Уфа', price: 4.37, population: 1.13 },
    { name: 'Стерлитамак', price: 4.33, population: 0.28 },
    { name: 'Салават', price: 4.39, population: 0.15 },
    { name: 'Нефтекамск', price: 4.35, population: 0.13 },
    { name: 'Октябрьский', price: 4.38, population: 0.11 }
  ],
  'Пермский край': [
    { name: 'Пермь', price: 4.51, population: 1.05 },
    { name: 'Березники', price: 4.47, population: 0.14 },
    { name: 'Соликамск', price: 4.53, population: 0.09 },
    { name: 'Чайковский', price: 4.49, population: 0.08 },
    { name: 'Кунгур', price: 4.52, population: 0.07 }
  ],
  'Волгоградская область': [
    { name: 'Волгоград', price: 4.94, population: 1.01 },
    { name: 'Волжский', price: 4.91, population: 0.32 },
    { name: 'Камышин', price: 4.96, population: 0.11 },
    { name: 'Михайловка', price: 4.93, population: 0.06 },
    { name: 'Урюпинск', price: 4.95, population: 0.04 }
  ],
  'Красноярский край': [
    { name: 'Красноярск', price: 3.82, population: 1.09 },
    { name: 'Норильск', price: 3.76, population: 0.18 },
    { name: 'Ачинск', price: 3.85, population: 0.11 },
    { name: 'Канск', price: 3.79, population: 0.09 },
    { name: 'Минусинск', price: 3.83, population: 0.07 }
  ],
  'Самарская область': [
    { name: 'Самара', price: 5.18, population: 1.16 },
    { name: 'Тольятти', price: 5.14, population: 0.69 },
    { name: 'Сызрань', price: 5.21, population: 0.17 },
    { name: 'Новокуйбышевск', price: 5.16, population: 0.1 },
    { name: 'Чапаевск', price: 5.19, population: 0.07 }
  ],
  'Воронежская область': [
    { name: 'Воронеж', price: 5.07, population: 1.06 },
    { name: 'Борисоглебск', price: 5.03, population: 0.06 },
    { name: 'Россошь', price: 5.09, population: 0.06 },
    { name: 'Лиски', price: 5.05, population: 0.05 },
    { name: 'Нововоронеж', price: 5.08, population: 0.03 }
  ],
  'Саратовская область': [
    { name: 'Саратов', price: 4.78, population: 0.84 },
    { name: 'Энгельс', price: 4.75, population: 0.23 },
    { name: 'Балаково', price: 4.81, population: 0.19 },
    { name: 'Балашов', price: 4.77, population: 0.08 },
    { name: 'Вольск', price: 4.79, population: 0.06 }
  ],
  'Тюменская область': [
    { name: 'Тюмень', price: 3.94, population: 0.82 },
    { name: 'Тобольск', price: 3.91, population: 0.1 },
    { name: 'Ишим', price: 3.96, population: 0.06 },
    { name: 'Ялуторовск', price: 3.93, population: 0.04 },
    { name: 'Заводоуральск', price: 3.95, population: 0.03 }
  ],
  'Алтайский край': [
    { name: 'Барнаул', price: 4.42, population: 0.63 },
    { name: 'Бийск', price: 4.38, population: 0.2 },
    { name: 'Рубцовск', price: 4.45, population: 0.14 },
    { name: 'Новоалтайск', price: 4.41, population: 0.07 },
    { name: 'Камень-на-Оби', price: 4.43, population: 0.04 }
  ],
  'Приморский край': [
    { name: 'Владивосток', price: 5.83, population: 0.6 },
    { name: 'Находка', price: 5.79, population: 0.15 },
    { name: 'Уссурийск', price: 5.86, population: 0.17 },
    { name: 'Артём', price: 5.81, population: 0.11 },
    { name: 'Большой Камень', price: 5.84, population: 0.04 }
  ],
  'Ставропольский край': [
    { name: 'Ставрополь', price: 5.27, population: 0.49 },
    { name: 'Пятигорск', price: 5.24, population: 0.15 },
    { name: 'Кисловодск', price: 5.29, population: 0.13 },
    { name: 'Невинномысск', price: 5.25, population: 0.12 },
    { name: 'Ессентуки', price: 5.28, population: 0.11 }
  ],
  'Хабаровский край': [
    { name: 'Хабаровск', price: 6.12, population: 0.62 },
    { name: 'Комсомольск-на-Амуре', price: 6.08, population: 0.25 },
    { name: 'Амурск', price: 6.15, population: 0.04 },
    { name: 'Советская Гавань', price: 6.09, population: 0.03 },
    { name: 'Николаевск-на-Амуре', price: 6.13, population: 0.02 }
  ],
  'Омская область': [
    { name: 'Омск', price: 4.68, population: 1.15 },
    { name: 'Калачинск', price: 4.64, population: 0.02 },
    { name: 'Тара', price: 4.71, population: 0.03 },
    { name: 'Исилькуль', price: 4.66, population: 0.02 },
    { name: 'Называевск', price: 4.69, population: 0.01 }
  ],
  'Иркутская область': [
    { name: 'Иркутск', price: 3.67, population: 0.62 },
    { name: 'Братск', price: 3.63, population: 0.23 },
    { name: 'Ангарск', price: 3.69, population: 0.23 },
    { name: 'Усть-Илимск', price: 3.65, population: 0.08 },
    { name: 'Усолье-Сибирское', price: 3.68, population: 0.08 }
  ],
  'Кемеровская область': [
    { name: 'Кемерово', price: 4.14, population: 0.56 },
    { name: 'Новокузнецк', price: 4.11, population: 0.55 },
    { name: 'Прокопьевск', price: 4.16, population: 0.2 },
    { name: 'Ленинск-Кузнецкий', price: 4.13, population: 0.1 },
    { name: 'Междуреченск', price: 4.15, population: 0.1 }
  ],
  'Удмуртская Республика': [
    { name: 'Ижевск', price: 4.46, population: 0.65 },
    { name: 'Сарапул', price: 4.42, population: 0.1 },
    { name: 'Воткинск', price: 4.48, population: 0.1 },
    { name: 'Глазов', price: 4.44, population: 0.09 },
    { name: 'Можга', price: 4.47, population: 0.05 }
  ],
  'Оренбургская область': [
    { name: 'Оренбург', price: 4.59, population: 0.57 },
    { name: 'Орск', price: 4.55, population: 0.23 },
    { name: 'Новотроицк', price: 4.62, population: 0.09 },
    { name: 'Бузулук', price: 4.57, population: 0.09 },
    { name: 'Соль-Илецк', price: 4.61, population: 0.03 }
  ]
};

export function getCitiesForRegion(regionName: string): City[] {
  return citiesByRegion[regionName] || [];
}
