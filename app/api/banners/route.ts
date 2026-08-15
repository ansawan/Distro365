import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';
import { checkAdminAuth } from '@/backend/lib/supabase/auth';

// GET /api/banners — list active banners
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ banners: data });
}

// POST /api/banners — create banner (admin only)
export async function POST(request: NextRequest) {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, subtitle, image_url, link_url, display_order, is_active } = body;

  if (!image_url) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('banners')
    .insert({
      title,
      subtitle,
      image_url,
      link_url,
      display_order: display_order || 0,
      is_active: is_active !== undefined ? is_active : true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ banner: data }, { status: 201 });
}

// PUT /api/banners — update banner (admin only, expects ?id=xxx)
export async function PUT(request: NextRequest) {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
  }

  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from('banners')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ banner: data });
}

// DELETE /api/banners — delete banner (admin only, expects ?id=xxx)
export async function DELETE(request: NextRequest) {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('banners')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
