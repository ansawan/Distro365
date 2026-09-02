import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';

// GET /api/brands — list distinct brands (vendors)
export async function GET() {
  try {
    const { data: vendorData } = await supabaseAdmin
      .from('products')
      .select('vendor')
      .not('vendor', 'is', null);

    const brands = Array.from(
      new Set((vendorData || []).map((p) => p.vendor?.trim()).filter(Boolean))
    ) as string[];

    return NextResponse.json({ brands });
  } catch (err: any) {
    return NextResponse.json({ brands: [] });
  }
}

// POST /api/brands — create/add new brand
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }
    const brandName = name.trim();
    return NextResponse.json({ brand: { name: brandName, slug: brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create brand' }, { status: 500 });
  }
}
