'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/backend/lib/types';
import { useCart } from './CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  // Primary image search cascade
  const primaryUrl =
    product.main_image ||
    product.images?.[0]?.image_src ||
    product.variants?.find((v) => v.image_src)?.image_src ||
    '';

  const [imgSrc, setImgSrc] = useState<string>(primaryUrl);
  const [imgError, setImgError] = useState(false);

  // Calculate stock
  const hasVariants = product.variants && product.variants.length > 0;
  const totalStock = hasVariants
    ? product.variants!.reduce((sum, v) => sum + (v.inventory_qty || 0), 0)
    : 1;
  const inStock = totalStock > 0;

  // Calculate price display
  const priceVal = Number(product.price);
  const displayPrice = priceVal > 0 ? `$${priceVal.toFixed(2)}` : 'Price on request';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.product_type === 'variable' || hasVariants) {
      window.location.href = `/product/${product.handle}`;
      return;
    }

    addItem({
      product_handle: product.handle,
      name: product.title,
      price: priceVal > 0 ? priceVal : 0,
      quantity: 1,
      image_url: imgSrc || undefined,
    });
  };

  const handleImageError = () => {
    console.warn(`[ProductCard] Broken image URL for "${product.title}" (${product.handle}):`, primaryUrl);
    setImgError(true);
  };

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group flex flex-col bg-white rounded-2xl border-2 border-gray-100 p-4 hover:border-[var(--pink)]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
      id={`product-${product.handle}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square rounded-xl bg-gray-50 overflow-hidden mb-4 flex items-center justify-center border border-gray-100">
        {imgSrc && !imgError ? (
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            <svg className="w-10 h-10 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.vendor || 'Distro365'}</span>
          </div>
        )}

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--pink)] shadow-md"
          title="Add to Cart"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1">
        {/* Vendor */}
        {product.vendor && (
          <span className="text-[11px] font-bold text-[var(--pink)] uppercase tracking-wider mb-1">
            {product.vendor}
          </span>
        )}

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm group-hover:text-[var(--pink)] transition-colors line-clamp-2 mb-1.5">
          {product.title}
        </h3>

        {/* In-Stock Indicator */}
        <div className="flex items-center gap-1.5 mb-2 mt-auto">
          <span
            className={`w-2 h-2 rounded-full ${
              inStock ? 'bg-green-500 animate-pulse-dot' : 'bg-red-400'
            }`}
          />
          <span className={`text-[11px] font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
            {inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-base font-black text-gray-900">
            {displayPrice}
          </span>
          {(product.product_type === 'variable' || hasVariants) && (
            <span className="text-[11px] text-gray-400 font-medium">Options</span>
          )}
        </div>
      </div>
    </Link>
  );
}
