'use client';

import React, { useState, useEffect, useRef } from 'react';

const announcements = [
  'Welcome to Distro365 — Premium Vape & Kratom Distribution',
  'Free Shipping on orders over $100 🚚',
  'New Arrivals: Caliiohmz & Powerohmz collections now live!',
  'Wholesale pricing available — Contact us for bulk orders',
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = (dir: 1 | -1) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((p) => (p + dir + announcements.length) % announcements.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  useEffect(() => {
    timeoutRef.current = setInterval(() => goTo(1), 4000);
    return () => { if (timeoutRef.current) clearInterval(timeoutRef.current); };
  }, []);

  return (
    <div className="bg-black text-white text-xs sm:text-sm select-none" id="announcement-bar">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left arrow */}
        <button
          onClick={() => goTo(-1)}
          className="p-1 hover:opacity-70 transition-opacity shrink-0"
          aria-label="Previous announcement"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Text */}
        <div className="flex-1 overflow-hidden text-center mx-4">
          <p
            key={current}
            className="animate-fade-in whitespace-nowrap truncate tracking-wide font-medium"
          >
            {announcements[current]}
          </p>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => goTo(1)}
          className="p-1 hover:opacity-70 transition-opacity shrink-0"
          aria-label="Next announcement"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
