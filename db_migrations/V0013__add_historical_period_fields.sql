-- Add columns for historical tariff data
ALTER TABLE t_p67469144_energy_price_monitor.price_history 
ADD COLUMN IF NOT EXISTS valid_from DATE,
ADD COLUMN IF NOT EXISTS valid_until DATE,
ADD COLUMN IF NOT EXISTS year INTEGER;

-- Create index for faster year-based queries
CREATE INDEX IF NOT EXISTS idx_price_history_year ON t_p67469144_energy_price_monitor.price_history(year);
CREATE INDEX IF NOT EXISTS idx_price_history_valid_period ON t_p67469144_energy_price_monitor.price_history(valid_from, valid_until);
