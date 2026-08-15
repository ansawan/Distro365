'use client';

import React from 'react';

const trustBadges = [
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7a2 2 0 00-2-2h-1.5a2 2 0 01-2-2V3.055M11 20.935V19a2.5 2.5 0 00-2.5-2.5H7a2 2 0 01-2-2v-1.5M14 20.935V19a2.5 2.5 0 012.5-2.5H18a2 2 0 002-2v-1.5" />
      </svg>
    ),
    title: 'Worldwide Shipping',
    description: 'Fast, secure & trackable delivery across the globe.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13C10.832 19.877 8 16.5 8 13V8h8v5c0 3.5-2.832 6.877-4 8z" />
      </svg>
    ),
    title: 'Customised Orders',
    description: 'Tailored wholesale solutions for your store needs.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: '24/7 Customer Care',
    description: 'Dedicated support team ready to assist you anytime.',
  },
];

export default function TrustBadgesRow() {
  return (
    <section className="bg-gray-50 border-y border-gray-100 py-12 lg:py-16" id="trust-badges">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {trustBadges.map((badge, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
                {badge.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-500 max-w-xs">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
