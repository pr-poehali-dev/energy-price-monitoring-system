CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    zone VARCHAR(100) NOT NULL,
    population NUMERIC(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    price NUMERIC(6,2) NOT NULL,
    recorded_at TIMESTAMP NOT NULL,
    source VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(region_id, recorded_at)
);

CREATE INDEX IF NOT EXISTS idx_price_history_region ON price_history(region_id);
CREATE INDEX IF NOT EXISTS idx_price_history_date ON price_history(recorded_at DESC);

INSERT INTO regions (name, zone, population) VALUES
('Москва', 'Центральный', 12.6),
('Санкт-Петербург', 'Северо-Западный', 5.4),
('Московская область', 'Центральный', 8.5),
('Краснодарский край', 'Южный', 5.8),
('Свердловская область', 'Уральский', 4.3),
('Новосибирская область', 'Сибирский', 2.8),
('Республика Татарстан', 'Приволжский', 4.0),
('Красноярский край', 'Сибирский', 2.9)
ON CONFLICT (name) DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at) 
SELECT r.id, 
       CASE r.name
           WHEN 'Москва' THEN 6.19
           WHEN 'Санкт-Петербург' THEN 5.87
           WHEN 'Московская область' THEN 6.35
           WHEN 'Краснодарский край' THEN 5.42
           WHEN 'Свердловская область' THEN 4.98
           WHEN 'Новосибирская область' THEN 4.67
           WHEN 'Республика Татарстан' THEN 5.12
           WHEN 'Красноярский край' THEN 4.23
       END,
       CURRENT_TIMESTAMP
FROM regions r
ON CONFLICT (region_id, recorded_at) DO NOTHING;

INSERT INTO price_history (region_id, price, recorded_at)
SELECT r.id,
       CASE r.name
           WHEN 'Москва' THEN 6.05 + (random() * 0.14)
           WHEN 'Санкт-Петербург' THEN 5.89 + (random() * 0.05)
           WHEN 'Московская область' THEN 6.25 + (random() * 0.10)
           WHEN 'Краснодарский край' THEN 5.35 + (random() * 0.07)
           WHEN 'Свердловская область' THEN 5.02 + (random() * 0.10)
           WHEN 'Новосибирская область' THEN 4.60 + (random() * 0.07)
           WHEN 'Республика Татарстан' THEN 5.05 + (random() * 0.07)
           WHEN 'Красноярский край' THEN 4.30 + (random() * 0.10)
       END,
       CURRENT_TIMESTAMP - INTERVAL '1 month' * generate_series(1, 6)
FROM regions r
ON CONFLICT (region_id, recorded_at) DO NOTHING;