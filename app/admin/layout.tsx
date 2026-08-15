'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/frontend/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login' || pathname?.startsWith('/admin/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
