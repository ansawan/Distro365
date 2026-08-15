'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createBrowserClient } from '@/backend/lib/supabase/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Admin Login] 🚀 Form submitted for email:', email);
    setIsLoading(true);
    setError('');

    try {
      const supabase = createBrowserClient();
      console.log('[Admin Login] 🔑 Invoking supabase.auth.signInWithPassword...');

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[Admin Login] 📩 Supabase Auth Response:', { data, error: authError });

      if (authError) {
        console.error('[Admin Login] ❌ Auth error:', authError.message);
        throw authError;
      }

      if (data?.session) {
        console.log('[Admin Login] ✅ Auth successful! Setting admin cookies...');

        // Set cookies so server middleware permits access to /admin/*
        document.cookie = `distro365_admin_session=true; Path=/; Max-Age=86400; SameSite=Lax`;
        document.cookie = `distro365_admin_token=${data.session.access_token}; Path=/; Max-Age=86400; SameSite=Lax`;
        document.cookie = `sb-admin-auth-token=${data.session.access_token}; Path=/; Max-Age=86400; SameSite=Lax`;

        console.log('[Admin Login] 🔄 Navigating to /admin/dashboard...');
        window.location.href = '/admin/dashboard';
      } else {
        throw new Error('No session returned from authentication');
      }
    } catch (err) {
      console.error('[Admin Login] ⚠️ Catch block error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/logo.png"
              alt="Distro365"
              width={160}
              height={50}
              className="h-12 w-auto object-contain brightness-0 invert mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in using your Supabase admin credentials</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="bg-black/60 border border-gray-800 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-xl"
          id="admin-login-form"
        >
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[var(--pink)] transition-colors"
              placeholder="admin@distro365.com"
              id="admin-email-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[var(--pink)] transition-colors"
              placeholder="••••••••"
              id="admin-password-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[var(--pink)] hover:bg-[var(--pink-dark)] text-white rounded-full font-bold text-sm transition-colors shadow-lg disabled:opacity-50 cursor-pointer"
            id="admin-login-button"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Admin'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          <Link href="/" className="hover:text-white transition-colors">← Back to Storefront</Link>
        </p>
      </div>
    </div>
  );
}
