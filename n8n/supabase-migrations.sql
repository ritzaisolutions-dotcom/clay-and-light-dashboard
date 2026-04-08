-- ============================================================
-- Clay & Light — Supabase schema additions
-- Run these in the Supabase SQL editor (Dashboard → SQL editor)
-- ============================================================

-- 1. marketing_consent column on reservations
--    (pottery_bookings already has this column)
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS marketing_consent boolean NOT NULL DEFAULT false;

-- 2. Unique constraint on pottery_bookings(timeslot) for non-cancelled bookings
--    This is the hard atomic guard against double-booking the same slot.
--    The Next.js API does a best-effort check first; this constraint is the safety net.
CREATE UNIQUE INDEX IF NOT EXISTS pottery_bookings_timeslot_active_unique
  ON pottery_bookings (timeslot)
  WHERE status <> 'cancelled';

-- 3. Idempotency: pottery_bookings.id must be provided as a UUID from the API route.
--    No migration needed — the id column is already uuid primary key with gen_random_uuid().
--    Passing a booking_id from the API means a retried n8n call will fail with a PK
--    conflict rather than create a duplicate row. n8n's error response is caught by
--    the API route, which returns the original success response.

-- 4. Same idempotency pattern for reservations — no additional migration needed.
