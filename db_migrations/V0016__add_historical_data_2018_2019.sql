-- Добавление исторических данных за 2018-2019 годы для расширения периода анализа

-- 2018 год (базовые тарифы примерно на 15% ниже 2020)
INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name
    WHEN 'Москва' THEN 4.57
    WHEN 'Санкт-Петербург' THEN 4.23
    WHEN 'Московская область' THEN 4.57
    WHEN 'Ленинградская область' THEN 4.23
    WHEN 'Краснодарский край' THEN 4.01
    WHEN 'Свердловская область' THEN 3.49
    WHEN 'Новосибирская область' THEN 3.05
    WHEN 'Республика Татарстан' THEN 3.28
    WHEN 'Нижегородская область' THEN 3.26
    WHEN 'Красноярский край' THEN 2.36
    WHEN 'Ростовская область' THEN 3.79
    WHEN 'Волгоградская область' THEN 3.57
    WHEN 'Челябинская область' THEN 3.35
    WHEN 'Самарская область' THEN 3.43
    WHEN 'Иркутская область' THEN 1.43
    WHEN 'Республика Саха (Якутия)' THEN 7.04
    WHEN 'Чукотский автономный округ' THEN 8.28
    ELSE 4.25
END AS NUMERIC), 2), '2018-07-01'::timestamp, 'HISTORICAL_DATA', 'single', 'all', 'residential'
FROM regions r
ON CONFLICT DO NOTHING;

-- 2019 год (базовые тарифы примерно на 8% ниже 2020)
INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name
    WHEN 'Москва' THEN 4.95
    WHEN 'Санкт-Петербург' THEN 4.58
    WHEN 'Московская область' THEN 4.95
    WHEN 'Ленинградская область' THEN 4.58
    WHEN 'Краснодарский край' THEN 4.34
    WHEN 'Свердловская область' THEN 3.78
    WHEN 'Новосибирская область' THEN 3.30
    WHEN 'Республика Татарстан' THEN 3.55
    WHEN 'Нижегородская область' THEN 3.53
    WHEN 'Красноярский край' THEN 2.56
    WHEN 'Ростовская область' THEN 4.10
    WHEN 'Волгоградская область' THEN 3.86
    WHEN 'Челябинская область' THEN 3.62
    WHEN 'Самарская область' THEN 3.71
    WHEN 'Иркутская область' THEN 1.55
    WHEN 'Республика Саха (Якутия)' THEN 7.62
    WHEN 'Чукотский автономный округ' THEN 8.96
    ELSE 4.60
END AS NUMERIC), 2), '2019-07-01'::timestamp, 'HISTORICAL_DATA', 'single', 'all', 'residential'
FROM regions r
ON CONFLICT DO NOTHING;

-- Ежемесячные данные за 2018 (12 месяцев)
INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.50 WHEN 'Санкт-Петербург' THEN 4.16 WHEN 'Московская область' THEN 4.50 ELSE 4.18 END AS NUMERIC), 2), '2018-01-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.52 WHEN 'Санкт-Петербург' THEN 4.18 WHEN 'Московская область' THEN 4.52 ELSE 4.20 END AS NUMERIC), 2), '2018-02-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.54 WHEN 'Санкт-Петербург' THEN 4.20 WHEN 'Московская область' THEN 4.54 ELSE 4.22 END AS NUMERIC), 2), '2018-03-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.56 WHEN 'Санкт-Петербург' THEN 4.21 WHEN 'Московская область' THEN 4.56 ELSE 4.23 END AS NUMERIC), 2), '2018-04-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.57 WHEN 'Санкт-Петербург' THEN 4.22 WHEN 'Московская область' THEN 4.57 ELSE 4.24 END AS NUMERIC), 2), '2018-05-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.58 WHEN 'Санкт-Петербург' THEN 4.23 WHEN 'Московская область' THEN 4.58 ELSE 4.25 END AS NUMERIC), 2), '2018-06-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.59 WHEN 'Санкт-Петербург' THEN 4.24 WHEN 'Московская область' THEN 4.59 ELSE 4.26 END AS NUMERIC), 2), '2018-07-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.60 WHEN 'Санкт-Петербург' THEN 4.25 WHEN 'Московская область' THEN 4.60 ELSE 4.27 END AS NUMERIC), 2), '2018-08-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.61 WHEN 'Санкт-Петербург' THEN 4.26 WHEN 'Московская область' THEN 4.61 ELSE 4.28 END AS NUMERIC), 2), '2018-09-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.62 WHEN 'Санкт-Петербург' THEN 4.27 WHEN 'Московская область' THEN 4.62 ELSE 4.29 END AS NUMERIC), 2), '2018-10-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.63 WHEN 'Санкт-Петербург' THEN 4.28 WHEN 'Московская область' THEN 4.63 ELSE 4.30 END AS NUMERIC), 2), '2018-11-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.64 WHEN 'Санкт-Петербург' THEN 4.29 WHEN 'Московская область' THEN 4.64 ELSE 4.31 END AS NUMERIC), 2), '2018-12-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

-- Ежемесячные данные за 2019 (12 месяцев)
INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.70 WHEN 'Санкт-Петербург' THEN 4.35 WHEN 'Московская область' THEN 4.70 ELSE 4.37 END AS NUMERIC), 2), '2019-01-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.75 WHEN 'Санкт-Петербург' THEN 4.40 WHEN 'Московская область' THEN 4.75 ELSE 4.41 END AS NUMERIC), 2), '2019-02-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.80 WHEN 'Санкт-Петербург' THEN 4.44 WHEN 'Московская область' THEN 4.80 ELSE 4.45 END AS NUMERIC), 2), '2019-03-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.84 WHEN 'Санкт-Петербург' THEN 4.48 WHEN 'Московская область' THEN 4.84 ELSE 4.49 END AS NUMERIC), 2), '2019-04-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.88 WHEN 'Санкт-Петербург' THEN 4.51 WHEN 'Московская область' THEN 4.88 ELSE 4.52 END AS NUMERIC), 2), '2019-05-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.91 WHEN 'Санкт-Петербург' THEN 4.54 WHEN 'Московская область' THEN 4.91 ELSE 4.55 END AS NUMERIC), 2), '2019-06-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.94 WHEN 'Санкт-Петербург' THEN 4.57 WHEN 'Московская область' THEN 4.94 ELSE 4.58 END AS NUMERIC), 2), '2019-07-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 4.97 WHEN 'Санкт-Петербург' THEN 4.59 WHEN 'Московская область' THEN 4.97 ELSE 4.60 END AS NUMERIC), 2), '2019-08-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 5.00 WHEN 'Санкт-Петербург' THEN 4.62 WHEN 'Московская область' THEN 5.00 ELSE 4.62 END AS NUMERIC), 2), '2019-09-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 5.03 WHEN 'Санкт-Петербург' THEN 4.65 WHEN 'Московская область' THEN 5.03 ELSE 4.65 END AS NUMERIC), 2), '2019-10-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 5.06 WHEN 'Санкт-Петербург' THEN 4.67 WHEN 'Московская область' THEN 5.06 ELSE 4.68 END AS NUMERIC), 2), '2019-11-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 5.09 WHEN 'Санкт-Петербург' THEN 4.70 WHEN 'Московская область' THEN 5.09 ELSE 4.71 END AS NUMERIC), 2), '2019-12-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;
