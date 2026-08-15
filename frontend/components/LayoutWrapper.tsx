'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen bg-zinc-950 text-white">{children}</main>;
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <AnnouncementBar />
      {/* Main Header */}
      <Header />
      {/* Sticky Navigation Bar */}
      <Navbar />
      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Page Body */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </>
  );
}
