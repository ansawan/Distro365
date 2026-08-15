'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSlide {
  image: string;
  imageOnly?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

/* ── CONFIG ARRAY — 5 Hero Slides ── */
const heroSlides: HeroSlide[] = [
  {
    image: '/SLIDEBANNER4.png',
    imageOnly: true,
    title: 'The Cactus Labs Slide Banner',
  },
  {
    image: '/SLIDEBANNER5.png',
    imageOnly: true,
    title: 'Whip Trip & Bad Duck Slide Banner',
  },
  {
    image: '/SLIDEBANNER1.jpg',
    imageOnly: false,
    eyebrow: 'New Collection',
    title: 'Premium Vape\nDistribution',
    description: 'Discover our curated selection of top-tier vape products. Reliable performance, trusted quality.',
    ctaText: 'Shop Now',
    ctaLink: '/shop',
  },
  {
    image: '/SLIDEBANNER2.jpg',
    imageOnly: false,
    eyebrow: 'Best Sellers',
    title: 'Caliiohmz\nCollection',
    description: 'Explore the full range of Caliiohmz disposable vapes — bold flavors, smooth hits, every time.',
    ctaText: 'Shop Caliiohmz',
    ctaLink: '/category/caliiohmz',
  },
  {
    image: '/SLIDEBANNER3.jpg',
    imageOnly: false,
    eyebrow: 'Just Dropped',
    title: 'Powerohmz\nSeries',
    description: 'High-performance devices with unmatched battery life and flavor delivery. Try the Powerohmz difference.',
    ctaText: 'Shop Powerohmz',
    ctaLink: '/category/powerohmz',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goTo = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length, 'next');
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length, 'prev');
  }, [current, goTo]);

  // Auto-play every 5s
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full overflow-hidden bg-black" id="hero-banner">
      {/* Consistent background image layer for all 5 slides (object-cover) */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={s.image}
            alt={s.title || 'Slide Banner'}
            fill
            sizes="100vw"
            quality={100}
            unoptimized
            className="object-cover object-center"
            priority={i === 0}
          />

          {/* Apply dark left gradient overlay ONLY for slides with text content */}
          {!s.imageOnly && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 via-35% to-transparent" />
          )}
        </div>
      ))}

      {/* Content Container (Consistent fixed/responsive height across all slides) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] flex items-center">
        {!slide.imageOnly && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full z-10">
            {/* Left: Text content */}
            <div
              key={`text-${current}`}
              className={direction === 'next' ? 'animate-slide-in-left' : 'animate-slide-in-right'}
            >
              {/* Eyebrow */}
              {slide.eyebrow && (
                <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full mb-5 tracking-wide uppercase">
                  {slide.eyebrow}
                </span>
              )}

              {/* Headline */}
              {slide.title && (
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] mb-5 whitespace-pre-line drop-shadow-md">
                  {slide.title}
                </h1>
              )}

              {/* Description */}
              {slide.description && (
                <p className="text-white/90 text-base sm:text-lg max-w-md mb-8 leading-relaxed drop-shadow">
                  {slide.description}
                </p>
              )}

              {/* CTA Button */}
              {slide.ctaText && slide.ctaLink && (
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white text-sm font-bold rounded-full hover:bg-[var(--pink)] transition-colors shadow-xl"
                >
                  {slide.ctaText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>

            <div className="hidden lg:block" />
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-[var(--pink)] transition-colors z-30 cursor-pointer shadow-xl"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-[var(--pink)] transition-colors z-30 cursor-pointer shadow-xl"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot pagination */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 'next' : 'prev')}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === current
                ? 'w-8 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
