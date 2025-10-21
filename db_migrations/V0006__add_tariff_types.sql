-- Добавляем типы тарифов и зоны суток
ALTER TABLE t_p67469144_energy_price_monitor.price_history 
ADD COLUMN tariff_type VARCHAR(50),
ADD COLUMN time_zone VARCHAR(20),
ADD COLUMN consumer_type VARCHAR(50);

-- Добавляем комментарии
COMMENT ON COLUMN t_p67469144_energy_price_monitor.price_history.tariff_type IS 'Тип тарифа: single (одноставочный), two_zone (день/ночь), three_zone (пик/полупик/ночь)';
COMMENT ON COLUMN t_p67469144_energy_price_monitor.price_history.time_zone IS 'Зона суток: day (день), night (ночь), peak (пик), half_peak (полупик)';
COMMENT ON COLUMN t_p67469144_energy_price_monitor.price_history.consumer_type IS 'Тип потребителя: standard (обычная квартира), electric_stove (электроплита), electric_heating (электроотопление), rural (село)';

-- Создаём индексы для быстрого поиска
CREATE INDEX idx_price_history_tariff_type ON t_p67469144_energy_price_monitor.price_history(tariff_type);
CREATE INDEX idx_price_history_time_zone ON t_p67469144_energy_price_monitor.price_history(time_zone);
CREATE INDEX idx_price_history_consumer_type ON t_p67469144_energy_price_monitor.price_history(consumer_type);