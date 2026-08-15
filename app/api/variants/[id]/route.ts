import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';
import { checkAdminAuth } from '@/backend/lib/supabase/auth';

// PUT /api/variants/[id] — update variant (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAuth();
  if (!admin) {
    console.warn('[API PUT /api/variants/[id]] Unauthorized');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  console.log('[API PUT /api/variants/[id]] Updating variant ID:', id, 'body:', body);

  const updateData: Record<string, any> = {};
  if (body.sku !== undefined) updateData.sku = body.sku;
  if (body.option_name !== undefined) updateData.option_name = body.option_name;
  if (body.option_value !== undefined) updateData.option_value = body.option_value;
  if (body.price !== undefined) updateData.price = parseFloat(body.price) || 0;
  if (body.inventory_qty !== undefined) updateData.inventory_qty = parseInt(body.inventory_qty, 10) || 0;
  if (body.image_src !== undefined) updateData.image_src = body.image_src;

  const { data, error } = await supabaseAdmin
    .from('product_variants')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  console.log('[API PUT /api/variants/[id]] Update result - data:', data, 'error:', error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ variant: data });
}

// DELETE /api/variants/[id] — delete variant (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminAuth();
  if (!admin) {
    console.warn('[API DELETE /api/variants/[id]] Unauthorized');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  console.log('[API DELETE /api/variants/[id]] Deleting variant ID:', id);

  const { error } = await supabaseAdmin
    .from('product_variants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[API DELETE /api/variants/[id]] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

