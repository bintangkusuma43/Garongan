'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash, Edit, Loader2, MapPin, Check, AlertCircle, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Map from '@/components/MapWrapper';

interface EvacuationPoint {
  id: string;
  nama_titik: string;
  latitude: number;
  longitude: number;
  deskripsi: string;
}

const mockPoints: EvacuationPoint[] = [
  {
    id: 'mock-e-1',
    nama_titik: 'Titik Kumpul Utama - Lapangan RT 01',
    latitude: -7.6323,
    longitude: 110.3789,
    deskripsi: 'Area terbuka luas, aman dari reruntuhan bangunan. Tempat berkumpul pertama warga jika terjadi gempa atau bahaya Merapi.'
  },
  {
    id: 'mock-e-2',
    nama_titik: 'Posko Evakuasi Sementara - Pendopo Garongan',
    latitude: -7.6328,
    longitude: 110.3795,
    deskripsi: 'Digunakan untuk koordinasi awal, pos kesehatan darurat, dan logistik bantuan darurat.'
  }
];

export default function AdminPetaEvakuasiPage() {
  const [points, setPoints] = useState<EvacuationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [namaTitik, setNamaTitik] = useState('');
  const [latitude, setLatitude] = useState<number | ''>('');
  const [longitude, setLongitude] = useState<number | ''>('');
  const [deskripsi, setDeskripsi] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const { data, error } = await supabase
        .from('jalur_evakuasi')
        .select('*');

      if (error) throw error;
      if (data) setPoints(data);
    } catch (err: any) {
      console.warn('Supabase fetch failed for map points, using mock fallback.', err.message);
      setDbError('Koneksi database offline / credentials belum dikonfigurasi. Menggunakan data memori.');
      setPoints(mockPoints);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setNamaTitik('');
    setLatitude('');
    setLongitude('');
    setDeskripsi('');
    setFormOpen(true);
    setSaveSuccess(false);
  };

  const handleOpenEdit = (pt: EvacuationPoint) => {
    setEditingId(pt.id);
    setNamaTitik(pt.nama_titik);
    setLatitude(pt.latitude);
    setLongitude(pt.longitude);
    setDeskripsi(pt.deskripsi);
    setFormOpen(true);
    setSaveSuccess(false);
  };

  const handleMapClick = (lat: number, lng: number) => {
    // Fill coordinates from clicking the Leaflet map directly
    setLatitude(parseFloat(lat.toFixed(6)));
    setLongitude(parseFloat(lng.toFixed(6)));
    if (!formOpen) {
      // Auto open form if map was clicked while form is closed
      setFormOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus titik evakuasi ini?')) return;

    try {
      if (id.startsWith('mock-')) {
        setPoints(prev => prev.filter(p => p.id !== id));
        return;
      }

      const { error } = await supabase.from('jalur_evakuasi').delete().eq('id', id);
      if (error) throw error;

      setPoints(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Gagal menghapus titik: ' + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (latitude === '' || longitude === '') {
      alert('Tentukan koordinat Latitude dan Longitude dengan klik di peta.');
      return;
    }

    setSubmitting(true);
    setSaveSuccess(false);

    try {
      if (editingId && editingId.startsWith('mock-')) {
        setPoints(prev => prev.map(p => p.id === editingId ? {
          id: editingId, nama_titik: namaTitik, latitude, longitude, deskripsi
        } : p));
      } else if (editingId) {
        // Update database
        const { error } = await supabase
          .from('jalur_evakuasi')
          .update({ nama_titik: namaTitik, latitude, longitude, deskripsi })
          .eq('id', editingId);
        if (error) throw error;
        await fetchPoints();
      } else {
        // Create database
        const newId = `mock-${Date.now()}`;
        if (dbError) {
          setPoints(prev => [...prev, { id: newId, nama_titik: namaTitik, latitude, longitude, deskripsi }]);
        } else {
          const { error } = await supabase
            .from('jalur_evakuasi')
            .insert([{ nama_titik: namaTitik, latitude, longitude, deskripsi }]);
          if (error) throw error;
          await fetchPoints();
        }
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setFormOpen(false);
        setSaveSuccess(false);
      }, 1000);
    } catch (err: any) {
      alert('Gagal menyimpan titik koordinat: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Coords formatted for map active placement marker
  const mapSelection = (latitude !== '' && longitude !== '') ? [latitude, longitude] as [number, number] : null;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Peta & Jalur Evakuasi</h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Kelola titik kumpul, posko darurat, dan jalur evakuasi. Klik di peta untuk menentukan koordinat secara langsung.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Titik Baru</span>
        </button>
      </div>

      {/* Database Warning */}
      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-2 text-xs text-amber-800 font-medium">
          <AlertCircle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0" />
          <span>{dbError}</span>
        </div>
      )}

      {/* Grid: Map & Form / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Map Selector */}
        <div className="lg:col-span-8 flex flex-col space-y-2">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">
            Pilih Koordinat (Klik di Peta untuk memindahkan Pin Pilihan)
          </span>
          <div className="w-full aspect-video min-h-[350px] rounded-2xl overflow-hidden border border-border shadow-sm h-[400px]">
            <Map 
              points={points} 
              adminMode={true} 
              onMapClick={handleMapClick} 
              selectedCoords={mapSelection} 
            />
          </div>
        </div>

        {/* Right Side: Form and List */}
        <div className="lg:col-span-4 flex flex-col space-y-6 justify-between">
          
          {formOpen ? (
            /* Input / Edit Form */
            <div className="bg-white p-5 rounded-2xl border border-primary/20 shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-primary text-xs uppercase tracking-wider">
                  {editingId ? 'Edit Koordinat' : 'Tambah Koordinat'}
                </h3>
                <button onClick={() => setFormOpen(false)} className="p-1 rounded hover:bg-slate-100 text-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5 text-xs font-semibold text-primary">
                
                <div className="space-y-1">
                  <label className="block">Nama Titik / Posko</label>
                  <input
                    type="text"
                    required
                    value={namaTitik}
                    onChange={(e) => setNamaTitik(e.target.value)}
                    placeholder="e.g. Lapangan RT 01"
                    className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-normal outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      placeholder="-7.6323"
                      className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-mono font-normal outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
                      placeholder="110.3789"
                      className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-mono font-normal outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Petunjuk aman berkumpul warga..."
                    className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-normal outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-grow flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white rounded-lg font-bold transition-all text-[11px]"
                  >
                    {submitting ? (
                      <Loader2 className="h-3 w-3 animate-spin text-white" />
                    ) : saveSuccess ? (
                      <Check className="h-3 w-3 text-secondary" />
                    ) : (
                      <span>Simpan</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors text-[11px]"
                  >
                    Batal
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* Coords List Table */
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex-grow space-y-4 max-h-[400px] overflow-y-auto">
              <h3 className="font-extrabold text-primary text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Daftar Titik Aktif</span>
              </h3>
              
              <div className="space-y-3">
                {points.map((pt) => (
                  <div key={pt.id} className="p-3 rounded-lg bg-slate-50 border border-border space-y-2 hover:border-primary/20 transition-all text-[11px]">
                    <div className="flex justify-between items-start space-x-1">
                      <span className="font-bold text-primary block leading-tight">{pt.nama_titik}</span>
                      <div className="flex space-x-1.5 flex-shrink-0">
                        <button onClick={() => handleOpenEdit(pt)} className="text-blue-600 hover:underline">Edit</button>
                        <span className="text-slate-300">|</span>
                        <button onClick={() => handleDelete(pt.id)} className="text-red-500 hover:underline">Hapus</button>
                      </div>
                    </div>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      Lat: {pt.latitude.toFixed(4)}, Lng: {pt.longitude.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
