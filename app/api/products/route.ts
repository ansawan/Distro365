import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';
import { checkAdminAuth } from '@/backend/lib/supabase/auth';

// GET /api/products — list products from Supabase
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vendor = searchParams.get('vendor');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const status = searchParams.get('status') || 'active';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '24');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('products')
    .select('*, variants:product_variants(*), images:product_images(*)', { count: 'exact' });

  // Filters
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  if (vendor) {
    // Strip "The " prefix if present (e.g., "The Cactus Labs" -> "Cactus Labs")
    const cleanVendor = vendor.replace(/^The\s+/i, '').trim();
    query = query.or(`vendor.ilike.%${cleanVendor}%,title.ilike.%${cleanVendor}%`);
  }
  if (category) {
    query = query.ilike('category', `%${category}%`);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,vendor.ilike.%${search}%,tags.ilike.%${search}%`);
  }

  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

// POST /api/products — create product (admin only)
export async function POST(request: NextRequest) {
  const admin = await checkAdminAuth();
  if (!admin) {
    console.warn('[API POST /api/products] Unauthorized request attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, handle, body_html, vendor, category, price, main_image, product_type, status } = body;

  if (!title) {
    console.warn('[API POST /api/products] Validation error: Title is required');
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const productHandle = handle || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const payload = {
    title,
    handle: productHandle,
    body_html: body_html || null,
    vendor: vendor || null,
    category: category || null,
    price: price || 0,
    main_image: main_image || null,
    product_type: product_type || 'simple',
    status: status || 'active',
  };

  console.log('[API POST /api/products] Payload before Supabase insert:', payload);

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(payload)
    .select()
    .single();

  console.log('[API POST /api/products] Supabase insert response - data:', data, 'error:', error);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data }, { status: 201 });
}

