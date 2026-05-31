'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  // Handle scroll and visibility on navigation
  useEffect(() => {
    // Force visibility
    setIsVisible(true);
    
    const hash = window.location.hash;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo(0, 0);
      }
      
      // Force repaint on mobile
      document.body.style.opacity = '0.99';
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div 
      className={`transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}
