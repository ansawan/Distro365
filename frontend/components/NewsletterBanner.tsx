'use client';

import React, { useState } from 'react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('Thank you for subscribing! Check your inbox soon.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <section className="relative overflow-hidden bg-pink-gradient py-16 lg:py-24 text-white" id="newsletter">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider mb-4">
          Stay Connected
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
          Join the Distro365 VIP Club
        </h2>
        <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Subscribe to get exclusive wholesale deals, new product drop alerts, and special promotions delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-5 py-3.5 rounded-full bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
            id="newsletter-email-input"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3.5 bg-black hover:bg-gray-900 text-white font-bold text-sm rounded-full transition-colors shrink-0 shadow-lg disabled:opacity-50"
            id="newsletter-subscribe-btn"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm font-medium ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
