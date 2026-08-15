import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client — uses the service role key.
 * SERVER-SIDE ONLY — never expose this to the client.
 * Bypasses Row Level Security for full CRUD access.
 */
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';
const supabaseServiceKey = rawKey || 'placeholder-service-key';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
