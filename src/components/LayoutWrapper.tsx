'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components';
import ClientWrapper from './ClientWrapper';
import FloatingContact from './FloatingContact';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdminRoute = pathname?.startsWith('/admin');
  const isHome = pathname === '/';

  // Prevent hydration mismatch by rendering a minimal shell until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-[#030008]">{children}</div>;
  }

  // Admin routes get their own layout without public navbar/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Public routes get the standard layout.
  // Home hero is full-bleed behind the floating navbar; inner pages get
  // extra top padding so the floating pill clears their page titles.
  return (
    <ClientWrapper>
      {/* Fixed light-leak backdrop shared across all public pages */}
      <div className="light-leak-bg" aria-hidden="true" />
      <Navbar />
      <main className={`flex-grow ${isHome ? '' : 'pt-24'}`}>{children}</main>
      <Footer />
      <FloatingContact />
    </ClientWrapper>
  );
}
