'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/backend/lib/types';

// Fallback categories matching live vendors
const fallbackCategories: Category[] = [
  { id: '1', name: 'Caliiohmz', slug: 'caliiohmz', logo_url: '/CALIIOHMZ.png' },
  { id: '2', name: 'Powerohmz', slug: 'powerohmz', logo_url: '/POWEROHMZ.png' },
  { id: '3', name: 'The Cactus Labs', slug: 'the-cactus-labs', logo_url: '/CACTUSLAB.png' },
  { id: '4', name: 'Whip Trip', slug: 'whip-trip', logo_url: '/WHIPTRIP.png' },
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch {
        // Fallback
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-white" id="category-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
            Browse Collections
          </h2>
          <p className="text-gray-500">Pick a brand to view full product catalog</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id || category.slug}
              href={`/category/${category.slug}`}
              className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gray-50 border-2 border-gray-100 transition-all duration-300 hover:border-[var(--pink)]/40 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[var(--pink)] font-black text-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {category.name.charAt(0)}
              </div>
              <span className="text-sm font-bold text-gray-900 text-center group-hover:text-[var(--pink)] transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
