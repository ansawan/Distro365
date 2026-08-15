import { createClient } from '@supabase/supabase-js';

/**
 * Public Supabase client — uses the anon key.
 * Safe to use in client components and server components for public reads.
 * Respects Row Level Security policies.
 */
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
