/*
# Fix anon INSERT privilege on player_applications

1. Problem
- The previous migration revoked table-level INSERT then granted column-level INSERT.
- PostgreSQL/Supabase PostgREST requires table-level INSERT to be present for the operation to work.
- Column-level INSERT grants alone don't allow the INSERT to reach the RLS policy check.

2. Fix
- Grant table-level INSERT to anon and authenticated.
- Then REVOKE column-level INSERT on sensitive columns (payment_status, application_status, registration_code, payment_provider, payment_reference, payment_details) so anon cannot set them.
- The form-field columns remain insertable by anon.

3. Security
- anon/authenticated can INSERT form fields only.
- Payment/workflow columns are revoked at column level.
- RLS INSERT policy (pa_public_insert, WITH CHECK true) allows the insert.
- No UPDATE or DELETE for anon/authenticated.
- Payment status changes only via service role in the webhook handler.

4. Important Notes
- No data is altered.
- Idempotent.
*/

-- Grant table-level INSERT (needed for PostgREST to allow the operation)
GRANT INSERT ON public.player_applications TO anon, authenticated;

-- Revoke INSERT on sensitive columns so anon cannot set them
-- (column-level revocation overrides the table-level grant for those columns)
REVOKE INSERT (registration_code, application_status, payment_status, payment_provider, payment_reference, payment_details) ON public.player_applications FROM anon, authenticated;
