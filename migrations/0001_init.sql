-- ============================================================
-- 0001 · Telemetría y control de calidad (GR-15)
-- ============================================================
CREATE TABLE IF NOT EXISTS server_error_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  stack TEXT,
  url TEXT,
  method TEXT,
  status INTEGER,
  client_ip TEXT,
  user_agent TEXT,
  user_id TEXT,
  metadata TEXT
);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON server_error_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_level ON server_error_logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_category ON server_error_logs(category);

-- ============================================================
-- 0002 · Cuadro de Honor: podium persistido y libro de pujas
-- ============================================================
CREATE TABLE IF NOT EXISTS honor_spots (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_slug TEXT NOT NULL,
  position INTEGER NOT NULL,
  current_bid_eur REAL NOT NULL,
  sponsor_name TEXT NOT NULL,
  entry_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_honor_spots_cat_service ON honor_spots(category, service_id);
CREATE INDEX IF NOT EXISTS idx_honor_spots_cat_pos ON honor_spots(category, position);

CREATE TABLE IF NOT EXISTS honor_bids (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  service_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  amount_eur REAL NOT NULL,
  sponsor_name TEXT,
  sponsor_message TEXT,
  invoice_id TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_honor_bids_cat ON honor_bids(category, created_at DESC);
