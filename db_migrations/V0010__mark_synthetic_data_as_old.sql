-- Помечаем синтетические данные специальным источником
-- чтобы их можно было отфильтровать при выборке
UPDATE t_p67469144_energy_price_monitor.price_history
SET source = 'SYNTHETIC_OLD_DATA'
WHERE region_id = 1 
  AND tariff_type = 'single'
  AND consumer_type = 'standard'
  AND time_zone = 'day'
  AND source != 'Мосэнергосбыт'
  AND (
    EXTRACT(DAY FROM recorded_at) = 15
    OR 
    recorded_at > '2024-12-31'
  );