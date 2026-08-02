'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </main>
  );
}
