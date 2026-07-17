'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Leaf, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/potensi', label: 'Potensi Dusun' },
  { href: '/galeri', label: 'Galeri Kegiatan' },
  { href: '/mitigasi', label: 'Jalur Evakuasi' },
  { href: '/lokasi', label: 'Lokasi' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isSolid = isScrolled || pathname !== '/';

  // Dynamic tailwind styles helper for nav links
  const getNavLinkClass = (linkHref: string) => {
    const isActive = pathname === linkHref;
    const base = "relative px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-extrabold tracking-wide transition-all duration-300";
    
    if (isActive) {
      const activeColor = isSolid 
        ? 'text-[#14532D]' 
        : 'text-[#84CC16]';
      return `${base} ${activeColor} active-link-indicator`;
    }
    
    if (isSolid) {
      return `${base} text-slate-700 hover:text-[#14532D] hover:bg-[#F5F7F2]/80`;
    }
    
    return `${base} text-white/90 hover:text-[#84CC16] hover:bg-white/10`;
  };

  const getAdminButtonClass = () => {
    const base = "ml-3 flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-[11px] font-extrabold transition-all shadow-sm hover:shadow-md hover:scale-105 transform duration-300";
    if (isSolid) {
      return `${base} bg-gradient-to-r from-[#14532D] to-[#166534] text-white hover:from-[#166534] hover:to-[#14532D]`;
    }
    return `${base} bg-white/10 hover:bg-white/20 border border-white/25 text-white backdrop-blur-md`;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,border-color,box-shadow] duration-300 ${
          isSolid
            ? 'bg-[#FAFAF9]/85 backdrop-blur-md shadow-sm py-3 border-b border-slate-200/50'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="bg-[#14532D] text-white p-2.5 rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-12 shadow-md">
                <Leaf className="h-5 w-5 text-[#84CC16] transition-transform duration-500" />
              </div>
              <div>
                <span className={`font-extrabold text-base sm:text-lg block leading-none tracking-tight transition-colors ${
                  isSolid ? 'text-[#14532D]' : 'text-white'
                }`}>
                  RT 01 Garongan
                </span>
                <span className={`text-[10px] sm:text-xs block font-bold transition-colors mt-0.5 ${
                  isSolid ? 'text-[#166534]/80' : 'text-white/80'
                }`}>
                  Wonokerto, Turi, Sleman
                </span>
              </div>
            </Link>
 
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={getNavLinkClass(link.href)}
                >
                  {link.label}
                </Link>
              ))}
              
              <Link
                href="/admin/dashboard"
                className={getAdminButtonClass()}
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-[#84CC16]" />
                <span>Admin</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl transition-colors focus:outline-none ${
                  isSolid 
                    ? 'text-[#14532D] hover:bg-[#F5F7F2]' 
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu (Outside fixed nav container to bypass WebKit translation bugs) */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-64 bg-[#FAFAF9]/92 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } border-l border-slate-200/60 flex flex-col`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <span className="font-extrabold text-sm text-[#14532D] font-heading">Navigasi</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 focus:outline-none"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="py-4 px-5 space-y-2 flex-grow">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'text-[#14532D] bg-[#F5F7F2]'
                    : 'text-slate-700 hover:text-[#14532D] hover:bg-[#F5F7F2]/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <div className="pt-5 mt-3 border-t border-slate-200">
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-[#14532D] text-white text-xs font-bold transition-all hover:bg-[#166534] shadow"
            >
              <LayoutDashboard className="h-4 w-4 text-[#84CC16]" />
              <span>Dashboard Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity duration-300"
        />
      )}
    </>
  );
}
