/*
# Create private football trial registration records and payment events

1. New Tables
- `registrations`: private player applications containing contact, football profile, destination, consent, and payment state.
- `payment_events`: private idempotency log for verified or pending payment notifications received from Selar.

2. Registration fields
- Personal details: first name, last name, email, phone, date of birth, nationality, current country.
- Football profile: position, preferred foot, optional height, club, experience, and highlight video URL.
- Destinations: JSON array of selected destinations.
- Minor safeguards: optional guardian name, email, and phone.
- Consent: privacy consent and eligibility acknowledgement.
- Workflow: application status, payment status, provider, payment reference, transaction details, registration code, timestamps.

3. Security
- Row Level Security is enabled on both tables.
- No public read or write policies are added because applications and payment events are written only through the server-side registration and verification handlers.
- The browser never receives privileged database credentials and cannot update payment status or registration codes.

4. Important notes
- Payment remains pending until an authenticated provider verification flow is configured.
- Unique application references and payment event identifiers prevent duplicate processing.
- No data is deleted or altered by this migration.
*/

CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_reference text NOT NULL UNIQUE DEFAULT ('UKS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  first_name text NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 80),
  last_name text NOT NULL CHECK (char_length(last_name) BETWEEN 1 AND 80),
  email text NOT NULL CHECK (position('@' in email) > 1),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 30),
  date_of_birth date NOT NULL,
  nationality text NOT NULL,
  current_country text NOT NULL,
  position text NOT NULL,
  preferred_foot text CHECK (preferred_foot IN ('Right', 'Left', 'Both')),
  height text,
  current_club text,
  playing_experience text,
  video_url text,
  preferred_destinations jsonb NOT NULL DEFAULT '[]'::jsonb,
  guardian_name text,
  guardian_email text,
  guardian_phone text,
  privacy_consent boolean NOT NULL DEFAULT false CHECK (privacy_consent = true),
  eligibility_acknowledged boolean NOT NULL DEFAULT false CHECK (eligibility_acknowledged = true),
  registration_code text UNIQUE,
  application_status text NOT NULL DEFAULT 'submitted' CHECK (application_status IN ('submitted', 'under_review', 'paid', 'closed')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_provider text NOT NULL DEFAULT 'selar',
  payment_reference text,
  payment_details jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'selar',
  provider_event_id text NOT NULL UNIQUE,
  payment_reference text,
  application_id uuid REFERENCES public.registrations(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  processed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS registrations_email_idx ON public.registrations (lower(email));
CREATE INDEX IF NOT EXISTS registrations_payment_status_idx ON public.registrations (payment_status);
CREATE INDEX IF NOT EXISTS payment_events_reference_idx ON public.payment_events (payment_reference);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "registrations_no_anon_access" ON public.registrations;
DROP POLICY IF EXISTS "payment_events_no_anon_access" ON public.payment_events;

REVOKE ALL ON TABLE public.registrations FROM anon, authenticated;
REVOKE ALL ON TABLE public.payment_events FROM anon, authenticated;
