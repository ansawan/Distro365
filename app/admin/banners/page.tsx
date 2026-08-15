'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/frontend/components/Modal';
import ImageUploader from '@/frontend/components/ImageUploader';
import { Banner } from '@/backend/lib/types';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    eyebrow: '',
    description: '',
    image_url: '',
    cta_text: '',
    cta_link: '',
    position: '0',
    active: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data.banners || []);
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    setForm({ title: '', eyebrow: '', description: '', image_url: '', cta_text: '', cta_link: '', position: '0', active: true });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({
      title: banner.title || '',
      eyebrow: banner.eyebrow || '',
      description: banner.description || '',
      image_url: banner.image_url,
      cta_text: banner.cta_text || '',
      cta_link: banner.cta_link || '',
      position: String(banner.position || 0),
      active: banner.active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: form.title || null,
        eyebrow: form.eyebrow || null,
        description: form.description || null,
        image_url: form.image_url,
        cta_text: form.cta_text || null,
        cta_link: form.cta_link || null,
        position: parseInt(form.position) || 0,
        active: form.active,
      };

      if (editingId) {
        await fetch(`/api/banners?id=${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      resetForm();
      fetchBanners();
    } catch {
      //
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner slide?')) return;
    try {
      await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
      fetchBanners();
    } catch {
      //
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Banners Management</h1>
          <p className="text-zinc-500">Manage homepage hero slides in Supabase</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-[var(--pink)] hover:bg-[var(--pink-dark)] text-white rounded-xl font-medium text-sm transition-all"
          id="add-banner-btn"
        >
          + Add Banner
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video rounded-2xl bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p>No banners added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900"
            >
              <div className="aspect-video bg-zinc-800 relative">
                <img
                  src={banner.image_url}
                  alt={banner.title || 'Banner'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[var(--pink)] font-bold uppercase">{banner.eyebrow || 'Eyebrow'}</p>
                <h3 className="text-sm font-bold text-white mt-0.5">{banner.title || 'Untitled'}</h3>
                <p className="text-xs text-zinc-500 mt-1">Position: {banner.position}</p>
              </div>

              {/* Overlay Actions */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(banner)}
                  className="p-2 bg-zinc-900/90 text-white rounded-lg hover:bg-zinc-800"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 bg-red-900/90 text-white rounded-lg hover:bg-red-800"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingId ? 'Edit Banner' : 'Add Banner'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Eyebrow</label>
            <input
              type="text"
              value={form.eyebrow}
              onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
              placeholder="New Arrival"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
              placeholder="Banner headline"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)] resize-none"
              placeholder="Short paragraph description"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Banner Image URL *</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
              placeholder="/SLIDEBANNER1.jpg"
            />
            <div className="mt-2">
              <ImageUploader onUpload={(url) => setForm({ ...form, image_url: url })} bucket="banners" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">CTA Link</label>
              <input
                type="text"
                value={form.cta_link}
                onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
                placeholder="/shop"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Position</label>
              <input
                type="number"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
              />
            </div>
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
              disabled={!form.image_url}
              className="px-6 py-2.5 bg-[var(--pink)] text-white rounded-xl text-xs font-bold hover:bg-[var(--pink-dark)] disabled:opacity-50"
            >
              {editingId ? 'Update Banner' : 'Create Banner'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
