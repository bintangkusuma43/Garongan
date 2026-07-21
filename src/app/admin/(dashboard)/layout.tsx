'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Leaf, 
  LayoutDashboard, 
  Calendar, 
  Compass, 
  MapPin, 
  User, 
  LogOut, 
  Menu, 
  X,
  Globe,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/kegiatan', label: 'Data Kegiatan', icon: Calendar },
  { href: '/admin/potensi', label: 'Data Potensi', icon: Compass },
  { href: '/admin/profil', label: 'Profil Dusun', icon: User },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const isOfflineMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (isOfflineMode) {
        // Clear mock-session cookie
        document.cookie = "mock-session=; path=/; max-age=0";
      } else {
        await supabase.auth.signOut();
      }

      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setSigningOut(false);
    }
  };

  // Close mobile drawer on link click
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* 1. Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-primary text-white flex-shrink-0 border-r border-primary-hover min-h-screen p-5 justify-between">
        <div className="space-y-8">
          {/* Brand Logo */}
          <Link href="/admin/dashboard" className="flex items-center space-x-2 border-b border-primary-light/20 pb-4">
            <div className="bg-white text-primary p-2 rounded-lg">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-sm block leading-none">Admin RT 01</span>
              <span className="text-[10px] text-white/70 block font-medium mt-1">Dusun Garongan</span>
            </div>
          </Link>

          {/* Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#166534] text-white shadow'
                      : 'text-white/75 hover:text-white hover:bg-[#166534]/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons: Web Site & Sign Out */}
        <div className="space-y-3 pt-6 border-t border-primary-light/10">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-xs text-white/70 hover:text-white font-bold transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>Lihat Web Publik</span>
          </Link>
          
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-xs w-full text-red-300 hover:text-red-100 hover:bg-red-950/20 font-bold transition-all disabled:opacity-50"
          >
            {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* 2. Topbar for Mobile */}
      <header className="md:hidden bg-primary text-white px-4 py-3 flex items-center justify-between border-b border-[#166534] shadow relative z-35">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <Leaf className="h-5 w-5 text-[#84CC16]" />
          <span className="font-bold text-sm tracking-tight">Admin Garongan</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded hover:bg-primary-hover text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div className="md:hidden fixed inset-y-0 left-0 w-64 bg-primary text-white z-40 shadow-2xl p-5 flex flex-col justify-between pt-16">
            <div className="space-y-6">
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg text-sm font-bold transition-colors ${
                        isActive
                          ? 'bg-[#166534] text-white'
                          : 'text-white/75 hover:text-white hover:bg-[#166534]/50'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="space-y-2 pt-6 border-t border-primary-light/10">
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white font-bold transition-colors"
              >
                <Globe className="h-4.5 w-4.5" />
                <span>Web Publik</span>
              </Link>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm w-full text-red-300 hover:text-red-100 font-bold transition-all"
              >
                {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-xs"
          />
        </>
      )}

      {/* 3. Main Dashboard Workspace Content Area */}
      <main className="flex-grow p-6 sm:p-10 max-h-screen overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>

    </div>
  );
}
