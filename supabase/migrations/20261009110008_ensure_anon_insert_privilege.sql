/*
# Ensure anon INSERT privilege on player_applications

1. Changes
- Grants INSERT (on form-field columns only) to anon and authenticated roles on player_applications.
- The previous migration applied column-level GRANT INSERT but the table-level INSERT privilege may not have taken effect.

2. Security
- anon/authenticated can INSERT only form fields (not payment_status, application_status, registration_code, etc.).
- No UPDATE or DELETE granted to anon/authenticated.
- RLS INSERT policy (pa_public_insert) remains WITH CHECK (true).
- Payment status changes only via service role in the webhook handler.

3. Important Notes
- No data is altered.
- No schema changes.
- Idempotent: re-running has no additional effect.
*/

-- Re-grant table-level INSERT to ensure the privilege is present
GRANT INSERT ON public.player_applications TO anon, authenticated;

-- Re-grant column-level INSERT (restricts which columns anon can set)
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

-- Also ensure SELECT is granted (for the reference lookup policy)
GRANT SELECT ON public.player_applications TO anon, authenticated;
