'use strict';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Leaf, Tent, Compass, Sparkles, Award, CheckCircle, MapPin, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { ScrollReveal } from '@/components/ScrollReveal';

interface SearchParams {
  tab?: string;
}

export const metadata = {
  title: "Potensi Dusun - KWT & Jaka Garong",
  description: "Menjelajahi potensi Kelompok Wanita Tani (KWT) Garongan dan wisata petualangan alam Jaka Garong (Jelajah Alam Kampung Garongan) Sleman.",
};

interface Potensi {
  id: string;
  nama_potensi: string;
  kategori?: string;
  deskripsi: string;
  foto_url?: string;
}

// Static fallbacks
const kwtFallbackDesc = `Kelompok Wanita Tani (KWT) merupakan wadah pemberdayaan perempuan di Dusun Garongan yang berperan aktif dalam kegiatan pertanian dan pemanfaatan lahan pekarangan. Melalui berbagai kegiatan budidaya tanaman pangan, hortikultura, serta tanaman obat keluarga, KWT berupaya meningkatkan ketahanan pangan dan kesejahteraan keluarga. Selain sebagai sarana belajar dan berbagi pengetahuan, KWT juga menjadi media untuk mempererat kebersamaan serta mendorong pemanfaatan potensi lokal secara berkelanjutan.`;

const jakaGarongFallbackDesc = `Jaka Garong adalah destinasi wisata alam yang berada di Dusun Garongan, Kalurahan Wonokerto, Kapanewon Turi, Kabupaten Sleman. Berlokasi di lereng Gunung Merapi, kawasan ini menawarkan udara yang sejuk, pemandangan alam yang indah, serta suasana pedesaan yang masih alami.

Jaka Garong dilengkapi dengan berbagai fasilitas, seperti camping ground, area outbound, pendopo, dan jalur susur Sungai Sempor yang dapat dimanfaatkan untuk kegiatan rekreasi, edukasi, maupun pelatihan. Dikelola bersama oleh masyarakat setempat, Jaka Garong menjadi salah satu destinasi unggulan yang mendukung pengembangan pariwisata berkelanjutan sekaligus meningkatkan kesejahteraan masyarakat Dusun Garongan.`;

const getPhotos = (fotoUrl: string | null | undefined): string[] => {
  if (!fotoUrl) return [];
  if (fotoUrl.startsWith('[')) {
    try {
      return JSON.parse(fotoUrl);
    } catch (e) {
      return [fotoUrl];
    }
  }
  if (fotoUrl.includes(',')) {
    return fotoUrl.split(',').map(s => s.trim());
  }
  return [fotoUrl];
};

