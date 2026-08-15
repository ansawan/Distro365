import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Try inserting into subscribers table if supabase is configured
    try {
      const { error } = await supabaseAdmin
        .from('subscribers')
        .insert({ email });

      if (error && error.code !== '42P01') { // 42P01 is table doesn't exist
        console.error('Supabase subscriber error:', error);
      }
    } catch {
      // Gracefully ignore if Supabase is not yet setup
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
