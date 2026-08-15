'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';

export default function CartDrawer() {
  const { items, total, isOpen, closeCart, removeItem, updateQuantity } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Your Cart
            <span className="text-xs text-gray-500 font-normal">({items.length} items)</span>
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg"
            id="close-cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500 font-medium mb-4">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product_handle}-${item.variant_id || 'default'}`}
                className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-xl bg-white shrink-0 overflow-hidden relative border border-gray-100 flex items-center justify-center">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">No img</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                  {item.variant_label && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.variant_label}</p>
                  )}
                  <p className="text-sm font-black text-gray-900 mt-1">
                    {item.price > 0 ? `$${(item.price * item.quantity).toFixed(2)}` : 'Price on request'}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product_handle, item.quantity - 1, item.variant_id)
                      }
                      className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center text-xs font-bold"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product_handle, item.quantity + 1, item.variant_id)
                      }
                      className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center text-xs font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.product_handle, item.variant_id)}
                      className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium text-sm">Subtotal</span>
              <span className="text-xl font-black text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-3.5 bg-black text-white rounded-full font-bold text-center text-sm hover:bg-gray-900 transition-colors shadow-lg"
              onClick={closeCart}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
