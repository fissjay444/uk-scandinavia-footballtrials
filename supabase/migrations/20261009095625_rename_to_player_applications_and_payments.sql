/*
# Rename registrations→player_applications and payment_events→payments, add RLS policies

1. Renamed Tables
- `registrations` → `player_applications`: stores player registration form data.
- `payment_events` → `payments`: stores idempotent payment event log from Selar.

2. RLS Policy Changes
- `player_applications`: 
  - INSERT allowed for anon+authenticated (public form submissions).
  - SELECT restricted: only by matching application_reference (a player can look up their own reference).
  - No UPDATE or DELETE for anon/authenticated — payment status changes only via service role / webhook.
- `payments`:
  - No anon/authenticated access (written only by server-side webhook handler with service role).

3. Column-Level Privileges
- anon/authenticated can only INSERT the form fields on player_applications, NOT payment_status, application_status, registration_code, etc.
- This prevents a public visitor from forging payment status through the data API.

4. Important Notes
- Existing 0 rows, so rename is safe — no data loss.
- The `next_registration_code()` function does not reference table names and remains unchanged.
- The FK from payments.application_id → player_applications.id is preserved by the rename.
- Payment remains pending until verified via the authenticated webhook handler.
*/

-- Rename tables (no data loss, 0 rows exist)
ALTER TABLE IF EXISTS public.registrations RENAME TO player_applications;
ALTER TABLE IF EXISTS public.payment_events RENAME TO payments;

-- Update indexes to match new table names (drop old, create new)
DROP INDEX IF EXISTS public.registrations_email_idx;
DROP INDEX IF EXISTS public.registrations_payment_status_idx;
DROP INDEX IF EXISTS public.payment_events_reference_idx;

CREATE INDEX IF NOT EXISTS player_applications_email_idx ON public.player_applications (lower(email));
CREATE INDEX IF NOT EXISTS player_applications_payment_status_idx ON public.player_applications (payment_status);
CREATE INDEX IF NOT EXISTS payments_reference_idx ON public.payments (payment_reference);

-- RLS is already enabled from the original migration; ensure it stays on
ALTER TABLE public.player_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ===== player_applications policies =====
-- Allow public INSERT (form submissions from anon-key client)
DROP POLICY IF EXISTS "pa_public_insert" ON public.player_applications;
CREATE POLICY "pa_public_insert"
  ON public.player_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow SELECT only by matching application_reference (so a player can look up their own record)
DROP POLICY IF EXISTS "pa_select_by_reference" ON public.player_applications;
CREATE POLICY "pa_select_by_reference"
  ON public.player_applications FOR SELECT
  TO anon, authenticated
  USING (application_reference = current_setting('request.jwt.claim.application_reference', true));

-- No UPDATE or DELETE policy for anon/authenticated — payment status changes only via service role

-- ===== payments policies =====
-- No public access — written only by server-side webhook handler with service role
DROP POLICY IF EXISTS "payments_no_public_access" ON public.payments;
CREATE POLICY "payments_no_public_access"
  ON public.payments FOR SELECT
  TO anon, authenticated
  USING (false);

-- ===== Grants =====
-- Grant table-level access
GRANT SELECT, INSERT ON public.player_applications TO anon, authenticated;
GRANT SELECT ON public.payments TO anon, authenticated;

-- Column-level INSERT restriction on player_applications:
-- anon/authenticated can only set form fields, NOT workflow/payment fields
REVOKE INSERT ON public.player_applications FROM anon, authenticated;
GRANT INSERT (
  id,
  application_reference,
  first_name,
  last_name,
  email,
  phone,
  date_of_birth,
  nationality,
  current_country,
  position,
  preferred_foot,
  height,
  current_club,
  playing_experience,
  video_url,
  preferred_destinations,
  guardian_name,
  guardian_email,
  guardian_phone,
  privacy_consent,
  eligibility_acknowledged,
  created_at,
  updated_at
) ON public.player_applications TO anon, authenticated;

-- Revoke UPDATE entirely from anon/authenticated (payment status changes only via service role)
REVOKE UPDATE ON public.player_applications FROM anon, authenticated;
REVOKE DELETE ON public.player_applications FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.payments FROM anon, authenticated;
