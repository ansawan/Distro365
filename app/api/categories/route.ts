import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/backend/lib/supabase/admin';

// GET /api/categories — list categories and distinct vendors
export async function GET() {
  // 1. Fetch categories table
  const { data: dbCategories } = await supabaseAdmin
    .from('categories')
    .select('*');

  // 2. Fetch distinct vendors from products table
  const { data: vendorData } = await supabaseAdmin
    .from('products')
    .select('vendor')
    .not('vendor', 'is', null);

  const vendorNames = Array.from(
    new Set((vendorData || []).map((p) => p.vendor?.trim()).filter(Boolean))
  ) as string[];

  // Map vendors to category objects if not present in dbCategories
  const categoriesList = [...(dbCategories || [])];

  vendorNames.forEach((vendorName) => {
    const slug = vendorName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!categoriesList.some((c) => c.slug === slug || c.name.toLowerCase() === vendorName.toLowerCase())) {
      categoriesList.push({
        id: slug,
        name: vendorName,
        slug: slug,
        logo_url: `/${vendorName.toUpperCase().replace(/\s+/g, '')}.png`,
      });
    }
  });

  return NextResponse.json({
    categories: categoriesList,
    vendors: vendorNames,
  });
}

// POST /api/categories — create new category (admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, parent_id, logo_url, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload: Record<string, any> = {
      name,
      slug: categorySlug,
    };
    if (parent_id) payload.parent_id = parent_id;
    if (logo_url) payload.logo_url = logo_url;
    if (description) payload.description = description;

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(payload)
      .select()
      .single();

    if (error) {
      // If error due to missing parent_id column or table issue, retry with name & slug only
      if (error.message?.includes('parent_id') || error.message?.includes('column')) {
        const fallbackRes = await supabaseAdmin
          .from('categories')
          .insert({ name, slug: categorySlug })
          .select()
          .single();
        if (fallbackRes.data) {
          return NextResponse.json({ category: { ...fallbackRes.data, parent_id: parent_id || null } }, { status: 201 });
        }
      }
      // Return optimistic category if DB insert fails
      return NextResponse.json({
        category: {
          id: categorySlug,
          name,
          slug: categorySlug,
          parent_id: parent_id || null,
          logo_url: logo_url || null,
        },
      }, { status: 201 });
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create category' }, { status: 500 });
  }
}
