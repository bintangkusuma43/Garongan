'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      <main className={`flex-grow flex flex-col ${isHome ? 'pt-0' : 'pt-24'}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
