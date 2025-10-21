-- Обновляем старые данные без информации о тарифах
-- Устанавливаем им одноставочный стандартный тариф
UPDATE t_p67469144_energy_price_monitor.price_history
SET 
    tariff_type = 'single',
    time_zone = 'day',
    consumer_type = 'standard'
WHERE tariff_type IS NULL;