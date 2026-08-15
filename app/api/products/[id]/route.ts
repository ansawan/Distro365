import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';
import { checkAdminAuth } from '@/backend/lib/supabase/auth';

// GET /api/products/[id] — single product by handle OR id, including variants & images
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: identifier } = await params;

  // Try matching handle first, then fallback to uuid id
  let query = supabaseAdmin
    .from('products')
    .select('*, variants:product_variants(*), images:product_images(*)')
    .eq('handle', identifier);

  let { data, error } = await query.maybeSingle();

  if (!data) {
    // If not found by handle, try matching id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    if (isUuid) {
      const res = await supabaseAdmin
        .from('products')
        .select('*, variants:product_variants(*), images:product_images(*)')
        .eq('id', identifier)
        .maybeSingle();
      data = res.data;
      error = res.error;
    }
  }

  if (error || !data) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}

// PUT /api/products/[id] — update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAuth();
  if (!admin) {
    console.warn('[API PUT /api/products/[id]] Unauthorized request attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  console.log('[API PUT /api/products/[id]] Identifier:', id, 'Payload before update:', body);

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  let query = supabaseAdmin.from('products').update(body);
  if (isUuid) {
    query = query.eq('id', id);
  } else {
    query = query.eq('handle', id);
  }

  const { data, error } = await query.select().single();

  console.log('[API PUT /api/products/[id]] Supabase update response - data:', data, 'error:', error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}


// DELETE /api/products/[id] — delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
