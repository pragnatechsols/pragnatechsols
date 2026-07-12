'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#4f2e88',
          color: '#f3eefb',
          border: '1px solid #5e3a9e',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#4f2e88',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#4f2e88',
          },
        },
      }}
    />
  );
}
