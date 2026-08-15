'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandItem {
  name: string;
  slug: string;
  logoUrl?: string;
}

const logoMap: Record<string, string> = {
  caliiohmz: '/CALIIOHMZ.png',
  powerohmz: '/POWEROHMZ.png',
  'cactus-labs': '/CACTUSLAB.png',
  'the-cactus-labs': '/CACTUSLAB.png',
  'whip-trip': '/WHIPTRIP.png',
  whiptrip: '/WHIPTRIP.png',
  'bad-duck': '/BADDUCK.webp',
  badduck: '/BADDUCK.webp',
  omnia: '/OMNIA.webp',
};

const excludedSlugs = ['distro365', 'glock-9', 'glock9'];

const defaultBrandList: BrandItem[] = [
  { name: 'Caliiohmz', slug: 'caliiohmz', logoUrl: '/CALIIOHMZ.png' },
  { name: 'Powerohmz', slug: 'powerohmz', logoUrl: '/POWEROHMZ.png' },
  { name: 'The Cactus Labs', slug: 'the-cactus-labs', logoUrl: '/CACTUSLAB.png' },
  { name: 'Whip Trip', slug: 'whip-trip', logoUrl: '/WHIPTRIP.png' },
  { name: 'Bad Duck', slug: 'bad-duck', logoUrl: '/BADDUCK.webp' },
  { name: 'Omnia', slug: 'omnia', logoUrl: '/OMNIA.webp' },
];

export default function BrandCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [brands, setBrands] = useState<BrandItem[]>(defaultBrandList);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        
        let loadedBrands: BrandItem[] = [];

        if (data.categories && data.categories.length > 0) {
          loadedBrands = data.categories
            .map((c: { name: string; slug: string; logo_url?: string }) => {
              const slug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return {
                name: c.name,
                slug: slug,
                logoUrl: logoMap[slug] || c.logo_url || undefined,
              };
            })
            .filter((b: BrandItem) => !excludedSlugs.includes(b.slug.toLowerCase()));
        }

        // Add Bad Duck and Omnia if not present in DB list
        const extraBrands = [
          { name: 'Bad Duck', slug: 'bad-duck', logoUrl: '/BADDUCK.webp' },
          { name: 'Omnia', slug: 'omnia', logoUrl: '/OMNIA.webp' },
        ];

        extraBrands.forEach((extra) => {
          if (!loadedBrands.some((b) => b.slug === extra.slug || b.name.toLowerCase() === extra.name.toLowerCase())) {
            loadedBrands.push(extra);
          }
        });

        if (loadedBrands.length > 0) {
          setBrands(loadedBrands);
        }
      } catch (err) {
        console.error('Failed to load brands:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBrands();
  }, []);

  const handleScroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    const amount = 300;
    const el = trackRef.current;
    if (dir === 'left') {
      el.scrollBy({ left: -amount, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-48 h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white py-14 lg:py-20 border-b border-gray-100" id="brand-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Our Collections
          </h2>
          <p className="mt-2 text-gray-500">Shop by official brand</p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[var(--pink)] hover:border-[var(--pink)] transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-2 py-2"
          >
            {brands.map((cat, i) => (
              <Link
                key={`${cat.slug}-${i}`}
                href={`/category/${cat.slug}`}
                className="shrink-0 w-[190px] sm:w-[210px] group"
              >
                {/* Sleek dark neutral background (bg-zinc-950) so white logos stand out crisp */}
                <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-6 flex flex-col items-center justify-center gap-4 h-48 group-hover:border-[var(--pink)] group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                  {cat.logoUrl ? (
                    <div className="w-24 h-24 relative flex items-center justify-center">
                      <Image
                        src={cat.logoUrl}
                        alt={cat.name}
                        width={96}
                        height={96}
                        unoptimized
                        className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-zinc-800 text-[var(--pink)] font-black text-2xl flex items-center justify-center border border-zinc-700">
                      {cat.name.charAt(0)}
                    </div>
                  )}

                  <div className="text-center">
                    <p className="font-bold text-white text-sm group-hover:text-[var(--pink)] transition-colors truncate">
                      {cat.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[var(--pink)] hover:border-[var(--pink)] transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
