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
    <div className="bg-white/10 border border-white/20 p-3 sm:p-4 rounded-3xl shadow-2xl relative overflow-hidden group">
      
      {/* Outer Card Container */}
      <Link 
        href="/mitigasi" 
        className="block relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#0a2e16] flex items-center justify-center cursor-pointer group/card"
      >
        {/* Uncropped Map Image with Object Contain */}
        {mapItems.map((map, idx) => (
          <div
            key={map.id}
            className={`absolute inset-0 w-full h-full flex items-center justify-center p-2 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={map.src}
              alt={map.title}
              className="w-full h-full object-contain filter drop-shadow-md group-hover/card:scale-[1.02] transition-transform duration-500"
            />
          </div>
        ))}

        {/* Gradient Overlay at Bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061f0e] via-[#061f0e]/70 to-transparent z-20 pointer-events-none" />

        {/* Top Badge & Indicator */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
          <span className={`text-[10px] sm:text-xs uppercase font-extrabold tracking-wider px-3.5 py-1.5 rounded-lg text-white shadow-md ${currentMap.badgeBg}`}>
            {currentMap.badge}
          </span>
          <span className="text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-md border border-white/10">
            {currentIndex + 1} / {mapItems.length}
          </span>
        </div>

        {/* Bottom Text & Zoom Icon */}
        <div className="absolute bottom-4 left-4 right-4 z-30 text-left pointer-events-none space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide font-heading group-hover/card:text-[#84CC16] transition-colors">
              {currentMap.title}
            </h3>
            <div className="bg-[#84CC16] text-[#14532D] p-2 rounded-xl group-hover/card:scale-110 transition-transform shadow">
              <ZoomIn className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs text-white/80 font-sans font-medium line-clamp-1">
            {currentMap.subtitle}
          </p>
        </div>

        {/* Manual Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-[#84CC16] hover:text-[#14532D] text-white p-2 rounded-full backdrop-blur-md transition-all shadow-md opacity-80 hover:opacity-100 hover:scale-110 focus:outline-none"
          aria-label="Peta sebelumnya"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-[#84CC16] hover:text-[#14532D] text-white p-2 rounded-full backdrop-blur-md transition-all shadow-md opacity-80 hover:opacity-100 hover:scale-110 focus:outline-none"
          aria-label="Peta berikutnya"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </Link>

      {/* Interactive Map Selector Tabs below Card */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {mapItems.map((item, idx) => {
          const isActive = currentIndex === idx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-left flex items-center space-x-2 border ${
                isActive
                  ? 'bg-[#84CC16] text-[#14532D] border-[#84CC16] shadow-md font-extrabold'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {idx === 0 ? <MapPin className="h-3.5 w-3.5 flex-shrink-0" /> : <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />}
              <span className="truncate">{item.badge}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