export default async function PotensiPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab === 'jakagarong' ? 'jakagarong' : searchParams.tab === 'lainnya' ? 'lainnya' : 'kwt';

  let kwtDbList: Potensi[] = [];
  let jakaDbList: Potensi[] = [];
  let lainnyaDbList: Potensi[] = [];
  let isOffline = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('potensi_dusun').select('*');
    
    if (error) throw error;

    if (data && data.length > 0) {
      // Filter KWT and Jaka Garong lists
      kwtDbList = data.filter((p: any) => p.kategori === 'KWT' || p.nama_potensi.toLowerCase().includes('kwt') || p.nama_potensi.toLowerCase().includes('wanita tani'));
      jakaDbList = data.filter((p: any) => p.kategori === 'Jaka Garong' || p.nama_potensi.toLowerCase().includes('jaka') || p.nama_potensi.toLowerCase().includes('garong'));
      
      // Filter out KWT and Jaka Garong to populate "Lainnya" tab
      lainnyaDbList = data.filter((p: any) => {
        const isKwt = p.kategori === 'KWT' || p.nama_potensi.toLowerCase().includes('kwt') || p.nama_potensi.toLowerCase().includes('wanita tani');
        const isJaka = p.kategori === 'Jaka Garong' || p.nama_potensi.toLowerCase().includes('jaka') || p.nama_potensi.toLowerCase().includes('garong');
        return !isKwt && !isJaka;
      });
    }
  } catch (err) {
    console.warn('Failed to load potensi from Supabase. Using fallbacks.', err);
    isOffline = true;
  }

  // Compile top carousels (statically defined for core summaries)
  const kwtCarouselPhotos = [
    '/images/kwt/kwt.jpeg'
  ];

  const jakaCarouselPhotos = [
    '/images/jakagarong/jakagarong-1.webp',
    '/images/jakagarong/jakagarong-2.webp',
    '/images/jakagarong/jakagarong-3.webp'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 space-y-16 bg-[#FAFAF9] text-[#1F2937]">
      
      {/* Header */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#84CC16] animate-float" />
            <span>Keanekaragaman Dusun</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#14532D] tracking-tight font-heading leading-tight">
            Potensi Dusun Garongan
          </h1>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans font-medium">
            Masyarakat aktif mengelola berbagai potensi lokal mulai dari kelompok tani hingga destinasi wisata alam terintegrasi.
          </p>
          {isOffline && (
            <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-800 text-[10px] rounded-full font-medium border border-yellow-100">
              ⚠️ Mode Offline. Menampilkan konten lokal.
            </span>
          )}
        </div>
      </ScrollReveal>

      {/* 3 Fixed Tabs Navigation */}
      <div className="flex justify-center border-b border-slate-200/60 pb-2">
        <div className="flex bg-[#F5F7F2] p-1.5 rounded-2xl shadow-sm border border-slate-200/50 space-x-1.5 sm:space-x-3">
          <Link
            href="/potensi?tab=kwt"
            className={`py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center space-x-2 font-heading shadow-xs hover:scale-102 transform duration-300 ${
              activeTab === 'kwt'
                ? 'bg-[#14532D] text-white shadow-md'
                : 'text-slate-600 hover:text-[#14532D] hover:bg-[#FAFAF9]/70'
            }`}
          >
            <Leaf className={`h-4.5 w-4.5 ${activeTab === 'kwt' ? 'text-[#84CC16] animate-pulse' : 'text-slate-400'}`} />
            <span>KWT (Wanita Tani)</span>
          </Link>
          <Link
            href="/potensi?tab=jakagarong"
            className={`py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center space-x-2 font-heading shadow-xs hover:scale-102 transform duration-300 ${
              activeTab === 'jakagarong'
                ? 'bg-[#14532D] text-white shadow-md'
                : 'text-slate-600 hover:text-[#14532D] hover:bg-[#FAFAF9]/70'
            }`}
          >
            <Tent className={`h-4.5 w-4.5 ${activeTab === 'jakagarong' ? 'text-[#84CC16] animate-pulse' : 'text-slate-400'}`} />
            <span>Jaka Garong (Wisata)</span>
          </Link>
          <Link
            href="/potensi?tab=lainnya"
            className={`py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center space-x-2 font-heading shadow-xs hover:scale-102 transform duration-300 ${
              activeTab === 'lainnya'
                ? 'bg-[#14532D] text-white shadow-md'
                : 'text-slate-600 hover:text-[#14532D] hover:bg-[#FAFAF9]/70'
            }`}
          >
            <Compass className={`h-4.5 w-4.5 ${activeTab === 'lainnya' ? 'text-[#84CC16] animate-pulse' : 'text-slate-400'}`} />
            <span>Potensi Lainnya</span>
          </Link>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="pt-4">
        {activeTab === 'kwt' && (
          /* KWT Tab Content */
          <div className="space-y-16 animate-fade-in-up">
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 lg:p-8 shadow-sm flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-x-12 lg:gap-y-4 items-center lg:items-start hover-scale-glow transition-all">
              {/* Title & Badge */}
              <div className="order-1 lg:col-span-7 space-y-3 w-full">
                <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5 shadow-xs">
                  <Award className="h-3.5 w-3.5 text-[#84CC16] animate-float" />
                  <span>Pemberdayaan Perempuan</span>
                </div>
                <h2 className="text-3xl font-extrabold text-[#14532D] leading-tight font-heading">
                  Ketahanan Pangan Keluarga melalui Pertanian Pekarangan
                </h2>
              </div>

              {/* Photo Carousel (Below Title on Mobile) */}
              <div className="order-2 lg:col-span-5 lg:row-span-2 w-full">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-200 aspect-[4/3] relative bg-[#F5F7F2] hover-scale-glow transition-all duration-300">
                  <PhotoCarousel photos={kwtCarouselPhotos} alt="Kegiatan Pertanian KWT" />
                </div>
              </div>

              {/* Description & Checklist (Below Photo on Mobile) */}
              <div className="order-3 lg:col-span-7 space-y-6 w-full">
                <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans font-medium whitespace-pre-line">
                  {kwtFallbackDesc}
                </p>
                
                <div className="space-y-4 pt-2">
                  <h3 className="font-extrabold text-[#14532D] text-base font-heading">Fokus Hasil Pertanian & Kegiatan:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                    <div className="flex items-center space-x-3 bg-[#F5F7F2]/60 hover:bg-[#F5F7F2] p-4 rounded-2xl border border-slate-100/80 transition-all font-bold text-slate-700 hover:scale-102 transform duration-250 shadow-xs hover:shadow-sm">
                      <CheckCircle className="h-5 w-5 text-[#84CC16] flex-shrink-0" />
                      <span>Budidaya Sayuran Organik</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-[#F5F7F2]/60 hover:bg-[#F5F7F2] p-4 rounded-2xl border border-slate-100/80 transition-all font-bold text-slate-700 hover:scale-102 transform duration-250 shadow-xs hover:shadow-sm">
                      <CheckCircle className="h-5 w-5 text-[#84CC16] flex-shrink-0" />
                      <span>Tanaman Obat Keluarga (TOGA)</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-[#F5F7F2]/60 hover:bg-[#F5F7F2] p-4 rounded-2xl border border-slate-100/80 transition-all font-bold text-slate-700 hover:scale-102 transform duration-250 shadow-xs hover:shadow-sm">
                      <CheckCircle className="h-5 w-5 text-[#84CC16] flex-shrink-0" />
                      <span>Pekarangan Pangan Lestari</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-[#F5F7F2]/60 hover:bg-[#F5F7F2] p-4 rounded-2xl border border-slate-100/80 transition-all font-bold text-slate-700 hover:scale-102 transform duration-250 shadow-xs hover:shadow-sm">
                      <CheckCircle className="h-5 w-5 text-[#84CC16] flex-shrink-0" />
                      <span>Pelatihan Pengolahan Panen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* List of Admin-Input KWT Potential items */}
            {kwtDbList.length > 0 && (
              <div className="space-y-12 pt-16 border-t border-slate-200/80">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h3 className="text-2xl font-extrabold text-[#14532D] font-heading">
                    Daftar Program & Kegiatan Kelompok Wanita Tani
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">Daftar kegiatan, rincian, dan dokumentasi foto KWT yang dikelola oleh pengurus dusun.</p>
                </div>
                <div className="space-y-10">
                  {kwtDbList.map((pot, idx) => (
                    <div key={pot.id} className="bg-white rounded-3xl border border-slate-200/60 p-6 lg:p-8 shadow-sm flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-x-12 lg:gap-y-4 items-center lg:items-start hover-scale-glow transition-all duration-300">
                      {/* Title & Badge */}
                      <div className="order-1 lg:col-span-7 space-y-3 w-full">
                        <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-[#14532D]/5">
                          <Leaf className="h-3 w-3 text-[#84CC16]" />
                          <span>Program KWT #{idx + 1}</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-[#14532D] leading-tight font-heading">
                          {pot.nama_potensi}
                        </h3>
                      </div>

                      {/* Photo Carousel */}
                      <div className="order-2 lg:col-span-5 lg:row-span-2 w-full">
                        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200/60 aspect-[4/3] relative bg-[#F5F7F2]">
                          <PhotoCarousel photos={getPhotos(pot.foto_url)} alt={pot.nama_potensi} />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="order-3 lg:col-span-7 w-full">
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans font-medium whitespace-pre-line">
                          {pot.deskripsi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'jakagarong' && (
          /* Jaka Garong Tab Content */
          <div className="space-y-16 animate-fade-in-up">
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 lg:p-8 shadow-sm flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-x-12 lg:gap-y-4 items-center lg:items-start hover-scale-glow transition-all">
              {/* Title & Badge */}
              <div className="order-1 lg:col-span-7 space-y-3 w-full">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5 shadow-xs">
                    <Compass className="h-3.5 w-3.5 text-[#84CC16] animate-float" />
                    <span>Ekowisata & Petualangan</span>
                  </div>
                  <a
                    href="https://jakagarong.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-[#14532D] text-white hover:bg-[#166534] px-4 py-2 rounded-full text-xs font-extrabold tracking-wide border border-[#14532D] shadow-xs transition-all hover:scale-105 group"
                  >
                    <Globe className="h-3.5 w-3.5 text-[#84CC16]" />
                    <span>jakagarong.com</span>
                    <ExternalLink className="h-3 w-3 text-[#84CC16] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
                <h2 className="text-3xl font-extrabold text-[#14532D] leading-tight font-heading">
                  Wisata Edukasi Sungai dan Berkemah di Kaki Merapi
                </h2>
              </div>

              {/* Photo Carousel */}
              <div className="order-2 lg:col-span-5 lg:row-span-2 w-full">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-200 aspect-[4/3] relative bg-[#F5F7F2] hover-scale-glow transition-all duration-300">
                  <PhotoCarousel photos={jakaCarouselPhotos} alt="Wisata Jaka Garong" />
                </div>
              </div>

              {/* Description & Facilities */}
              <div className="order-3 lg:col-span-7 space-y-6 w-full">
                <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans font-medium whitespace-pre-line">
                  {jakaGarongFallbackDesc}
                </p>
                
                <div className="space-y-4 pt-2">
                  <h3 className="font-extrabold text-[#14532D] text-base font-heading">Fasilitas Utama Wisata:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover-scale-glow hover:border-[#14532D]/20 transition-all duration-300">
                      <div className="bg-[#F5F7F2] p-2.5 rounded-xl border border-[#14532D]/5 flex-shrink-0">
                        <Tent className="h-5.5 w-5.5 text-[#84CC16] flex-shrink-0" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#14532D] text-sm font-heading">Bumi Perkemahan</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">Area camping ground luas berkapasitas ratusan tenda, aman dan nyaman.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover-scale-glow hover:border-[#14532D]/20 transition-all duration-300">
                      <div className="bg-[#F5F7F2] p-2.5 rounded-xl border border-[#14532D]/5 flex-shrink-0">
                        <Sparkles className="h-5.5 w-5.5 text-[#84CC16] flex-shrink-0" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#14532D] text-sm font-heading">Outbound & LDK</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">Fasilitas wahana permainan kelompok, makrab mahasiswa, dan LDK siswa.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover-scale-glow hover:border-[#14532D]/20 transition-all duration-300">
                      <div className="bg-[#F5F7F2] p-2.5 rounded-xl border border-[#14532D]/5 flex-shrink-0">
                        <Compass className="h-5.5 w-5.5 text-[#84CC16] flex-shrink-0" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#14532D] text-sm font-heading">Susur Sungai Sempor</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">Petualangan trekking menyusuri sungai Sempor yang jernih and berbatuan asri.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover-scale-glow hover:border-[#14532D]/20 transition-all duration-300">
                      <div className="bg-[#F5F7F2] p-2.5 rounded-xl border border-[#14532D]/5 flex-shrink-0">
                        <MapPin className="h-5.5 w-5.5 text-[#84CC16] flex-shrink-0" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#14532D] text-sm font-heading">Pendopo Pertemuan</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">Pendopo joglo tradisional untuk berkumpul, dilengkapi sarana MCK lengkap.</p>
                      </div>
                    </div>

                    {/* Official Website CTA Card inside facility grid */}
                    <a
                      href="https://jakagarong.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-4 bg-gradient-to-r from-[#14532D] via-[#166534] to-[#14532D] text-white p-5 rounded-2xl border border-[#14532D] shadow-md hover-scale-glow hover:shadow-xl transition-all duration-300 group sm:col-span-2"
                    >
                      <div className="bg-white/10 p-2.5 rounded-xl border border-white/20 flex-shrink-0 group-hover:scale-110 group-hover:bg-[#84CC16] group-hover:text-[#14532D] transition-all">
                        <Globe className="h-5.5 w-5.5 text-[#84CC16] group-hover:text-[#14532D]" />
                      </div>
                      <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-white text-sm font-heading flex items-center space-x-1.5">
                            <span>Website Resmi Wisata Jaka Garong</span>
                            <ExternalLink className="h-3.5 w-3.5 text-[#84CC16]" />
                          </h4>
                          <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed font-semibold">
                            Kunjungi jakagarong.com untuk reservasi, booking camping ground, & layanan paket wisata.
                          </p>
                        </div>
                        <span className="inline-flex items-center space-x-1 text-xs font-extrabold bg-[#84CC16] text-[#14532D] px-3.5 py-1.5 rounded-xl flex-shrink-0 group-hover:bg-white transition-colors shadow">
                          <span>Buka Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* List of Admin-Input Jaka Garong Potential items */}
            {jakaDbList.length > 0 && (
              <div className="space-y-12 pt-16 border-t border-slate-200/80">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h3 className="text-2xl font-extrabold text-[#14532D] font-heading">
                    Daftar Sektor & Layanan Jaka Garong
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">Daftar paket wisata, fasilitas outbound, dan dokumentasi baru yang dikelola oleh admin.</p>
                </div>
                <div className="space-y-10">
                  {jakaDbList.map((pot, idx) => (
                    <div key={pot.id} className="bg-white rounded-3xl border border-slate-200/60 p-6 lg:p-8 shadow-sm flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-x-12 lg:gap-y-4 items-center lg:items-start hover-scale-glow transition-all duration-300">
                      {/* Title & Badge */}
                      <div className="order-1 lg:col-span-7 space-y-3 w-full">
                        <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-[#14532D]/5">
                          <Tent className="h-3 w-3 text-[#84CC16]" />
                          <span>Fasilitas Jaka Garong #{idx + 1}</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-[#14532D] leading-tight font-heading">
                          {pot.nama_potensi}
                        </h3>
                      </div>

                      {/* Photo Carousel */}
                      <div className="order-2 lg:col-span-5 lg:row-span-2 w-full">
                        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200/60 aspect-[4/3] relative bg-[#F5F7F2]">
                          <PhotoCarousel photos={getPhotos(pot.foto_url)} alt={pot.nama_potensi} />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="order-3 lg:col-span-7 w-full">
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans font-medium whitespace-pre-line">
                          {pot.deskripsi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        )}

        {activeTab === 'lainnya' && (
          /* "Lainnya" Tab Content - Displays all other input sectors as cards */
          <div className="space-y-8 animate-fade-in-up">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#84CC16] animate-float" />
                <span>Potensi Tambahan</span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#14532D] font-heading leading-tight">Potensi Warga & Kegiatan Tambahan</h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans font-medium">
                Menampilkan inisiatif warga, potensi wirausaha, olahraga, serta kegiatan kemasyarakatan lainnya di wilayah RT 01 Garongan.
              </p>
            </div>

            {lainnyaDbList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200/60 max-w-lg mx-auto shadow-sm hover-scale-glow transition-all duration-300">
                <Compass className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold">Belum ada potensi tambahan yang dimasukkan.</p>
                <p className="text-xs text-slate-400 mt-1 font-bold">Potensi tambahan yang diinputkan oleh Admin di panel dashboard akan muncul di sini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {lainnyaDbList.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden flex flex-col group hover-scale-glow transition-all duration-300 shadow-sm">
                    {/* Image Header / Carousel */}
                    <div className="h-64 bg-[#F5F7F2] overflow-hidden relative">
                      <PhotoCarousel photos={getPhotos(item.foto_url)} alt={item.nama_potensi} />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-[#84CC16] to-[#65a30d] text-white text-[10px] uppercase font-extrabold tracking-wider px-3.5 py-1.5 rounded-xl shadow-sm z-10">
                        Potensi Lain
                      </div>
                    </div>
                    {/* Content Body */}
                    <div className="p-6 flex-grow flex flex-col space-y-3">
                      <h3 className="text-lg font-extrabold text-[#1F2937] group-hover:text-[#14532D] transition-colors font-heading">
                        {item.nama_potensi}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed flex-grow whitespace-pre-line font-sans font-medium">
                        {item.deskripsi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
