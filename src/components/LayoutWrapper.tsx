'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { Navbar, Footer } from '@/components';
import ClientWrapper from './ClientWrapper';

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

  // Prevent hydration mismatch by rendering a minimal shell until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  // Admin routes get their own layout without public navbar/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Public routes get the standard layout
  return (
    <ClientWrapper>
      <Navbar />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </ClientWrapper>
  );
}
