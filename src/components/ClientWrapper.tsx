'use client';

import { ReactNode } from 'react';
import LoadingScreen from './LoadingScreen';
import PageTransition from './PageTransition';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <>
      <LoadingScreen />
      <PageTransition>
        {children}
      </PageTransition>
    </>
  );
}
