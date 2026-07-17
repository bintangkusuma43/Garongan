import React from 'react';
import { ShieldAlert, MapPin, Phone, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Map from '@/components/MapWrapper';

export const metadata = {
  title: "Peta Jalur Evakuasi & Mitigasi",
  description: "Peta jalur evakuasi interaktif RT 01 Garongan, titik kumpul darurat, posko bencana, serta panduan keselamatan kesiapsiagaan letusan Gunung Merapi.",
};

const fallbackPoints = [
  {
    id: '1',
    nama_titik: 'Titik Kumpul Utama - Lapangan RT 01',
    latitude: -7.6323,
    longitude: 110.3789,
    deskripsi: 'Area terbuka luas, aman dari reruntuhan bangunan. Tempat berkumpul pertama warga jika terjadi gempa atau bahaya Merapi.'
  },
  {
    id: '2',
    nama_titik: 'Posko Evakuasi Sementara - Pendopo Garongan',
    latitude: -7.6328,
    longitude: 110.3795,
    deskripsi: 'Digunakan untuk koordinasi awal, pos kesehatan darurat, dan logistik bantuan darurat.'
  },
  {
    id: '3',
    nama_titik: 'Jalur Evakuasi Barat (Arah Sungai Sempor)',
    latitude: -7.6320,
    longitude: 110.3775,
    deskripsi: 'Jalur jalan kaki alternatif menjauhi tebing curam dan area padat penduduk.'
  }
];

export default async function MitigasiPage() {
  let points = [];
  let isSupabaseConfigured = true;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('jalur_evakuasi')
      .select('*');

    if (error) {
      console.warn('Supabase fetch error for jalur_evakuasi, using fallback:', error.message);
      points = fallbackPoints;
    } else if (data && data.length > 0) {
      points = data;
    } else {
      points = fallbackPoints;
    }
  } catch (err) {
    console.warn('Supabase client error. Using mock evacuation markers.');
    isSupabaseConfigured = false;
    points = fallbackPoints;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-[#FAFAF9] text-[#1F2937]">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
        <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5 shadow-xs">
          <ShieldAlert className="h-3.5 w-3.5 text-[#84CC16] animate-pulse" />
          <span>Mitigasi Merapi Siaga</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#14532D] tracking-tight font-heading leading-tight">
          Jalur Evakuasi & Kesiapsiagaan Bencana
        </h1>
        <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans font-medium">
          Informasi rute penyelamatan diri, titik aman berkumpul, dan panduan mitigasi bencana letusan Gunung Merapi di lingkungan RT 01 Garongan.
        </p>
        {!isSupabaseConfigured && (
          <span className="inline-block px-3.5 py-1 bg-yellow-50 text-yellow-800 text-[10px] rounded-full font-bold border border-yellow-200">
            ⚠️ Database offline. Menggunakan koordinat dummy.
          </span>
        )}
      </div>

      {/* Grid: Map and Landmark details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Leaflet Map Display */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <h3 className="font-extrabold text-[#14532D] text-base flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5 text-[#84CC16] animate-float" />
            <span>Peta Jalur Evakuasi Interaktif</span>
          </h3>
          <div className="w-full flex-grow aspect-square md:aspect-[16/10] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl h-[480px] bg-slate-50 hover-scale-glow duration-500">
            <Map points={points} />
          </div>
          <p className="text-xs text-slate-500 font-bold italic">
            * Geser peta dan klik marker untuk melihat informasi lengkap detail lokasi.
          </p>
        </div>

        {/* Evacuation Points Details */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-extrabold text-[#14532D] text-base flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-[#14532D] animate-float" />
              <span>Titik & Posko Penting</span>
            </h3>
            
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {points.map((pt: any) => {
                let typeColor = 'bg-blue-600';
                let tagLabel = 'Lainnya';
                const lowerName = pt.nama_titik.toLowerCase();
                
                if (lowerName.includes('kumpul')) {
                  typeColor = 'bg-emerald-600';
                  tagLabel = 'Titik Kumpul';
                } else if (lowerName.includes('posko') || lowerName.includes('darurat') || lowerName.includes('pendopo')) {
                  typeColor = 'bg-red-600';
                  tagLabel = 'Posko Bencana';
                } else if (lowerName.includes('jalur') || lowerName.includes('evakuasi') || lowerName.includes('arah')) {
                  typeColor = 'bg-amber-600';
                  tagLabel = 'Rute Evakuasi';
                }

                return (
                  <div key={pt.id} className="bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-sm hover:border-[#14532D]/20 hover-scale-glow transition-all duration-300 space-y-2">
                    <div className="flex justify-between items-start space-x-3">
                      <h4 className="font-extrabold text-[#14532D] text-xs leading-normal">{pt.nama_titik}</h4>
                      <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-md text-white ${typeColor} flex-shrink-0 tracking-wide uppercase`}>
                        {tagLabel}
                      </span>
                    </div>
                    {pt.deskripsi && (
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                        {pt.deskripsi}
                      </p>
                    )}
                    <div className="text-[9px] text-slate-400 font-mono font-semibold">
                      Lat: {pt.latitude.toFixed(5)}, Lng: {pt.longitude.toFixed(5)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency contacts card */}
          <div className="bg-gradient-to-br from-[#14532D] via-[#114022] to-[#166534] text-white p-6 rounded-3xl shadow-xl border border-white/5 space-y-4 hover-glow duration-300">
            <h4 className="font-extrabold text-sm flex items-center space-x-2 tracking-wide uppercase">
              <Phone className="h-4.5 w-4.5 text-[#84CC16] animate-float" />
              <span>Kontak Darurat Bencana</span>
            </h4>
            <div className="space-y-3 text-xs text-emerald-100/90 font-sans font-medium">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Posko Merapi Wonokerto:</span>
                <span className="font-bold text-white tracking-wider">+62 811-2233-445</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
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
      </div>

      {/* Mitigation Procedures (Risk Reduction Guide) */}
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

    </div>
  );
}
