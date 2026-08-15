import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';
import { checkAdminAuth } from '@/backend/lib/supabase/auth';

// GET /api/orders — list orders (admin only)
export async function GET(request: NextRequest) {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('orders')
    .select('*, items:order_items(*)', { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    orders: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

// POST /api/orders — create order (public COD checkout)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customer_name, phone, address, notes, items } = body;

  if (!customer_name || !phone) {
    return NextResponse.json(
      { error: 'Customer name and phone number are required' },
      { status: 400 }
    );
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: 'At least one item is required in the cart' },
      { status: 400 }
    );
  }

  // Create order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_name,
      phone,
      address: address || null,
      notes: notes || null,
      status: 'pending',
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  // Create order items
  const orderItems = items.map((item: {
    product_handle?: string;
    variant_id?: string;
    quantity?: number;
    qty?: number;
    price?: number;
  }) => ({
    order_id: order.id,
    product_handle: item.product_handle || null,
    variant_id: item.variant_id || null,
    qty: item.quantity || item.qty || 1,
    unit_price: item.price || 0,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items error:', itemsError);
  }

  return NextResponse.json({ order }, { status: 201 });
}
