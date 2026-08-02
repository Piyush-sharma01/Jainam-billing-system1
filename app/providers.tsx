'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/context/AuthContext';
import { DataProvider } from '@/lib/context/DataContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </AuthProvider>
  );
}
