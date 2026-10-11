/*
# Add a server-only registration code generator

1. New function
- `next_registration_code()` atomically obtains the next sequence value and formats a current-year code.

2. Security
- The function uses a fixed search path and is callable only by the server service role.
- Anonymous and authenticated browser roles cannot invoke it.

3. Important notes
- The function is used only after a genuine verified payment event.
*/

CREATE OR REPLACE FUNCTION public.next_registration_code()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'UKSFT-' || extract(year from now())::text || '-' || lpad(nextval('public.registration_code_seq')::text, 5, '0');
$$;

REVOKE ALL ON FUNCTION public.next_registration_code() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_registration_code() TO service_role;
