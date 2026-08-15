'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const brands = [
  { name: 'Caliiohmz', slug: 'caliiohmz' },
  { name: 'Powerohmz', slug: 'powerohmz' },
  { name: 'The Cactus Labs', slug: 'cactus-labs' },
  { name: 'Whip Trip', slug: 'whip-trip' },
  { name: 'Bad Duck', slug: 'bad-duck' },
  { name: 'Omnia', slug: 'omnia' },
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Collections', href: '/category' },
  { name: 'Products', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);

  return (
    <nav className="bg-[var(--pink)] sticky top-0 z-50 shadow-md" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1 w-full justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  pathname === link.href
                    ? 'bg-white/20 text-white'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Brands dropdown */}
            <div className="relative">
              <button
                onClick={() => setBrandsOpen(!brandsOpen)}
                onMouseEnter={() => setBrandsOpen(true)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white rounded-full transition-colors"
              >
                Brands
                <svg className={`w-3.5 h-3.5 transition-transform ${brandsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {brandsOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-slide-down"
                  onMouseLeave={() => setBrandsOpen(false)}
                >
                  {brands.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/category/${brand.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-[var(--pink)] transition-colors font-medium"
                      onClick={() => setBrandsOpen(false)}
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <span className="lg:hidden text-white font-bold text-sm">Menu</span>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--pink-dark)] border-t border-white/10 animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              <p className="px-4 py-2 text-white/60 text-xs uppercase tracking-wider font-semibold">Brands</p>
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/category/${brand.slug}`}
                  className="block px-4 py-2.5 text-white/90 font-medium hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
