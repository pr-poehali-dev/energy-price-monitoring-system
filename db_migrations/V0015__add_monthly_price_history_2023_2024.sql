-- Monthly price history data for 2023-2024 (24 months)

-- 2023 year (12 months)
INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.91 WHEN 'Санкт-Петербург' THEN 6.45 * 0.91 WHEN 'Московская область' THEN 6.62 * 0.91 ELSE 5.00 * 0.91 END AS NUMERIC), 2), '2023-01-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.915 WHEN 'Санкт-Петербург' THEN 6.45 * 0.915 WHEN 'Московская область' THEN 6.62 * 0.915 ELSE 5.00 * 0.915 END AS NUMERIC), 2), '2023-02-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.92 WHEN 'Санкт-Петербург' THEN 6.45 * 0.92 WHEN 'Московская область' THEN 6.62 * 0.92 ELSE 5.00 * 0.92 END AS NUMERIC), 2), '2023-03-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.925 WHEN 'Санкт-Петербург' THEN 6.45 * 0.925 WHEN 'Московская область' THEN 6.62 * 0.925 ELSE 5.00 * 0.925 END AS NUMERIC), 2), '2023-04-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.93 WHEN 'Санкт-Петербург' THEN 6.45 * 0.93 WHEN 'Московская область' THEN 6.62 * 0.93 ELSE 5.00 * 0.93 END AS NUMERIC), 2), '2023-05-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.935 WHEN 'Санкт-Петербург' THEN 6.45 * 0.935 WHEN 'Московская область' THEN 6.62 * 0.935 ELSE 5.00 * 0.935 END AS NUMERIC), 2), '2023-06-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.94 WHEN 'Санкт-Петербург' THEN 6.45 * 0.94 WHEN 'Московская область' THEN 6.62 * 0.94 ELSE 5.00 * 0.94 END AS NUMERIC), 2), '2023-07-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.945 WHEN 'Санкт-Петербург' THEN 6.45 * 0.945 WHEN 'Московская область' THEN 6.62 * 0.945 ELSE 5.00 * 0.945 END AS NUMERIC), 2), '2023-08-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.95 WHEN 'Санкт-Петербург' THEN 6.45 * 0.95 WHEN 'Московская область' THEN 6.62 * 0.95 ELSE 5.00 * 0.95 END AS NUMERIC), 2), '2023-09-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.955 WHEN 'Санкт-Петербург' THEN 6.45 * 0.955 WHEN 'Московская область' THEN 6.62 * 0.955 ELSE 5.00 * 0.955 END AS NUMERIC), 2), '2023-10-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.96 WHEN 'Санкт-Петербург' THEN 6.45 * 0.96 WHEN 'Московская область' THEN 6.62 * 0.96 ELSE 5.00 * 0.96 END AS NUMERIC), 2), '2023-11-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.965 WHEN 'Санкт-Петербург' THEN 6.45 * 0.965 WHEN 'Московская область' THEN 6.62 * 0.965 ELSE 5.00 * 0.965 END AS NUMERIC), 2), '2023-12-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

-- 2024 year (12 months)
INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.97 WHEN 'Санкт-Петербург' THEN 6.45 * 0.97 WHEN 'Московская область' THEN 6.62 * 0.97 ELSE 5.00 * 0.97 END AS NUMERIC), 2), '2024-01-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.975 WHEN 'Санкт-Петербург' THEN 6.45 * 0.975 WHEN 'Московская область' THEN 6.62 * 0.975 ELSE 5.00 * 0.975 END AS NUMERIC), 2), '2024-02-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.98 WHEN 'Санкт-Петербург' THEN 6.45 * 0.98 WHEN 'Московская область' THEN 6.62 * 0.98 ELSE 5.00 * 0.98 END AS NUMERIC), 2), '2024-03-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.985 WHEN 'Санкт-Петербург' THEN 6.45 * 0.985 WHEN 'Московская область' THEN 6.62 * 0.985 ELSE 5.00 * 0.985 END AS NUMERIC), 2), '2024-04-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.99 WHEN 'Санкт-Петербург' THEN 6.45 * 0.99 WHEN 'Московская область' THEN 6.62 * 0.99 ELSE 5.00 * 0.99 END AS NUMERIC), 2), '2024-05-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 0.995 WHEN 'Санкт-Петербург' THEN 6.45 * 0.995 WHEN 'Московская область' THEN 6.62 * 0.995 ELSE 5.00 * 0.995 END AS NUMERIC), 2), '2024-06-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 1.0 WHEN 'Санкт-Петербург' THEN 6.45 * 1.0 WHEN 'Московская область' THEN 6.62 * 1.0 ELSE 5.00 * 1.0 END AS NUMERIC), 2), '2024-07-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 1.005 WHEN 'Санкт-Петербург' THEN 6.45 * 1.005 WHEN 'Московская область' THEN 6.62 * 1.005 ELSE 5.00 * 1.005 END AS NUMERIC), 2), '2024-08-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 1.01 WHEN 'Санкт-Петербург' THEN 6.45 * 1.01 WHEN 'Московская область' THEN 6.62 * 1.01 ELSE 5.00 * 1.01 END AS NUMERIC), 2), '2024-09-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 1.015 WHEN 'Санкт-Петербург' THEN 6.45 * 1.015 WHEN 'Московская область' THEN 6.62 * 1.015 ELSE 5.00 * 1.015 END AS NUMERIC), 2), '2024-10-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 1.02 WHEN 'Санкт-Петербург' THEN 6.45 * 1.02 WHEN 'Московская область' THEN 6.62 * 1.02 ELSE 5.00 * 1.02 END AS NUMERIC), 2), '2024-11-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
SELECT r.id, ROUND(CAST(CASE r.name WHEN 'Москва' THEN 6.74 * 1.025 WHEN 'Санкт-Петербург' THEN 6.45 * 1.025 WHEN 'Московская область' THEN 6.62 * 1.025 ELSE 5.00 * 1.025 END AS NUMERIC), 2), '2024-12-15'::timestamp, 'MONTHLY_GENERATED', 'single', 'all', 'residential' FROM regions r ON CONFLICT DO NOTHING;
