import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/backend/lib/supabase/auth';

// GET /api/auth/check — verify admin session
export async function GET() {
  const admin = await checkAdminAuth();

  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: admin.id,
      email: admin.email,
    },
  });
}
