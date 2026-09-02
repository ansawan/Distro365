'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/frontend/components/Modal';
import ImageUploader from '@/frontend/components/ImageUploader';
import { Product, ProductVariant, Category, ProductAttribute } from '@/backend/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modal states for creating Category & Brand inline
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatParentId, setNewCatParentId] = useState('');
  const [isSavingCat, setIsSavingCat] = useState(false);

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [isSavingBrand, setIsSavingBrand] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    handle: '',
    body_html: '',
    price: '0',
    compare_at_price: '',
    vendor: '', // Brand
    category: '', // Primary Category
    categories: [] as string[], // Multiple categories
    product_type: 'simple' as 'simple' | 'variable',
    status: 'active',
    main_image: '',
  });

  // Attributes & Variations state
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeValues, setNewAttributeValues] = useState('');

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  // Manual new variant state
  const [newVariant, setNewVariant] = useState({
    option_name: 'Flavor',
    option_value: '',
    sku: '',
    price: '',
    compare_at_price: '',
    inventory_qty: '10',
    image_src: '',
    barcode: '',
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?status=all&limit=100');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }

  async function fetchBrands() {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      setBrands(data.brands || ['Caliiohmz', 'Powerohmz', 'The Cactus Labs', 'Bad Duck', 'Whip Trip', 'Omnia']);
    } catch (err) {
      setBrands(['Caliiohmz', 'Powerohmz', 'The Cactus Labs', 'Bad Duck', 'Whip Trip', 'Omnia']);
    }
  }

  async function fetchVariantsForProduct(handle: string) {
    setIsLoadingVariants(true);
    try {
      const res = await fetch(`/api/variants?product_handle=${encodeURIComponent(handle)}`);
      const data = await res.json();
      setVariants(data.variants || []);
    } catch (err) {
      console.error('Failed to fetch variants:', err);
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
      compare_at_price: '',
      vendor: '',
      category: '',
      categories: [],
      product_type: 'simple',
      status: 'active',
      main_image: '',
    });
    setEditingProduct(null);
    setAttributes([]);
    setVariants([]);
    setNewAttributeName('');
    setNewAttributeValues('');
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
      price: String(product.price || 0),
      compare_at_price: product.compare_at_price ? String(product.compare_at_price) : '',
      vendor: product.vendor || '',
      category: product.category || '',
      categories: product.categories || (product.category ? [product.category] : []),
      product_type: (product.product_type as 'simple' | 'variable') || 'simple',
      status: product.status || 'active',
      main_image: product.main_image || '',
    });
    setAttributes(product.attributes || []);
    setIsModalOpen(true);

    if (product.product_type === 'variable' || (product.variants && product.variants.length > 0)) {
      fetchVariantsForProduct(product.handle);
    }
  };

  // ── INLINE CATEGORY CREATION ──
  const handleCreateCategoryInline = async () => {
    if (!newCatName.trim()) return;
    setIsSavingCat(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          parent_id: newCatParentId || null,
        }),
      });
      const data = await res.json();
      if (data.category) {
        setCategories((prev) => [...prev, data.category]);
        setForm((prev) => ({
          ...prev,
          category: data.category.name,
          categories: Array.from(new Set([...prev.categories, data.category.name])),
        }));
      }
      setIsCategoryModalOpen(false);
      setNewCatName('');
      setNewCatParentId('');
    } catch (err) {
      console.error('Failed to create inline category:', err);
    } finally {
      setIsSavingCat(false);
    }
  };

  // ── INLINE BRAND CREATION ──
  const handleCreateBrandInline = async () => {
    if (!newBrandName.trim()) return;
    setIsSavingBrand(true);
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName.trim() }),
      });
      const data = await res.json();
      const createdBrand = data.brand?.name || newBrandName.trim();
      setBrands((prev) => Array.from(new Set([...prev, createdBrand])));
      setForm((prev) => ({ ...prev, vendor: createdBrand }));
      setIsBrandModalOpen(false);
      setNewBrandName('');
    } catch (err) {
      console.error('Failed to create inline brand:', err);
    } finally {
      setIsSavingBrand(false);
    }
  };

  // ── SAVE PRODUCT ──
  const handleSaveProduct = async () => {
    if (!form.title.trim()) {
      alert('Product Title is required.');
      return;
    }

    try {
      const productHandle = form.handle || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        title: form.title,
        handle: productHandle,
        body_html: form.body_html || null,
        price: parseFloat(form.price) || 0,
        compare_at_price: parseFloat(form.compare_at_price) || null,
        vendor: form.vendor || null,
        brand: form.vendor || null,
        category: form.category || (form.categories.length > 0 ? form.categories[0] : null),
        categories: form.categories,
        product_type: form.product_type,
        status: form.status,
        main_image: form.main_image || null,
        attributes,
      };

      let savedProduct: Product | null = null;

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.product) {
          savedProduct = data.product;
        } else {
          alert(`Failed to update product: ${data.error || 'Unknown error'}`);
          return;
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.product) {
          savedProduct = data.product;
        } else {
          alert(`Failed to create product: ${data.error || 'Unknown error'}`);
          return;
        }
      }

      // Save memory variations if created locally
      if (savedProduct && form.product_type === 'variable' && variants.length > 0) {
        for (const v of variants) {
          if (!v.id || v.id.startsWith('temp-')) {
            await fetch('/api/variants', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                product_handle: savedProduct.handle,
                sku: v.sku,
                option_name: v.option_name || 'Option',
                option_value: v.option_value,
                attributes: v.attributes || {},
                price: v.price,
                inventory_qty: v.inventory_qty,
                image_src: v.image_src,
                barcode: v.barcode,
                is_active: v.is_active,
              }),
            });
          }
        }
      }

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  // ── DELETE PRODUCT ──
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // ── DUPLICATE PRODUCT ──
  const handleDuplicateProduct = async (product: Product) => {
    try {
      const duplicateTitle = `${product.title} - Copy`;
      const duplicateHandle = `${product.handle}-copy-${Date.now().toString(36).slice(-4)}`;

      // 1. Fetch original product variants
      let origVariants: ProductVariant[] = [];
      try {
        const vRes = await fetch(`/api/variants?product_handle=${encodeURIComponent(product.handle)}`);
        const vData = await vRes.json();
        origVariants = vData.variants || [];
      } catch {
        //
      }

      // 2. Create duplicated main product
      const productPayload = {
        title: duplicateTitle,
        handle: duplicateHandle,
        body_html: product.body_html || null,
        vendor: product.vendor || null,
        category: product.category || null,
        categories: product.categories || [],
        price: product.price || 0,
        compare_at_price: product.compare_at_price || null,
        product_type: product.product_type || 'simple',
        status: 'draft', // Set to draft so admin can review
        main_image: product.main_image || null,
        attributes: product.attributes || [],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });
      const data = await res.json();

      if (res.ok && data.product) {
        const newProd = data.product;
        // 3. Duplicate variants if variable product
        if (origVariants.length > 0) {
          for (const v of origVariants) {
            await fetch('/api/variants', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                product_handle: newProd.handle,
                sku: v.sku ? `${v.sku}-COPY` : null,
                option_name: v.option_name || 'Option',
                option_value: v.option_value,
                attributes: v.attributes || {},
                price: v.price,
                compare_at_price: v.compare_at_price,
                inventory_qty: v.inventory_qty,
                image_src: v.image_src,
                barcode: v.barcode,
                is_active: v.is_active ?? true,
              }),
            });
          }
        }
        alert(`Successfully duplicated "${product.title}" as "${duplicateTitle}" (Draft)!`);
        fetchProducts();
      } else {
        alert(`Failed to duplicate product: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to duplicate product:', err);
    }
  };

  // ── ATTRIBUTE BUILDER & VARIATION GENERATOR ──
  const handleAddAttribute = () => {
    if (!newAttributeName.trim()) {
      alert('Please enter an attribute name (e.g. Size, Color, Flavor).');
      return;
    }
    if (!newAttributeValues.trim()) {
      alert('Please enter attribute values separated by commas (e.g. S, M, L, XL).');
      return;
    }

    const values = newAttributeValues
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    if (values.length === 0) return;

    setAttributes((prev) => [
      ...prev.filter((a) => a.name.toLowerCase() !== newAttributeName.trim().toLowerCase()),
      { name: newAttributeName.trim(), values },
    ]);
    setNewAttributeName('');
    setNewAttributeValues('');
  };

  const handleRemoveAttribute = (name: string) => {
    setAttributes((prev) => prev.filter((a) => a.name !== name));
  };

  const handleGenerateVariations = () => {
    if (attributes.length === 0) {
      alert('Please add at least one attribute with values first.');
      return;
    }

    // Compute Cartesian Product of attribute values
    const cartesian = (arr: ProductAttribute[]): Record<string, string>[] => {
      return arr.reduce<Record<string, string>[]>(
        (acc, attr) => {
          return acc.flatMap((accItem) =>
            attr.values.map((val) => ({
              ...accItem,
              [attr.name]: val,
            }))
          );
        },
        [{}]
      );
    };

    const combinations = cartesian(attributes);
    const basePrice = parseFloat(form.price) || 0;
    const baseHandle = form.handle || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const generated: ProductVariant[] = combinations.map((comb, index) => {
      const optionName = Object.keys(comb).join(' / ');
      const optionValue = Object.values(comb).join(' / ');
      const skuParts = Object.values(comb)
        .map((v) => v.toUpperCase().replace(/\s+/g, ''))
        .join('-');

      return {
        id: `temp-${Date.now()}-${index}`,
        product_handle: baseHandle,
        sku: `${baseHandle.toUpperCase()}-${skuParts}`,
        option_name: optionName,
        option_value: optionValue,
        attributes: comb,
        price: basePrice,
        inventory_qty: 10,
        image_src: form.main_image || null,
        is_active: true,
      };
    });

    setVariants(generated);
    alert(`Generated ${generated.length} variations! Click "Save Product Details" to persist.`);
  };

  // ── VARIANT CRUD ──
  const handleAddManualVariant = async () => {
    if (!newVariant.option_value.trim()) {
      alert('Please enter a variant value (e.g. Red, XL, Mango Ice).');
      return;
    }

    const baseHandle = form.handle || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const varPayload = {
      product_handle: editingProduct ? editingProduct.handle : baseHandle,
      option_name: newVariant.option_name || 'Option',
      option_value: newVariant.option_value.trim(),
      sku: newVariant.sku.trim() || `${baseHandle.toUpperCase()}-${newVariant.option_value.trim().toUpperCase().replace(/\s+/g, '')}`,
      price: parseFloat(newVariant.price) || parseFloat(form.price) || 0,
      compare_at_price: parseFloat(newVariant.compare_at_price) || null,
      inventory_qty: parseInt(newVariant.inventory_qty, 10) || 10,
      image_src: newVariant.image_src || form.main_image || null,
      barcode: newVariant.barcode.trim() || null,
      is_active: newVariant.is_active,
    };

    if (editingProduct) {
      try {
        const res = await fetch('/api/variants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(varPayload),
        });
        const data = await res.json();
        if (data.variant) {
          setVariants((prev) => [...prev, data.variant]);
        }
      } catch (err) {
        console.error('Failed to add variant:', err);
      }
    } else {
      setVariants((prev) => [...prev, { ...varPayload, id: `temp-${Date.now()}` }]);
    }

    setNewVariant({
      option_name: 'Flavor',
      option_value: '',
      sku: '',
      price: '',
      compare_at_price: '',
      inventory_qty: '10',
      image_src: '',
      barcode: '',
      is_active: true,
    });
  };

  const handleUpdateVariant = async (variantId: string, updatedFields: Partial<ProductVariant>) => {
    if (variantId.startsWith('temp-')) {
      setVariants((prev) => prev.map((v) => (v.id === variantId ? { ...v, ...updatedFields } : v)));
      setEditingVariantId(null);
      return;
    }

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
    if (!confirm('Are you sure you want to delete this variation?')) return;

    if (variantId.startsWith('temp-')) {
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      return;
    }

    try {
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      await fetch(`/api/variants/${variantId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete variant:', err);
    }
  };

  // Build Indented Category List for Hierarchy
  const renderCategoryOptions = () => {
    const mainCats = categories.filter((c) => !c.parent_id);
    const subCats = categories.filter((c) => Boolean(c.parent_id));

    return (
      <>
        {mainCats.map((parent) => {
          const children = subCats.filter((child) => child.parent_id === parent.id || child.parent_id === parent.slug);
          return (
            <React.Fragment key={parent.id || parent.slug}>
              <option value={parent.name} className="font-bold">
                {parent.name}
              </option>
              {children.map((child) => (
                <option key={child.id || child.slug} value={child.name} className="pl-4 text-zinc-400">
                  &nbsp;&nbsp;↳ {child.name}
                </option>
              ))}
            </React.Fragment>
          );
        })}
        {/* Orphans or flat categories if any */}
        {categories
          .filter((c) => c.parent_id && !categories.some((p) => p.id === c.parent_id || p.slug === c.parent_id))
          .map((orphan) => (
            <option key={orphan.id || orphan.slug} value={orphan.name}>
              {orphan.name}
            </option>
          ))}
      </>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
          <p className="text-zinc-400 text-sm mt-0.5">Manage simple & variable products, attributes, and variations</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-[var(--pink)] hover:bg-[var(--pink-dark)] text-white rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
          id="add-product-btn"
        >
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Catalog Table */}
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
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Category</th>
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
                        {product.vendor || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(product.categories && product.categories.length > 0
                          ? product.categories
                          : [product.category]
                        ).filter(Boolean).map((c) => (
                          <span key={c} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {c}
                          </span>
                        ))}
                        {(!product.categories || product.categories.length === 0) && !product.category && (
                          <span className="text-zinc-600 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        product.product_type === 'variable'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {product.product_type || 'simple'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {product.price > 0 ? `$${Number(product.price).toFixed(2)}` : 'Price on request'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
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
                          onClick={() => handleDuplicateProduct(product)}
                          className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          title="Duplicate Product"
                        >
                          📋 Duplicate
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

      {/* Main Product Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingProduct ? `Edit Product — ${editingProduct.title}` : 'Add New Product'}
        maxWidth="max-w-5xl"
      >
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
          {/* Section 1: Basic Information */}
          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[var(--pink)]">
              Product Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, handle: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
                  placeholder="e.g. Nike Air Max"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">URL Slug (Handle)</label>
                <input
                  type="text"
                  value={form.handle}
                  onChange={(e) => setForm({ ...form, handle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono focus:outline-none focus:border-[var(--pink)]"
                  placeholder="nike-air-max"
                />
              </div>
            </div>

            {/* Brand & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* BRAND SELECTION & INLINE CREATION */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Brand</label>
                  <button
                    type="button"
                    onClick={() => setIsBrandModalOpen(true)}
                    className="text-[11px] font-bold text-[var(--pink)] hover:underline cursor-pointer"
                  >
                    + Create New Brand
                  </button>
                </div>
                <select
                  value={form.vendor}
                  onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)] cursor-pointer"
                >
                  <option value="">Select Brand...</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* CATEGORY SELECTION & INLINE CREATION (MULTIPLE CATEGORIES SUPPORT) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Categories {form.categories.length > 0 ? `(${form.categories.length})` : ''}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-[11px] font-bold text-[var(--pink)] hover:underline cursor-pointer"
                  >
                    + Create New Category
                  </button>
                </div>

                {/* Selected Multi-Category Badges */}
                {form.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {form.categories.map((catName) => (
                      <span
                        key={catName}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800 border border-zinc-700 text-white rounded-full text-xs font-bold"
                      >
                        {catName}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = form.categories.filter((c) => c !== catName);
                            setForm({
                              ...form,
                              categories: updated,
                              category: updated[0] || '',
                            });
                          }}
                          className="text-zinc-400 hover:text-red-400 font-bold text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <select
                  value=""
                  onChange={(e) => {
                    const catVal = e.target.value;
                    if (!catVal) return;
                    const updated = Array.from(new Set([...form.categories, catVal]));
                    setForm({
                      ...form,
                      category: updated[0] || '',
                      categories: updated,
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)] cursor-pointer"
                >
                  <option value="">+ Add category to product (Parent / Child)...</option>
                  {renderCategoryOptions()}
                </select>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Select parent & child categories to assign a product to multiple categories.
                </p>
              </div>
            </div>

            {/* Product Type & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Product Type</label>
                <select
                  value={form.product_type}
                  onChange={(e) => setForm({ ...form, product_type: e.target.value as 'simple' | 'variable' })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)] cursor-pointer"
                >
                  <option value="simple">Simple product (Standard)</option>
                  <option value="variable">Variable product (Attributes & Variations)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)] cursor-pointer"
                >
                  <option value="active">Active (Published)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[var(--pink)]">
              Pricing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Regular Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Sale Price / Compare Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.compare_at_price}
                  onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
                  placeholder="Optional sale price"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[var(--pink)]">
              Description
            </h2>
            <textarea
              rows={4}
              value={form.body_html}
              onChange={(e) => setForm({ ...form, body_html: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
              placeholder="Product overview, features, specifications..."
            />
          </div>

          {/* Section 4: Images */}
          <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[var(--pink)]">
              Main Product Image
            </h2>
            <input
              type="text"
              value={form.main_image}
              onChange={(e) => setForm({ ...form, main_image: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[var(--pink)] mb-2"
              placeholder="https://..."
            />
            <ImageUploader value={form.main_image} onUpload={(url) => setForm({ ...form, main_image: url })} />
          </div>

          {/* Section 5 & 6: ATTRIBUTES & VARIATIONS (Only for Variable Product) */}
          {form.product_type === 'variable' && (
            <div className="space-y-6 pt-4 border-t-2 border-purple-500/30">
              {/* ATTRIBUTES BUILDING SECTION */}
              <div className="bg-purple-950/30 p-5 rounded-2xl border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                      Product Attributes & Options
                    </h2>
                    <p className="text-xs text-purple-400/80 mt-0.5">
                      Define custom attributes (e.g. Size, Color, Flavor, Weight) and values (comma separated)
                    </p>
                  </div>
                  {attributes.length > 0 && (
                    <button
                      type="button"
                      onClick={handleGenerateVariations}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>⚡</span> Generate Variations
                    </button>
                  )}
                </div>

                {/* Add Attribute Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Attribute Name</label>
                    <input
                      type="text"
                      placeholder="Size, Color, Flavor, Weight..."
                      value={newAttributeName}
                      onChange={(e) => setNewAttributeName(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[var(--pink)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Values (comma separated)</label>
                    <input
                      type="text"
                      placeholder="S, M, L, XL or Black, White, Red"
                      value={newAttributeValues}
                      onChange={(e) => setNewAttributeValues(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-[var(--pink)]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      + Add Attribute
                    </button>
                  </div>
                </div>

                {/* Display Current Attributes List */}
                {attributes.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-zinc-400">Defined Attributes:</span>
                    <div className="flex flex-wrap gap-3">
                      {attributes.map((attr) => (
                        <div key={attr.name} className="px-3.5 py-2 bg-zinc-900 border border-purple-500/30 rounded-xl flex items-center gap-3">
                          <div>
                            <span className="text-xs font-bold text-purple-300">{attr.name}: </span>
                            <span className="text-xs text-zinc-300">{attr.values.join(', ')}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(attr.name)}
                            className="text-red-400 hover:text-red-300 text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* VARIATIONS MANAGEMENT TABLE SECTION */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Product Variations Matrix ({variants.length})
                    </h2>
                    <p className="text-xs text-zinc-400">Set SKU, price, sale price, stock, images, and active status for each variation</p>
                  </div>
                </div>

                {/* Add Single Manual Variation Row */}
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-[var(--pink)]">+</span> Add Manual Variation Row
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Option Name</label>
                      <input
                        type="text"
                        placeholder="Flavor, Color..."
                        value={newVariant.option_name}
                        onChange={(e) => setNewVariant({ ...newVariant, option_name: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Value *</label>
                      <input
                        type="text"
                        placeholder="e.g. Red / XL"
                        value={newVariant.option_value}
                        onChange={(e) => setNewVariant({ ...newVariant, option_value: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">SKU</label>
                      <input
                        type="text"
                        placeholder="SKU-123"
                        value={newVariant.sku}
                        onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Price ($)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={newVariant.price}
                        onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Stock</label>
                      <input
                        type="number"
                        placeholder="10"
                        value={newVariant.inventory_qty}
                        onChange={(e) => setNewVariant({ ...newVariant, inventory_qty: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddManualVariant}
                        className="w-full py-2 bg-[var(--pink)] hover:bg-[var(--pink-dark)] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        + Add Row
                      </button>
                    </div>
                  </div>
                </div>

                {/* Variations Table */}
                {isLoadingVariants ? (
                  <div className="p-6 text-center text-xs text-zinc-500">Loading variations...</div>
                ) : variants.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">No variations created yet. Use "Generate Variations" above or add manually.</div>
                ) : (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-zinc-300">
                        <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-500 uppercase tracking-wider">
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Variation</th>
                            <th className="px-4 py-3">SKU</th>
                            <th className="px-4 py-3">Price ($)</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {variants.map((v) => {
                            const isEditingThis = editingVariantId === v.id;
                            const isActive = v.is_active !== false;

                            return (
                              <tr key={v.id} className="hover:bg-zinc-800/50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden relative flex items-center justify-center">
                                    {v.image_src ? (
                                      <img src={v.image_src} alt="" className="w-full h-full object-contain p-0.5" />
                                    ) : (
                                      <span className="text-zinc-600 text-[10px]">—</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  {isEditingThis ? (
                                    <input
                                      type="text"
                                      defaultValue={v.option_value || ''}
                                      onBlur={(e) => handleUpdateVariant(v.id, { option_value: e.target.value })}
                                      className="px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-xs text-white w-full"
                                    />
                                  ) : (
                                    <div>
                                      <span className="font-bold text-white block">{v.option_value || 'Variation'}</span>
                                      <span className="text-[10px] text-zinc-500 uppercase">{v.option_name || 'Option'}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-mono text-zinc-400">
                                  {isEditingThis ? (
                                    <input
                                      type="text"
                                      defaultValue={v.sku || ''}
                                      onBlur={(e) => handleUpdateVariant(v.id, { sku: e.target.value })}
                                      className="px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-xs text-white w-full font-mono"
                                    />
                                  ) : (
                                    v.sku || '—'
                                  )}
                                </td>
                                <td className="px-4 py-3 font-bold text-white">
                                  {isEditingThis ? (
                                    <input
                                      type="number"
                                      step="0.01"
                                      defaultValue={v.price}
                                      onBlur={(e) => handleUpdateVariant(v.id, { price: parseFloat(e.target.value) || 0 })}
                                      className="px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-xs text-white w-20"
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
                                      className="px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-xs text-white w-16"
                                    />
                                  ) : (
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${v.inventory_qty > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                      {v.inventory_qty} in stock
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateVariant(v.id, { is_active: !isActive })}
                                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                                      isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                                    }`}
                                  >
                                    {isActive ? 'Active' : 'Disabled'}
                                  </button>
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
            </div>
          )}

          {/* Modal Footer Controls */}
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
        </div>
      </Modal>

      {/* Inline Category Creation Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create New Category"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Category Name *</label>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Chargers & Cables"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Parent Category (Optional)</label>
            <select
              value={newCatParentId}
              onChange={(e) => setNewCatParentId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none cursor-pointer"
            >
              <option value="">None (Top Level Category)</option>
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.id || c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-4 py-2 text-zinc-400 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateCategoryInline}
              disabled={isSavingCat || !newCatName.trim()}
              className="px-5 py-2 bg-[var(--pink)] text-white text-xs font-bold rounded-xl hover:bg-[var(--pink-dark)] disabled:opacity-50"
            >
              {isSavingCat ? 'Saving...' : 'Create & Select Category'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Inline Brand Creation Modal */}
      <Modal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        title="Create New Brand"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Brand Name *</label>
            <input
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="e.g. Nike, Apple, Caliiohmz"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-[var(--pink)]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsBrandModalOpen(false)}
              className="px-4 py-2 text-zinc-400 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateBrandInline}
              disabled={isSavingBrand || !newBrandName.trim()}
              className="px-5 py-2 bg-[var(--pink)] text-white text-xs font-bold rounded-xl hover:bg-[var(--pink-dark)] disabled:opacity-50"
            >
              {isSavingBrand ? 'Saving...' : 'Create & Select Brand'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
