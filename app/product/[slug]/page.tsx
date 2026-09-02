'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductGallery from '@/frontend/components/ProductGallery';
import VariantSelector from '@/frontend/components/VariantSelector';
import ProductCard from '@/frontend/components/ProductCard';
import { useCart } from '@/frontend/components/CartContext';
import { Product, ProductVariant } from '@/backend/lib/types';

/**
 * Format raw body_html string from database:
 * - Converts escaped literal '\n' strings to real line breaks
 * - Normalizes excessive '\n\n\n' gaps
 * - Formats bold headings/labels like "Strain:", "Flavor Profile:", "Benefits:"
 * - Wraps text paragraphs cleanly
 */
function formatBodyHtml(raw?: string | null): string {
  if (!raw) return '';

  // 1. Unescape literal '\n' and '\r' strings
  let text = raw.replace(/\\n/g, '\n').replace(/\\r/g, '');

  // 2. Remove redundant triple+ newlines
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  // 3. Highlight common product detail headers with bold styling
  const labels = [
    'Strain',
    'Flavor Profile',
    'Flavors',
    'Effects',
    'Benefits',
    'Precautions',
    'Description',
    'Suggested Use',
    'Ingredients',
    'Product Details',
    'Specifications',
    'Features',
  ];

  labels.forEach((label) => {
    const regex = new RegExp(`(${label}):`, 'gi');
    text = text.replace(regex, '<strong>$1:</strong>');
  });

  // 4. Check if text contains native HTML tags
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(text);

  if (hasHtmlTags) {
    return text;
  }

  // 5. Convert plaintext paragraphs to structured HTML
  const paragraphs = text.split(/\n\n+/);
  return paragraphs
    .map((p) => `<p class="mb-3 leading-relaxed text-gray-700">${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProductData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        const prod: Product = data.product;

        setProduct(prod);

        // Auto-select first variant if present
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        } else {
          setSelectedVariant(null);
        }

        // Fetch related products from same vendor
        if (prod.vendor) {
          const relRes = await fetch(`/api/products?vendor=${encodeURIComponent(prod.vendor)}&limit=4`);
          const relData = await relRes.json();
          setRelatedProducts((relData.products || []).filter((p: Product) => p.handle !== slug));
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-3xl bg-gray-100 animate-pulse" />
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-6 w-1/3 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The requested product handle does not exist in our catalog.</p>
        <Link
          href="/shop"
          className="inline-flex px-8 py-3.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  // Price calculation
  const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
  const displayPrice = currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'Price on request';

  // Stock calculation
  const isVariantInStock = selectedVariant ? selectedVariant.inventory_qty > 0 : true;
  const hasVariants = product.variants && product.variants.length > 0;
  const totalStock = hasVariants
    ? product.variants!.reduce((sum, v) => sum + (v.inventory_qty || 0), 0)
    : 1;

  const inStock = hasVariants ? isVariantInStock : totalStock > 0;

  const handleAddToCart = () => {
    addItem({
      product_handle: product.handle,
      variant_id: selectedVariant?.id,
      name: product.title,
      variant_label: selectedVariant?.option_value || undefined,
      price: currentPrice > 0 ? currentPrice : 0,
      quantity,
      image_url: selectedVariant?.image_src || product.main_image || product.images?.[0]?.image_src || undefined,
    });
  };

  const formattedDescription = formatBodyHtml(product.body_html);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-[var(--pink)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[var(--pink)] transition-colors">Shop</Link>
        {product.vendor && (
          <>
            <span>/</span>
            <Link
              href={`/category/${product.vendor.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="hover:text-[var(--pink)] transition-colors"
            >
              {product.vendor}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image Gallery */}
        <ProductGallery
          images={product.images || []}
          mainImage={selectedVariant?.image_src || product.main_image}
          productName={product.title}
        />

        {/* Product Details */}
        <div className="space-y-6">
          {/* Vendor */}
          {product.vendor && (
            <span className="inline-block px-3.5 py-1 bg-pink-50 text-[var(--pink)] text-xs font-bold rounded-full uppercase tracking-wider">
              {product.vendor}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
            {product.title}
          </h1>

          {/* Stock Badge */}
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-500 animate-pulse-dot' : 'bg-red-400'}`} />
            <span className={`text-xs font-bold ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              {inStock ? 'In stock — ready to ship' : 'Out of stock'}
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-black text-gray-900 border-y border-gray-100 py-4">
            {displayPrice}
          </div>

          {/* Formatted Description */}
          {formattedDescription && (
            <div className="text-gray-700 text-sm leading-relaxed max-w-none space-y-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div dangerouslySetInnerHTML={{ __html: formattedDescription }} />
            </div>
          )}

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="pt-2">
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700 uppercase">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-full p-1 bg-gray-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-white text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-white text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full py-4 bg-black hover:bg-gray-900 text-white font-bold text-sm rounded-full transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              id="add-to-cart-btn"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {inStock ? `Add to Cart — ${displayPrice}` : 'Out of Stock'}
            </button>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-100 text-xs">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <span className="text-lg">🚚</span>
              <span className="font-semibold text-gray-700">Fast Nationwide Delivery</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
              <span className="text-lg">✅</span>
              <span className="font-semibold text-gray-700">100% Authentic Product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            More from {product.vendor}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
