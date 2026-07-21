'use client';

import React, { useState } from 'react';
import { ShieldAlert, Phone, HelpCircle, Eye, X, ZoomIn } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function MitigasiPage() {
  const [activeTab, setActiveTab] = useState<'semua' | 'krb' | 'jalur'>('semua');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  const openLightbox = (imgSrc: string, title: string) => {
    setLightboxImage(imgSrc);
    setLightboxTitle(title);
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
              <div className="bg-gradient-to-br from-[#14532D] via-[#114022] to-[#166534] text-white p-8 rounded-3xl shadow-xl border border-white/5 space-y-5 hover-glow duration-300">
                <h4 className="font-extrabold text-sm flex items-center space-x-2 tracking-wide uppercase">
                  <Phone className="h-4.5 w-4.5 text-[#84CC16] animate-float" />
                  <span>Kontak Darurat Bencana</span>
                </h4>
                <div className="space-y-3.5 text-xs text-emerald-100/90 font-sans font-medium">
                  <div className="flex justify-between border-b border-white/10 pb-2.5">
                    <span>Posko Merapi Wonokerto:</span>
                    <span className="font-bold text-white tracking-wider">+62 811-2233-445</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2.5">
                    <span>BPBD Sleman:</span>
                    <span className="font-bold text-white tracking-wider">(0274) 868500</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Ambulans RT 01:</span>
                    <span className="font-bold text-white tracking-wider">+62 812-3456-7890</span>
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

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in cursor-zoom-out p-4"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 shadow-md focus:outline-none"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Large Image Frame */}
          <div className="max-w-[95vw] max-h-[85vh] flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage}
              alt={lightboxTitle}
              className="object-contain max-h-[80vh] max-w-full rounded-xl shadow-2xl transition-all duration-300"
            />
            <span className="text-white/80 text-sm font-extrabold mt-4 text-center font-heading">
              {lightboxTitle}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
