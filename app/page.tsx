'use client';

import React from 'react';
import HeroBanner from '@/frontend/components/HeroBanner';
import BrandCarousel from '@/frontend/components/BrandCarousel';
import VideoCarousel from '@/frontend/components/VideoCarousel';
import CollectionSection, { collectionsConfig } from '@/frontend/components/CollectionSection';
import PromoStrip from '@/frontend/components/PromoStrip';
import TestimonialsCarousel from '@/frontend/components/TestimonialsCarousel';
import TrustBadgesRow from '@/frontend/components/TrustBadgesRow';
import NewsletterBanner from '@/frontend/components/NewsletterBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 4. Hero Banner Slider */}
      <HeroBanner />

      {/* 5. Category Logo Carousel */}
      <BrandCarousel />

      {/* 6. Video Carousel */}
      <VideoCarousel />

      {/* 7. Per-Collection Sections */}
      {collectionsConfig.map((collection, index) => (
        <CollectionSection
          key={collection.slug}
          collection={collection}
          index={index}
        />
      ))}

      {/* 8. Promo Strip */}
      <PromoStrip />

      {/* 9. Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* 10. Trust Badges Row */}
      <TrustBadgesRow />

      {/* 11. Newsletter Banner */}
      <NewsletterBanner />
    </div>
  );
}
