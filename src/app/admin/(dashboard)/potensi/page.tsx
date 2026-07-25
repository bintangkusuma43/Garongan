'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Edit, Check, AlertCircle, Image as ImageIcon, Trash, Plus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { convertAndCompressToWebp } from '@/lib/imageConverter';

interface Potensi {
  id: string;
  nama_potensi: string;
  kategori?: string;
  deskripsi: string;
  foto_url?: string;
}

const mockPotensi: Potensi[] = [
  {
    id: 'mock-p-1',
    nama_potensi: 'Kelompok Wanita Tani (KWT)',
    kategori: 'KWT',
    deskripsi: 'Kelompok Wanita Tani (KWT) merupakan wadah pemberdayaan perempuan di Dusun Garongan yang berperan aktif dalam kegiatan pertanian dan pemanfaatan lahan pekarangan. Melalui berbagai kegiatan budidaya tanaman pangan, hortikultura, serta tanaman obat keluarga, KWT berupaya meningkatkan ketahanan pangan dan kesejahteraan keluarga.',
    foto_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mock-p-2',
    nama_potensi: 'Jaka Garong (Jelajah Alam Kampung Garongan)',
    kategori: 'Jaka Garong',
    deskripsi: 'Jaka Garong adalah destinasi wisata alam yang berada di Dusun Garongan, Kalurahan Wonokerto, Kapanewon Turi, Kabupaten Sleman. Berlokasi di lereng Gunung Merapi, kawasan ini menawarkan udara yang sejuk, pemandangan alam yang indah, serta suasana pedesaan yang masih alami.',
    foto_url: '/images/jakagarong/jakagarong-1.webp'
  }
];

