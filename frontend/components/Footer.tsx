'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-900" id="site-footer">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo & Tagline */}
          <div>
            <Link href="/" className="inline-block p-3 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4">
              <Image
                src="/logo.png"
                alt="Distro365"
                width={140}
                height={48}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-zinc-300 text-sm font-medium leading-relaxed mb-4">
              Distro365 – Premium Distribution. Reliable Performance. Trusted Quality.
            </p>
            <p className="text-xs text-zinc-500">
              Your premier partner for top-tier vape & kratom brands across the nation.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--pink)] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li>
                <Link href="/" className="hover:text-[var(--pink)] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/category" className="hover:text-[var(--pink)] transition-colors">Collections</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[var(--pink)] transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--pink)] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--pink)] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Brands */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--pink)] mb-4">
              Top Brands
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li>
                <Link href="/category/caliiohmz" className="hover:text-[var(--pink)] transition-colors">Caliiohmz</Link>
              </li>
              <li>
                <Link href="/category/powerohmz" className="hover:text-[var(--pink)] transition-colors">Powerohmz</Link>
              </li>
              <li>
                <Link href="/category/cactus-labs" className="hover:text-[var(--pink)] transition-colors">The Cactus Labs</Link>
              </li>
              <li>
                <Link href="/category/whip-trip" className="hover:text-[var(--pink)] transition-colors">Whip Trip</Link>
              </li>
              <li>
                <Link href="/category/bad-duck" className="hover:text-[var(--pink)] transition-colors">Bad Duck</Link>
              </li>
              <li>
                <Link href="/category/omnia" className="hover:text-[var(--pink)] transition-colors">Omnia</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info (No business hours) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--pink)] mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--pink)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Los Angeles, California</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[var(--pink)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:sales@distro365.com" className="hover:text-[var(--pink)] transition-colors">sales@distro365.com</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[var(--pink)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+12134412345" className="hover:text-[var(--pink)] transition-colors">+1 (213) 441-2345</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} Distro365. All rights reserved. Age 21+ only.
          </p>

          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-[var(--pink)] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
