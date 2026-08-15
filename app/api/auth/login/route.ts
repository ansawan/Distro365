import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';

// POST /api/auth/login — Server-side login handler bypassing client storage issues
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    console.log('[API POST /api/auth/login] Attempting server-side login for:', email);

    // Attempt Supabase Auth login via server client
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.warn('[API POST /api/auth/login] Supabase auth error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.session) {
      return NextResponse.json({ error: 'No session returned from authentication server' }, { status: 401 });
    }

    console.log('[API POST /api/auth/login] Login successful for:', email);

    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });

    // Set secure admin session cookies
    response.cookies.set('distro365_admin_session', 'true', {
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
      httpOnly: false,
    });

    response.cookies.set('distro365_admin_token', data.session.access_token, {
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
      httpOnly: false,
    });

    response.cookies.set('sb-admin-auth-token', data.session.access_token, {
      path: '/',
      maxAge: 86400,
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (err: any) {
    console.error('[API POST /api/auth/login] Server error:', err);
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
