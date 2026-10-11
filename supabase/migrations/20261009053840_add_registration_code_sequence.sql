/*
# Add an atomic registration code sequence

1. New database object
- `registration_code_seq` provides one atomic number per paid registration.

2. Security
- The sequence is used only by the server-side payment verification handler.
- Public database roles do not receive access to the sequence.

3. Important notes
- Existing registration records are unchanged.
- Future verified payments cannot generate duplicate numeric registration codes during concurrent webhook processing.
*/

CREATE SEQUENCE IF NOT EXISTS public.registration_code_seq;
REVOKE ALL ON SEQUENCE public.registration_code_seq FROM anon, authenticated;
