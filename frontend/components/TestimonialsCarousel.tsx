'use client';

import React, { useState, useEffect, useCallback } from 'react';

const testimonials = [
  {
    stars: 5,
    quote: 'Best vape distributor I\'ve worked with. Quality products, fast shipping, and the customer service is top notch. Highly recommend Distro365!',
    name: 'Marcus T.',
    location: 'Los Angeles, CA',
  },
  {
    stars: 5,
    quote: 'The Caliiohmz collection is absolutely fire. Great flavors and my customers love them. Will definitely keep ordering from Distro365.',
    name: 'Sarah K.',
    location: 'Houston, TX',
  },
  {
    stars: 5,
    quote: 'Reliable distribution, competitive pricing, and genuine products. Distro365 has been our go-to supplier for over a year now.',
    name: 'James P.',
    location: 'Miami, FL',
  },
  {
    stars: 4,
    quote: 'Amazing selection and the wholesale prices are unbeatable. Powerohmz products fly off the shelves. Great partner for our shop!',
    name: 'David R.',
    location: 'Chicago, IL',
  },
];

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <section className="bg-white py-14 lg:py-20" id="testimonials">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonial card */}
        <div className="relative">
          <div key={current} className="text-center animate-fade-in">
            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < t.stars ? 'text-yellow-400' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6 italic">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Customer */}
            <p className="font-bold text-gray-900">{t.name}</p>
            <p className="text-sm text-gray-400">{t.location}</p>
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[var(--pink)] hover:border-[var(--pink)] transition-colors"
            aria-label="Previous testimonial"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[var(--pink)] hover:border-[var(--pink)] transition-colors"
            aria-label="Next testimonial"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-7 h-2.5 bg-[var(--pink)]' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
