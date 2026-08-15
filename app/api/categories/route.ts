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
