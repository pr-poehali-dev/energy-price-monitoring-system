-- Добавление исторических данных за 2024 год (12 месяцев)
-- Генерация данных с реалистичными колебаниями цен

-- Январь 2024 (базовые цены минус ~10%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT 
    r.id,
    CASE r.name
        WHEN 'Москва' THEN 6.19
        WHEN 'Санкт-Петербург' THEN 5.93
        WHEN 'Белгородская область' THEN 4.91
        WHEN 'Брянская область' THEN 4.84
        WHEN 'Владимирская область' THEN 4.97
        WHEN 'Воронежская область' THEN 4.56
        WHEN 'Ивановская область' THEN 5.05
        WHEN 'Калужская область' THEN 4.93
        WHEN 'Костромская область' THEN 4.89
        WHEN 'Курская область' THEN 4.76
        WHEN 'Липецкая область' THEN 4.66
        WHEN 'Московская область' THEN 6.08
        WHEN 'Орловская область' THEN 4.79
        WHEN 'Рязанская область' THEN 4.87
        WHEN 'Смоленская область' THEN 4.82
        WHEN 'Тамбовская область' THEN 4.72
        WHEN 'Тверская область' THEN 4.92
        WHEN 'Тульская область' THEN 4.85
        WHEN 'Ярославская область' THEN 4.90
        WHEN 'Республика Карелия' THEN 4.79
        WHEN 'Республика Коми' THEN 4.75
        WHEN 'Архангельская область' THEN 4.87
        WHEN 'Ненецкий АО' THEN 5.56
        WHEN 'Вологодская область' THEN 4.73
        WHEN 'Калининградская область' THEN 4.98
        WHEN 'Ленинградская область' THEN 5.88
        WHEN 'Мурманская область' THEN 5.10
        WHEN 'Новгородская область' THEN 4.76
        WHEN 'Псковская область' THEN 4.72
        WHEN 'Республика Адыгея' THEN 4.93
        WHEN 'Республика Калмыкия' THEN 4.47
        WHEN 'Республика Крым' THEN 5.15
        WHEN 'Краснодарский край' THEN 5.69
        WHEN 'Астраханская область' THEN 4.54
        WHEN 'Волгоградская область' THEN 4.87
        WHEN 'Ростовская область' THEN 5.42
        WHEN 'Севастополь' THEN 5.23
        WHEN 'Республика Дагестан' THEN 4.43
        WHEN 'Республика Ингушетия' THEN 4.63
        WHEN 'Кабардино-Балкарская Республика' THEN 4.55
        WHEN 'Карачаево-Черкесская Республика' THEN 4.60
        WHEN 'Республика Северная Осетия' THEN 4.58
        WHEN 'Чеченская Республика' THEN 4.39
        WHEN 'Ставропольский край' THEN 4.95
        WHEN 'Республика Башкортостан' THEN 4.69
        WHEN 'Республика Марий Эл' THEN 4.61
        WHEN 'Республика Мордовия' THEN 4.59
        WHEN 'Республика Татарстан' THEN 4.82
        WHEN 'Удмуртская Республика' THEN 4.67
        WHEN 'Чувашская Республика' THEN 4.64
        WHEN 'Пермский край' THEN 4.91
        WHEN 'Кировская область' THEN 4.65
        WHEN 'Нижегородская область' THEN 5.03
        WHEN 'Оренбургская область' THEN 4.58
        WHEN 'Пензенская область' THEN 4.63
        WHEN 'Самарская область' THEN 4.93
        WHEN 'Саратовская область' THEN 4.66
        WHEN 'Ульяновская область' THEN 4.71
        WHEN 'Курганская область' THEN 4.78
        WHEN 'Свердловская область' THEN 4.86
        WHEN 'Тюменская область' THEN 4.42
        WHEN 'Ханты-Мансийский АО' THEN 4.35
        WHEN 'Ямало-Ненецкий АО' THEN 3.98
        WHEN 'Челябинская область' THEN 4.84
        WHEN 'Республика Алтай' THEN 5.12
        WHEN 'Республика Тыва' THEN 5.73
        WHEN 'Республика Хакасия' THEN 4.77
        WHEN 'Алтайский край' THEN 4.99
        WHEN 'Красноярский край' THEN 4.51
        WHEN 'Иркутская область' THEN 3.87
        WHEN 'Кемеровская область' THEN 4.73
        WHEN 'Новосибирская область' THEN 4.96
        WHEN 'Омская область' THEN 4.82
        WHEN 'Томская область' THEN 4.68
        WHEN 'Республика Бурятия' THEN 4.92
        WHEN 'Республика Саха (Якутия)' THEN 5.48
        WHEN 'Забайкальский край' THEN 5.07
        WHEN 'Камчатский край' THEN 6.12
        WHEN 'Приморский край' THEN 5.34
        WHEN 'Хабаровский край' THEN 5.41
        WHEN 'Амурская область' THEN 5.16
        WHEN 'Магаданская область' THEN 6.57
        WHEN 'Сахалинская область' THEN 6.23
        WHEN 'Еврейская АО' THEN 5.29
        WHEN 'Чукотский АО' THEN 6.89
        ELSE 5.00
    END as price,
    'historical_data_2024',
    '2024-01-15'::timestamp
FROM regions r;

-- Февраль 2024 (+2%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.02)::numeric, 2), 'historical_data_2024', '2024-02-15'::timestamp
FROM price_history WHERE recorded_at = '2024-01-15';

-- Март 2024 (+1.5%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.015)::numeric, 2), 'historical_data_2024', '2024-03-15'::timestamp
FROM price_history WHERE recorded_at = '2024-02-15';

-- Апрель 2024 (+2.5%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.025)::numeric, 2), 'historical_data_2024', '2024-04-15'::timestamp
FROM price_history WHERE recorded_at = '2024-03-15';

-- Май 2024 (+1%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.01)::numeric, 2), 'historical_data_2024', '2024-05-15'::timestamp
FROM price_history WHERE recorded_at = '2024-04-15';

-- Июнь 2024 (+1.8%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.018)::numeric, 2), 'historical_data_2024', '2024-06-15'::timestamp
FROM price_history WHERE recorded_at = '2024-05-15';

-- Июль 2024 (+2.2%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.022)::numeric, 2), 'historical_data_2024', '2024-07-15'::timestamp
FROM price_history WHERE recorded_at = '2024-06-15';

-- Август 2024 (+1.3%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.013)::numeric, 2), 'historical_data_2024', '2024-08-15'::timestamp
FROM price_history WHERE recorded_at = '2024-07-15';

-- Сентябрь 2024 (+2.8%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.028)::numeric, 2), 'historical_data_2024', '2024-09-15'::timestamp
FROM price_history WHERE recorded_at = '2024-08-15';

-- Октябрь 2024 (+1.6%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.016)::numeric, 2), 'historical_data_2024', '2024-10-15'::timestamp
FROM price_history WHERE recorded_at = '2024-09-15';

-- Ноябрь 2024 (+2.1%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.021)::numeric, 2), 'historical_data_2024', '2024-11-15'::timestamp
FROM price_history WHERE recorded_at = '2024-10-15';

-- Декабрь 2024 (+1.4%)
INSERT INTO price_history (region_id, price, source, recorded_at)
SELECT region_id, ROUND((price * 1.014)::numeric, 2), 'historical_data_2024', '2024-12-15'::timestamp
FROM price_history WHERE recorded_at = '2024-11-15';