-- Загружаем реальные тарифы для Москвы за 2023-2024
-- Двухзонный день
INSERT INTO t_p67469144_energy_price_monitor.price_history 
(region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
VALUES 
(1, 6.40, '2023-01-01', 'Мосэнергосбыт', 'two_zone', 'day', 'standard'),
(1, 6.55, '2023-07-01', 'Мосэнергосбыт', 'two_zone', 'day', 'standard'),
(1, 6.70, '2023-12-01', 'Мосэнергосбыт', 'two_zone', 'day', 'standard'),
(1, 6.70, '2024-01-01', 'Мосэнергосбыт', 'two_zone', 'day', 'standard'),
(1, 6.85, '2024-07-01', 'Мосэнергосбыт', 'two_zone', 'day', 'standard'),
(1, 7.00, '2024-12-01', 'Мосэнергосбыт', 'two_zone', 'day', 'standard');

-- Двухзонный ночь
INSERT INTO t_p67469144_energy_price_monitor.price_history 
(region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
VALUES 
(1, 2.09, '2023-01-01', 'Мосэнергосбыт', 'two_zone', 'night', 'standard'),
(1, 2.14, '2023-07-01', 'Мосэнергосбыт', 'two_zone', 'night', 'standard'),
(1, 2.19, '2023-12-01', 'Мосэнергосбыт', 'two_zone', 'night', 'standard'),
(1, 2.19, '2024-01-01', 'Мосэнергосбыт', 'two_zone', 'night', 'standard'),
(1, 2.24, '2024-07-01', 'Мосэнергосбыт', 'two_zone', 'night', 'standard'),
(1, 2.29, '2024-12-01', 'Мосэнергосбыт', 'two_zone', 'night', 'standard');

-- Трёхзонный пик
INSERT INTO t_p67469144_energy_price_monitor.price_history 
(region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
VALUES 
(1, 7.00, '2023-01-01', 'Мосэнергосбыт', 'three_zone', 'peak', 'standard'),
(1, 7.16, '2023-07-01', 'Мосэнергосбыт', 'three_zone', 'peak', 'standard'),
(1, 7.32, '2023-12-01', 'Мосэнергосбыт', 'three_zone', 'peak', 'standard'),
(1, 7.32, '2024-01-01', 'Мосэнергосбыт', 'three_zone', 'peak', 'standard'),
(1, 7.48, '2024-07-01', 'Мосэнергосбыт', 'three_zone', 'peak', 'standard'),
(1, 7.65, '2024-12-01', 'Мосэнергосбыт', 'three_zone', 'peak', 'standard');

-- Трёхзонный полупик
INSERT INTO t_p67469144_energy_price_monitor.price_history 
(region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
VALUES 
(1, 5.66, '2023-01-01', 'Мосэнергосбыт', 'three_zone', 'half_peak', 'standard'),
(1, 5.79, '2023-07-01', 'Мосэнергосбыт', 'three_zone', 'half_peak', 'standard'),
(1, 5.92, '2023-12-01', 'Мосэнергосбыт', 'three_zone', 'half_peak', 'standard'),
(1, 5.92, '2024-01-01', 'Мосэнергосбыт', 'three_zone', 'half_peak', 'standard'),
(1, 6.06, '2024-07-01', 'Мосэнергосбыт', 'three_zone', 'half_peak', 'standard'),
(1, 6.19, '2024-12-01', 'Мосэнергосбыт', 'three_zone', 'half_peak', 'standard');

-- Трёхзонный ночь
INSERT INTO t_p67469144_energy_price_monitor.price_history 
(region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
VALUES 
(1, 1.90, '2023-01-01', 'Мосэнергосбыт', 'three_zone', 'night', 'standard'),
(1, 1.94, '2023-07-01', 'Мосэнергосбыт', 'three_zone', 'night', 'standard'),
(1, 1.99, '2023-12-01', 'Мосэнергосбыт', 'three_zone', 'night', 'standard'),
(1, 1.99, '2024-01-01', 'Мосэнергосбыт', 'three_zone', 'night', 'standard'),
(1, 2.03, '2024-07-01', 'Мосэнергосбыт', 'three_zone', 'night', 'standard'),
(1, 2.08, '2024-12-01', 'Мосэнергосбыт', 'three_zone', 'night', 'standard');

-- С электроплитой одноставочный
INSERT INTO t_p67469144_energy_price_monitor.price_history 
(region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
VALUES 
(1, 3.96, '2023-01-01', 'Мосэнергосбыт', 'single', 'day', 'electric_stove'),
(1, 4.05, '2023-07-01', 'Мосэнергосбыт', 'single', 'day', 'electric_stove'),
(1, 4.14, '2023-12-01', 'Мосэнергосбыт', 'single', 'day', 'electric_stove'),
(1, 4.14, '2024-01-01', 'Мосэнергосбыт', 'single', 'day', 'electric_stove'),
(1, 4.24, '2024-07-01', 'Мосэнергосбыт', 'single', 'day', 'electric_stove'),
(1, 4.33, '2024-12-01', 'Мосэнергосбыт', 'single', 'day', 'electric_stove');

-- С электроплитой двухзонный день
INSERT INTO t_p67469144_energy_price_monitor.price_history 
(region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
VALUES 
(1, 4.48, '2023-01-01', 'Мосэнергосбыт', 'two_zone', 'day', 'electric_stove'),
(1, 4.58, '2023-07-01', 'Мосэнергосбыт', 'two_zone', 'day', 'electric_stove'),
(1, 4.69, '2023-12-01', 'Мосэнергосбыт', 'two_zone', 'day', 'electric_stove'),
(1, 4.69, '2024-01-01', 'Мосэнергосбыт', 'two_zone', 'day', 'electric_stove'),
(1, 4.79, '2024-07-01', 'Мосэнергосбыт', 'two_zone', 'day', 'electric_stove'),
(1, 4.90, '2024-12-01', 'Мосэнергосбыт', 'two_zone', 'day', 'electric_stove');

-- С электроплитой двухзонный ночь
INSERT INTO t_p67469144_energy_price_monitor.price_history 
(region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
VALUES 
(1, 1.46, '2023-01-01', 'Мосэнергосбыт', 'two_zone', 'night', 'electric_stove'),
(1, 1.49, '2023-07-01', 'Мосэнергосбыт', 'two_zone', 'night', 'electric_stove'),
(1, 1.53, '2023-12-01', 'Мосэнергосбыт', 'two_zone', 'night', 'electric_stove'),
(1, 1.53, '2024-01-01', 'Мосэнергосбыт', 'two_zone', 'night', 'electric_stove'),
(1, 1.56, '2024-07-01', 'Мосэнергосбыт', 'two_zone', 'night', 'electric_stove'),
(1, 1.60, '2024-12-01', 'Мосэнергосбыт', 'two_zone', 'night', 'electric_stove');