'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/frontend/components/ProductCard';
import { Product } from '@/backend/lib/types';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load vendors list
  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setVendors(data.vendors || []);
      } catch (err) {
        console.error('Failed to load vendors:', err);
      }
    }
    loadVendors();
  }, []);

  // Load products
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '24' });
        if (selectedVendor) params.set('vendor', selectedVendor);
        if (searchQuery) params.set('search', searchQuery);

        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [page, selectedVendor, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
          Shop All Products
        </h1>
        <p className="text-gray-500">
          Browse our complete catalog of {totalCount > 0 ? `${totalCount} premium products` : 'vape & kratom products'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
          {/* Search */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Search Catalog
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title, brand..."
                className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--pink)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Vendor Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
              Filter by Brand
            </label>
            <div className="space-y-1">
              <button
                onClick={() => { setSelectedVendor(''); setPage(1); }}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  !selectedVendor
                    ? 'bg-[var(--pink)] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                All Brands
              </button>
              {vendors.map((v) => (
                <button
                  key={v}
                  onClick={() => { setSelectedVendor(v); setPage(1); }}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors truncate ${
                    selectedVendor === v
                      ? 'bg-[var(--pink)] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-200/60'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
              <p className="text-sm text-gray-500 mb-6">Try clearing your filters or search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedVendor(''); setPage(1); }}
                className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
