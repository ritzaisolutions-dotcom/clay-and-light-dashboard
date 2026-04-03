-- ============================================================
-- Clay & Light — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- Enable UUID extension (already enabled on Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE 1: pottery_bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS pottery_bookings (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  name                TEXT        NOT NULL,
  email               TEXT        NOT NULL,
  phone               TEXT,
  timeslot            TIMESTAMPTZ NOT NULL,
  persons             INTEGER     NOT NULL CHECK (persons > 0),
  price_per_person    NUMERIC     NOT NULL DEFAULT 45,
  total_price         NUMERIC     GENERATED ALWAYS AS (persons * price_per_person) STORED,
  notes               TEXT,
  marketing_consent   BOOLEAN     NOT NULL DEFAULT false,
  status              TEXT        NOT NULL DEFAULT 'confirmed'
                                  CHECK (status IN ('confirmed', 'cancelled', 'completed', 'pending'))
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS pottery_bookings_email_idx    ON pottery_bookings (email);
CREATE INDEX IF NOT EXISTS pottery_bookings_timeslot_idx ON pottery_bookings (timeslot);
CREATE INDEX IF NOT EXISTS pottery_bookings_status_idx   ON pottery_bookings (status);
CREATE INDEX IF NOT EXISTS pottery_bookings_created_idx  ON pottery_bookings (created_at DESC);

-- ============================================================
-- TABLE 2: reservations
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  name                  TEXT        NOT NULL,
  email                 TEXT        NOT NULL,
  phone                 TEXT,
  reservation_time      TIMESTAMPTZ NOT NULL,
  persons               INTEGER     NOT NULL CHECK (persons > 0),
  notes                 TEXT,
  avg_spend_per_person  NUMERIC     NOT NULL DEFAULT 25,
  estimated_revenue     NUMERIC     GENERATED ALWAYS AS (persons * avg_spend_per_person) STORED,
  status                TEXT        NOT NULL DEFAULT 'confirmed'
                                    CHECK (status IN ('confirmed', 'cancelled', 'completed', 'pending'))
);

CREATE INDEX IF NOT EXISTS reservations_email_idx   ON reservations (email);
CREATE INDEX IF NOT EXISTS reservations_time_idx    ON reservations (reservation_time);
CREATE INDEX IF NOT EXISTS reservations_status_idx  ON reservations (status);
CREATE INDEX IF NOT EXISTS reservations_created_idx ON reservations (created_at DESC);

-- ============================================================
-- TABLE 3: settings
-- Stores editable pricing & configuration values for the dashboard
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default values
INSERT INTO settings (key, value) VALUES
  ('price_per_person',       '45'),
  ('avg_spend_per_person',   '25'),
  ('owner_email',            'hello@clayandlight.at'),
  ('studio_name',            'Clay & Light'),
  ('timezone',               'Europe/Vienna')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- Row Level Security
-- No auth — use anon key with open policies for intake forms,
-- restrict dashboard reads to service role key in production.
-- ============================================================
ALTER TABLE pottery_bookings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings            ENABLE ROW LEVEL SECURITY;

-- Allow anon INSERT for form submissions (n8n uses service role key, forms use anon)
CREATE POLICY "anon_insert_pottery_bookings"
  ON pottery_bookings FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_reservations"
  ON reservations FOR INSERT TO anon WITH CHECK (true);

-- Allow service role full access (dashboard backend)
CREATE POLICY "service_all_pottery_bookings"
  ON pottery_bookings FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_all_reservations"
  ON reservations FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_all_settings"
  ON settings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow anon to read settings (needed for pricing on public forms)
CREATE POLICY "anon_read_settings"
  ON settings FOR SELECT TO anon USING (true);

-- ============================================================
-- Helpful views for analytics
-- ============================================================

CREATE OR REPLACE VIEW revenue_summary AS
SELECT
  COALESCE(SUM(pb.total_price), 0)        AS total_pottery_revenue,
  COALESCE(SUM(r.estimated_revenue), 0)   AS total_reservation_revenue,
  COALESCE(SUM(pb.total_price), 0)
    + COALESCE(SUM(r.estimated_revenue), 0) AS combined_revenue
FROM
  (SELECT total_price FROM pottery_bookings WHERE status != 'cancelled') pb,
  (SELECT estimated_revenue FROM reservations WHERE status != 'cancelled') r;

-- Monthly revenue breakdown
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT
  DATE_TRUNC('month', created_at)::DATE AS month,
  'pottery'                              AS source,
  SUM(total_price)                       AS revenue,
  COUNT(*)                               AS bookings
FROM pottery_bookings
WHERE status != 'cancelled'
GROUP BY 1
UNION ALL
SELECT
  DATE_TRUNC('month', created_at)::DATE AS month,
  'reservation'                          AS source,
  SUM(estimated_revenue)                 AS revenue,
  COUNT(*)                               AS bookings
FROM reservations
WHERE status != 'cancelled'
GROUP BY 1
ORDER BY 1 DESC, 2;
