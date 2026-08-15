'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/frontend/components/Modal';
import { Category } from '@/backend/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    logo_url: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    setForm({ name: '', slug: '', logo_url: '' });
  };

  const handleSave = async () => {
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          logo_url: form.logo_url || null,
        }),
      });
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch {
      //
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories & Brands</h1>
          <p className="text-zinc-500">Manage categories and brand collections</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="px-5 py-2.5 bg-[var(--pink)] hover:bg-[var(--pink-dark)] text-white rounded-xl font-medium text-sm transition-all"
          id="add-category-btn"
        >
          + Add Category / Brand
        </button>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">No categories found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead>
                <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800 bg-zinc-950/40">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Logo URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {categories.map((cat) => (
                  <tr key={cat.id || cat.slug} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-white">{cat.name}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400 font-mono">{cat.slug}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{cat.logo_url || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title="Add Category / Brand"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
              placeholder="Brand / Category name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)] font-mono"
              placeholder="brand-slug"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Logo URL (Optional)</label>
            <input
              type="text"
              value={form.logo_url}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
              placeholder="/CALIIOHMZ.png"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="px-5 py-2.5 text-zinc-400 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.name}
              className="px-6 py-2.5 bg-[var(--pink)] text-white rounded-xl text-xs font-bold hover:bg-[var(--pink-dark)] disabled:opacity-50"
            >
              Create Category
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
