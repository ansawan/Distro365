'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/frontend/components/ProductCard';
import { Product } from '@/backend/lib/types';

export default function CategoryFilterPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const vendorName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const prodRes = await fetch(`/api/products?vendor=${encodeURIComponent(vendorName)}&limit=36`);
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [categorySlug, vendorName]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[var(--pink)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[var(--pink)] transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{vendorName}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
          {vendorName}
        </h1>
        <p className="text-gray-500">Showing all available products from {vendorName}</p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Check back soon for new arrivals from {vendorName}.</p>
          <Link
            href="/shop"
            className="inline-flex px-6 py-2.5 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}
