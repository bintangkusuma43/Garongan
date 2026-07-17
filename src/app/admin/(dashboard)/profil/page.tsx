'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Check, AlertCircle, Compass, Users, GitBranch, Plus, Trash, Camera, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { convertAndCompressToWebp } from '@/lib/imageConverter';

interface Kependudukan {
  total_penduduk: number;
  kepala_keluarga: number;
  laki_laki: number;
  perempuan: number;
  pekerjaan: Record<string, number>;
  kelompok_usia: Record<string, number>;
}

interface OrganisasiMember {
  nama: string;
  jabatan: string;
  foto_url?: string;
}

interface ProfilData {
  letak_geografis: string;
  data_kependudukan: Kependudukan;
  struktur_organisasi: OrganisasiMember[];
}

const mockProfil: ProfilData = {
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

export default function AdminProfilPage() {
  const [activeTab, setActiveTab] = useState<'geo' | 'kependudukan' | 'struktur'>('geo');
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Geo State
  const [letakGeografis, setLetakGeografis] = useState('');

  // Kependudukan State
  const [totalPenduduk, setTotalPenduduk] = useState<number>(0);
  const [kepalaKeluarga, setKepalaKeluarga] = useState<number>(0);
  const [lakiLaki, setLakiLaki] = useState<number>(0);
  const [perempuan, setPerempuan] = useState<number>(0);
  
  // Job fields
  const [jobPetani, setJobPetani] = useState<number>(0);
  const [jobKaryawan, setJobKaryawan] = useState<number>(0);
  const [jobWiraswasta, setJobWiraswasta] = useState<number>(0);
  const [jobPns, setJobPns] = useState<number>(0);
  const [jobLainnya, setJobLainnya] = useState<number>(0);

  // Age fields
  const [ageBalita, setAgeBalita] = useState<number>(0);
  const [ageAnak, setAgeAnak] = useState<number>(0);
  const [ageRemaja, setAgeRemaja] = useState<number>(0);
  const [ageDewasa, setAgeDewasa] = useState<number>(0);
  const [ageLansia, setAgeLansia] = useState<number>(0);

  // Struktur State
  const [struktur, setStruktur] = useState<OrganisasiMember[]>([]);
  // Input additions
  const [newNama, setNewNama] = useState('');
  const [newJabatan, setNewJabatan] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [newFotoUrl, setNewFotoUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setDbError(null);
    try {
      const { data, error } = await supabase
        .from('profil_dusun')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      if (data) {
        populateState(data);
      }
    } catch (err: any) {
      console.warn('Could not fetch profile from DB. Using mock fallback.', err.message);
      setDbError('Koneksi database offline / credentials belum dikonfigurasi. Menggunakan data memori.');
      populateState(mockProfil);
    } finally {
      setLoading(false);
    }
  };

  const populateState = (data: any) => {
    setLetakGeografis(data.letak_geografis || '');
    
    const kep: Kependudukan = data.data_kependudukan || mockProfil.data_kependudukan;
    setTotalPenduduk(kep.total_penduduk || 0);
    setKepalaKeluarga(kep.kepala_keluarga || 0);
    setLakiLaki(kep.laki_laki || 0);
    setPerempuan(kep.perempuan || 0);

    const jobs = kep.pekerjaan || {};
    setJobPetani(jobs["Petani / Pekebun"] || 0);
    setJobKaryawan(jobs["Karyawan Swasta"] || 0);
    setJobWiraswasta(jobs["Wiraswasta"] || 0);
    setJobPns(jobs["PNS / TNI / Polri"] || 0);
    setJobLainnya(jobs["Lainnya"] || 0);

    const ages = kep.kelompok_usia || {};
    setAgeBalita(ages["Balita (0-5 th)"] || 0);
    setAgeAnak(ages["Anak (6-12 th)"] || 0);
    setAgeRemaja(ages["Remaja (13-18 th)"] || 0);
    setAgeDewasa(ages["Dewasa (19-59 th)"] || 0);
    setAgeLansia(ages["Lansia (60+ th)"] || 0);

    setStruktur(data.struktur_organisasi || []);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      let fileToUpload = file;
      try {
        fileToUpload = await convertAndCompressToWebp(file);
      } catch (compressErr) {
        console.warn('Compress failed, using original:', compressErr);
      }

      const fileExt = fileToUpload.name.split('.').pop() || 'webp';
      const fileName = `member-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `struktur/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('garongan-media')
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('garongan-media')
        .getPublicUrl(filePath);

      if (urlData) {
        setNewFotoUrl(urlData.publicUrl);
      }
    } catch (err: any) {
      alert('Gagal mengupload foto: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdateMemberPhoto = async (idx: number, file: File) => {
    try {
      let fileToUpload = file;
      try {
        fileToUpload = await convertAndCompressToWebp(file);
      } catch (compressErr) {
        console.warn('Compress failed, using original:', compressErr);
      }

      const fileExt = fileToUpload.name.split('.').pop() || 'webp';
      const fileName = `member-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `struktur/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('garongan-media')
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('garongan-media')
        .getPublicUrl(filePath);

      if (urlData) {
        const updatedUrl = urlData.publicUrl;
        setStruktur(prev => prev.map((m, i) => i === idx ? { ...m, foto_url: updatedUrl } : m));
        alert('Foto pengurus berhasil diperbarui! Jangan lupa simpan perubahan profil.');
      }
    } catch (err: any) {
      alert('Gagal mengupdate foto pengurus: ' + err.message);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama || !newJabatan) return;
    setStruktur(prev => [...prev, { nama: newNama, jabatan: newJabatan, foto_url: newFotoUrl }]);
    setNewNama('');
    setNewJabatan('');
    setNewFotoUrl('');
    const fileInput = document.getElementById('new-member-photo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleRemoveMember = (idx: number) => {
    setStruktur(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSaveSuccess(false);

    // Formulate JSON objects for DB
    const kependudukanObj: Kependudukan = {
      total_penduduk: totalPenduduk,
      kepala_keluarga: kepalaKeluarga,
      laki_laki: lakiLaki,
      perempuan: perempuan,
      pekerjaan: {
        "Petani / Pekebun": jobPetani,
        "Karyawan Swasta": jobKaryawan,
        "Wiraswasta": jobWiraswasta,
        "PNS / TNI / Polri": jobPns,
        "Lainnya": jobLainnya
      },
      kelompok_usia: {
        "Balita (0-5 th)": ageBalita,
        "Anak (6-12 th)": ageAnak,
        "Remaja (13-18 th)": ageRemaja,
        "Dewasa (19-59 th)": ageDewasa,
        "Lansia (60+ th)": ageLansia
      }
    };

    try {
      if (dbError) {
        // Mock save simulation
        mockProfil.letak_geografis = letakGeografis;
        mockProfil.data_kependudukan = kependudukanObj;
        mockProfil.struktur_organisasi = struktur;
      } else {
        const { error } = await supabase
          .from('profil_dusun')
          .update({
            letak_geografis: letakGeografis,
            data_kependudukan: kependudukanObj,
            struktur_organisasi: struktur
          })
          .eq('id', 1);

        if (error) throw error;
        await fetchProfile();
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 1000);
    } catch (err: any) {
      alert('Gagal memperbarui profil: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Pengelolaan Profil Dusun</h1>
        <p className="text-xs text-muted mt-1 leading-relaxed">Kelola data letak geografis, demografi, dan bagan kepengurusan RT 01.</p>
      </div>

      {/* Database Warning */}
      {dbError && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-2 text-xs text-amber-800 font-medium">
          <AlertCircle className="h-4.5 w-4.5 text-amber-600 flex-shrink-0" />
          <span>{dbError}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('geo')}
          className={`py-3.5 px-5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'geo' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Letak Geografis</span>
        </button>
        <button
          onClick={() => setActiveTab('kependudukan')}
          className={`py-3.5 px-5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'kependudukan' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Kependudukan</span>
        </button>
        <button
          onClick={() => setActiveTab('struktur')}
          className={`py-3.5 px-5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'struktur' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'
          }`}
        >
          <GitBranch className="h-4 w-4" />
          <span>Struktur Organisasi</span>
        </button>
      </div>

      {/* Editor Content Box */}
      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-2 text-muted bg-white rounded-3xl border border-border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs font-semibold">Mengambil data profil...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm space-y-6">
          
          {/* TAB 1: GEO */}
          {activeTab === 'geo' && (
            <div className="space-y-2 text-xs font-semibold text-primary">
              <h3 className="font-extrabold text-primary text-base mb-2">Ubah Letak Geografis</h3>
              <label className="block">Deskripsi Letak Geografis Dusun</label>
              <textarea
                rows={6}
                required
                value={letakGeografis}
                onChange={(e) => setLetakGeografis(e.target.value)}
                placeholder="Letak batas administrasi, ketinggian tempat, dan koordinat dusun..."
                className="w-full px-4 py-2.5 rounded-xl border border-border text-foreground font-normal outline-none focus:border-primary resize-y"
              />
            </div>
          )}

          {/* TAB 2: KEPENDUDUKAN */}
          {activeTab === 'kependudukan' && (
            <div className="space-y-6 text-xs font-semibold text-primary">
              <h3 className="font-extrabold text-primary text-base mb-2">Ubah Statistik Kependudukan</h3>
              
              {/* Highlight metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="block">Total Penduduk</label>
                  <input
                    type="number"
                    required
                    value={totalPenduduk}
                    onChange={(e) => setTotalPenduduk(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-normal focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block">Kepala Keluarga</label>
                  <input
                    type="number"
                    required
                    value={kepalaKeluarga}
                    onChange={(e) => setKepalaKeluarga(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-normal focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block">Laki-Laki</label>
                  <input
                    type="number"
                    required
                    value={lakiLaki}
                    onChange={(e) => setLakiLaki(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-normal focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block">Perempuan</label>
                  <input
                    type="number"
                    required
                    value={perempuan}
                    onChange={(e) => setPerempuan(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-normal focus:border-primary"
                  />
                </div>
              </div>

              {/* Jobs and Age Split grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                {/* Jobs Group */}
                <div className="space-y-3">
                  <h4 className="font-bold text-primary text-sm">Distribusi Pekerjaan (Jiwa)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Petani / Pekebun:</span>
                      <input
                        type="number"
                        value={jobPetani}
                        onChange={(e) => setJobPetani(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Karyawan Swasta:</span>
                      <input
                        type="number"
                        value={jobKaryawan}
                        onChange={(e) => setJobKaryawan(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Wiraswasta:</span>
                      <input
                        type="number"
                        value={jobWiraswasta}
                        onChange={(e) => setJobWiraswasta(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">PNS / TNI / Polri:</span>
                      <input
                        type="number"
                        value={jobPns}
                        onChange={(e) => setJobPns(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Lainnya:</span>
                      <input
                        type="number"
                        value={jobLainnya}
                        onChange={(e) => setJobLainnya(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                  </div>
                </div>

                {/* Age Group */}
                <div className="space-y-3">
                  <h4 className="font-bold text-primary text-sm">Distribusi Kelompok Usia (Jiwa)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Balita (0-5 th):</span>
                      <input
                        type="number"
                        value={ageBalita}
                        onChange={(e) => setAgeBalita(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Anak (6-12 th):</span>
                      <input
                        type="number"
                        value={ageAnak}
                        onChange={(e) => setAgeAnak(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Remaja (13-18 th):</span>
                      <input
                        type="number"
                        value={ageRemaja}
                        onChange={(e) => setAgeRemaja(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Dewasa (19-59 th):</span>
                      <input
                        type="number"
                        value={ageDewasa}
                        onChange={(e) => setAgeDewasa(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Lansia (60+ th):</span>
                      <input
                        type="number"
                        value={ageLansia}
                        onChange={(e) => setAgeLansia(parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded border border-border text-center font-normal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRUKTUR ORGANISASI */}
          {activeTab === 'struktur' && (
            <div className="space-y-6 text-xs font-semibold text-primary">
              <h3 className="font-extrabold text-primary text-base mb-2">Bagan Kepengurusan RT 01</h3>
              
              {/* Add New Member Form Segment */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-border space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#14532D]">Tambah Anggota Pengurus Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block">Nama Lengkap</label>
                    <input
                      type="text"
                      value={newNama}
                      onChange={(e) => setNewNama(e.target.value)}
                      placeholder="e.g. Supardi"
                      className="w-full px-3 py-2.5 rounded-xl border border-border font-normal text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block">Jabatan / Posisi</label>
                    <input
                      type="text"
                      value={newJabatan}
                      onChange={(e) => setNewJabatan(e.target.value)}
                      placeholder="e.g. Ketua RT 01"
                      className="w-full px-3 py-2.5 rounded-xl border border-border font-normal text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  
                  {/* Photo upload input */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block">Foto Pengurus</label>
                    <div className="flex items-center space-x-4">
                      <input
                        id="new-member-photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#F5F7F2] file:text-[#14532D] cursor-pointer"
                      />
                      {uploadingPhoto && (
                        <div className="flex items-center space-x-1 text-slate-500 font-normal">
                          <Loader2 className="h-4.5 w-4.5 animate-spin text-primary" />
                          <span>Uploading...</span>
                        </div>
                      )}
                      {!uploadingPhoto && newFotoUrl && (
                        <div 
                          className="rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0"
                          style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
                        >
                          <img src={newFotoUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={uploadingPhoto || !newNama || !newJabatan}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow transition-all"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Tambahkan Anggota</span>
                </button>
              </div>

              {/* List of current members */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#14532D]">Daftar Pengurus Saat Ini</h4>
                {struktur.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {struktur.map((member, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4.5 rounded-2xl border border-border bg-white shadow-xs">
                        <div className="flex items-center space-x-3.5">
                          <div 
                            className="rounded-full overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-200"
                            style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px' }}
                          >
                            {member.foto_url ? (
                              <img src={member.foto_url} alt={member.nama} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-[#14532D] text-lg">
                                {member.nama.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="block font-bold text-primary text-sm">{member.nama}</span>
                            <span className="block text-[10px] text-muted uppercase tracking-wider font-extrabold mt-0.5">{member.jabatan}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <label className="p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-primary cursor-pointer transition-colors" title="Ubah Foto">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpdateMemberPhoto(idx, file);
                              }}
                            />
                            <Camera className="h-4.5 w-4.5" />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <Trash className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-[11px] font-normal italic">Tidak ada pengurus terdaftar.</p>
                )}
              </div>
            </div>
          )}

          {/* Global Submit Action */}
          <div className="flex space-x-3 pt-6 border-t border-border">
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
                  <span>Profil Berhasil Diupdate!</span>
                </>
              ) : (
                <span>Simpan Perubahan Profil</span>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
