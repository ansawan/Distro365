'use client';

import React, { useState } from 'react';
import { useCart } from './CartContext';

export default function CheckoutForm() {
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({
        product_handle: item.product_handle,
        variant_id: item.variant_id,
        qty: item.quantity,
        price: item.price,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: orderItems,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to place order');
      }

      setSuccess(true);
      clearCart();
      setForm({ customer_name: '', phone: '', address: '', notes: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Order Placed Successfully!</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Thank you for your order. Our team will contact you shortly to confirm delivery details.
        </p>
        <p className="text-xs text-gray-400 mb-8 font-semibold uppercase tracking-wider">Payment: Cash on Delivery (COD)</p>
        <a
          href="/shop"
          className="inline-flex px-8 py-3.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 transition-colors shadow-lg"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="checkout-form">
      <div>
        <h3 className="text-2xl font-black text-gray-900 mb-1">Delivery Details</h3>
        <p className="text-xs text-gray-500">Cash on Delivery — pay when you receive your package</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name *</label>
          <input
            type="text"
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[var(--pink)]"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[var(--pink)]"
            placeholder="+1 (213) 441-2345"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Shipping Address *</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[var(--pink)] resize-none"
          placeholder="Street address, apartment, suite, city, state, zip"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Order Notes (Optional)</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[var(--pink)] resize-none"
          placeholder="Special delivery instructions"
        />
      </div>

      {/* Summary */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
        {items.map((item) => (
          <div key={`${item.product_handle}-${item.variant_id}`} className="flex justify-between font-medium">
            <span className="text-gray-700">
              {item.name} {item.variant_label ? `(${item.variant_label})` : ''} × {item.quantity}
            </span>
            <span className="text-gray-900 font-bold font-mono">
              {item.price > 0 ? `$${(item.price * item.quantity).toFixed(2)}` : 'Price on request'}
            </span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center text-sm">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-black text-base text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || items.length === 0}
        className="w-full py-4 bg-black hover:bg-gray-900 text-white rounded-full font-bold text-sm transition-colors shadow-xl disabled:opacity-50"
      >
        {isSubmitting ? 'Placing Order...' : 'Confirm Order (COD)'}
      </button>
    </form>
  );
}
