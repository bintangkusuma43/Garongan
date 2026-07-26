'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ZoomIn, ChevronLeft, ChevronRight, MapPin, ShieldAlert } from 'lucide-react';

const mapItems = [
  {
    id: 'jalur',
    title: 'Peta Rute Jalur Evakuasi',
    subtitle: 'Rute penyelamatan diri mandiri & lokasi titik kumpul warga RT 01',
    badge: 'Peta Jalur Evakuasi',
    badgeBg: 'bg-emerald-600',
    src: '/images/dashboard/peta_jalur_evakuasi.webp',
  },
  {
    id: 'krb',
    title: 'Peta Kawasan Rawan Bencana (KRB)',
    subtitle: 'Zonasi bahaya letusan Gunung Merapi & radius awan panas',
    badge: 'Peta KRB Merapi',
    badgeBg: 'bg-red-600',
    src: '/images/dashboard/peta_krb.webp',
  }
];

export function MitigasiMapPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mapItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentMap = mapItems[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mapItems.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mapItems.length);
  };

  return (
    <div className="bg-white/10 border border-white/20 p-4 sm:p-5 rounded-3xl shadow-2xl space-y-4">
      
      {/* Top Header info inside card */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] sm:text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-lg text-white shadow-sm ${currentMap.badgeBg}`}>
            {currentMap.badge}
          </span>
          <span className="text-xs text-white/80 font-bold hidden sm:inline-block">Peta Resmi RT 01</span>
        </div>
        <span className="text-xs font-mono font-bold bg-black/40 text-white/90 px-2.5 py-1 rounded-md border border-white/10">
          {currentIndex + 1} / {mapItems.length}
        </span>
      </div>

      {/* Interactive Map Image Frame */}
      <Link 
        href="/mitigasi" 
        className="block relative aspect-[4/3] sm:aspect-[1.4/1] rounded-2xl overflow-hidden bg-black/60 border border-white/15 group/card cursor-pointer shadow-inner"
      >
        {/* Map Images */}
        {mapItems.map((map, idx) => (
          <div
            key={map.id}
            className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={map.src}
              alt={map.title}
              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
            />
          </div>
        ))}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <div className="bg-[#84CC16] text-[#14532D] font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 transform scale-95 group-hover/card:scale-100 transition-transform">
            <ZoomIn className="h-4 w-4" />
            <span>Buka Peta & Panduan Lengkap</span>
          </div>
        </div>

        {/* Manual Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-[#84CC16] hover:text-[#14532D] text-white p-2.5 rounded-full backdrop-blur-md transition-all shadow-md opacity-90 hover:scale-110 focus:outline-none"
          aria-label="Peta sebelumnya"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-[#84CC16] hover:text-[#14532D] text-white p-2.5 rounded-full backdrop-blur-md transition-all shadow-md opacity-90 hover:scale-110 focus:outline-none"
          aria-label="Peta berikutnya"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </Link>

      {/* Map Selector Tabs */}
      <div className="grid grid-cols-2 gap-2">
        {mapItems.map((item, idx) => {
          const isActive = currentIndex === idx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all text-left flex items-center space-x-2 border ${
                isActive
                  ? 'bg-[#84CC16] text-[#14532D] border-[#84CC16] shadow-md font-extrabold'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {idx === 0 ? <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#14532D]" /> : <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0 text-[#14532D]" />}
              <span className="truncate">{item.badge}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
