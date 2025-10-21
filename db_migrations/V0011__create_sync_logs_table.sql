CREATE TABLE IF NOT EXISTS t_p67469144_energy_price_monitor.sync_logs (
    id SERIAL PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    parsed_count INTEGER,
    updated_count INTEGER,
    skipped_count INTEGER,
    errors TEXT,
    source_info JSONB,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_ms INTEGER,
    trigger_type VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_started_at ON t_p67469144_energy_price_monitor.sync_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON t_p67469144_energy_price_monitor.sync_logs(status);