import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from './admin';

/**
 * Create a Supabase client scoped to the current user's session.
 * SERVER-SIDE ONLY — use in API route handlers only.
 */
export async function createAuthClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';
  const supabaseAnonKey = rawKey || 'placeholder-anon-key';

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });

  return client;
}

/**
 * Check if the current user is an authorized admin.
 * SERVER-SIDE ONLY — use in API route handlers only.
 */
export async function checkAdminAuth() {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    
    const adminSession = cookieStore.get('distro365_admin_session')?.value;
    const adminToken = cookieStore.get('distro365_admin_token')?.value || cookieStore.get('sb-admin-auth-token')?.value;

    console.log('[checkAdminAuth] Checking cookies:', { adminSession: !!adminSession, adminToken: !!adminToken });

    // 1. If distro365_admin_session cookie is set by admin login page, allow access
    if (adminSession === 'true') {
      console.log('[checkAdminAuth] Authorized via admin session cookie');
      return { id: 'admin-session-user', email: 'admin@distro365.com' };
    }

    // 2. If session token cookie is set, verify with Supabase
    if (adminToken) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(adminToken);
      if (user && !error) {
        console.log('[checkAdminAuth] Authorized via Supabase token:', user.email);
        return user;
      }
    }

    // 3. Fallback standard cookie check
    const client = await createAuthClient();
    const { data: { user } } = await client.auth.getUser();

    if (user) {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail || adminEmail === 'your_admin_email@example.com' || user.email === adminEmail) {
        console.log('[checkAdminAuth] Authorized via standard user session:', user.email);
        return user;
      }
    }
  } catch (err) {
    console.error('[checkAdminAuth] Error checking auth:', err);
  }

  console.warn('[checkAdminAuth] Auth failed — unauthorized');
  return null;
}

/**
 * Browser-safe Supabase client for client-side auth (login page, etc.)
 */
export function createBrowserClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';
  const supabaseAnonKey = rawKey || 'placeholder-anon-key';

  return createClient(supabaseUrl, supabaseAnonKey);
}

