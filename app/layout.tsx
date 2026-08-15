import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/frontend/components/CartContext';
import { ToastProvider } from '@/frontend/components/Toast';
import LayoutWrapper from '@/frontend/components/LayoutWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Distro365 — Premium Vape & Kratom Distribution',
  description:
    'Distro365 - Premium Distribution. Reliable Performance. Trusted Quality. Discover top brands like Caliiohmz, Powerohmz, The Cactus Labs, Whip Trip and Omnia.',
  keywords: ['vape', 'kratom', 'disposable vape', 'Caliiohmz', 'Powerohmz', 'Cactus Labs', 'Whip Trip', 'wholesale vape'],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-gray-900 min-h-screen flex flex-col antialiased">
        <CartProvider>
          <ToastProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
