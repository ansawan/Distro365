'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './ProductCard';
import { Product } from '@/backend/lib/types';

export interface CollectionConfig {
  name: string;
  slug: string;
  tagline: string;
  bannerImage: string;
  bannerColor: string;
}

export const collectionsConfig: CollectionConfig[] = [
  {
    name: 'Caliiohmz',
    slug: 'caliiohmz',
    tagline: 'California vibes. Premium disposable vapes.',
    bannerImage: '/CALIIOHMZ.png',
    bannerColor: 'from-pink-600 to-rose-700',
  },
  {
    name: 'Powerohmz',
    slug: 'powerohmz',
    tagline: 'Power meets high-potency performance.',
    bannerImage: '/POWEROHMZ.png',
    bannerColor: 'from-blue-600 to-purple-700',
  },
  {
    name: 'The Cactus Labs',
    slug: 'cactus-labs',
    tagline: 'Natural botanical blends & lab-tested quality.',
    bannerImage: '/CACTUSLAB.png',
    bannerColor: 'from-emerald-600 to-teal-800',
  },
  {
    name: 'Bad Duck',
    slug: 'bad-duck',
    tagline: 'Specialty THC-A & THC-P Frosties Hash Holes.',
    bannerImage: '/BADDUCK.webp',
    bannerColor: 'from-amber-600 to-yellow-700',
  },
  {
    name: 'Whip Trip',
    slug: 'whip-trip',
    tagline: 'Elevated taste. Feel the difference.',
    bannerImage: '/WHIPTRIP.png',
    bannerColor: 'from-purple-600 to-fuchsia-700',
  },
  {
    name: 'Omnia',
    slug: 'omnia',
    tagline: 'Pure extracts & maximum concentration.',
    bannerImage: '/OMNIA.webp',
    bannerColor: 'from-orange-600 to-red-700',
  },
];

interface Props {
  collection: CollectionConfig;
  index: number;
}

export default function CollectionSection({ collection, index }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVendorProducts() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?vendor=${encodeURIComponent(collection.name)}&limit=24`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch collection products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVendorProducts();
  }, [collection.name]);

  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    const amount = 320;
    trackRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const isEven = index % 2 === 0;

  return (
    <section
      className={isEven ? 'bg-white' : 'bg-gray-50'}
      id={`collection-${collection.slug}`}
    >
      {/* Banner */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${collection.bannerColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">
              Official Collection
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">{collection.name}</h2>
            <p className="text-white/80 mt-1 text-sm sm:text-base">{collection.tagline}</p>
            <Link
              href={`/category/${collection.slug}`}
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-black text-white text-xs sm:text-sm font-bold rounded-full hover:bg-[var(--pink)] transition-colors shadow-md"
            >
              Shop {collection.name} ({products.length})
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {collection.bannerImage && (
            <div className="hidden sm:block w-28 h-28 lg:w-36 lg:h-36 relative opacity-90">
              <Image
                src={collection.bannerImage}
                alt={collection.name}
                fill
                unoptimized
                className="object-contain drop-shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>

      {/* Products Carousel (4 per row on desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 bg-gray-200/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="relative">
            {/* Left arrow button */}
            <button
              type="button"
              onClick={() => scroll('left')}
              className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[var(--pink)] hover:border-[var(--pink)] transition-colors cursor-pointer"
              aria-label="Previous products"
            >
              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Scrollable Track: 4 per row on desktop */}
            <div
              ref={trackRef}
              className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-1 py-2"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Right arrow button */}
            <button
              type="button"
              onClick={() => scroll('right')}
              className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[var(--pink)] hover:border-[var(--pink)] transition-colors cursor-pointer"
              aria-label="Next products"
            >
              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 text-sm">
            No products loaded for {collection.name} yet.
          </div>
        )}
      </div>
    </section>
  );
}