export const getPhotos = (fotoUrl: string | null | undefined): string[] => {
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

export default function AdminPotensiPage() {
  const supabase = createClient();
  
  const [potensiList, setPotensiList] = useState<Potensi[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit & Create state flags
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form States
  const [namaPotensi, setNamaPotensi] = useState('');
  const [kategori, setKategori] = useState('Lainnya');
  const [deskripsi, setDeskripsi] = useState('');
  const [uploadFiles, setUploadFiles] = useState<(File | null)[]>([null, null, null]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(['', '', '']);
  
  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    fetchPotensi();
  }, []);

  const fetchPotensi = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const { data, error } = await supabase
        .from('potensi_dusun')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setPotensiList(data);
      } else {
        setPotensiList(mockPotensi);
      }
    } catch (err: any) {
      console.warn('Could not load potensi from Supabase. Falling back to mock data.', err.message);
      setDbError('Koneksi database offline / credentials belum dikonfigurasi. Menggunakan data memori.');
      setPotensiList(mockPotensi);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (pot: Potensi) => {
    setIsCreating(false);
    setEditingId(pot.id);
    setNamaPotensi(pot.nama_potensi);
    setKategori(pot.kategori || 'Lainnya');
    setDeskripsi(pot.deskripsi);
    setUploadFiles([null, null, null]);
    
    // Parse existing photos
    const existing = getPhotos(pot.foto_url);
    const populated = ['', '', ''];
    existing.forEach((url, i) => {
      if (i < 3) populated[i] = url;
    });
    setPreviewUrls(populated);
    setSaveSuccess(false);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setNamaPotensi('');
    setKategori('Lainnya');
    setDeskripsi('');
    setUploadFiles([null, null, null]);
    setPreviewUrls(['', '', '']);
    setSaveSuccess(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setUploadFiles([null, null, null]);
    setPreviewUrls(['', '', '']);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus sektor potensi ini secara permanen?')) {
      return;
    }

    try {
      if (id.startsWith('mock-') || dbError) {
        // Mock deletion
        setPotensiList(prev => prev.filter(p => p.id !== id));
      } else {
        // Supabase DB Delete
        const { error } = await supabase
          .from('potensi_dusun')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchPotensi();
      }
      alert('Sektor potensi berhasil dihapus.');
    } catch (err: any) {
      alert('Gagal menghapus potensi: ' + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSaveSuccess(false);

    try {
      const finalPhotos = [...previewUrls];

      // Upload Banner Images if selected
      for (let i = 0; i < 3; i++) {
        const file = uploadFiles[i];
        if (file) {
          let fileToUpload = file;
          try {
            fileToUpload = await convertAndCompressToWebp(file);
          } catch (compressErr) {
            console.warn('Gagal mengompres gambar, menggunakan file asli:', compressErr);
          }

          const fileExt = fileToUpload.name.split('.').pop() || 'webp';
          const fileName = `potensi-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `potensi/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('garongan-media')
            .upload(filePath, fileToUpload);

          if (uploadError) {
            console.error(`File upload ${i + 1} failed:`, uploadError.message);
          } else {
            const { data: urlData } = supabase.storage
              .from('garongan-media')
              .getPublicUrl(filePath);
            
            if (urlData) {
              finalPhotos[i] = urlData.publicUrl;
            }
          }
        }
      }

      // Filter empty urls and format as JSON string array
      const filteredPhotos = finalPhotos.filter(Boolean);
      const finalFotoUrlStr = JSON.stringify(filteredPhotos);

      if (isCreating) {
        // CREATE OPERATION
        if (dbError) {
          // Mock creation simulation
          const newMock = {
            id: `mock-p-${Date.now()}`,
            nama_potensi: namaPotensi,
            kategori: kategori,
            deskripsi,
            foto_url: finalFotoUrlStr
          };
          setPotensiList(prev => [newMock, ...prev]);
        } else {
          // Supabase DB Insert
          const { error } = await supabase
            .from('potensi_dusun')
            .insert([{
              nama_potensi: namaPotensi,
              kategori: kategori,
              deskripsi,
              foto_url: finalFotoUrlStr
            }]);

          if (error) throw error;
          await fetchPotensi();
        }
      } else if (editingId) {
        // UPDATE OPERATION
        if (editingId.startsWith('mock-')) {
          // Mock edit simulation
          setPotensiList(prev => prev.map(p => p.id === editingId ? {
            ...p, nama_potensi: namaPotensi, kategori: kategori, deskripsi, foto_url: finalFotoUrlStr
          } : p));
        } else {
          // Supabase DB Update
          const { error } = await supabase
            .from('potensi_dusun')
            .update({
              nama_potensi: namaPotensi,
              kategori: kategori,
              deskripsi,
              foto_url: finalFotoUrlStr
            })
            .eq('id', editingId);

          if (error) throw error;
          await fetchPotensi();
        }
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setEditingId(null);
        setIsCreating(false);
        setUploadFiles([null, null, null]);
        setPreviewUrls(['', '', '']);
        setSaveSuccess(false);
      }, 1000);
    } catch (err: any) {
      alert('Gagal menyimpan data potensi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Pengelolaan Potensi Dusun</h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">Ubah, tambah, atau hapus rincian profil Kelompok Wanita Tani (KWT), wisata alam Jaka Garong, dan potensi lainnya.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Potensi</span>
          </button>
        )}
      </div>

      {/* Database Warning */}
      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-2 text-xs text-amber-800 font-medium">
          <AlertCircle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0" />
          <span>{dbError}</span>
        </div>
      )}

      {/* Form Creator (New Potential) */}
      {isCreating && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-primary/20 shadow-md space-y-6">
          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-primary">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-extrabold text-primary text-base">Tambah Sektor Potensi Baru</h3>
              <button type="button" onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Potensi */}
              <div className="space-y-1">
                <label className="block">Nama Sektor Potensi</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Sektor Peternakan Sapi"
                  value={namaPotensi}
                  onChange={(e) => setNamaPotensi(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-1">
                <label className="block">Kategori Potensi</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="KWT">Kelompok Wanita Tani (KWT)</option>
                  <option value="Jaka Garong">Jaka Garong (Wisata)</option>
                  <option value="Lainnya">Lainnya (Sektor Tambahan)</option>
                </select>
              </div>
            </div>

            {/* Gallery Upload Slots */}
            <div className="space-y-2">
              <label className="block text-primary font-bold">Foto Galeri Potensi (Unggah hingga 3 Foto untuk Slider Carousel)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="border border-slate-200 p-3 rounded-2xl bg-[#F5F7F2]/40 flex flex-col space-y-2">
                    <span className="text-[10px] text-[#14532D] font-extrabold uppercase">Foto {idx + 1}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          const localUrl = URL.createObjectURL(file);
                          setPreviewUrls(prev => {
                            const copy = [...prev];
                            copy[idx] = localUrl;
                            return copy;
                          });
                          setUploadFiles(prev => {
                            const copy = [...prev];
                            copy[idx] = file;
                            return copy;
                          });
                        }
                      }}
                      className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-extrabold file:bg-primary-soft file:text-primary cursor-pointer"
                    />
                    {previewUrls[idx] && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrls[idx]} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            if (previewUrls[idx].startsWith('blob:')) {
                              URL.revokeObjectURL(previewUrls[idx]);
                            }
                            setPreviewUrls(prev => {
                              const copy = [...prev];
                              copy[idx] = '';
                              return copy;
                            });
                            setUploadFiles(prev => {
                              const copy = [...prev];
                              copy[idx] = null;
                              return copy;
                            });
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1">
              <label className="block">Deskripsi Lengkap Potensi</label>
              <textarea
                required
                rows={6}
                placeholder="Tuliskan penjelasan lengkap tentang potensi baru ini..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary resize-y"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-1.5 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white rounded-xl font-bold transition-all shadow"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Menyimpan...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-secondary" />
                    <span>Berhasil Ditambahkan!</span>
                  </>
                ) : (
                  <span>Simpan Potensi</span>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Display Cards */}
      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-2 text-muted bg-white rounded-3xl border border-border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs font-semibold">Mengambil data potensi...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {potensiList.map((pot) => {
            const isEditing = editingId === pot.id;
            return (
              <div key={pot.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm space-y-6">
                
                {isEditing ? (
                  /* Form Editor */
                  <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-primary">
                    <h3 className="font-extrabold text-primary text-base">Edit Potensi: {pot.nama_potensi}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nama Potensi */}
                      <div className="space-y-1">
                        <label className="block">Nama Sektor Potensi</label>
                        <input
                          type="text"
                          required
                          value={namaPotensi}
                          onChange={(e) => setNamaPotensi(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary"
                        />
                      </div>

                      {/* Kategori */}
                      <div className="space-y-1">
                        <label className="block">Kategori Potensi</label>
                        <select
                          value={kategori}
                          onChange={(e) => setKategori(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary bg-white cursor-pointer"
                        >
                          <option value="KWT">Kelompok Wanita Tani (KWT)</option>
                          <option value="Jaka Garong">Jaka Garong (Wisata)</option>
                          <option value="Lainnya">Lainnya (Sektor Tambahan)</option>
                        </select>
                      </div>
                    </div>

                    {/* Gallery Upload Slots */}
                    <div className="space-y-2">
                      <label className="block text-primary font-bold">Foto Galeri Potensi (Unggah hingga 3 Foto untuk Slider Carousel)</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((idx) => (
                          <div key={idx} className="border border-slate-200 p-3 rounded-2xl bg-[#F5F7F2]/40 flex flex-col space-y-2">
                            <span className="text-[10px] text-[#14532D] font-extrabold uppercase">Foto {idx + 1}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file) {
                                  const localUrl = URL.createObjectURL(file);
                                  setPreviewUrls(prev => {
                                    const copy = [...prev];
                                    copy[idx] = localUrl;
                                    return copy;
                                  });
                                  setUploadFiles(prev => {
                                    const copy = [...prev];
                                    copy[idx] = file;
                                    return copy;
                                  });
                                }
                              }}
                              className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-extrabold file:bg-primary-soft file:text-primary cursor-pointer"
                            />
                            {previewUrls[idx] && (
                              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={previewUrls[idx]} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (previewUrls[idx].startsWith('blob:')) {
                                      URL.revokeObjectURL(previewUrls[idx]);
                                    }
                                    setPreviewUrls(prev => {
                                      const copy = [...prev];
                                      copy[idx] = '';
                                      return copy;
                                    });
                                    setUploadFiles(prev => {
                                      const copy = [...prev];
                                      copy[idx] = null;
                                      return copy;
                                    });
                                  }}
                                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="space-y-1">
                      <label className="block">Deskripsi Lengkap Potensi</label>
                      <textarea
                        required
                        rows={6}
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary resize-y"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center space-x-1.5 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white rounded-xl font-bold transition-all shadow"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            <span>Menyimpan...</span>
                          </>
                        ) : saveSuccess ? (
                          <>
                            <Check className="h-4 w-4 text-secondary" />
                            <span>Berhasil Diupdate!</span>
                          </>
                        ) : (
                          <span>Update Data</span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display Section View */
                  <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                    <div className="space-y-4 flex-grow max-w-3xl">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-primary text-lg">{pot.nama_potensi}</h3>
                        <span className="px-2.5 py-0.5 bg-primary-soft text-primary text-[10px] uppercase font-bold rounded-full border border-primary/10">
                          {pot.kategori || 'Lainnya'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                        {pot.deskripsi}
                      </p>
                      <div className="flex items-center space-x-3 pt-1">
                        <button
                          onClick={() => handleStartEdit(pot)}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary-soft text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit Deskripsi & Foto</span>
                        </button>
                        <button
                          onClick={() => handleDelete(pot.id)}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          <Trash className="h-3.5 w-3.5" />
                          <span>Hapus Potensi</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Visual Banner Preview */}
                    <div className="w-full lg:w-60 aspect-video lg:aspect-square bg-primary-soft rounded-2xl overflow-hidden border border-border flex-shrink-0 relative">
                      {getPhotos(pot.foto_url).length > 0 ? (
                        <div className="w-full h-full relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={getPhotos(pot.foto_url)[0]} alt={pot.nama_potensi} className="w-full h-full object-cover" />
                          {getPhotos(pot.foto_url).length > 1 && (
                            <span className="absolute bottom-2 right-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                              +{getPhotos(pot.foto_url).length - 1} Foto
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
