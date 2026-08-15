'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collectionsConfig } from '@/frontend/components/CollectionSection';

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-[var(--pink)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Collections</span>
      </nav>

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
          All Collections
        </h1>
        <p className="text-gray-600">
          Explore our premier vape & kratom brands, carefully selected for maximum quality and customer satisfaction.
        </p>
      </div>

      {/* Grid of Collection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collectionsConfig.map((col) => (
          <Link
            key={col.slug}
            href={`/category/${col.slug}`}
            className="group relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Gradient background */}
            <div className={`h-64 sm:h-72 bg-gradient-to-br ${col.bannerColor} relative p-8 flex flex-col justify-between text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                    Brand Collection
                  </span>
                  <h2 className="text-3xl font-black">{col.name}</h2>
                </div>
                <div className="w-20 h-20 relative opacity-90 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={col.bannerImage}
                    alt={col.name}
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </div>
              </div>

              <div>
                <p className="text-white/80 text-sm mb-4 max-w-md">{col.tagline}</p>
                <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full group-hover:bg-gray-900 transition-colors">
                  Shop {col.name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
