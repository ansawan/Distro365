'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/frontend/components/ProductCard';
import { Product } from '@/backend/lib/types';
import { collectionsConfig } from '@/frontend/components/CollectionSection';

export default function CategorySlugPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<{ name: string; slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find matching config for header banner
  const currentConfig = collectionsConfig.find((c) => c.slug === slug);
  const vendorName = currentConfig?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Load vendor list
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        const vendorList = (catData.vendors || []).map((v: string) => ({
          name: v,
          slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }));
        setVendors(vendorList);

        // Load products for this vendor
        const prodRes = await fetch(`/api/products?vendor=${encodeURIComponent(vendorName)}&limit=48`);
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      } catch (err) {
        console.error('Failed to load collection products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug, vendorName]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-[var(--pink)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category" className="hover:text-[var(--pink)] transition-colors">Collections</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{vendorName}</span>
      </nav>

      {/* Hero Banner for Collection */}
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${currentConfig?.bannerColor || 'from-pink-600 to-rose-700'} p-8 sm:p-12 text-white mb-10 shadow-lg`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Official Collection
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-3">{vendorName}</h1>
            <p className="text-white/80 text-base sm:text-lg max-w-xl">
              {currentConfig?.tagline || `Explore the complete lineup of premium products from ${vendorName}.`}
            </p>
          </div>
          {currentConfig?.bannerImage && (
            <div className="w-32 h-32 sm:w-40 sm:h-40 relative shrink-0">
              <Image
                src={currentConfig.bannerImage}
                alt={vendorName}
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar: Other Collections */}
        <aside className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Brand Collections
          </h3>
          <ul className="space-y-1.5">
            {vendors.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/category/${v.slug}`}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    v.slug === slug
                      ? 'bg-[var(--pink)] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-200/60'
                  }`}
                >
                  <span className="truncate">{v.name}</span>
                  <svg className="w-4 h-4 opacity-70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 font-medium">
              Showing {products.length} products
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No products found for this collection</h3>
              <p className="text-sm text-gray-500 mb-6">Check back soon for new arrivals.</p>
              <Link
                href="/shop"
                className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
