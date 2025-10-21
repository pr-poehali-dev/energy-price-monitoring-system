import type { City } from '@/components/energy/types';

export const citiesByRegion: Record<string, City[]> = {
  'Москва': [
    { name: 'Москва (центр)', price: 5.47, population: 12.6 },
    { name: 'Москва (север)', price: 5.38, population: 3.2 },
    { name: 'Москва (юг)', price: 5.52, population: 3.8 },
    { name: 'Москва (восток)', price: 5.43, population: 2.9 },
    { name: 'Москва (запад)', price: 5.49, population: 2.7 },
    { name: 'Москва (двухзонный - день)', price: 6.29, population: 4.2 },
    { name: 'Москва (двухзонный - ночь)', price: 2.13, population: 4.2 },
    { name: 'Москва (трёхзонный - пик)', price: 7.18, population: 3.1 },
    { name: 'Москва (трёхзонный - полупик)', price: 5.47, population: 3.1 },
    { name: 'Москва (трёхзонный - ночь)', price: 2.13, population: 3.1 }
  ],
  'Санкт-Петербург': [
    { name: 'Санкт-Петербург (центр)', price: 4.84, population: 5.6 },
    { name: 'Колпино', price: 4.79, population: 0.15 },
    { name: 'Пушкин', price: 4.87, population: 0.11 },
    { name: 'Кронштадт', price: 4.91, population: 0.04 },
    { name: 'Петергоф', price: 4.82, population: 0.08 },
    { name: 'СПб (двухзонный - день)', price: 5.58, population: 2.8 },
    { name: 'СПб (двухзонный - ночь)', price: 2.87, population: 2.8 },
    { name: 'СПб (трёхзонный - пик)', price: 6.43, population: 1.9 },
    { name: 'СПб (трёхзонный - полупик)', price: 4.84, population: 1.9 },
    { name: 'СПб (трёхзонный - ночь)', price: 2.87, population: 1.9 }
  ],
  'Московская область': [
    { name: 'Балашиха', price: 5.92, population: 0.52 },
    { name: 'Подольск', price: 5.87, population: 0.31 },
    { name: 'Химки', price: 5.94, population: 0.26 },
    { name: 'Мытищи', price: 5.89, population: 0.25 },
    { name: 'Королёв', price: 5.91, population: 0.22 },
    { name: 'МО (двухзонный - день)', price: 6.82, population: 1.5 },
    { name: 'МО (двухзонный - ночь)', price: 2.31, population: 1.5 }
  ],
  'Ленинградская область': [
    { name: 'Гатчина', price: 5.21, population: 0.09 },
    { name: 'Выборг', price: 5.18, population: 0.08 },
    { name: 'Всеволожск', price: 5.24, population: 0.07 },
    { name: 'Сосновый Бор', price: 5.19, population: 0.07 },
    { name: 'Тихвин', price: 5.16, population: 0.06 },
    { name: 'ЛО (двухзонный - день)', price: 6.01, population: 0.4 },
    { name: 'ЛО (двухзонный - ночь)', price: 3.09, population: 0.4 }
  ],
  'Татарстан': [
    { name: 'Казань', price: 4.25, population: 1.26 },
    { name: 'Набережные Челны', price: 4.22, population: 0.53 },
    { name: 'Нижнекамск', price: 4.28, population: 0.24 },
    { name: 'Альметьевск', price: 4.19, population: 0.15 },
    { name: 'Зеленодольск', price: 4.27, population: 0.1 },
    { name: 'Казань (двухзонный - день)', price: 4.89, population: 0.8 },
    { name: 'Казань (двухзонный - ночь)', price: 2.52, population: 0.8 },
    { name: 'Казань (трёхзонный - пик)', price: 5.61, population: 0.5 },
    { name: 'Казань (трёхзонный - полупик)', price: 4.25, population: 0.5 },
    { name: 'Казань (трёхзонный - ночь)', price: 2.52, population: 0.5 }
  ],
  'Свердловская область': [
    { name: 'Екатеринбург', price: 4.73, population: 1.54 },
    { name: 'Нижний Тагил', price: 4.68, population: 0.34 },
    { name: 'Каменск-Уральский', price: 4.76, population: 0.17 },
    { name: 'Первоуральск', price: 4.71, population: 0.12 },
    { name: 'Серов', price: 4.69, population: 0.09 },
    { name: 'Екб (двухзонный - день)', price: 5.45, population: 0.9 },
    { name: 'Екб (двухзонный - ночь)', price: 2.80, population: 0.9 },
    { name: 'Екб (трёхзонный - пик)', price: 6.25, population: 0.6 },
    { name: 'Екб (трёхзонный - полупик)', price: 4.73, population: 0.6 },
    { name: 'Екб (трёхзонный - ночь)', price: 2.80, population: 0.6 }
  ],
  'Краснодарский край': [
    { name: 'Краснодар', price: 5.63, population: 1.04 },
    { name: 'Сочи', price: 5.71, population: 0.41 },
    { name: 'Новороссийск', price: 5.59, population: 0.28 },
    { name: 'Армавир', price: 5.65, population: 0.19 },
    { name: 'Ейск', price: 5.58, population: 0.08 },
    { name: 'Краснодар (двухзонный - день)', price: 6.48, population: 0.65 },
    { name: 'Краснодар (двухзонный - ночь)', price: 3.33, population: 0.65 },
    { name: 'Сочи (двухзонный - день)', price: 6.57, population: 0.25 },
    { name: 'Сочи (двухзонный - ночь)', price: 3.38, population: 0.25 }
  ],
  'Новосибирская область': [
    { name: 'Новосибирск', price: 4.91, population: 1.63 },
    { name: 'Бердск', price: 4.87, population: 0.1 },
    { name: 'Искитим', price: 4.93, population: 0.06 },
    { name: 'Куйбышев', price: 4.89, population: 0.04 },
    { name: 'Обь', price: 4.92, population: 0.03 },
    { name: 'Нск (двухзонный - день)', price: 5.65, population: 1.0 },
    { name: 'Нск (двухзонный - ночь)', price: 2.90, population: 1.0 },
    { name: 'Нск (трёхзонный - пик)', price: 6.48, population: 0.7 },
    { name: 'Нск (трёхзонный - полупик)', price: 4.91, population: 0.7 },
    { name: 'Нск (трёхзонный - ночь)', price: 2.90, population: 0.7 }
  ],
  'Нижегородская область': [
    { name: 'Нижний Новгород', price: 5.34, population: 1.23 },
    { name: 'Дзержинск', price: 5.31, population: 0.23 },
    { name: 'Арзамас', price: 5.37, population: 0.1 },
    { name: 'Саров', price: 5.29, population: 0.09 },
    { name: 'Кстово', price: 5.36, population: 0.07 },
    { name: 'НН (двухзонный - день)', price: 6.15, population: 0.75 },
    { name: 'НН (двухзонный - ночь)', price: 3.16, population: 0.75 },
    { name: 'НН (трёхзонный - пик)', price: 7.05, population: 0.5 },
    { name: 'НН (трёхзонный - полупик)', price: 5.34, population: 0.5 },
    { name: 'НН (трёхзонный - ночь)', price: 3.16, population: 0.5 }
  ],
  'Челябинская область': [
    { name: 'Челябинск', price: 4.58, population: 1.2 },
    { name: 'Магнитогорск', price: 4.53, population: 0.41 },
    { name: 'Златоуст', price: 4.61, population: 0.17 },
    { name: 'Миасс', price: 4.56, population: 0.15 },
    { name: 'Копейск', price: 4.59, population: 0.14 },
    { name: 'Челябинск (двухзонный - день)', price: 5.27, population: 0.7 },
    { name: 'Челябинск (двухзонный - ночь)', price: 2.71, population: 0.7 },
    { name: 'Челябинск (трёхзонный - пик)', price: 6.04, population: 0.45 },
    { name: 'Челябинск (трёхзонный - полупик)', price: 4.58, population: 0.45 },
    { name: 'Челябинск (трёхзонный - ночь)', price: 2.71, population: 0.45 }
  ],
  'Ростовская область': [
    { name: 'Ростов-на-Дону', price: 5.12, population: 1.14 },
    { name: 'Таганрог', price: 5.08, population: 0.25 },
    { name: 'Шахты', price: 5.15, population: 0.23 },
    { name: 'Волгодонск', price: 5.09, population: 0.17 },
    { name: 'Новочеркасск', price: 5.13, population: 0.17 },
    { name: 'Ростов (двухзонный - день)', price: 5.89, population: 0.68 },
    { name: 'Ростов (двухзонный - ночь)', price: 3.03, population: 0.68 },
    { name: 'Ростов (трёхзонный - пик)', price: 6.76, population: 0.42 },
    { name: 'Ростов (трёхзонный - полупик)', price: 5.12, population: 0.42 },
    { name: 'Ростов (трёхзонный - ночь)', price: 3.03, population: 0.42 }
  ],
  'Башкортостан': [
    { name: 'Уфа', price: 4.37, population: 1.13 },
    { name: 'Стерлитамак', price: 4.33, population: 0.28 },
    { name: 'Салават', price: 4.39, population: 0.15 },
    { name: 'Нефтекамск', price: 4.35, population: 0.13 },
    { name: 'Октябрьский', price: 4.38, population: 0.11 },
    { name: 'Уфа (двухзонный - день)', price: 5.03, population: 0.65 },
    { name: 'Уфа (двухзонный - ночь)', price: 2.59, population: 0.65 },
    { name: 'Уфа (трёхзонный - пик)', price: 5.77, population: 0.4 },
    { name: 'Уфа (трёхзонный - полупик)', price: 4.37, population: 0.4 },
    { name: 'Уфа (трёхзонный - ночь)', price: 2.59, population: 0.4 }
  ],
  'Пермский край': [
    { name: 'Пермь', price: 4.51, population: 1.05 },
    { name: 'Березники', price: 4.47, population: 0.14 },
    { name: 'Соликамск', price: 4.53, population: 0.09 },
    { name: 'Чайковский', price: 4.49, population: 0.08 },
    { name: 'Кунгур', price: 4.52, population: 0.07 },
    { name: 'Пермь (двухзонный - день)', price: 5.19, population: 0.6 },
    { name: 'Пермь (двухзонный - ночь)', price: 2.67, population: 0.6 },
    { name: 'Пермь (трёхзонный - пик)', price: 5.95, population: 0.38 },
    { name: 'Пермь (трёхзонный - полупик)', price: 4.51, population: 0.38 },
    { name: 'Пермь (трёхзонный - ночь)', price: 2.67, population: 0.38 }
  ],
  'Волгоградская область': [
    { name: 'Волгоград', price: 4.94, population: 1.01 },
    { name: 'Волжский', price: 4.91, population: 0.32 },
    { name: 'Камышин', price: 4.96, population: 0.11 },
    { name: 'Михайловка', price: 4.93, population: 0.06 },
    { name: 'Урюпинск', price: 4.95, population: 0.04 },
    { name: 'Волгоград (двухзонный - день)', price: 5.68, population: 0.58 },
    { name: 'Волгоград (двухзонный - ночь)', price: 2.92, population: 0.58 }
  ],
  'Красноярский край': [
    { name: 'Красноярск', price: 3.82, population: 1.09 },
    { name: 'Норильск', price: 3.76, population: 0.18 },
    { name: 'Ачинск', price: 3.85, population: 0.11 },
    { name: 'Канск', price: 3.79, population: 0.09 },
    { name: 'Минусинск', price: 3.83, population: 0.07 },
    { name: 'Красноярск (двухзонный - день)', price: 4.39, population: 0.63 },
    { name: 'Красноярск (двухзонный - ночь)', price: 2.26, population: 0.63 },
    { name: 'Красноярск (трёхзонный - пик)', price: 5.04, population: 0.4 },
    { name: 'Красноярск (трёхзонный - полупик)', price: 3.82, population: 0.4 },
    { name: 'Красноярск (трёхзонный - ночь)', price: 2.26, population: 0.4 }
  ],
  'Самарская область': [
    { name: 'Самара', price: 5.18, population: 1.16 },
    { name: 'Тольятти', price: 5.14, population: 0.69 },
    { name: 'Сызрань', price: 5.21, population: 0.17 },
    { name: 'Новокуйбышевск', price: 5.16, population: 0.1 },
    { name: 'Чапаевск', price: 5.19, population: 0.07 },
    { name: 'Самара (двухзонный - день)', price: 5.96, population: 0.7 },
    { name: 'Самара (двухзонный - ночь)', price: 3.06, population: 0.7 },
    { name: 'Тольятти (двухзонный - день)', price: 5.92, population: 0.42 },
    { name: 'Тольятти (двухзонный - ночь)', price: 3.04, population: 0.42 }
  ],
  'Воронежская область': [
    { name: 'Воронеж', price: 5.07, population: 1.06 },
    { name: 'Борисоглебск', price: 5.03, population: 0.06 },
    { name: 'Россошь', price: 5.09, population: 0.06 },
    { name: 'Лиски', price: 5.05, population: 0.05 },
    { name: 'Нововоронеж', price: 5.08, population: 0.03 },
    { name: 'Воронеж (двухзонный - день)', price: 5.83, population: 0.62 },
    { name: 'Воронеж (двухзонный - ночь)', price: 3.00, population: 0.62 }
  ],
  'Саратовская область': [
    { name: 'Саратов', price: 4.78, population: 0.84 },
    { name: 'Энгельс', price: 4.75, population: 0.23 },
    { name: 'Балаково', price: 4.81, population: 0.19 },
    { name: 'Балашов', price: 4.77, population: 0.08 },
    { name: 'Вольск', price: 4.79, population: 0.06 },
    { name: 'Саратов (двухзонный - день)', price: 5.50, population: 0.5 },
    { name: 'Саратов (двухзонный - ночь)', price: 2.83, population: 0.5 }
  ],
  'Тюменская область': [
    { name: 'Тюмень', price: 3.94, population: 0.82 },
    { name: 'Тобольск', price: 3.91, population: 0.1 },
    { name: 'Ишим', price: 3.96, population: 0.06 },
    { name: 'Ялуторовск', price: 3.93, population: 0.04 },
    { name: 'Заводоуральск', price: 3.95, population: 0.03 },
    { name: 'Тюмень (двухзонный - день)', price: 4.53, population: 0.48 },
    { name: 'Тюмень (двухзонный - ночь)', price: 2.33, population: 0.48 }
  ],
  'Алтайский край': [
    { name: 'Барнаул', price: 4.42, population: 0.63 },
    { name: 'Бийск', price: 4.38, population: 0.2 },
    { name: 'Рубцовск', price: 4.45, population: 0.14 },
    { name: 'Новоалтайск', price: 4.41, population: 0.07 },
    { name: 'Камень-на-Оби', price: 4.43, population: 0.04 },
    { name: 'Барнаул (двухзонный - день)', price: 5.09, population: 0.37 },
    { name: 'Барнаул (двухзонный - ночь)', price: 2.61, population: 0.37 }
  ],
  'Приморский край': [
    { name: 'Владивосток', price: 5.83, population: 0.6 },
    { name: 'Находка', price: 5.79, population: 0.15 },
    { name: 'Уссурийск', price: 5.86, population: 0.17 },
    { name: 'Артём', price: 5.81, population: 0.11 },
    { name: 'Большой Камень', price: 5.84, population: 0.04 },
    { name: 'Владивосток (двухзонный - день)', price: 6.71, population: 0.35 },
    { name: 'Владивосток (двухзонный - ночь)', price: 3.45, population: 0.35 }
  ],
  'Ставропольский край': [
    { name: 'Ставрополь', price: 5.27, population: 0.49 },
    { name: 'Пятигорск', price: 5.24, population: 0.15 },
    { name: 'Кисловодск', price: 5.29, population: 0.13 },
    { name: 'Невинномысск', price: 5.25, population: 0.12 },
    { name: 'Ессентуки', price: 5.28, population: 0.11 },
    { name: 'Ставрополь (двухзонный - день)', price: 6.06, population: 0.28 },
    { name: 'Ставрополь (двухзонный - ночь)', price: 3.12, population: 0.28 }
  ],
  'Хабаровский край': [
    { name: 'Хабаровск', price: 6.12, population: 0.62 },
    { name: 'Комсомольск-на-Амуре', price: 6.08, population: 0.25 },
    { name: 'Амурск', price: 6.15, population: 0.04 },
    { name: 'Советская Гавань', price: 6.09, population: 0.03 },
    { name: 'Николаевск-на-Амуре', price: 6.13, population: 0.02 },
    { name: 'Хабаровск (двухзонный - день)', price: 7.04, population: 0.36 },
    { name: 'Хабаровск (двухзонный - ночь)', price: 3.62, population: 0.36 }
  ],
  'Омская область': [
    { name: 'Омск', price: 4.68, population: 1.15 },
    { name: 'Калачинск', price: 4.64, population: 0.02 },
    { name: 'Тара', price: 4.71, population: 0.03 },
    { name: 'Исилькуль', price: 4.66, population: 0.02 },
    { name: 'Называевск', price: 4.69, population: 0.01 },
    { name: 'Омск (двухзонный - день)', price: 5.38, population: 0.66 },
    { name: 'Омск (двухзонный - ночь)', price: 2.77, population: 0.66 }
  ],
  'Иркутская область': [
    { name: 'Иркутск', price: 3.67, population: 0.62 },
    { name: 'Братск', price: 3.63, population: 0.23 },
    { name: 'Ангарск', price: 3.69, population: 0.23 },
    { name: 'Усть-Илимск', price: 3.65, population: 0.08 },
    { name: 'Усолье-Сибирское', price: 3.68, population: 0.08 },
    { name: 'Иркутск (двухзонный - день)', price: 4.22, population: 0.36 },
    { name: 'Иркутск (двухзонный - ночь)', price: 2.17, population: 0.36 }
  ],
  'Кемеровская область': [
    { name: 'Кемерово', price: 4.14, population: 0.56 },
    { name: 'Новокузнецк', price: 4.11, population: 0.55 },
    { name: 'Прокопьевск', price: 4.16, population: 0.2 },
    { name: 'Ленинск-Кузнецкий', price: 4.13, population: 0.1 },
    { name: 'Междуреченск', price: 4.15, population: 0.1 },
    { name: 'Кемерово (двухзонный - день)', price: 4.76, population: 0.32 },
    { name: 'Кемерово (двухзонный - ночь)', price: 2.45, population: 0.32 }
  ],
  'Удмуртская Республика': [
    { name: 'Ижевск', price: 4.46, population: 0.65 },
    { name: 'Сарапул', price: 4.42, population: 0.1 },
    { name: 'Воткинск', price: 4.48, population: 0.1 },
    { name: 'Глазов', price: 4.44, population: 0.09 },
    { name: 'Можга', price: 4.47, population: 0.05 },
    { name: 'Ижевск (двухзонный - день)', price: 5.13, population: 0.38 },
    { name: 'Ижевск (двухзонный - ночь)', price: 2.64, population: 0.38 }
  ],
  'Оренбургская область': [
    { name: 'Оренбург', price: 4.52, population: 0.57 },
    { name: 'Орск', price: 4.48, population: 0.23 },
    { name: 'Новотроицк', price: 4.54, population: 0.09 },
    { name: 'Бузулук', price: 4.51, population: 0.09 },
    { name: 'Бугуруслан', price: 4.53, population: 0.05 },
    { name: 'Оренбург (двухзонный - день)', price: 5.20, population: 0.33 },
    { name: 'Оренбург (двухзонный - ночь)', price: 2.67, population: 0.33 }
  ]
};

export function getCitiesForRegion(regionName: string): City[] {
  return citiesByRegion[regionName] || [];
}
