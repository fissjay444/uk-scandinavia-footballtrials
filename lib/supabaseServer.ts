import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns a server-side Supabase client.
 *
 * Prefers the service-role key (bypasses RLS, for admin/webhook writes).
 * Falls back to the anon key when the service-role key is not configured,
 * so that public insert policies on player_applications still work.
 */
export function getSupabaseServer(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error('SUPABASE_URL is not configured');
  const key = serviceRoleKey || anonKey;
  if (!key) throw new Error('No Supabase API key configured (need SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY)');

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
