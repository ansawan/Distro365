'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/backend/lib/types';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  async function fetchOrders() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(orderId: string, status: OrderStatus) {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch {
      //
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders Management</h1>
          <p className="text-zinc-500">View and update customer COD orders</p>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-[var(--pink)]"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">No orders found</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {orders.map((order) => (
              <div key={order.id}>
                {/* Order Row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{order.customer_name}</p>
                    <p className="text-xs text-zinc-400">{order.phone}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateStatus(order.id, e.target.value as OrderStatus);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusColors[order.status]} bg-transparent focus:outline-none cursor-pointer`}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900 text-zinc-300">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-zinc-500 min-w-[90px] text-right">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'}
                  </div>
                  <svg
                    className={`w-4 h-4 text-zinc-500 transition-transform ${
                      expandedOrder === order.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="px-6 py-4 bg-zinc-950/60 border-t border-zinc-800/60 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-zinc-500 font-bold uppercase mb-1">Shipping Address</p>
                        <p className="text-zinc-300 font-medium">{order.address || 'No address specified'}</p>
                      </div>
                      {order.notes && (
                        <div>
                          <p className="text-zinc-500 font-bold uppercase mb-1">Order Notes</p>
                          <p className="text-zinc-300 font-medium">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div>
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-2">Order Items</p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center text-xs p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                            >
                              <div>
                                <span className="text-white font-semibold">{item.product_handle || 'Product'}</span>
                                {item.variant_id && (
                                  <span className="text-zinc-500 ml-2">Variant: {item.variant_id}</span>
                                )}
                              </div>
                              <div className="text-zinc-400 font-mono">
                                Qty: {item.qty} {item.unit_price ? `× $${Number(item.unit_price).toFixed(2)}` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
