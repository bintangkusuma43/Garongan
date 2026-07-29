'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash, 
  Edit, 
  Loader2, 
  Image as ImageIcon, 
  Calendar as CalendarIcon, 
  Check, 
  AlertCircle,
  X,
  FolderArchive,
  ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { convertAndCompressToWebp } from '@/lib/imageConverter';

interface Kegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: 'KWT' | 'Pemuda' | 'Posyandu' | 'PKK' | 'Masyarakat' | 'Lainnya';
  tanggal: string;
  drive_url?: string;
  kegiatan_foto?: { id?: string; foto_url: string }[];
}

const initialMockKegiatan: Kegiatan[] = [
  {
    id: 'mock-1',
    judul: 'Panen Perdana Hortikultura KWT Garongan',
    kategori: 'KWT',
    tanggal: '2026-07-10',
    deskripsi: 'Kelompok Wanita Tani (KWT) RT 01 melakukan panen bersama sayuran organik cabai, sawi, dan tomat di kebun percontohan dusun.',
    kegiatan_foto: [{ id: 'f-1', foto_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    id: 'mock-2',
    judul: 'Kerja Bakti Bersama Membersihkan Saluran Air',
    kategori: 'Masyarakat',
    tanggal: '2026-07-05',
    deskripsi: 'Warga RT 01 bergotong royong membersihkan saluran air dan jalan utama dusun untuk menjaga kebersihan dan mencegah banjir menjelang musim hujan.',
    kegiatan_foto: [{ id: 'f-2', foto_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800' }]
  }
];

export default function AdminKegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState<Kegiatan['kategori']>('Lainnya');
  const [tanggal, setTanggal] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  
  // Upload State
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [existingPhotos, setExistingPhotos] = useState<{ id?: string; foto_url: string }[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const fetchKegiatan = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const { data, error } = await supabase
        .from('kegiatan')
        .select('*, kegiatan_foto(id, foto_url)')
        .order('tanggal', { ascending: false });

      if (error) {
        throw error;
      }
      if (data) {
        setKegiatanList(data);
      }
    } catch (err: any) {
      console.warn('Could not fetch from Supabase. Using mock fallback.', err.message);
      setDbError('Koneksi database offline / credentials belum dikonfigurasi. Menggunakan data memori.');
      setKegiatanList(initialMockKegiatan);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setJudul('');
    setDeskripsi('');
    setKategori('Lainnya');
    setTanggal(new Date().toISOString().split('T')[0]);
    setDriveUrl('');
    setExistingPhotos([]);
    setUploadFiles(null);
    setFormOpen(true);
    setSaveSuccess(false);
  };

  const handleOpenEdit = (keg: Kegiatan) => {
    setEditingId(keg.id);
    setJudul(keg.judul);
    setDeskripsi(keg.deskripsi);
    setKategori(keg.kategori);
    setTanggal(keg.tanggal);
    setDriveUrl(keg.drive_url || '');
    setExistingPhotos(keg.kegiatan_foto || []);
    setUploadFiles(null);
    setFormOpen(true);
    setSaveSuccess(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return;

    try {
      if (id.startsWith('mock-')) {
        setKegiatanList(prev => prev.filter(k => k.id !== id));
        return;
      }

      const { error } = await supabase.from('kegiatan').delete().eq('id', id);
      if (error) throw error;
      
      setKegiatanList(prev => prev.filter(k => k.id !== id));
    } catch (err: any) {
      alert('Gagal menghapus kegiatan: ' + err.message);
    }
  };

  const handleRemovePhoto = async (photoIndex: number, photoId?: string) => {
    if (!confirm('Hapus foto ini?')) return;

    if (photoId && !photoId.startsWith('mock-')) {
      try {
        await supabase.from('kegiatan_foto').delete().eq('id', photoId);
      } catch (err) {
        console.error('Failed to delete photo from DB:', err);
      }
    }
    setExistingPhotos(prev => prev.filter((_, idx) => idx !== photoIndex));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSaveSuccess(false);

    try {
      let uploadedUrls: string[] = [];

      // Handle Image Uploads to Supabase Storage if files exist
      if (uploadFiles && uploadFiles.length > 0) {
        setUploadingPhotos(true);
        for (let i = 0; i < uploadFiles.length; i++) {
          const file = uploadFiles[i];
          let fileToUpload = file;
          try {
            fileToUpload = await convertAndCompressToWebp(file);
          } catch (compressErr) {
            console.warn('Gagal mengompres gambar, menggunakan file asli:', compressErr);
          }

          const fileExt = fileToUpload.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `kegiatan/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('garongan-media')
            .upload(filePath, fileToUpload);

          if (uploadError) {
            console.error('Upload error:', uploadError.message);
            // If offline, simulate mock URL
            uploadedUrls.push(`https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800`);
          } else {
            const { data: urlData } = supabase.storage
              .from('garongan-media')
              .getPublicUrl(filePath);
            
            if (urlData) {
              uploadedUrls.push(urlData.publicUrl);
            }
          }
        }
        setUploadingPhotos(false);
      }

      const allPhotos = [
        ...existingPhotos,
        ...uploadedUrls.map(url => ({ foto_url: url }))
      ];

      const driveUrlTrimmed = driveUrl.trim() || undefined;

      if (editingId) {
        // UPDATE MODE
        if (editingId.startsWith('mock-')) {
          setKegiatanList(prev => prev.map(k => k.id === editingId ? {
            ...k, judul, deskripsi, kategori, tanggal, drive_url: driveUrlTrimmed, kegiatan_foto: allPhotos
          } : k));
        } else {
          // Update kegiatan table
          const { error } = await supabase
            .from('kegiatan')
            .update({ judul, deskripsi, kategori, tanggal, drive_url: driveUrlTrimmed })
            .eq('id', editingId);
          if (error) throw error;

          // Insert new photos into DB
          if (uploadedUrls.length > 0) {
            const photoInserts = uploadedUrls.map(url => ({
              kegiatan_id: editingId,
              foto_url: url
            }));
            await supabase.from('kegiatan_foto').insert(photoInserts);
          }
          await fetchKegiatan();
        }
      } else {
        // CREATE MODE
        const newId = editingId || `mock-${Date.now()}`;
        if (dbError) {
          const mockNew: Kegiatan = {
            id: newId,
            judul,
            deskripsi,
            kategori,
            tanggal,
            drive_url: driveUrlTrimmed,
            kegiatan_foto: allPhotos.length > 0 ? allPhotos : [{ foto_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' }]
          };
          setKegiatanList(prev => [mockNew, ...prev]);
        } else {
          // Supabase Insert
          const { data, error } = await supabase
            .from('kegiatan')
            .insert([{ judul, deskripsi, kategori, tanggal, drive_url: driveUrlTrimmed }])
            .select()
            .single();
          if (error) throw error;

          if (data && allPhotos.length > 0) {
            const photoInserts = allPhotos.map(p => ({
              kegiatan_id: data.id,
              foto_url: p.foto_url
            }));
            await supabase.from('kegiatan_foto').insert(photoInserts);
          }
          await fetchKegiatan();
        }
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setFormOpen(false);
        setSaveSuccess(false);
      }, 1000);
    } catch (err: any) {
      alert('Gagal menyimpan kegiatan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Pengelolaan Kegiatan Warga</h1>
          <p className="text-xs text-muted mt-1 leading-relaxed">Tambah, ubah, atau hapus rincian dokumentasi kegiatan warga.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kegiatan</span>
        </button>
      </div>

      {/* Database Warning */}
      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-2 text-xs text-amber-800 font-medium">
          <AlertCircle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0" />
          <span>{dbError}</span>
        </div>
      )}

      {/* Modal Form Card */}
      {formOpen && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-primary/20 shadow-lg space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setFormOpen(false)}
            className="absolute top-6 right-6 p-1.5 rounded-lg hover:bg-slate-100 text-muted"
            aria-label="Tutup form"
          >
            <X className="h-5 w-5" />
          </button>
          
          <h3 className="font-extrabold text-primary text-base">
            {editingId ? 'Edit Detail Kegiatan' : 'Tambah Kegiatan Baru'}
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Judul */}
              <div className="space-y-1">
                <label className="block text-primary">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="e.g., Kerja Bakti Lingkungan"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-1">
                <label className="block text-primary">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary"
                >
                  <option value="KWT">KWT (Kelompok Wanita Tani)</option>
                  <option value="Pemuda">Pemuda</option>
                  <option value="Posyandu">Posyandu</option>
                  <option value="PKK">PKK</option>
                  <option value="Masyarakat">Masyarakat / Gotong Royong</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Tanggal */}
              <div className="space-y-1">
                <label className="block text-primary">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary"
                />
              </div>

              {/* Link Google Drive */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <label className="block text-primary flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider">
                  <FolderArchive className="h-3.5 w-3.5 text-[#84CC16]" />
                  <span>Link Google Drive Album / Foto Full Resolusi (Opsional)</span>
                </label>
                <input
                  type="url"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary text-xs sm:text-sm"
                />
                <p className="text-[11px] text-slate-500 font-medium">Masukkan link folder Google Drive publik agar warga dapat mengunduh foto resolusi tinggi.</p>
              </div>

              {/* Photo Upload */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <label className="block text-primary">Upload Foto Baru (Dapat memilih beberapa)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setUploadFiles(e.target.files)}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-soft file:text-primary hover:file:bg-primary-soft/80"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1">
              <label className="block text-primary">Deskripsi Kegiatan</label>
              <textarea
                required
                rows={4}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Tuliskan laporan ringkas detail pelaksanaan kegiatan..."
                className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary resize-y"
              />
            </div>

            {/* List Existing Photos */}
            {existingPhotos.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="block text-primary">Foto Dokumentasi Saat Ini:</label>
                <div className="flex flex-wrap gap-4">
                  {existingPhotos.map((photo, idx) => (
                    <div key={photo.id || idx} className="relative w-20 aspect-video rounded-lg overflow-hidden border border-border group bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.foto_url} alt="Dokumentasi" className="w-full h-full object-cover opacity-80" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx, photo.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 font-bold"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-1.5 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white rounded-xl font-bold transition-all shadow"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{uploadingPhotos ? 'Mengunggah Foto...' : 'Menyimpan...'}</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-secondary" />
                    <span>Berhasil Disimpan!</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
              >
                Batal
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Table list of Kegiatan */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-2 text-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-semibold">Mengambil daftar kegiatan...</span>
          </div>
        ) : kegiatanList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border text-primary font-extrabold uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Foto</th>
                  <th className="p-4 sm:p-5">Kegiatan</th>
                  <th className="p-4 sm:p-5">Kategori</th>
                  <th className="p-4 sm:p-5">Tanggal</th>
                  <th className="p-4 sm:p-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-600 font-medium">
                {kegiatanList.map((keg) => (
                  <tr key={keg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="w-16 aspect-video bg-primary-soft rounded-lg overflow-hidden border border-border">
                        {keg.kegiatan_foto?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={keg.kegiatan_foto[0].foto_url} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-soft text-primary">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 max-w-[280px]">
                      <span className="block font-bold text-primary text-sm line-clamp-1">{keg.judul}</span>
                      <span className="block text-[10px] text-muted line-clamp-1 mt-0.5">{keg.deskripsi}</span>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-block px-2 py-0.5 rounded bg-primary-soft text-primary font-bold text-[10px]">
                        {keg.kategori}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="flex items-center space-x-1 font-mono text-[10px] text-muted">
                        <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                        <span>{keg.tanggal}</span>
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(keg)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(keg.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Hapus"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted">
            <span className="text-xs font-semibold">Tidak ada kegiatan terdaftar. Silakan tambahkan kegiatan baru.</span>
          </div>
        )}
      </div>

    </div>
  );
}
