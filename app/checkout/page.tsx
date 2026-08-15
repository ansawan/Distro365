'use client';

import CheckoutForm from '@/frontend/components/CheckoutForm';
import { useCart } from '@/frontend/components/CartContext';

export default function CheckoutPage() {
  const { items } = useCart();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
        <a href="/" className="hover:text-white transition-colors">Home</a>
        <span>/</span>
        <a href="/shop" className="hover:text-white transition-colors">Shop</a>
        <span>/</span>
        <span className="text-zinc-300">Checkout</span>
      </nav>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-zinc-400 mb-6">Add some products before checking out</p>
          <a
            href="/shop"
            className="inline-flex px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-500 transition-colors"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 lg:p-8">
          <CheckoutForm />
        </div>
      )}
    </div>
  );
}
