'use client';

import React, { useState, useEffect } from 'react';
import { ProductVariant } from '@/backend/lib/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  // Filter active variants only (or all if active flag missing)
  const activeVariants = variants.filter((v) => v.is_active !== false);
  if (activeVariants.length === 0) return null;

  // Check if variants have multi-attribute mapping
  const hasAttributesObj = activeVariants.some(
    (v) => v.attributes && Object.keys(v.attributes).length > 1
  );

  if (hasAttributesObj) {
    // Multi-attribute selection UI
    const attributeKeys = Array.from(
      new Set(activeVariants.flatMap((v) => (v.attributes ? Object.keys(v.attributes) : [])))
    );

    const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() => {
      if (selectedVariant?.attributes) return selectedVariant.attributes;
      return activeVariants[0]?.attributes || {};
    });

    useEffect(() => {
      if (selectedVariant?.attributes) {
        setSelectedAttrs(selectedVariant.attributes);
      }
    }, [selectedVariant]);

    const handleSelectAttr = (key: string, val: string) => {
      const nextAttrs = { ...selectedAttrs, [key]: val };
      setSelectedAttrs(nextAttrs);

      // Find best matching variant
      const match = activeVariants.find((v) => {
        if (!v.attributes) return false;
        return Object.entries(nextAttrs).every(([k, expectedVal]) => v.attributes![k] === expectedVal);
      }) || activeVariants.find((v) => v.attributes?.[key] === val) || activeVariants[0];

      if (match) onSelect(match);
    };

    return (
      <div className="space-y-4">
        {attributeKeys.map((attrKey) => {
          const availableValues = Array.from(
            new Set(
              activeVariants
                .map((v) => v.attributes?.[attrKey])
                .filter(Boolean) as string[]
            )
          );

          const currentVal = selectedAttrs[attrKey] || availableValues[0];

          return (
            <div key={attrKey}>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Select {attrKey}
                {currentVal && (
                  <span className="ml-2 text-[var(--pink)] font-semibold normal-case">
                    — {currentVal}
                  </span>
                )}
              </label>

              <div className="flex flex-wrap gap-2.5">
                {availableValues.map((val) => {
                  const isSelected = currentVal === val;
                  // Check stock for this specific attribute choice
                  const matchingVariant = activeVariants.find(
                    (v) => v.attributes?.[attrKey] === val
                  );
                  const inStock = matchingVariant ? matchingVariant.inventory_qty > 0 : true;

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectAttr(attrKey, val)}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--pink)] border-[var(--pink)] text-white shadow-md'
                          : inStock
                          ? 'bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-400'
                          : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Selected Variant Stock & SKU */}
        {selectedVariant && (
          <div className="flex items-center gap-4 text-xs pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedVariant.inventory_qty > 0 ? 'bg-green-500 animate-pulse-dot' : 'bg-red-400'
                }`}
              />
              <span
                className={`font-semibold ${
                  selectedVariant.inventory_qty > 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {selectedVariant.inventory_qty > 0
                  ? `${selectedVariant.inventory_qty} in stock`
                  : 'Out of stock'}
              </span>
            </div>
            {selectedVariant.sku && (
              <span className="text-gray-400 font-mono">SKU: {selectedVariant.sku}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Single option deduplicated selector (Standard / Fallback)
  const uniqueVariants = activeVariants.reduce<ProductVariant[]>((acc, current) => {
    const valKey = (current.option_value || current.sku || '').trim().toLowerCase();
    if (valKey && !acc.some((v) => (v.option_value || v.sku || '').trim().toLowerCase() === valKey)) {
      acc.push(current);
    }
    return acc;
  }, []);

  if (uniqueVariants.length === 0) return null;

  const optionName = uniqueVariants[0]?.option_name || 'Option';
  const useDropdown = uniqueVariants.length > 6;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
          Select {optionName}
          {selectedVariant?.option_value && (
            <span className="ml-2 text-[var(--pink)] font-semibold normal-case">
              — {selectedVariant.option_value}
            </span>
          )}
        </label>

        {useDropdown ? (
          <div className="relative max-w-md">
            <select
              value={selectedVariant?.id || uniqueVariants[0]?.id}
              onChange={(e) => {
                const match = uniqueVariants.find((v) => v.id === e.target.value);
                if (match) onSelect(match);
              }}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm font-bold focus:outline-none focus:border-[var(--pink)] appearance-none cursor-pointer pr-10"
              id="variant-select-dropdown"
            >
              {uniqueVariants.map((v) => {
                const variantPrice = Number(v.price);
                const priceLabel = variantPrice > 0 ? ` — $${variantPrice.toFixed(2)}` : '';
                const stockLabel = v.inventory_qty <= 0 ? ' (Out of stock)' : '';
                return (
                  <option key={v.id} value={v.id}>
                    {v.option_value || v.sku || 'Variant'}{priceLabel}{stockLabel}
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {uniqueVariants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const inStock = v.inventory_qty > 0;
              const variantPrice = Number(v.price);
              const priceLabel = variantPrice > 0 ? `$${variantPrice.toFixed(2)}` : '';

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onSelect(v)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--pink)] border-[var(--pink)] text-white shadow-md'
                      : inStock
                      ? 'bg-gray-50 border-gray-200 text-gray-800 hover:border-gray-400'
                      : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                  }`}
                >
                  {v.option_value || v.sku || 'Variant'}
                  {priceLabel && <span className="ml-1.5 opacity-80">({priceLabel})</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Variant Stock & SKU */}
      {selectedVariant && (
        <div className="flex items-center gap-4 text-xs pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                selectedVariant.inventory_qty > 0 ? 'bg-green-500 animate-pulse-dot' : 'bg-red-400'
              }`}
            />
            <span
              className={`font-semibold ${
                selectedVariant.inventory_qty > 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {selectedVariant.inventory_qty > 0
                ? `${selectedVariant.inventory_qty} in stock`
                : 'Out of stock'}
            </span>
          </div>

          {selectedVariant.sku && (
            <span className="text-gray-400 font-mono">SKU: {selectedVariant.sku}</span>
          )}
        </div>
      )}
    </div>
  );
}
