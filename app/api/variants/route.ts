import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';
import { checkAdminAuth } from '@/backend/lib/supabase/auth';

// GET /api/variants?product_handle=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productHandle = searchParams.get('product_handle') || searchParams.get('product_id');

  if (!productHandle) {
    return NextResponse.json({ error: 'product_handle is required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('product_variants')
    .select('*')
    .eq('product_handle', productHandle)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[API GET /api/variants] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ variants: data || [] });
}

// POST /api/variants — create variant (admin only)
export async function POST(request: NextRequest) {
  const admin = await checkAdminAuth();
  if (!admin) {
    console.warn('[API POST /api/variants] Unauthorized');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    product_handle,
    sku,
    option_name = 'Flavor',
    option_value,
    attributes = {},
    price = 0,
    compare_at_price,
    inventory_qty = 10,
    stock = 10,
    image_src,
    barcode,
    is_active = true,
  } = body;

  if (!product_handle) {
    return NextResponse.json({ error: 'product_handle is required' }, { status: 400 });
  }

  const payload: Record<string, any> = {
    product_handle,
    sku: sku || null,
    option_name: option_name || 'Flavor',
    option_value: option_value || 'Default',
    attributes: typeof attributes === 'object' ? attributes : {},
    price: parseFloat(price) || 0,
    inventory_qty: parseInt(inventory_qty || stock || 0, 10),
    image_src: image_src || null,
  };
  if (compare_at_price !== undefined) payload.compare_at_price = parseFloat(compare_at_price) || null;
  if (barcode !== undefined) payload.barcode = barcode || null;
  if (is_active !== undefined) payload.is_active = Boolean(is_active);

  console.log('[API POST /api/variants] Creating variant payload:', payload);

  const { data, error } = await supabaseAdmin
    .from('product_variants')
    .insert(payload)
    .select()
    .single();

  console.log('[API POST /api/variants] Insert response - data:', data, 'error:', error);

  if (error) {
    // Retry without columns if missing in DB schema
    if (error.message?.includes('column')) {
      const fallbackPayload = {
        product_handle,
        sku: sku || null,
        option_name: option_name || 'Flavor',
        option_value: option_value || 'Default',
        price: parseFloat(price) || 0,
        inventory_qty: parseInt(inventory_qty || stock || 0, 10),
        image_src: image_src || null,
      };
      const fb = await supabaseAdmin.from('product_variants').insert(fallbackPayload).select().single();
      if (fb.data) {
        return NextResponse.json({ variant: { ...fb.data, attributes, compare_at_price, barcode, is_active } }, { status: 201 });
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ variant: data }, { status: 201 });
}

