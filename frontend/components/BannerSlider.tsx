'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface BannerSlide {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
}

// Fallback banners when Supabase is empty
const fallbackBanners: BannerSlide[] = [
  {
    id: 'fb-1',
    title: 'Premium Vapes',
    subtitle: 'Discover the finest selection of vape products',
    image_url: '/banners/banner-1.jpg',
    link_url: '/shop',
  },
  {
    id: 'fb-2',
    title: 'New Arrivals',
    subtitle: 'Check out the latest flavours and devices',
    image_url: '/banners/banner-2.jpg',
    link_url: '/shop',
  },
  {
    id: 'fb-3',
    title: 'Free Delivery',
    subtitle: 'On all orders above Rs. 3,000',
    image_url: '/banners/banner-3.jpg',
    link_url: '/shop',
  },
];

export default function BannerSlider() {
  const [banners, setBanners] = useState<BannerSlide[]>(fallbackBanners);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch banners from API
  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('/api/banners');
        const data = await res.json();
        if (data.banners && data.banners.length > 0) {
          setBanners(data.banners);
        }
      } catch {
        // Use fallback banners
      }
    }
    fetchBanners();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % banners.length);
  }, [current, banners.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + banners.length) % banners.length);
  }, [current, banners.length, goToSlide]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden rounded-2xl">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === current
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-violet-950/30 to-zinc-900">
            {banner.image_url && (
              <Image
                src={banner.image_url}
                alt={banner.title || 'Banner'}
                fill
                className="object-cover opacity-60"
                priority={index === 0}
              />
            )}
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div
                className={`max-w-xl transition-all duration-700 delay-200 ${
                  index === current
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {banner.title && (
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {banner.title}
                  </h2>
                )}
                {banner.subtitle && (
                  <p className="text-lg sm:text-xl text-zinc-300 mb-8">
                    {banner.subtitle}
                  </p>
                )}
                {banner.link_url && (
                  <a
                    href={banner.link_url}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                  >
                    Shop Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        id="banner-prev"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        id="banner-next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? 'w-8 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400'
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
