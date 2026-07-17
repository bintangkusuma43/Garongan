'use strict';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldAlert, MapPin, Calendar, Compass, Users, Award, Tent, HelpCircle, GitBranch, BarChart3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { HeroBackground } from '@/components/HeroBackground';

// Fallback mock data in case Supabase is empty or not yet connected
const mockKegiatan = [
  {
    id: 'mock-1',
    judul: 'Panen Perdana Hortikultura KWT Garongan',
    kategori: 'KWT',
    tanggal: '2026-07-10',
    deskripsi: 'Kelompok Wanita Tani (KWT) RT 01 melakukan panen bersama sayuran organik cabai, sawi, dan tomat di kebun percontohan dusun.',
    kegiatan_foto: [{ foto_url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    id: 'mock-2',
    judul: 'Kerja Bakti Bersama Membersihkan Saluran Air',
    kategori: 'Masyarakat',
    tanggal: '2026-07-05',
    deskripsi: 'Warga RT 01 bergotong royong membersihkan saluran air dan jalan utama dusun untuk menjaga kebersihan dan mencegah banjir.',
    kegiatan_foto: [{ foto_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    id: 'mock-3',
    judul: 'Sosialisasi Mitigasi Kebencanaan Merapi',
    kategori: 'Mitigasi',
    tanggal: '2026-06-28',
    deskripsi: 'Pertemuan warga RT 01 bersama BPBD Sleman untuk simulasi jalur evakuasi dan pengenalan rambu keselamatan bencana.',
    kegiatan_foto: [{ foto_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800' }]
  }
];

const mockProfil = {
  letak_geografis: 'Dusun Garongan terletak di Kalurahan Wonokerto, Kapanewon Turi, Kabupaten Sleman, Daerah Istimewa Yogyakarta. Dusun ini berada di lereng Gunung Merapi bagian selatan, dengan ketinggian sekitar 400-600 meter di atas permukaan laut.',
  data_kependudukan: {
    total_penduduk: 240,
    kepala_keluarga: 75,
    laki_laki: 118,
    perempuan: 122,
    pekerjaan: {
      "Petani / Pekebun": 45,
      "Karyawan Swasta": 35,
      "Wiraswasta": 20,
      "PNS / TNI / Polri": 10,
      "Lainnya": 15
    },
    kelompok_usia: {
      "Balita (0-5 th)": 15,
      "Anak (6-12 th)": 25,
      "Remaja (13-18 th)": 30,
      "Dewasa (19-59 th)": 135,
      "Lansia (60+ th)": 35
    }
  },
  struktur_organisasi: [
    { nama: "Supardi", jabatan: "Ketua RT 01", foto_url: "" },
    { nama: "Siti Aminah", jabatan: "Sekretaris RT 01", foto_url: "" },
    { nama: "Bambang Wijaya", jabatan: "Bendahara RT 01", foto_url: "" },
    { nama: "Rian Hidayat", jabatan: "Ketua Pemuda", foto_url: "" }
  ]
};

export default async function HomePage() {
  let latestKegiatan = [];
  let isSupabaseConfigured = true;
  let profil = mockProfil;

  try {
    const supabase = await createClient();
    
    // Fetch latest kegiatan
    const { data: kegiatanData, error: kegiatanError } = await supabase
      .from('kegiatan')
      .select('id, judul, deskripsi, kategori, tanggal, kegiatan_foto(foto_url)')
      .order('tanggal', { ascending: false })
      .limit(3);

    if (kegiatanError) {
      latestKegiatan = mockKegiatan;
    } else if (kegiatanData && kegiatanData.length > 0) {
      latestKegiatan = kegiatanData.map((item: any) => ({
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
      latestKegiatan = mockKegiatan;
    }

    // Fetch profile info
    const { data: profileData } = await supabase
      .from('profil_dusun')
      .select('*')
      .eq('id', 1)
      .single();

    if (profileData) {
      profil = {
        letak_geografis: profileData.letak_geografis || mockProfil.letak_geografis,
        data_kependudukan: typeof profileData.data_kependudukan === 'object' && profileData.data_kependudukan
          ? profileData.data_kependudukan
          : mockProfil.data_kependudukan,
        struktur_organisasi: Array.isArray(profileData.struktur_organisasi)
          ? profileData.struktur_organisasi
          : mockProfil.struktur_organisasi
      };
    }
  } catch (err) {
    console.warn('Could not initialize Supabase client for Homepage. Using fallback.');
    isSupabaseConfigured = false;
    latestKegiatan = mockKegiatan;
    profil = mockProfil;
  }

  const heroImages = [
    '/images/jakagarong/jakagarong-1.webp',
    '/images/jakagarong/jakagarong-2.webp',
    '/images/jakagarong/jakagarong-3.webp',
    '/images/jakagarong/jakagarong-4.webp',
    '/images/jakagarong/jakagarong-5.webp'
  ];

  return (
    <div className="w-full flex flex-col bg-[#FAFAF9] text-[#1F2937]">
      
      {/* 1. Hero Section (Parallax & Fullscreen) */}
      <section className="relative h-screen flex items-center text-white overflow-hidden">
        {/* Sliding Background */}
        <HeroBackground images={heroImages} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div className="max-w-4xl mx-auto space-y-7 animate-fade-in-up">
            
            {/* Top Badge */}
            <span className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-[#84CC16] uppercase tracking-widest mb-2 shadow-lg animate-float">
              <Leaf className="h-3.5 w-3.5 text-[#84CC16] animate-pulse" />
              <span>Modern Village Information System</span>
            </span>

            {/* Main Welcome */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-heading">
              Selamat Datang di <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84CC16] via-[#a3e635] to-[#facc15] filter drop-shadow-[0_2px_15px_rgba(132,204,22,0.35)]">Dusun Garongan</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed max-w-2xl mx-auto font-sans font-medium tracking-wide">
              Menjelajahi potensi dusun, mengenal kehidupan masyarakat, serta memperoleh informasi jalur evakuasi.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link
                href="/profil"
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#84CC16] to-[#65a30d] hover:shadow-[0_0_25px_rgba(132,204,22,0.45)] hover:scale-105 text-white rounded-2xl font-extrabold transition-all transform hover:-translate-y-1 duration-300 shadow-md"
              >
                <span>Jelajahi Dusun</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/mitigasi"
                className="flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/25 text-white rounded-2xl font-extrabold backdrop-blur-md transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transform hover:-translate-y-1 duration-300 shadow-sm"
              >
                Lihat Jalur Evakuasi
              </Link>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 text-white/70 animate-bounce">
          <span className="text-[9px] uppercase font-bold tracking-widest text-[#84CC16]">Scroll Down</span>
          <div className="w-5 h-9 border-2 border-white/30 rounded-full flex justify-center p-1 backdrop-blur-xs">
            <div className="w-1 h-2 bg-[#84CC16] rounded-full" />
          </div>
        </div>
      </section>

      {/* Env Warning banner */}
      {!isSupabaseConfigured && (
        <div className="bg-yellow-50 border-y border-yellow-200 py-3 text-center text-xs text-yellow-800 font-medium">
          ⚠️ Supabase keys are not set. Showing realistic mock data. Fill out `.env.local` to connect to database.
        </div>
      )}

      {/* 2. Profil Dusun Section */}
      <section className="py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
          
          {/* Top Row: Foto Dusun | Informasi Profil */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left: Foto Dusun */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200/40 bg-slate-100 hover-scale-glow duration-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
                  alt="Pesona Dusun Garongan"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[#14532D] to-[#166534] text-white p-5.5 rounded-2xl shadow-2xl hidden sm:block max-w-[260px] border border-white/10 hover-glow duration-300">
                <span className="block font-bold text-sm text-[#84CC16] mb-1">Lereng Merapi 🏔️</span>
                <span className="text-[11px] text-white/80 leading-relaxed font-semibold block">Keindahan alam pedesaan yang sejuk, subur, dan asri.</span>
              </div>
            </div>

            {/* Right: Informasi Profil */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5">
                <Users className="h-3.5 w-3.5 text-[#84CC16]" />
                <span>Geografi & Demografi</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14532D] tracking-tight font-heading leading-tight">
                Sekilas Tentang Dusun Garongan
              </h2>
              <p className="text-slate-600 leading-relaxed text-base font-sans font-medium">
                Dusun Garongan terletak di lereng Gunung Merapi bagian selatan, Kalurahan Wonokerto, Kapanewon Turi, Sleman. Dikenal dengan udara pegunungan yang segar dan tanah subur, dusun ini merupakan salah satu sentra pertanian salak pondoh serta destinasi pariwisata petualangan alam yang berwawasan lingkungan.
              </p>
              
              {/* Premium Stat Widget Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                <div className="bg-gradient-to-b from-white to-[#F5F7F2] p-5 rounded-2xl border border-slate-200/50 text-center hover-scale-glow transition-all duration-300 shadow-sm">
                  <Users className="mx-auto h-5 w-5 text-[#84CC16] mb-1.5" />
                  <span className="block text-3xl font-extrabold text-[#14532D]">{profil.data_kependudukan.total_penduduk}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mt-1 block">Total Penduduk</span>
                </div>
                <div className="bg-gradient-to-b from-white to-[#F5F7F2] p-5 rounded-2xl border border-slate-200/50 text-center hover-scale-glow transition-all duration-300 shadow-sm">
                  <GitBranch className="mx-auto h-5 w-5 text-[#84CC16] mb-1.5" />
                  <span className="block text-3xl font-extrabold text-[#14532D]">{profil.data_kependudukan.kepala_keluarga}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mt-1 block">Kepala Keluarga</span>
                </div>
                <div className="bg-gradient-to-b from-white to-[#F5F7F2] p-5 rounded-2xl border border-slate-200/50 text-center hover-scale-glow transition-all duration-300 shadow-sm">
                  <MapPin className="mx-auto h-5 w-5 text-[#84CC16] mb-1.5" />
                  <span className="block text-3xl font-extrabold text-[#14532D]">RT 01</span>
                  <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mt-1 block">Fokus Wilayah</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-row additions: Charts, Timeline & Organization Cards */}
          <div className="pt-16 border-t border-slate-100 space-y-20">
            
            {/* 1. Demografi Charts */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-[#84CC16]" />
                <h3 className="text-xl font-extrabold text-[#14532D] font-heading">Statistik Kependudukan</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Job Chart */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200/70 hover-scale-glow transition-all space-y-6 shadow-sm">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#14532D]">Mata Pencaharian Utama</h4>
                  <div className="space-y-4">
                    {Object.entries(profil.data_kependudukan.pekerjaan).map(([job, count]) => {
                      const pct = profil.data_kependudukan.total_penduduk > 0 ? ((count as number) / profil.data_kependudukan.total_penduduk * 200).toFixed(1) : "0";
                      return (
                        <div key={job} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-slate-700">
                            <span>{job}</span>
                            <span className="font-extrabold text-[#14532D]">{count} Jiwa</span>
                          </div>
                          <div className="w-full bg-[#F5F7F2] rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-[#14532D] to-[#84CC16] h-full rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(parseFloat(pct) * 3, 100)}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Age Group Chart */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200/70 hover-scale-glow transition-all flex flex-col justify-between space-y-6 shadow-sm">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#14532D]">Komposisi Kelompok Usia</h4>
                  <div className="grid grid-cols-5 gap-3 pt-8 h-56 items-end">
                    {Object.entries(profil.data_kependudukan.kelompok_usia).map(([ageGroup, count]) => {
                      const maxCount = Math.max(...Object.values(profil.data_kependudukan.kelompok_usia) as number[]);
                      const heightPct = maxCount > 0 ? ((count as number) / maxCount) * 80 : 0;
                      return (
                        <div key={ageGroup} className="flex flex-col items-center space-y-2 h-full justify-end group">
                          <div className="text-[10px] font-extrabold text-[#14532D] opacity-0 group-hover:opacity-100 transition-opacity bg-[#F5F7F2] px-2 py-0.5 rounded shadow-sm border border-slate-100">
                            {count}
                          </div>
                          <div 
                            className="w-full bg-gradient-to-t from-[#14532D] to-[#84CC16] hover:from-[#84CC16] hover:to-[#14532D] rounded-t-2xl transition-all duration-500 shadow-sm" 
                            style={{ height: `${Math.max(heightPct, 8)}%` }} 
                          />
                          <div className="text-[9px] sm:text-[10px] text-slate-500 text-center font-bold leading-none mt-2 min-h-[24px] flex items-center justify-center">
                            {ageGroup}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Timeline Sejarah Singkat */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#84CC16]" />
                <h3 className="text-xl font-extrabold text-[#14532D] font-heading">Lini Masa Sejarah Dusun</h3>
              </div>
              
              <div className="relative border-l-3 border-[#F5F7F2] ml-4 space-y-8 py-4">
                <div className="relative pl-8 group transition-all duration-300 cursor-default">
                  <div className="absolute -left-[10px] top-2.5 bg-white border-4 border-slate-200 group-hover:border-[#14532D] rounded-full w-5 h-5 transition-all duration-300 group-hover:scale-110 shadow-md" />
                  <span className="text-[10px] font-extrabold text-[#14532D] bg-[#F5F7F2] group-hover:bg-[#14532D] group-hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 border border-[#14532D]/5 shadow-sm">1972</span>
                  <h5 className="font-extrabold text-sm sm:text-base text-slate-800 group-hover:text-[#14532D] mt-2.5 font-heading transition-colors">Pembukaan Wilayah Hunian</h5>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl font-medium">Pemukiman baru di lereng selatan Merapi dibuka oleh warga pasca bencana alam lokal.</p>
                </div>
                <div className="relative pl-8 group transition-all duration-300 cursor-default">
                  <div className="absolute -left-[10px] top-2.5 bg-white border-4 border-slate-200 group-hover:border-[#14532D] rounded-full w-5 h-5 transition-all duration-300 group-hover:scale-110 shadow-md" />
                  <span className="text-[10px] font-extrabold text-[#14532D] bg-[#F5F7F2] group-hover:bg-[#14532D] group-hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 border border-[#14532D]/5 shadow-sm">1995</span>
                  <h5 className="font-extrabold text-sm sm:text-base text-slate-800 group-hover:text-[#14532D] mt-2.5 font-heading transition-colors">Sentra Budidaya Salak Pondoh</h5>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl font-medium">Transformasi perkebunan menjadi pusat budidaya salak pondoh khas Sleman.</p>
                </div>
                <div className="relative pl-8 group transition-all duration-300 cursor-default">
                  <div className="absolute -left-[10px] top-2.5 bg-white border-4 border-slate-200 group-hover:border-[#14532D] rounded-full w-5 h-5 transition-all duration-300 group-hover:scale-110 shadow-md" />
                  <span className="text-[10px] font-extrabold text-[#14532D] bg-[#F5F7F2] group-hover:bg-[#14532D] group-hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 border border-[#14532D]/5 shadow-sm">2012</span>
                  <h5 className="font-extrabold text-sm sm:text-base text-slate-800 group-hover:text-[#14532D] mt-2.5 font-heading transition-colors">Deklarasi Desa Wisata</h5>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl font-medium">Pendirian Jaka Garong sebagai destinasi camping, outbound, & susur sungai.</p>
                </div>
                <div className="relative pl-8 group transition-all duration-300 cursor-default">
                  <div className="absolute -left-[10px] top-2.5 bg-white border-4 border-slate-200 group-hover:border-[#14532D] rounded-full w-5 h-5 transition-all duration-300 group-hover:scale-110 shadow-md" />
                  <span className="text-[10px] font-extrabold text-[#14532D] bg-[#F5F7F2] group-hover:bg-[#14532D] group-hover:text-white px-3 py-1.5 rounded-full transition-all duration-300 border border-[#14532D]/5 shadow-sm">2026</span>
                  <h5 className="font-extrabold text-sm sm:text-base text-slate-800 group-hover:text-[#14532D] mt-2.5 font-heading transition-colors">Digitalisasi Portal Modern</h5>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-2xl font-medium">Peluncuran platform sistem informasi desa digital untuk warga RT 01.</p>
                </div>
              </div>
            </div>

            {/* 3. Bagan Struktur Kepengurusan */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5 text-[#84CC16]" />
                <h3 className="text-xl font-extrabold text-[#14532D] font-heading">Struktur Organisasi RT 01</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {profil.struktur_organisasi.map((member: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-3xl border border-slate-200/60 p-6 text-center space-y-4 shadow-sm hover:border-[#84CC16]/30 hover-scale-glow transition-all duration-300 group">
                    <div 
                      className="rounded-full overflow-hidden bg-[#F5F7F2] text-[#14532D] mx-auto flex items-center justify-center text-xl font-bold border-2 border-slate-100 group-hover:border-[#84CC16] group-hover:scale-105 transition-all duration-500 shadow-inner"
                      style={{ width: '76px', height: '76px', minWidth: '76px', minHeight: '76px' }}
                    >
                      {member.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.foto_url} alt={member.nama} className="w-full h-full object-cover" />
                      ) : (
                        member.nama.charAt(0)
                      )}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm font-heading">{member.nama}</h4>
                      <span className="inline-block text-[9px] font-extrabold text-[#14532D] bg-[#F5F7F2] px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#14532D]/5">
                        {member.jabatan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Potensi Dusun */}
      <section className="py-28 bg-[#F5F7F2]/40 border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center space-x-1.5 bg-white border border-slate-200/80 text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
              <Compass className="h-3.5 w-3.5 text-[#84CC16] animate-float" />
              <span>Destinasi Pariwisata & Pertanian</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14532D] tracking-tight font-heading leading-tight">
              Potensi Desa Wisata Unggulan
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-medium">
              Masyarakat aktif mengelola berbagai potensi pariwisata berkelanjutan dan ketahanan pangan berbasis komunitas lokal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* KWT Tourism Style Card */}
            <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden flex flex-col group hover-scale-glow transition-all duration-300 shadow-sm">
              <div className="h-76 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800"
                  alt="Aktivitas Pertanian KWT"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#14532D] to-[#166534] text-white text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Ketahanan Pangan
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs text-[#84CC16] font-extrabold">
                    <Award className="h-4.5 w-4.5" />
                    <span>Pemberdayaan Wanita Tani</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#14532D] font-heading">Kelompok Wanita Tani (KWT)</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-sans font-medium">
                    Pengembangan budidaya sayuran pangan hortikultura secara alami menggunakan pupuk kandang organik, serta penanaman tanaman TOGA (Obat Keluarga) demi kesejahteraan pangan keluarga mandiri.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#6B7280]">100% Organik & Alami</span>
                  <Link
                    href="/potensi?tab=kwt"
                    className="inline-flex items-center space-x-1.5 px-6 py-3.5 bg-gradient-to-r from-[#14532D] to-[#166534] hover:shadow-[0_0_20px_rgba(20,83,45,0.35)] hover:scale-105 text-white rounded-2xl text-xs font-extrabold transition-all shadow group"
                  >
                    <span>Detail KWT</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Jaka Garong Tourism Style Card */}
            <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden flex flex-col group hover-scale-glow transition-all duration-300 shadow-sm">
              <div className="h-76 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/jakagarong/jakagarong-1.webp"
                  alt="Camping Jaka Garong"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#84CC16] to-[#65a30d] text-white text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Ekowisata Terpadu
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs text-[#84CC16] font-extrabold">
                    <Tent className="h-4.5 w-4.5" />
                    <span>Petualangan Lereng Merapi</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#14532D] font-heading">Wisata Alam Jaka Garong</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-sans font-medium">
                    Menyuguhkan kesegaran udara kaki Gunung Merapi. Bumi perkemahan yang representatif untuk outbound korporat, LDK pramuka sekolah, makrab mahasiswa, dan susur aliran jernih Sungai Sempor.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#6B7280]">Camping & Outbound</span>
                  <Link
                    href="/potensi?tab=jakagarong"
                    className="inline-flex items-center space-x-1.5 px-6 py-3.5 bg-gradient-to-r from-[#14532D] to-[#166534] hover:shadow-[0_0_20px_rgba(20,83,45,0.35)] hover:scale-105 text-white rounded-2xl text-xs font-extrabold transition-all shadow group"
                  >
                    <span>Detail Jaka Garong</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Galeri Kegiatan Section */}
      <section className="py-28 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div className="space-y-3">
              <span className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5">
                <Calendar className="h-3.5 w-3.5 text-[#84CC16]" />
                <span>Kabar Dusun Terbaru</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14532D] tracking-tight font-heading leading-tight">
                Dokumentasi Kegiatan Warga
              </h2>
            </div>
            <Link
              href="/galeri"
              className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 font-extrabold text-[#14532D] hover:text-[#84CC16] transition-all text-sm group"
            >
              <span>Lihat Galeri Selengkapnya</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {/* Masonry-like responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestKegiatan.map((keg: any) => (
              <Link 
                key={keg.id} 
                href={`/galeri/${keg.id}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover-scale-glow transition-all duration-300 shadow-sm"
              >
                {/* Image Wrap */}
                <div className="h-58 relative overflow-hidden bg-emerald-50/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={keg.kegiatan_foto?.[0]?.foto_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'}
                    alt={keg.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  />
                  
                  {/* Hover detail button overlay */}
                  <div className="absolute inset-0 bg-[#14532D]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-[#14532D] text-xs font-extrabold px-4.5 py-2.5 rounded-xl shadow-md transform scale-90 group-hover:scale-100 transition-all duration-300">
                      Lihat Detail
                    </span>
                  </div>

                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#14532D] to-[#166534] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                    {keg.kategori}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="text-[11px] text-slate-500 font-bold flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#84CC16]" />
                      <span>
                        {new Date(keg.tanggal).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-base group-hover:text-[#14532D] transition-colors line-clamp-2 leading-snug font-heading">
                      {keg.judul}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed font-sans font-medium">
                      {keg.deskripsi}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Jalur Evakuasi Section */}
      <section className="py-28 bg-gradient-to-br from-[#14532D] via-[#0f3d21] to-[#14532D] text-white relative overflow-hidden border-b border-white/5">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Mitigation Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-1.5 bg-white/10 border border-white/20 text-[#84CC16] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider animate-float">
                <ShieldAlert className="h-3.5 w-3.5 animate-pulse" />
                <span>Mitigasi Merapi Siaga</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-heading">
                Kesiapsiagaan & Jalur Evakuasi Bencana
              </h2>
              <p className="text-white/80 leading-relaxed text-sm md:text-base font-sans font-medium">
                Berada di kawasan lereng Gunung Merapi membuat Dusun Garongan berkomitmen tinggi pada mitigasi bencana secara mandiri. Kami menyediakan sistem jalur evakuasi yang jelas, titik kumpul aman, dan posko koordinasi yang siap siaga demi keselamatan seluruh warga.
              </p>
              
              {/* Mitigasi Q&A Grid */}
              <div className="space-y-4 pt-2">
                <h4 className="font-extrabold text-sm text-[#84CC16] flex items-center space-x-2">
                  <HelpCircle className="h-4.5 w-4.5" />
                  <span>Apa yang harus dilakukan ketika terjadi bencana?</span>
                </h4>
                
                <div className="space-y-3.5 text-xs text-white/90 font-sans font-medium">
                  <div className="flex items-start space-x-3 bg-white/5 border border-white/15 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="bg-[#84CC16] text-[#14532D] px-2.5 py-0.5 rounded font-extrabold shadow-sm">1</div>
                    <p className="leading-relaxed"><strong>Jalur Evakuasi:</strong> Tetap tenang, tinggalkan rumah, dan segera berjalan cepat mengikuti rambu rute jalur evakuasi menuju jalan utama.</p>
                  </div>
                  <div className="flex items-start space-x-3 bg-white/5 border border-white/15 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="bg-[#84CC16] text-[#14532D] px-2.5 py-0.5 rounded font-extrabold shadow-sm">2</div>
                    <p className="leading-relaxed"><strong>Titik Kumpul:</strong> Berkumpul di lapangan titik kumpul aman yang telah ditentukan untuk pendataan warga dan koordinasi bantuan darurat.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link
                  href="/mitigasi"
                  className="inline-flex items-center space-x-2 px-7 py-4 bg-gradient-to-r from-[#84CC16] to-[#65a30d] hover:shadow-[0_0_25px_rgba(132,204,22,0.45)] hover:scale-105 text-[#14532D] rounded-2xl font-extrabold text-sm transition-all transform hover:-translate-y-0.5 duration-300 shadow-md"
                >
                  <span>Buka Peta Evakuasi</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Map Frame Illustration Column */}
            <div className="lg:col-span-7">
              <div className="bg-white/5 border border-white/10 p-3 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-[#166534]/50 flex flex-col justify-center items-center text-center p-6 relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-xs group-hover:scale-105 transition-transform duration-1000" 
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')" }} 
                  />
                  <div className="relative z-10 space-y-4">
                    <div className="bg-[#84CC16]/20 border border-[#84CC16]/40 text-[#84CC16] p-4.5 rounded-full w-fit mx-auto animate-pulse-ring">
                      <MapPin className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-extrabold text-white tracking-wide font-heading">Peta Jalur Evakuasi Interaktif</h3>
                    <p className="text-xs text-white/80 max-w-sm mx-auto leading-relaxed font-sans font-semibold">
                      Sistem terintegrasi Leaflet.js yang menunjukkan letak pos ronda, posko darurat bencana, dan rute pengungsian darurat warga.
                    </p>
                    <Link
                      href="/mitigasi"
                      className="inline-block px-5.5 py-3.5 bg-[#84CC16] text-[#14532D] hover:bg-[#84CC16]/95 hover:shadow-[0_0_15px_rgba(132,204,22,0.3)] hover:scale-105 rounded-xl text-xs font-extrabold transition-all shadow"
                    >
                      Buka Peta Leaflet
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Lokasi Section */}
      <section className="py-28 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5">
                <MapPin className="h-3.5 w-3.5 text-[#84CC16] animate-float" />
                <span>Akses & Alamat</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14532D] tracking-tight font-heading leading-tight">
                Lokasi Geografis Dusun Garongan
              </h2>
              <p className="text-slate-600 leading-relaxed text-base font-sans font-medium">
                Dusun Garongan terletak di Kalurahan Wonokerto, Kapanewon Turi, Sleman, DI Yogyakarta. Wilayah kami sangat mudah dijangkau dengan kendaraan roda dua maupun roda empat melalui rute Jalan Turi-Wonokerto.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover-scale-glow transition-all duration-300">
                  <div className="bg-[#F5F7F2] text-[#14532D] p-3 rounded-2xl border border-[#14532D]/5">
                    <MapPin className="h-5 w-5 text-[#84CC16]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#14532D] font-heading">Alamat Pengurus RT</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed font-sans font-medium">
                      RT 01 / RW 20, Dusun Garongan, Wonokerto, Turi, Sleman, D.I. Yogyakarta, Indonesia (Kode Pos: 55551)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <a
                  href="https://maps.app.goo.gl/tW3C7iF3t1XU9qM38" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-7 py-4 bg-gradient-to-r from-[#14532D] to-[#166534] hover:shadow-[0_0_20px_rgba(20,83,45,0.35)] hover:scale-105 text-white rounded-2xl font-extrabold text-sm transition-all transform hover:-translate-y-0.5 duration-300 shadow-md group"
                >
                  <span>Buka Google Maps</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>

            {/* Map Embed Frame */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200/40 aspect-[4/3] bg-slate-100 hover-scale-glow duration-500">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.593922659345!2d110.37021727411244!3d-7.619057875323533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5e55e0996fef%3A0xeab50d75a133f9cf!2sDesa%20Wisata%20Garongan!5e0!3m2!1sid!2sid!4v1721100000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Dusun Garongan"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

