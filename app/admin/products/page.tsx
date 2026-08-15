'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/frontend/components/Modal';
import ImageUploader from '@/frontend/components/ImageUploader';
import { Product, ProductVariant, Category } from '@/backend/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category creation state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Form state matching schema
  const [form, setForm] = useState({
    title: '',
    handle: '',
    body_html: '',
    price: '',
    vendor: '',
    category: '',
    product_type: 'simple',
    status: 'active',
    main_image: '',
  });

  // Variants state for variable products
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  
  // New variant state
  const [newVariant, setNewVariant] = useState({
    option_name: 'Flavor',
    option_value: '',
    sku: '',
    price: '',
    inventory_qty: '10',
    image_src: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?status=all&limit=100');
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      //
    }
  }

  async function fetchVariantsForProduct(handle: string) {
    setIsLoadingVariants(true);
    try {
      const res = await fetch(`/api/variants?product_handle=${encodeURIComponent(handle)}`);
      const data = await res.json();
      setVariants(data.variants || []);
    } catch {
      //
    } finally {
      setIsLoadingVariants(false);
    }
  }

  const resetForm = () => {
    setForm({
      title: '',
      handle: '',
      body_html: '',
      price: '0',
      vendor: '',
      category: '',
      product_type: 'simple',
      status: 'active',
      main_image: '',
    });
    setEditingProduct(null);
    setVariants([]);
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      handle: product.handle,
      body_html: product.body_html || '',
      price: String(product.price),
      vendor: product.vendor || '',
      category: product.category || product.vendor || '',
      product_type: product.product_type || 'simple',
      status: product.status || 'active',
      main_image: product.main_image || '',
    });
    setIsModalOpen(true);

    if (product.product_type === 'variable' || (product.variants && product.variants.length > 0)) {
      fetchVariantsForProduct(product.handle);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const payload = {
        title: form.title,
        handle: form.handle || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        body_html: form.body_html || null,
        price: parseFloat(form.price) || 0,
        vendor: form.vendor || form.category || null,
        category: form.category || form.vendor || null,
        product_type: form.product_type,
        status: form.status,
        main_image: form.main_image || null,
      };

      let updatedRow: Product | null = null;

      if (editingProduct) {
        console.log('[Admin Product Form] [UPDATE] Submitting payload for product ID:', editingProduct.id, payload);
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log('[Admin Product Form] [UPDATE] Server HTTP status:', res.status, 'Response data:', data);

        if (res.ok && data.product) {
          updatedRow = data.product;
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id || p.handle === editingProduct.handle ? { ...p, ...data.product } : p))
          );
        } else {
          console.error('[Admin Product Form] [UPDATE] Failed to update product:', data.error || data);
          alert(`Failed to update product: ${data.error || 'Unknown error'}`);
          return;
        }
      } else {
        console.log('[Admin Product Form] [INSERT] Submitting payload for new product:', payload);
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log('[Admin Product Form] [INSERT] Server HTTP status:', res.status, 'Response data:', data);

        if (res.ok && data.product) {
          updatedRow = data.product;
          setProducts((prev) => [data.product, ...prev]);
        } else {
          console.error('[Admin Product Form] [INSERT] Failed to create product:', data.error || data);
          alert(`Failed to create product: ${data.error || 'Unknown error'}`);
          return;
        }
      }

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('[Admin Product Form] Save product failed:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch {
      //
    }
  };

  const handleAddCategorySubmit = async () => {
    if (!newCategoryName.trim()) return;
    setIsSavingCategory(true);
    try {
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim(), slug }),
      });
      const data = await res.json();
      if (data.category) {
        setCategories((prev) => [...prev, data.category]);
        setForm((prev) => ({ ...prev, category: data.category.name, vendor: data.category.name }));
      } else {
        setForm((prev) => ({ ...prev, category: newCategoryName.trim(), vendor: newCategoryName.trim() }));
      }
      setIsAddingCategory(false);
      setNewCategoryName('');
    } catch {
      setForm((prev) => ({ ...prev, category: newCategoryName.trim(), vendor: newCategoryName.trim() }));
      setIsAddingCategory(false);
    } finally {
      setIsSavingCategory(false);
    }
  };

  /* ── VARIANT CRUD ── */
  const handleAddVariant = async () => {
    if (!editingProduct) {
      alert('Please save the product details first before adding variants.');
      return;
    }
    if (!newVariant.option_value.trim()) {
      alert('Please enter a variant option value (e.g. Flavor name).');
      return;
    }

    try {
      const payload = {
        product_handle: editingProduct.handle,
        product_id: editingProduct.id,
        option_name: newVariant.option_name || 'Flavor',
        option_value: newVariant.option_value.trim(),
        sku: newVariant.sku.trim() || null,
        price: parseFloat(newVariant.price) || parseFloat(form.price) || 0,
        inventory_qty: parseInt(newVariant.inventory_qty, 10) || 10,
        image_src: newVariant.image_src || null,
      };

      const res = await fetch('/api/variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.variant) {
        setVariants((prev) => [...prev, data.variant]);
        setNewVariant({
          option_name: 'Flavor',
          option_value: '',
          sku: '',
          price: '',
          inventory_qty: '10',
          image_src: '',
        });
      }
    } catch (err) {
      console.error('Failed to add variant:', err);
    }
  };

  const handleUpdateVariant = async (variantId: string, updatedFields: Partial<ProductVariant>) => {
    try {
      const res = await fetch(`/api/variants/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      const data = await res.json();
      if (data.variant) {
        setVariants((prev) => prev.map((v) => (v.id === variantId ? data.variant : v)));
      }
      setEditingVariantId(null);
    } catch (err) {
      console.error('Failed to update variant:', err);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    try {
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      await fetch(`/api/variants/${variantId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete variant:', err);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
          <p className="text-zinc-400 text-sm mt-0.5">Manage real products, categories, and variants in Supabase</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-[var(--pink)] hover:bg-[var(--pink-dark)] text-white rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
          id="add-product-btn"
        >
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {isLoading && products.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">Loading catalog from Supabase...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">No products found. Click "+ Add Product" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead>
                <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800 bg-zinc-950/60">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Brand / Category</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0 overflow-hidden relative flex items-center justify-center">
                          {product.main_image ? (
                            <img src={product.main_image} alt="" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-zinc-600 text-xs font-bold">—</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-snug">{product.title}</p>
                          <p className="text-xs text-zinc-500 font-mono mt-0.5">{product.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">
                        {product.vendor || product.category || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        product.product_type === 'variable'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {product.product_type || 'simple'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {product.price > 0 ? `$${product.price.toFixed(2)}` : 'Price on request'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingProduct ? `Edit Product — ${editingProduct.title}` : 'Add New Product'}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
          {/* Main Product Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, handle: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
                placeholder="e.g. Caliiohmz 2G Disposable"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">URL Slug (Handle)</label>
              <input
                type="text"
                value={form.handle}
                onChange={(e) => setForm({ ...form, handle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none focus:border-[var(--pink)]"
                placeholder="caliiohmz-2g-disposable"
              />
            </div>
          </div>

          {/* Category Dropdown + Add New Inline (Task 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Brand / Category
              </label>
              {!isAddingCategory ? (
                <select
                  value={form.category}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__ADD_NEW__') {
                      setIsAddingCategory(true);
                    } else {
                      setForm({ ...form, category: val, vendor: val });
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)] cursor-pointer"
                >
                  <option value="">Select Category / Brand...</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat.slug} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  {/* Fallbacks if categories table is short */}
                  {!categories.some((c) => c.name === 'Caliiohmz') && <option value="Caliiohmz">Caliiohmz</option>}
                  {!categories.some((c) => c.name === 'Powerohmz') && <option value="Powerohmz">Powerohmz</option>}
                  {!categories.some((c) => c.name === 'The Cactus Labs') && <option value="The Cactus Labs">The Cactus Labs</option>}
                  {!categories.some((c) => c.name === 'Bad Duck') && <option value="Bad Duck">Bad Duck</option>}
                  {!categories.some((c) => c.name === 'Whip Trip') && <option value="Whip Trip">Whip Trip</option>}
                  {!categories.some((c) => c.name === 'Omnia') && <option value="Omnia">Omnia</option>}
                  <option value="__ADD_NEW__" className="text-[var(--pink)] font-bold">
                    + Add new category
                  </option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-[var(--pink)] text-white text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategorySubmit}
                    disabled={isSavingCategory}
                    className="px-4 py-2.5 bg-[var(--pink)] text-white font-bold text-xs rounded-xl hover:bg-[var(--pink-dark)]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-3 py-2.5 bg-zinc-800 text-zinc-400 font-bold text-xs rounded-xl hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Base Price ($)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Product Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Product Type</label>
              <select
                value={form.product_type}
                onChange={(e) => setForm({ ...form, product_type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)] cursor-pointer"
              >
                <option value="simple">Simple product (No variants)</option>
                <option value="variable">Variable product (Multiple flavors/sizes)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)] cursor-pointer"
              >
                <option value="active">Active (Visible on shop)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Description / Body HTML</label>
            <textarea
              rows={4}
              value={form.body_html}
              onChange={(e) => setForm({ ...form, body_html: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
              placeholder="Product features, strain details, and description..."
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Main Product Image</label>
            <input
              type="text"
              value={form.main_image}
              onChange={(e) => setForm({ ...form, main_image: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)] mb-2"
              placeholder="https://..."
            />
            <ImageUploader value={form.main_image} onUpload={(url) => setForm({ ...form, main_image: url })} />
          </div>

          {/* Save Product Details Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="px-5 py-2.5 text-zinc-400 hover:text-white text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProduct}
              className="px-6 py-2.5 bg-[var(--pink)] text-white rounded-xl text-xs font-bold hover:bg-[var(--pink-dark)] shadow-lg cursor-pointer"
            >
              {editingProduct ? 'Save Product Details' : 'Create Product'}
            </button>
          </div>

          {/* VARIANT MANAGEMENT SECTION */}
          {(form.product_type === 'variable' || (editingProduct && variants.length > 0)) && (
            <div className="mt-8 pt-6 border-t-2 border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-white">Product Variants</h3>
                  <p className="text-xs text-zinc-400">Manage flavor, color, size options, prices, stock, and variant-specific images</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  {variants.length} Variants
                </span>
              </div>

              {/* Add New Variant Box */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3 mb-6">
                <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-[var(--pink)]">+</span> Add New Variant
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Option Type</label>
                    <select
                      value={newVariant.option_name}
                      onChange={(e) => setNewVariant({ ...newVariant, option_name: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--pink)]"
                    >
                      <option value="Flavor">Flavor</option>
                      <option value="Color">Color</option>
                      <option value="Size / ML">Size / ML</option>
                      <option value="Option">Option</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Value (e.g. Blue Razz)*</label>
                    <input
                      type="text"
                      placeholder="e.g. Mango Ice"
                      value={newVariant.option_value}
                      onChange={(e) => setNewVariant({ ...newVariant, option_value: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--pink)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">SKU</label>
                    <input
                      type="text"
                      placeholder="SKU-123"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[var(--pink)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Price ($)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--pink)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Stock Qty</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={newVariant.inventory_qty}
                      onChange={(e) => setNewVariant({ ...newVariant, inventory_qty: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[var(--pink)]"
                    />
                  </div>
                </div>

                {/* Variant Image Upload Component */}
                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Variant Image</label>
                  <ImageUploader
                    value={newVariant.image_src}
                    onUpload={(url) => setNewVariant({ ...newVariant, image_src: url })}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-6 py-2.5 bg-[var(--pink)] text-white text-xs font-bold rounded-xl hover:bg-[var(--pink-dark)] shrink-0 cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <span>+</span> Add Variant Row
                  </button>
                </div>
              </div>

              {/* Variants Table */}
              {isLoadingVariants ? (
                <div className="p-6 text-center text-xs text-zinc-500">Loading variants...</div>
              ) : variants.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">No variants created yet for this product.</div>
              ) : (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-900 text-zinc-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Image</th>
                          <th className="px-4 py-3">Option</th>
                          <th className="px-4 py-3">SKU</th>
                          <th className="px-4 py-3">Price ($)</th>
                          <th className="px-4 py-3">Stock</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {variants.map((v) => {
                          const isEditingThis = editingVariantId === v.id;
                          return (
                            <tr key={v.id} className="hover:bg-zinc-900/50">
                              <td className="px-4 py-3">
                                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden relative flex items-center justify-center">
                                  {v.image_src ? (
                                    <img src={v.image_src} alt="" className="w-full h-full object-contain p-0.5" />
                                  ) : (
                                    <span className="text-zinc-600 text-[10px]">—</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {isEditingThis ? (
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-zinc-500 uppercase">{v.option_name || 'Flavor'}</span>
                                    <input
                                      type="text"
                                      defaultValue={v.option_value || ''}
                                      onBlur={(e) => handleUpdateVariant(v.id, { option_value: e.target.value })}
                                      className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white w-full"
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <span className="font-bold text-white block">{v.option_value || 'Variant'}</span>
                                    <span className="text-[10px] text-zinc-500 uppercase">{v.option_name || 'Flavor'}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 font-mono text-zinc-400">
                                {isEditingThis ? (
                                  <input
                                    type="text"
                                    defaultValue={v.sku || ''}
                                    onBlur={(e) => handleUpdateVariant(v.id, { sku: e.target.value })}
                                    className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white w-full font-mono"
                                  />
                                ) : (
                                  v.sku || '—'
                                )}
                              </td>
                              <td className="px-4 py-3 font-bold text-white">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    defaultValue={v.price}
                                    onBlur={(e) => handleUpdateVariant(v.id, { price: parseFloat(e.target.value) || 0 })}
                                    className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white w-20"
                                  />
                                ) : (
                                  `$${Number(v.price).toFixed(2)}`
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    defaultValue={v.inventory_qty}
                                    onBlur={(e) => handleUpdateVariant(v.id, { inventory_qty: parseInt(e.target.value, 10) || 0 })}
                                    className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white w-16"
                                  />
                                ) : (
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${v.inventory_qty > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {v.inventory_qty} in stock
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingVariantId(isEditingThis ? null : v.id)}
                                    className="px-2.5 py-1 bg-zinc-800 text-zinc-300 hover:text-white rounded text-[11px] font-bold cursor-pointer"
                                  >
                                    {isEditingThis ? 'Done' : 'Edit'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteVariant(v.id)}
                                    className="px-2.5 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded text-[11px] font-bold cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
