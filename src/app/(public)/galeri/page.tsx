'use strict';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { Calendar, Filter, ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

interface SearchParams {
  category?: string;
}

export const metadata = {
  title: "Galeri Kegiatan Warga",
  description: "Dokumentasi foto dan catatan laporan kegiatan RT 01 Garongan meliputi kegiatan KWT, Pemuda, Posyandu, PKK, dan gotong royong masyarakat.",
};

const categories = ['Semua', 'KWT', 'Pemuda', 'Posyandu', 'PKK', 'Masyarakat', 'Lainnya'];

const mockActivities = [
  {
    id: 'mock-1',
    judul: 'Panen Perdana Hortikultura KWT Garongan',
    kategori: 'KWT',
    tanggal: '2026-07-10',
    deskripsi: 'Kelompok Wanita Tani (KWT) RT 01 melakukan panen bersama sayuran organik cabai, sawi, dan tomat di kebun percontohan dusun. Hasil panen dibagi rata untuk warga dan sebagian dipasarkan.',
    kegiatan_foto: [{ foto_url: '/images/kwt/kwt.jpeg' }]
  },
  {
    id: 'mock-2',
    judul: 'Kerja Bakti Bersama Membersihkan Saluran Air',
    kategori: 'Masyarakat',
    tanggal: '2026-07-05',
    deskripsi: 'Warga RT 01 bergotong royong membersihkan saluran air dan jalan utama dusun untuk menjaga kebersihan dan mencegah banjir menjelang musim hujan.',
    kegiatan_foto: [{ foto_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    id: 'mock-3',
    judul: 'Pemeriksaan Kesehatan Berkala Posyandu Balita',
    kategori: 'Posyandu',
    tanggal: '2026-06-25',
    deskripsi: 'Kegiatan rutin posyandu balita untuk pemantauan tumbuh kembang anak, pemberian vitamin, dan makanan tambahan bagi balita RT 01.',
    kegiatan_foto: [{ foto_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    id: 'mock-4',
    judul: 'Rapat Rutin Dasawisma PKK RT 01',
    kategori: 'PKK',
    tanggal: '2026-06-15',
    deskripsi: 'Pertemuan rutin ibu-ibu PKK membahas program kesehatan keluarga, tabungan warga, serta persiapan lomba kebersihan lingkungan.',
    kegiatan_foto: [{ foto_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    id: 'mock-5',
    judul: 'Turnamen Bulutangkis Pemuda Garongan Cup',
    kategori: 'Pemuda',
    tanggal: '2026-06-10',
    deskripsi: 'Kelompok Pemuda RT 01 menyelenggarakan turnamen persahabatan bulutangkis antar-RT untuk mempererat persaudaraan dan kebersamaan remaja.',
    kegiatan_foto: [{ foto_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800' }]
  }
];

export default async function GaleriPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const activeCategory = searchParams.category || 'Semua';

  let activities = [];
  let isSupabaseConfigured = true;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('kegiatan')
      .select('id, judul, deskripsi, kategori, tanggal, kegiatan_foto(foto_url)')
      .order('tanggal', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, using fallback:', error.message);
      activities = mockActivities;
    } else if (data && data.length > 0) {
      activities = data.map((item: any) => ({
        id: item.id,
        judul: item.judul,
        kategori: item.kategori,
        tanggal: item.tanggal,
        deskripsi: item.deskripsi,
        kegiatan_foto: item.kegiatan_foto && item.kegiatan_foto.length > 0 
          ? item.kegiatan_foto 
          : [{ foto_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' }]
      }));
    } else {
      activities = mockActivities;
    }
  } catch (err) {
    console.warn('Could not connect to Supabase. Using fallback.');
    isSupabaseConfigured = false;
    activities = mockActivities;
  }

  // Filter activities by category
  const filteredActivities = activeCategory === 'Semua'
    ? activities
    : activities.filter((act) => act.kategori === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 space-y-12 bg-[#FAFAF9] text-[#1F2937]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
        <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-[#14532D]/5">
          <Sparkles className="h-3.5 w-3.5 text-[#84CC16]" />
          <span>Kumpulan Kegiatan</span>
        </div>
        <h1 className="text-4xl font-extrabold text-[#14532D] tracking-tight font-heading">
          Galeri Kegiatan RT 01
        </h1>
        <p className="text-[#6B7280] leading-relaxed text-sm md:text-base font-sans">
          Dokumentasi dan laporan berkala kegiatan kemasyarakatan di Dusun Garongan, Kalurahan Wonokerto.
        </p>
        {!isSupabaseConfigured && (
          <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-800 text-[10px] rounded-full font-medium border border-yellow-200">
            ⚠️ Mode Offline. Menampilkan kegiatan contoh.
          </span>
        )}
      </div>

      {/* Filter Tabs Navigation */}
      <div className="flex bg-[#F5F7F2] p-1.5 rounded-2xl border border-slate-200/50 shadow-xs flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-[#14532D] px-4 py-2 font-extrabold text-xs sm:text-sm font-heading">
          <Filter className="h-4 w-4 text-[#84CC16]" />
          <span>Filter Kategori:</span>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={cat === 'Semua' ? '/galeri' : `/galeri?category=${cat}`}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all font-heading ${
                  isActive
                    ? 'bg-[#14532D] text-white shadow-md'
                    : 'text-slate-600 hover:text-[#14532D] hover:bg-[#FAFAF9]/60'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((act) => (
            <Link
              key={act.id}
              href={`/galeri/${act.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-md hover:border-[#14532D]/10 hover-lift transition-all duration-300 flex flex-col h-full shadow-sm"
            >
              <div className="h-52 relative overflow-hidden bg-[#F5F7F2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={act.kegiatan_foto?.[0]?.foto_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'}
                  alt={act.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#14532D] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg">
                  {act.kategori}
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="text-[11px] text-[#6B7280] font-bold flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#84CC16]" />
                    <span>
                      {new Date(act.tanggal).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[#1F2937] group-hover:text-[#14532D] text-base leading-snug font-heading transition-colors line-clamp-2">
                    {act.judul}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3 font-sans">
                    {act.deskripsi}
                  </p>
                </div>

                <div className="pt-2 text-xs font-bold text-[#14532D] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Lihat Selengkapnya</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto">
          <p className="text-slate-500 text-sm font-semibold">Tidak ada kegiatan dalam kategori ini.</p>
        </div>
      )}

    </div>
  );
}
