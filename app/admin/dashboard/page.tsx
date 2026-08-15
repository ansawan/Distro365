'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products?status=active&limit=1'),
          fetch('/api/orders?limit=5'),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        const orders = ordersData.orders || [];
        const pendingOrders = orders.filter((o: Record<string, unknown>) => o.status === 'pending');

        setStats({
          totalProducts: productsData.total || 0,
          totalOrders: ordersData.total || 0,
          pendingOrders: pendingOrders.length,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch {
        //
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: 'Total Catalog Products',
      value: stats.totalProducts,
      icon: '📦',
      gradient: 'from-pink-600/20 to-purple-600/20 border-pink-500/20',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: '🛒',
      gradient: 'from-blue-600/20 to-cyan-600/20 border-blue-500/20',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '⏳',
      gradient: 'from-amber-600/20 to-orange-600/20 border-amber-500/20',
    },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-violet-500/20 text-violet-400',
    delivered: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-zinc-500">Welcome to your Distro365 Admin Portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`p-6 rounded-2xl bg-gradient-to-br ${card.gradient} border backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {isLoading ? '—' : card.value}
            </p>
            <p className="text-sm text-zinc-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-[var(--pink)] hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-zinc-500">Loading orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">No orders received yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead>
                <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800 bg-zinc-950/40">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {recentOrders.map((order) => (
                  <tr key={String(order.id)} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{String(order.customer_name)}</td>
                    <td className="px-6 py-4 text-zinc-400">{String(order.phone)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[String(order.status)] || 'bg-zinc-700 text-zinc-300'}`}>
                        {String(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {order.created_at ? new Date(String(order.created_at)).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
