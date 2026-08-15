'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/backend/lib/types';

interface ProductGalleryProps {
  images: ProductImage[];
  mainImage?: string | null;
  productName: string;
}

export default function ProductGallery({ images, mainImage, productName }: ProductGalleryProps) {
  // Combine mainImage with extra images list
  const allImages = [...images];
  if (mainImage && !allImages.some((img) => img.image_src === mainImage)) {
    allImages.unshift({
      id: 'main-img',
      product_handle: '',
      image_src: mainImage,
      position: 0,
      alt_text: productName,
    });
  }

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = allImages[selectedIndex] || { image_src: mainImage || '' };

  if (allImages.length === 0 && !mainImage) {
    return (
      <div className="aspect-square rounded-3xl bg-gray-100 flex items-center justify-center border border-gray-200">
        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary Display */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-200 shadow-lg">
        {selected.image_src ? (
          <Image
            src={selected.image_src}
            alt={selected.alt_text || productName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No Image
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {allImages.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                i === selectedIndex
                  ? 'border-[var(--pink)] shadow-md scale-105'
                  : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_src}
                alt={img.alt_text || `${productName} ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
