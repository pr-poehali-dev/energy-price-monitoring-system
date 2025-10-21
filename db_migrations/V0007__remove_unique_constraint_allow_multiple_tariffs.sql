-- Удаляем уникальное ограничение, чтобы разрешить несколько тарифов на одну дату
ALTER TABLE t_p67469144_energy_price_monitor.price_history 
DROP CONSTRAINT IF EXISTS price_history_region_id_recorded_at_key;

-- Создаём обычный индекс для производительности поиска
CREATE INDEX IF NOT EXISTS idx_price_history_region_date 
ON t_p67469144_energy_price_monitor.price_history (region_id, recorded_at);