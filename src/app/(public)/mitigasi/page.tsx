'use client';

import React, { useState } from 'react';
import { ShieldAlert, Phone, HelpCircle, Eye, X, ZoomIn, Landmark, Radio, MessageSquare } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function MitigasiPage() {
  const [activeTab, setActiveTab] = useState<'semua' | 'krb' | 'jalur'>('semua');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const didDragRef = React.useRef(false);
  const dragStartPosRef = React.useRef({ x: 0, y: 0 });

  const openLightbox = (imgSrc: string, title: string) => {
    setLightboxImage(imgSrc);
    setLightboxTitle(title);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    didDragRef.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    didDragRef.current = false;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = Math.abs(e.clientX - dragStartPosRef.current.x);
    const dy = Math.abs(e.clientY - dragStartPosRef.current.y);
    if (dx > 5 || dy > 5) {
      didDragRef.current = true;
    }
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = 0.15;
    const newScale = e.deltaY < 0 ? Math.min(scale + zoomFactor, 5) : Math.max(scale - zoomFactor, 1);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
    setScale(newScale);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    didDragRef.current = false;
    dragStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - dragStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - dragStartPosRef.current.y);
    if (dx > 5 || dy > 5) {
      didDragRef.current = true;
    }
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    // Single click only zooms IN when at normal scale 1
    if (scale === 1) {
      setScale(2);
    }
    // When scale > 1, single click will NOT zoom out so accidental clicks don't reset view
  };

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    didDragRef.current = false;
  };

  const maps = [
    {
      id: 'krb',
      title: 'Peta Kawasan Rawan Bencana (KRB)',
      description: 'Peta zonasi tingkat kerawanan bencana Gunung Merapi yang menunjukkan radius bahaya awan panas, guguran lava, dan hujan abu vulkanik.',
      image: '/images/dashboard/peta_krb.webp',
      badge: 'Zonasi Bahaya',
      badgeColor: 'bg-red-600',
    },
    {
      id: 'jalur',
      title: 'Peta Rute Jalur Evakuasi',
      description: 'Peta panduan rute penyelamatan diri mandiri warga RT 01 Garongan untuk menjangkau titik kumpul utama (Assembly Point) dan posko pengungsian.',
      image: '/images/dashboard/peta_jalur_evakuasi.webp',
      badge: 'Rute Penyelamatan',
      badgeColor: 'bg-emerald-600',
    }
  ];

  const filteredMaps = activeTab === 'semua' ? maps : maps.filter(m => m.id === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 space-y-16 bg-[#FAFAF9] text-[#1F2937]">
      
      {/* Header */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5 shadow-xs">
            <ShieldAlert className="h-3.5 w-3.5 text-[#84CC16] animate-pulse" />
            <span>Kesiapsiagaan Bencana</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#14532D] tracking-tight font-heading leading-tight">
            Peta Mitigasi & Jalur Evakuasi
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans font-medium">
            Informasi visual mengenai zona rawan bencana letusan Gunung Merapi serta rute penyelamatan diri warga RT 01 Dusun Garongan.
          </p>
        </div>
      </ScrollReveal>

      {/* Tabs Navigation */}
      <ScrollReveal delay={100}>
        <div className="flex justify-center border-b border-slate-200/60 pb-2">
          <div className="flex bg-[#F5F7F2] p-1.5 rounded-2xl shadow-sm border border-slate-200/50 space-x-1.5 sm:space-x-3">
            <button
              onClick={() => setActiveTab('semua')}
              className={`py-3 px-4 sm:px-6 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center space-x-2 font-heading shadow-xs hover:scale-102 transform duration-300 ${
                activeTab === 'semua'
                  ? 'bg-[#14532D] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#14532D] hover:bg-[#FAFAF9]/70'
              }`}
            >
              <span>Semua Peta</span>
            </button>
            <button
              onClick={() => setActiveTab('krb')}
              className={`py-3 px-4 sm:px-6 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center space-x-2 font-heading shadow-xs hover:scale-102 transform duration-300 ${
                activeTab === 'krb'
                  ? 'bg-[#14532D] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#14532D] hover:bg-[#FAFAF9]/70'
              }`}
            >
              <span>Kawasan Rawan Bencana</span>
            </button>
            <button
              onClick={() => setActiveTab('jalur')}
              className={`py-3 px-4 sm:px-6 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center space-x-2 font-heading shadow-xs hover:scale-102 transform duration-300 ${
                activeTab === 'jalur'
                  ? 'bg-[#14532D] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#14532D] hover:bg-[#FAFAF9]/70'
              }`}
            >
              <span>Rute Jalur Evakuasi</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Grid Layout: Maps list & Emergency contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Peta / Maps List */}
        <div className="lg:col-span-8 space-y-10">
          <ScrollReveal delay={150}>
            <div className={`grid grid-cols-1 gap-10 ${activeTab === 'semua' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
              {filteredMaps.map((map) => (
                <div 
                  key={map.id} 
                  className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden flex flex-col group hover-scale-glow transition-all duration-300 shadow-sm"
                >
                  {/* Map Image Container */}
                  <div 
                    onClick={() => openLightbox(map.image, map.title)}
                    className="aspect-[4/3] bg-black overflow-hidden relative cursor-zoom-in"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={map.image}
                      alt={map.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    
                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 bg-[#14532D]/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/95 text-[#14532D] text-xs font-extrabold px-4.5 py-2.5 rounded-xl shadow-md transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center space-x-1.5">
                        <ZoomIn className="h-4 w-4" />
                        <span>Perbesar Peta</span>
                      </div>
                    </div>

                    <div className={`absolute top-4 left-4 text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-lg shadow-md ${map.badgeColor}`}>
                      {map.badge}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-extrabold text-[#14532D] leading-tight font-heading group-hover:text-emerald-700 transition-colors">
                        {map.title}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                        {map.description}
                      </p>
                    </div>
                    <button 
                      onClick={() => openLightbox(map.image, map.title)}
                      className="w-full py-3.5 rounded-2xl border border-slate-200 font-extrabold text-xs text-[#14532D] bg-[#F5F7F2] hover:bg-[#14532D] hover:text-white hover:border-[#14532D] transition-all flex items-center justify-center space-x-2 shadow-xs group"
                    >
                      <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span>Buka File Gambar Penuh</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Emergency Card */}
        <div className="lg:col-span-4 space-y-6">
          <ScrollReveal delay={200}>
            <div className="space-y-6">
              {/* Emergency contacts card */}
              <div className="bg-gradient-to-br from-[#14532D] via-[#114022] to-[#166534] text-white p-7 rounded-3xl shadow-xl border border-white/10 space-y-5 hover-glow duration-300">
                <div>
                  <h4 className="font-extrabold text-sm flex items-center space-x-2 tracking-wide uppercase">
                    <Phone className="h-4.5 w-4.5 text-[#84CC16] animate-float flex-shrink-0" />
                    <span>Kontak Darurat Bencana</span>
                  </h4>
                  <p className="text-[11px] text-emerald-100/70 font-sans mt-1">
                    Badan Penanggulangan Bencana Daerah (BPBD) Kab. Sleman
                  </p>
                </div>

                <div className="space-y-3.5 text-xs font-sans font-medium">
                  {/* Kantor BPBD Sleman */}
                  <div className="border-b border-white/10 pb-3 space-y-1">
                    <div className="text-[10px] uppercase font-extrabold text-[#84CC16] tracking-wider flex items-center space-x-1.5">
                      <Landmark className="h-3.5 w-3.5" />
                      <span>Kantor BPBD Kab. Sleman</span>
                    </div>
                    <div className="text-sm font-bold text-white tracking-wider pl-5">
                      (0274) 868504
                    </div>
                  </div>

                  {/* Lapor Bencana Telepon */}
                  <div className="border-b border-white/10 pb-3 space-y-1">
                    <div className="text-[10px] uppercase font-extrabold text-[#84CC16] tracking-wider flex items-center space-x-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      <span>Posko Lapor Bencana</span>
                    </div>
                    <div className="text-xs font-bold text-white tracking-wider pl-5">
                      0274-898350 / 2860051
                    </div>
                  </div>

                  {/* WhatsApp Lapor Bencana */}
                  <div className="border-b border-white/10 pb-3 space-y-1">
                    <div className="text-[10px] uppercase font-extrabold text-[#84CC16] tracking-wider flex items-center space-x-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-[#84CC16]" />
                      <span>WhatsApp Lapor Bencana</span>
                    </div>
                    <a
                      href="https://wa.me/6282125101212"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-bold text-white hover:text-[#84CC16] underline decoration-[#84CC16]/70 underline-offset-4 tracking-wider pl-5 transition-colors"
                    >
                      082125101212 (WA)
                    </a>
                  </div>

                  {/* Radio Frequency HT */}
                  <div className="space-y-1 pt-0.5">
                    <div className="text-[10px] uppercase font-extrabold text-[#84CC16] tracking-wider flex items-center space-x-1.5">
                      <Radio className="h-3.5 w-3.5" />
                      <span>Frekuensi Radio HT</span>
                    </div>
                    <div className="text-xs font-extrabold text-white tracking-wider pl-5 font-mono bg-white/15 px-3 py-1.5 rounded-xl w-fit border border-white/10">
                      159.800 MHz
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Mitigation Procedures (Risk Reduction Guide) */}
      <ScrollReveal delay={250}>
        <section className="bg-[#F5F7F2]/40 p-8 rounded-3xl border border-slate-200/60 space-y-8">
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-6 w-6 text-[#14532D] animate-float" />
            <h2 className="text-xl font-extrabold text-[#14532D] font-heading">Panduan Singkat Mitigasi Bencana Merapi</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-500">
            
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/60 space-y-4 shadow-sm hover-scale-glow transition-all duration-300">
              <span className="inline-flex w-9 h-9 rounded-full bg-gradient-to-br from-[#14532D] to-[#84CC16] text-white font-extrabold items-center justify-center text-xs shadow-md">
                01
              </span>
              <h4 className="font-extrabold text-[#14532D] text-sm font-heading">Status Waspada / Siaga</h4>
              <p className="text-xs leading-relaxed font-sans font-medium">
                Pantau informasi resmi dari BPPTKG/BPBD melalui radio HT desa. Siapkan tas siaga bencana berisi surat berharga, obat-obatan, senter, masker, dan air minum secukupnya di tempat yang mudah dijangkau.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/60 space-y-4 shadow-sm hover-scale-glow transition-all duration-300">
              <span className="inline-flex w-9 h-9 rounded-full bg-gradient-to-br from-[#14532D] to-[#84CC16] text-white font-extrabold items-center justify-center text-xs shadow-md">
                02
              </span>
              <h4 className="font-extrabold text-[#14532D] text-sm font-heading">Status Awas (Evakuasi)</h4>
              <p className="text-xs leading-relaxed font-sans font-medium">
                Ketika sirine bahaya berbunyi, segera berkumpul di <strong>Titik Kumpul Lapangan RT 01</strong>. Matikan kompor dan listrik rumah. Ikuti komando koordinator keselamatan RT untuk menuju titik pengungsian akhir.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/60 space-y-4 shadow-sm hover-scale-glow transition-all duration-300">
              <span className="inline-flex w-9 h-9 rounded-full bg-gradient-to-br from-[#14532D] to-[#84CC16] text-white font-extrabold items-center justify-center text-xs shadow-md">
                03
              </span>
              <h4 className="font-extrabold text-[#14532D] text-sm font-heading">Pasca Terjadi Erupsi</h4>
              <p className="text-xs leading-relaxed font-sans font-medium">
                Gunakan selalu masker dan kacamata saat beraktivitas di luar ruangan untuk melindungi dari debu vulkanik. Jangan kembali ke pemukiman sebelum ada pernyataan aman dari pihak berwenang.
              </p>
            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* Lightbox Modal with Zoom & Pan */}
      {lightboxImage && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in p-4 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 shadow-md focus:outline-none z-50"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Title */}
          <div className="absolute top-6 left-6 text-white z-50 pointer-events-none hidden sm:block">
            <h3 className="text-base font-extrabold font-heading tracking-wide">{lightboxTitle}</h3>
            <p className="text-xs text-white/70 font-sans mt-0.5">
              Scroll / Tombol (+/-) untuk zoom. Geser (drag) untuk melihat lokasi. Double-click / Reset untuk kembali.
            </p>
          </div>

          {/* Large Image Frame Container (Handles Drag, Wheel, and Touch) */}
          <div 
            className="relative w-full h-[85vh] flex items-center justify-center select-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage}
              alt={lightboxTitle}
              onClick={handleImageClick}
              onDoubleClick={handleImageDoubleClick}
              className="object-contain max-h-[75vh] max-w-[90vw] rounded-xl shadow-2xl origin-center select-none"
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
              }}
            />

            {/* Zoom Controls Overlay */}
            <div className="absolute bottom-6 flex items-center bg-black/75 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 space-x-4 z-50 text-white shadow-xl">
              <button
                type="button"
                onClick={() => setScale(prev => Math.max(prev - 0.5, 1))}
                disabled={scale === 1}
                className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent font-bold text-base transition-colors w-8 h-8 flex items-center justify-center"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-xs font-mono font-extrabold w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setScale(prev => Math.min(prev + 0.5, 5))}
                disabled={scale === 5}
                className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent font-bold text-base transition-colors w-8 h-8 flex items-center justify-center"
                title="Zoom In"
              >
                +
              </button>
              <div className="h-4 w-[1px] bg-white/20" />
              <button
                type="button"
                onClick={() => {
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                }}
                disabled={scale === 1 && position.x === 0 && position.y === 0}
                className="px-3 py-1.5 text-[9px] uppercase font-extrabold bg-[#14532D] hover:bg-emerald-700 text-white rounded-lg disabled:opacity-40 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
