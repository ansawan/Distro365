'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-[var(--pink)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">About Us</span>
      </nav>

      {/* Hero section */}
      <div className="bg-pink-gradient rounded-3xl p-8 sm:p-14 text-white mb-16 shadow-xl">
        <div className="max-w-3xl">
          <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Distro365 Story
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
            Premium Distribution. Reliable Performance. Trusted Quality.
          </h1>
          <p className="text-white/80 text-lg sm:text-xl leading-relaxed">
            Headquartered in Los Angeles, California, Distro365 is a premier distributor of top-tier vape and kratom products, supplying retailers and vape enthusiasts nationwide with authentic, lab-tested products.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-pink-100 text-[var(--pink)] flex items-center justify-center font-black text-xl mb-4">
            01
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Brands</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            We partner directly with industry-leading manufacturers like Caliiohmz, Powerohmz, The Cactus Labs, and Whip Trip to ensure 100% genuine products.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-pink-100 text-[var(--pink)] flex items-center justify-center font-black text-xl mb-4">
            02
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Logistics</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our streamlined warehouse infrastructure in California enables fast processing and reliable nationwide shipping for orders of any size.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-pink-100 text-[var(--pink)] flex items-center justify-center font-black text-xl mb-4">
            03
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Wholesale Dedicated</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Whether you run a smoke shop or online store, our dedicated support team offers customized ordering solutions to help your business grow.
          </p>
        </div>
      </div>
    </div>
  );
}
