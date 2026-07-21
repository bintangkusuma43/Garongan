import React from 'react';
import Link from 'next/link';
import { Calendar, Compass, MapPin, User, ArrowRight, Activity, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: "Dashboard Admin",
  description: "Dashboard panel admin pengelolaan data website RT 01 Dusun Garongan.",
};

export default async function AdminDashboardPage() {
  let stats = {
    kegiatan: 5, // fallback defaults
    potensi: 2,
  };
  
  let isSupabaseConfigured = true;

  try {
    const supabase = await createClient();
    
    // Fetch counts using Supabase API
    const [kegRes, potRes] = await Promise.all([
      supabase.from('kegiatan').select('*', { count: 'exact', head: true }),
      supabase.from('potensi_dusun').select('*', { count: 'exact', head: true }),
    ]);

    if (!kegRes.error && kegRes.count !== null) stats.kegiatan = kegRes.count;
    if (!potRes.error && potRes.count !== null) stats.potensi = potRes.count;
  } catch (err) {
    console.warn('Could not load statistics from Supabase database. Using fallback counts.');
    isSupabaseConfigured = false;
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Selamat Datang, Admin!</h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Kelola seluruh konten profil, potensi wisata & tani, publikasi kegiatan warga, dan peta jalur evakuasi RT 01 Dusun Garongan.
          </p>
        </div>
        {!isSupabaseConfigured && (
          <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] font-bold px-3 py-1 rounded-full">
            Mode Offline (Mock Data)
          </span>
        )}
      </div>

      {/* Grid: Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Stat: Kegiatan */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center space-x-4">
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Jumlah Kegiatan</span>
            <span className="text-2xl font-extrabold text-primary block mt-1">{stats.kegiatan}</span>
          </div>
        </div>

        {/* Stat: Potensi */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center space-x-4">
          <div className="bg-amber-50 text-amber-600 p-4 rounded-xl">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Sektor Potensi</span>
            <span className="text-2xl font-extrabold text-primary block mt-1">{stats.potensi}</span>
          </div>
        </div>

      </div>

      {/* Grid: Quick Actions & Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Quick Actions Shortcuts */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-primary text-base">Pintasan Pengelolaan</h3>
            <p className="text-xs text-muted">Akses cepat menu CRUD untuk memperbarui informasi website</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Link
              href="/admin/kegiatan"
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/20 hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center space-x-3 text-xs font-bold text-primary">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>Publikasikan Kegiatan</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/admin/potensi"
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/20 hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center space-x-3 text-xs font-bold text-primary">
                <Compass className="h-4 w-4 text-amber-600" />
                <span>Ubah Data Wisata & Tani</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/admin/profil"
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/20 hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center space-x-3 text-xs font-bold text-primary">
                <User className="h-4 w-4 text-blue-600" />
                <span>Ubah Struktur & Demografi</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
            </Link>

          </div>
        </div>

        {/* Database configuration summary */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-extrabold text-primary text-base flex items-center space-x-2">
              <Activity className="h-4.5 w-4.5 text-primary" />
              <span>Status Sistem Database</span>
            </h3>
            
            <div className="space-y-3 text-xs text-muted leading-relaxed">
              <div className="flex justify-between border-b border-border pb-2">
                <span>Database:</span>
                <span className="font-bold text-primary">Supabase PostgreSQL</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span>Storage bucket:</span>
                <span className="font-bold text-primary">garongan-media</span>
              </div>
              <div className="flex justify-between">
                <span>Status Koneksi:</span>
                <span className={`font-bold ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {isSupabaseConfigured ? 'Terhubung (Online)' : 'Terputus (Offline)'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-primary-soft p-4 rounded-xl text-[10px] text-muted flex items-start space-x-2">
            <Settings className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span>
              Seluruh perubahan data di panel ini akan langsung memengaruhi konten di halaman publik website RT 01 Garongan secara real-time.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
