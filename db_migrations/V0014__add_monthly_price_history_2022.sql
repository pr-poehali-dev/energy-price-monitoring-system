-- Monthly price history data for 2022 (12 months)

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.85
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.85
           WHEN 'Московская область' THEN 6.62 * 0.85
           ELSE 5.00 * 0.85
       END AS NUMERIC), 2),
       '2022-01-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.855
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.855
           WHEN 'Московская область' THEN 6.62 * 0.855
           ELSE 5.00 * 0.855
       END AS NUMERIC), 2),
       '2022-02-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.86
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.86
           WHEN 'Московская область' THEN 6.62 * 0.86
           ELSE 5.00 * 0.86
       END AS NUMERIC), 2),
       '2022-03-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.865
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.865
           WHEN 'Московская область' THEN 6.62 * 0.865
           ELSE 5.00 * 0.865
       END AS NUMERIC), 2),
       '2022-04-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.87
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.87
           WHEN 'Московская область' THEN 6.62 * 0.87
           ELSE 5.00 * 0.87
       END AS NUMERIC), 2),
       '2022-05-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.875
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.875
           WHEN 'Московская область' THEN 6.62 * 0.875
           ELSE 5.00 * 0.875
       END AS NUMERIC), 2),
       '2022-06-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.88
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.88
           WHEN 'Московская область' THEN 6.62 * 0.88
           ELSE 5.00 * 0.88
       END AS NUMERIC), 2),
       '2022-07-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.885
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.885
           WHEN 'Московская область' THEN 6.62 * 0.885
           ELSE 5.00 * 0.885
       END AS NUMERIC), 2),
       '2022-08-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.89
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.89
           WHEN 'Московская область' THEN 6.62 * 0.89
           ELSE 5.00 * 0.89
       END AS NUMERIC), 2),
       '2022-09-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.895
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.895
           WHEN 'Московская область' THEN 6.62 * 0.895
           ELSE 5.00 * 0.895
       END AS NUMERIC), 2),
       '2022-10-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.90
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.90
           WHEN 'Московская область' THEN 6.62 * 0.90
           ELSE 5.00 * 0.90
       END AS NUMERIC), 2),
       '2022-11-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, 
       ROUND(CAST(CASE r.name
           WHEN 'Москва' THEN 6.74 * 0.905
           WHEN 'Санкт-Петербург' THEN 6.45 * 0.905
           WHEN 'Московская область' THEN 6.62 * 0.905
           ELSE 5.00 * 0.905
       END AS NUMERIC), 2),
       '2022-12-15'::timestamp,
       'MONTHLY_GENERATED',
       'single',
       'all',
       'residential'
FROM regions r
ON CONFLICT DO NOTHING;
