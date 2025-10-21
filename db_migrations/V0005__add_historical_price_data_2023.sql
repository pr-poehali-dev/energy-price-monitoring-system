-- Добавление исторических данных за 2023 год (12 месяцев)
-- Генерация данных с реалистичными колебаниями цен

-- Январь 2023 (базовые цены минус ~20% от 2024)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT 
    r.id,
    CASE r.name
        WHEN 'Москва' THEN 5.95
        WHEN 'Санкт-Петербург' THEN 5.70
        WHEN 'Белгородская область' THEN 4.72
        WHEN 'Брянская область' THEN 4.65
        WHEN 'Владимирская область' THEN 4.78
        WHEN 'Воронежская область' THEN 4.39
        WHEN 'Ивановская область' THEN 4.86
        WHEN 'Калужская область' THEN 4.74
        WHEN 'Костромская область' THEN 4.70
        WHEN 'Курская область' THEN 4.58
        WHEN 'Липецкая область' THEN 4.48
        WHEN 'Московская область' THEN 5.85
        WHEN 'Орловская область' THEN 4.61
        WHEN 'Рязанская область' THEN 4.68
        WHEN 'Смоленская область' THEN 4.64
        WHEN 'Тамбовская область' THEN 4.54
        WHEN 'Тверская область' THEN 4.73
        WHEN 'Тульская область' THEN 4.67
        WHEN 'Ярославская область' THEN 4.71
        WHEN 'Республика Карелия' THEN 4.61
        WHEN 'Республика Коми' THEN 4.57
        WHEN 'Архангельская область' THEN 4.68
        WHEN 'Ненецкий АО' THEN 5.35
        WHEN 'Вологодская область' THEN 4.55
        WHEN 'Калининградская область' THEN 4.79
        WHEN 'Ленинградская область' THEN 5.65
        WHEN 'Мурманская область' THEN 4.90
        WHEN 'Новгородская область' THEN 4.58
        WHEN 'Псковская область' THEN 4.54
        WHEN 'Республика Адыгея' THEN 4.74
        WHEN 'Республика Калмыкия' THEN 4.30
        WHEN 'Республика Крым' THEN 4.95
        WHEN 'Краснодарский край' THEN 5.47
        WHEN 'Астраханская область' THEN 4.37
        WHEN 'Волгоградская область' THEN 4.68
        WHEN 'Ростовская область' THEN 5.21
        WHEN 'Севастополь' THEN 5.03
        WHEN 'Республика Дагестан' THEN 4.26
        WHEN 'Республика Ингушетия' THEN 4.45
        WHEN 'Кабардино-Балкарская Республика' THEN 4.38
        WHEN 'Карачаево-Черкесская Республика' THEN 4.42
        WHEN 'Республика Северная Осетия' THEN 4.40
        WHEN 'Чеченская Республика' THEN 4.22
        WHEN 'Ставропольский край' THEN 4.76
        WHEN 'Республика Башкортостан' THEN 4.51
        WHEN 'Республика Марий Эл' THEN 4.43
        WHEN 'Республика Мордовия' THEN 4.41
        WHEN 'Республика Татарстан' THEN 4.63
        WHEN 'Удмуртская Республика' THEN 4.49
        WHEN 'Чувашская Республика' THEN 4.46
        WHEN 'Пермский край' THEN 4.72
        WHEN 'Кировская область' THEN 4.47
        WHEN 'Нижегородская область' THEN 4.84
        WHEN 'Оренбургская область' THEN 4.40
        WHEN 'Пензенская область' THEN 4.45
        WHEN 'Самарская область' THEN 4.74
        WHEN 'Саратовская область' THEN 4.48
        WHEN 'Ульяновская область' THEN 4.53
        WHEN 'Курганская область' THEN 4.59
        WHEN 'Свердловская область' THEN 4.67
        WHEN 'Тюменская область' THEN 4.25
        WHEN 'Ханты-Мансийский АО' THEN 4.18
        WHEN 'Ямало-Ненецкий АО' THEN 3.83
        WHEN 'Челябинская область' THEN 4.65
        WHEN 'Республика Алтай' THEN 4.92
        WHEN 'Республика Тыва' THEN 5.51
        WHEN 'Республика Хакасия' THEN 4.59
        WHEN 'Алтайский край' THEN 4.80
        WHEN 'Красноярский край' THEN 4.34
        WHEN 'Иркутская область' THEN 3.72
        WHEN 'Кемеровская область' THEN 4.55
        WHEN 'Новосибирская область' THEN 4.77
        WHEN 'Омская область' THEN 4.63
        WHEN 'Томская область' THEN 4.50
        WHEN 'Республика Бурятия' THEN 4.73
        WHEN 'Республика Саха (Якутия)' THEN 5.27
        WHEN 'Забайкальский край' THEN 4.87
        WHEN 'Камчатский край' THEN 5.88
        WHEN 'Приморский край' THEN 5.13
        WHEN 'Хабаровский край' THEN 5.20
        WHEN 'Амурская область' THEN 4.96
        WHEN 'Магаданская область' THEN 6.32
        WHEN 'Сахалинская область' THEN 5.99
        WHEN 'Еврейская АО' THEN 5.09
        WHEN 'Чукотский АО' THEN 6.62
        ELSE 4.80
    END as price,
    'historical_data_2023',
    '2023-01-15'::timestamp
FROM regions r;

-- Февраль 2023 (+1.5%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.015)::numeric, 2), 'historical_data_2023', '2023-02-15'::timestamp
FROM price_history WHERE recorded_at = '2023-01-15';

-- Март 2023 (+1.2%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.012)::numeric, 2), 'historical_data_2023', '2023-03-15'::timestamp
FROM price_history WHERE recorded_at = '2023-02-15';

-- Апрель 2023 (+2.0%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.020)::numeric, 2), 'historical_data_2023', '2023-04-15'::timestamp
FROM price_history WHERE recorded_at = '2023-03-15';

-- Май 2023 (+0.8%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.008)::numeric, 2), 'historical_data_2023', '2023-05-15'::timestamp
FROM price_history WHERE recorded_at = '2023-04-15';

-- Июнь 2023 (+1.5%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.015)::numeric, 2), 'historical_data_2023', '2023-06-15'::timestamp
FROM price_history WHERE recorded_at = '2023-05-15';

-- Июль 2023 (+1.8%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.018)::numeric, 2), 'historical_data_2023', '2023-07-15'::timestamp
FROM price_history WHERE recorded_at = '2023-06-15';

-- Август 2023 (+1.1%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.011)::numeric, 2), 'historical_data_2023', '2023-08-15'::timestamp
FROM price_history WHERE recorded_at = '2023-07-15';

-- Сентябрь 2023 (+2.3%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.023)::numeric, 2), 'historical_data_2023', '2023-09-15'::timestamp
FROM price_history WHERE recorded_at = '2023-08-15';

-- Октябрь 2023 (+1.4%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.014)::numeric, 2), 'historical_data_2023', '2023-10-15'::timestamp
FROM price_history WHERE recorded_at = '2023-09-15';

-- Ноябрь 2023 (+1.9%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.019)::numeric, 2), 'historical_data_2023', '2023-11-15'::timestamp
FROM price_history WHERE recorded_at = '2023-10-15';

-- Декабрь 2023 (+1.3%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.013)::numeric, 2), 'historical_data_2023', '2023-12-15'::timestamp
FROM price_history WHERE recorded_at = '2023-11-15';