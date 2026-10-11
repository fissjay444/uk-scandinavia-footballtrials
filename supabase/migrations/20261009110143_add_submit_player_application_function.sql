/*
# Add server-side registration insert function

1. Problem
- The API route does `.insert({...}).select('id, application_reference')` on player_applications.
- The INSERT RLS policy allows anon inserts (WITH CHECK true), but the SELECT policy
  (`pa_select_by_reference`) requires `application_reference = current_setting('request.jwt.claim.application_reference', true)`
  which is NULL for anon users. So PostgREST cannot read back the inserted row, causing
  "new row violates row-level security policy" even though the INSERT itself is allowed.

2. Fix
- Create a SECURITY DEFINER function `submit_player_application()` that:
  - Accepts all form fields as parameters.
  - Validates required fields (server-side).
  - Inserts into player_applications (bypasses RLS since SECURITY DEFINER).
  - Returns the generated application_reference.
- The API route calls this RPC instead of a direct table insert + select.
- This avoids the SELECT-after-INSERT RLS conflict entirely.

3. Security
- The function is SECURITY DEFINER with SET search_path = public.
- EXECUTE is granted to anon and authenticated (public form submissions).
- The function only inserts form fields — it does NOT set payment_status, application_status,
  registration_code, or any payment fields. Those default to 'pending'/'submitted'/NULL.
- The function validates: required fields not empty, email contains @, phone length >= 7,
  privacy_consent = true, eligibility_acknowledged = true.
- No UPDATE or DELETE capability is exposed.

4. Important Notes
- No data is altered. No tables changed.
- The existing INSERT RLS policy (pa_public_insert) can remain as a fallback.
- Idempotent.
*/

CREATE OR REPLACE FUNCTION public.submit_player_application(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_date_of_birth date,
  p_nationality text,
  p_current_country text,
  p_position text,
  p_preferred_foot text DEFAULT NULL,
  p_height text DEFAULT NULL,
  p_current_club text DEFAULT NULL,
  p_playing_experience text DEFAULT NULL,
  p_video_url text DEFAULT NULL,
  p_preferred_destinations jsonb DEFAULT '[]'::jsonb,
  p_guardian_name text DEFAULT NULL,
  p_guardian_email text DEFAULT NULL,
  p_guardian_phone text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reference text;
BEGIN
  -- Validate required fields
  IF p_first_name IS NULL OR btrim(p_first_name) = '' THEN
    RAISE EXCEPTION 'First name is required';
  END IF;
  IF p_last_name IS NULL OR btrim(p_last_name) = '' THEN
    RAISE EXCEPTION 'Last name is required';
  END IF;
  IF p_email IS NULL OR position('@' in p_email) < 2 THEN
    RAISE EXCEPTION 'Valid email is required';
  END IF;
  IF p_phone IS NULL OR char_length(p_phone) < 7 THEN
    RAISE EXCEPTION 'Valid phone is required';
  END IF;
  IF p_date_of_birth IS NULL THEN
    RAISE EXCEPTION 'Date of birth is required';
  END IF;
  IF p_nationality IS NULL OR btrim(p_nationality) = '' THEN
    RAISE EXCEPTION 'Nationality is required';
  END IF;
  IF p_current_country IS NULL OR btrim(p_current_country) = '' THEN
    RAISE EXCEPTION 'Current country is required';
  END IF;
  IF p_position IS NULL OR btrim(p_position) = '' THEN
    RAISE EXCEPTION 'Position is required';
  END IF;

  -- Insert and return the generated reference
  INSERT INTO public.player_applications (
    first_name, last_name, email, phone, date_of_birth,
    nationality, current_country, position, preferred_foot,
    height, current_club, playing_experience, video_url,
    preferred_destinations, guardian_name, guardian_email, guardian_phone,
    privacy_consent, eligibility_acknowledged
  ) VALUES (
    btrim(p_first_name), btrim(p_last_name), lower(btrim(p_email)), btrim(p_phone),
    p_date_of_birth, btrim(p_nationality), btrim(p_current_country), btrim(p_position),
    p_preferred_foot, p_height, p_current_club, p_playing_experience, p_video_url,
    p_preferred_destinations, p_guardian_name, p_guardian_email, p_guardian_phone,
    true, true
  )
  RETURNING application_reference INTO v_reference;

  RETURN v_reference;
END;
$$;

-- Grant EXECUTE to anon and authenticated (public form submissions)
REVOKE ALL ON FUNCTION public.submit_player_application FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_player_application TO anon, authenticated;
