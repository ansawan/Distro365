'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';

export default function Header() {
  const { itemCount, total, toggleCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white border-b border-gray-100" id="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo — Always visible on Mobile & Desktop */}
          <Link href="/" className="shrink-0 flex items-center py-1">
            <Image
              src="/logo.png"
              alt="Distro365"
              width={140}
              height={48}
              className="h-8 sm:h-10 lg:h-12 w-auto object-contain block"
              priority
            />
          </Link>

          {/* Search Bar — desktop center */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-4 pr-11 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--pink)] focus:ring-1 focus:ring-[var(--pink)] transition-colors"
                id="search-input"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[var(--pink)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Phone — desktop only */}
            <a
              href="tel:+12797777786"
              className="hidden lg:flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[var(--pink)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-pink-50 text-[var(--pink)] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Support</span>
                <span className="text-xs font-bold text-gray-900">(279) 777-7786</span>
              </div>
            </a>

            {/* Admin Icon */}
            <Link
              href="/admin/dashboard"
              className="p-2 text-gray-600 hover:text-[var(--pink)] transition-colors rounded-full hover:bg-gray-50"
              title="Admin Portal"
              id="admin-portal-link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart Button with Pill Badge */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-2.5 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-full transition-all shadow-md group cursor-pointer"
              id="cart-button"
            >
              <div className="relative">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--pink)] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">${total.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
