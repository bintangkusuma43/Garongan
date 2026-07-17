'use strict';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Compass, Users, GitBranch, MapPin, Calendar, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

// Fallback profile data
const mockProfil = {
  letak_geografis: 'Dusun Garongan terletak di Kalurahan Wonokerto, Kapanewon Turi, Kabupaten Sleman, Daerah Istimewa Yogyakarta. Dusun ini berada di lereng Gunung Merapi bagian selatan, dengan ketinggian sekitar 400-600 meter di atas permukaan laut. Batas wilayah Dusun Garongan berbatasan dengan kebun salak pondoh dan area persawahan yang asri.',
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

export const metadata = {
  title: "Profil Dusun & Kependudukan",
  description: "Profil lengkap, data kependudukan (demografi), letak geografis, serta struktur organisasi pengurus RT 01 Dusun Garongan, Wonokerto, Turi, Sleman.",
};

export default async function ProfilPage() {
  let profil = mockProfil;
  let isSupabaseConfigured = true;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profil_dusun')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.warn('Supabase profil fetch error, using fallback:', error.message);
      profil = mockProfil;
    } else if (data) {
      profil = {
        letak_geografis: data.letak_geografis || mockProfil.letak_geografis,
        data_kependudukan: typeof data.data_kependudukan === 'object' && data.data_kependudukan
          ? data.data_kependudukan
          : mockProfil.data_kependudukan,
        struktur_organisasi: Array.isArray(data.struktur_organisasi)
          ? data.struktur_organisasi
          : mockProfil.struktur_organisasi
      };
    }
  } catch (err) {
    console.warn('Could not connect to Supabase for Profile. Using mock fallback.');
    isSupabaseConfigured = false;
    profil = mockProfil;
  }

  const { total_penduduk, kepala_keluarga, laki_laki, perempuan, pekerjaan, kelompok_usia } = profil.data_kependudukan;
  
  // Calculate percentages
  const pctLaki = ((laki_laki / total_penduduk) * 100).toFixed(1);
  const pctPerempuan = ((perempuan / total_penduduk) * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 space-y-24 bg-[#FAFAF9] text-[#1F2937]">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
        <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-[#84CC16] animate-float" />
          <span>Informasi Profil</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#14532D] tracking-tight font-heading leading-tight">
          Profil Dusun Garongan
        </h1>
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-sans font-medium">
          Ketahui lebih dalam mengenai letak geografis, demografi kependudukan, serta struktur kepengurusan organisasi RT 01 Dusun Garongan.
        </p>
        {!isSupabaseConfigured && (
          <span className="inline-block mt-4 px-3 py-1 bg-yellow-50 text-yellow-800 text-[10px] rounded-full font-medium border border-yellow-200">
            ⚠️ Mode Offline. Menampilkan profil default.
          </span>
        )}
      </div>

      {/* 1. Letak Geografis */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200/60 hover-scale-glow transition-all shadow-sm">
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#14532D] to-[#166534] rounded-2xl space-y-4 text-white hover-glow duration-300">
          <div className="bg-white/10 p-4.5 rounded-2xl shadow-inner border border-white/15">
            <Compass className="h-8 w-8 text-[#84CC16]" />
          </div>
          <h3 className="text-xl font-extrabold font-heading text-white tracking-wide">Letak Geografis</h3>
          <span className="text-xs font-extrabold px-4 py-2 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
            Lereng Merapi Selatan
          </span>
        </div>
        <div className="lg:col-span-8 space-y-4 pl-0 lg:pl-6">
          <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans font-medium whitespace-pre-line">
            {profil.letak_geografis}
          </p>
          <div className="flex items-center space-x-2.5 text-xs text-[#14532D] font-bold">
            <MapPin className="h-5 w-5 text-[#84CC16] flex-shrink-0" />
            <span>Ketinggian: ~450 mdpl | Topografi: Perbukitan / Lereng Gunung Berapi Subur</span>
          </div>
        </div>
      </section>

      {/* 2. Data Kependudukan */}
      <section className="space-y-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-xl border border-[#14532D]/5 shadow-sm">
            <Users className="h-5 w-5 text-[#84CC16] animate-float" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#14532D] font-heading">Data Kependudukan (Demografi)</h2>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 hover-scale-glow transition-all text-center shadow-sm">
            <Users className="mx-auto h-5 w-5 text-[#84CC16] mb-1.5" />
            <span className="text-slate-500 text-xs font-extrabold uppercase tracking-wider block">Total Penduduk</span>
            <span className="text-4xl font-extrabold text-[#14532D] block mt-2">{total_penduduk}</span>
            <span className="text-[10px] text-slate-400 font-bold block mt-1">Jiwa terdaftar di RT 01</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 hover-scale-glow transition-all text-center shadow-sm">
            <GitBranch className="mx-auto h-5 w-5 text-[#84CC16] mb-1.5" />
            <span className="text-slate-500 text-xs font-extrabold uppercase tracking-wider block">Kepala Keluarga</span>
            <span className="text-4xl font-extrabold text-[#14532D] block mt-2">{kepala_keluarga}</span>
            <span className="text-[10px] text-slate-400 font-bold block mt-1">Rata-rata 3.2 jiwa/KK</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 hover-scale-glow transition-all text-center shadow-sm">
            <Users className="mx-auto h-5 w-5 text-[#84CC16] mb-1.5" />
            <span className="text-slate-500 text-xs font-extrabold uppercase tracking-wider block">Laki-Laki</span>
            <span className="text-4xl font-extrabold text-[#14532D] block mt-2">{laki_laki}</span>
            <span className="text-[10px] text-[#14532D] font-extrabold block mt-1">{pctLaki}% dari total</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 hover-scale-glow transition-all text-center shadow-sm">
            <Users className="mx-auto h-5 w-5 text-[#84CC16] mb-1.5" />
            <span className="text-slate-500 text-xs font-extrabold uppercase tracking-wider block">Perempuan</span>
            <span className="text-4xl font-extrabold text-[#14532D] block mt-2">{perempuan}</span>
            <span className="text-[10px] text-[#14532D] font-extrabold block mt-1">{pctPerempuan}% dari total</span>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
          
          {/* Chart 1: Pekerjaan (Horizontal Bar Chart) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/70 hover-scale-glow transition-all space-y-6 shadow-sm">
            <div>
              <h3 className="font-extrabold text-[#14532D] text-lg font-heading">Mata Pencaharian Utama</h3>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Distribusi pekerjaan produktif warga RT 01 Garongan</p>
            </div>
            <div className="space-y-4">
              {Object.entries(pekerjaan).map(([job, count]) => {
                const percent = total_penduduk > 0 ? ((count as number) / total_penduduk * 200).toFixed(1) : "0";
                return (
                  <div key={job} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{job}</span>
                      <span className="text-[#14532D] font-extrabold">{count} Jiwa</span>
                    </div>
                    <div className="w-full bg-[#F5F7F2] rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#14532D] to-[#84CC16] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(parseFloat(percent) * 3, 100)}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Kelompok Usia (Vertical Bar Chart Layout) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/70 hover-scale-glow transition-all flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <h3 className="font-extrabold text-[#14532D] text-lg font-heading">Kelompok Usia</h3>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Komposisi umur warga dalam kelompok kategori usia</p>
            </div>
            <div className="grid grid-cols-5 gap-3 pt-6 h-60 items-end">
              {Object.entries(kelompok_usia).map(([ageGroup, count]) => {
                const maxCount = Math.max(...Object.values(kelompok_usia) as number[]);
                const heightPercentage = maxCount > 0 ? ((count as number) / maxCount) * 80 : 0;
                return (
                  <div key={ageGroup} className="flex flex-col items-center space-y-3 h-full justify-end group">
                    <div className="text-[10px] font-extrabold text-[#14532D] opacity-0 group-hover:opacity-100 transition-opacity bg-[#F5F7F2] px-2 py-0.5 rounded shadow-sm border border-slate-100">
                      {count}
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-[#14532D] to-[#84CC16] hover:from-[#84CC16] hover:to-[#14532D] rounded-t-2xl transition-all duration-500 shadow-sm" 
                      style={{ height: `${Math.max(heightPercentage, 8)}%` }} 
                    />
                    <div className="text-[9px] sm:text-[10px] text-slate-500 text-center font-bold leading-none mt-2 min-h-[30px] flex items-center justify-center">
                      {ageGroup}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Timeline Sejarah Dusun (Short History Timeline) */}
      <section className="space-y-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-xl border border-[#14532D]/5 shadow-sm">
            <Calendar className="h-5 w-5 text-[#84CC16]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#14532D] font-heading">Sejarah Dusun Garongan</h2>
        </div>

        <div className="relative border-l-3 border-[#F5F7F2] ml-4 md:ml-6 space-y-10 py-4">
          {/* Milestone 1 */}
          <div className="relative pl-8 md:pl-10 group transition-all duration-300 cursor-default">
            <div className="absolute -left-[10px] top-2.5 bg-white border-4 border-slate-200 group-hover:border-[#14532D] rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md" />
            <span className="inline-block px-3 py-1.5 bg-[#F5F7F2] group-hover:bg-[#14532D] group-hover:text-white text-[#14532D] text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-2.5 transition-all duration-300 border border-[#14532D]/5 shadow-sm">Tahun 1972</span>
            <h4 className="font-extrabold text-slate-800 group-hover:text-[#14532D] text-base sm:text-lg font-heading transition-colors">Pembukaan Wilayah Hunian</h4>
            <p className="text-slate-500 text-sm leading-relaxed mt-1 font-sans font-medium">Pembukaan area hunian baru di lereng selatan Gunung Merapi oleh sesepuh warga secara mandiri pasca bencana alam lokal.</p>
          </div>

          {/* Milestone 2 */}
          <div className="relative pl-8 md:pl-10 group transition-all duration-300 cursor-default">
            <div className="absolute -left-[10px] top-2.5 bg-white border-4 border-slate-200 group-hover:border-[#14532D] rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md" />
            <span className="inline-block px-3 py-1.5 bg-[#F5F7F2] group-hover:bg-[#14532D] group-hover:text-white text-[#14532D] text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-2.5 transition-all duration-300 border border-[#14532D]/5 shadow-sm">Tahun 1995</span>
            <h4 className="font-extrabold text-slate-800 group-hover:text-[#14532D] text-base sm:text-lg font-heading transition-colors">Sentra Budidaya Salak Pondoh</h4>
            <p className="text-slate-500 text-sm leading-relaxed mt-1 font-sans font-medium">Transformasi lahan perkebunan warga menjadi sentra produksi utama buah salak pondoh Sleman yang manis dan berdaya jual tinggi.</p>
          </div>

          {/* Milestone 3 */}
          <div className="relative pl-8 md:pl-10 group transition-all duration-300 cursor-default">
            <div className="absolute -left-[10px] top-2.5 bg-white border-4 border-slate-200 group-hover:border-[#14532D] rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md" />
            <span className="inline-block px-3 py-1.5 bg-[#F5F7F2] group-hover:bg-[#14532D] group-hover:text-white text-[#14532D] text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-2.5 transition-all duration-300 border border-[#14532D]/5 shadow-sm">Tahun 2012</span>
            <h4 className="font-extrabold text-slate-800 group-hover:text-[#14532D] text-base sm:text-lg font-heading transition-colors">Deklarasi Desa Wisata</h4>
            <p className="text-slate-500 text-sm leading-relaxed mt-1 font-sans font-medium">Dusun Garongan secara resmi dideklarasikan sebagai Desa Wisata berbasis ekologis dengan Jaka Garong sebagai magnet pariwisata camping dan outbound.</p>
          </div>

          {/* Milestone 4 */}
          <div className="relative pl-8 md:pl-10 group transition-all duration-300 cursor-default">
            <div className="absolute -left-[10px] top-2.5 bg-white border-4 border-slate-200 group-hover:border-[#14532D] rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md" />
            <span className="inline-block px-3 py-1.5 bg-[#F5F7F2] group-hover:bg-[#14532D] group-hover:text-white text-[#14532D] text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-2.5 transition-all duration-300 border border-[#14532D]/5 shadow-sm">Tahun 2020</span>
            <h4 className="font-extrabold text-slate-800 group-hover:text-[#14532D] text-base sm:text-lg font-heading transition-colors">Inisiasi KWT RT 01</h4>
            <p className="text-slate-500 text-sm leading-relaxed mt-1 font-sans font-medium">Pembentukan Kelompok Wanita Tani (KWT) RT 01 sebagai sarana pemberdayaan perempuan dalam ketahanan pangan sayur pekarangan organik secara mandiri.</p>
          </div>

          {/* Milestone 5 */}
          <div className="relative pl-8 md:pl-10 group transition-all duration-300 cursor-default">
            <div className="absolute -left-[10px] top-2.5 bg-white border-4 border-slate-200 group-hover:border-[#14532D] rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md" />
            <span className="inline-block px-3 py-1.5 bg-[#F5F7F2] group-hover:bg-[#14532D] group-hover:text-white text-[#14532D] text-[10px] font-extrabold rounded-full uppercase tracking-wider mb-2.5 transition-all duration-300 border border-[#14532D]/5 shadow-sm">Tahun 2026</span>
            <h4 className="font-extrabold text-slate-800 group-hover:text-[#14532D] text-base sm:text-lg font-heading transition-colors">Digitalisasi Portal Informasi</h4>
            <p className="text-slate-500 text-sm leading-relaxed mt-1 font-sans font-medium">Peluncuran resmi sistem informasi desa 'Modern Village Information System' untuk memudahkan komunikasi administratif dan penyebaran kabar warga.</p>
          </div>
        </div>
      </section>

      {/* 4. Struktur Organisasi */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-xl border border-[#14532D]/5 shadow-sm">
            <GitBranch className="h-5 w-5 text-[#84CC16]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#14532D] font-heading">Struktur Organisasi RT 01</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profil.struktur_organisasi.map((member, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200/60 p-6 text-center space-y-4 shadow-sm hover:border-[#84CC16]/30 hover-scale-glow transition-all duration-300 group">
              <div 
                className="rounded-full overflow-hidden bg-[#F5F7F2] text-[#14532D] mx-auto flex items-center justify-center text-2xl font-bold border-2 border-slate-100 group-hover:border-[#84CC16] group-hover:scale-105 transition-all duration-500 shadow-inner"
                style={{ width: '84px', height: '84px', minWidth: '84px', minHeight: '84px' }}
              >
                {member.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.foto_url} alt={member.nama} className="w-full h-full object-cover" />
                ) : (
                  member.nama.charAt(0)
                )}
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 text-base font-heading">{member.nama}</h4>
                <span className="inline-block text-[10px] font-extrabold text-[#14532D] bg-[#F5F7F2] px-3 py-1 rounded-full uppercase tracking-wider border border-[#14532D]/5">
                  {member.jabatan}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
