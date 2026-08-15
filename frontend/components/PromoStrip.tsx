'use client';

import React, { useState } from 'react';

export default function PromoStrip() {
  const code = 'DISTRO10';
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-gray-900" id="promo-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-center">
          <p className="text-white text-sm sm:text-base font-semibold">
            🎉 Use code{' '}
            <span className="text-[var(--pink)] font-black">{code}</span>{' '}
            for 10% off your first order
          </p>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-5 py-2 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
