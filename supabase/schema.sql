-- Supabase Database Schema for RT 01 Garongan Profile Website

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table: kegiatan
CREATE TABLE IF NOT EXISTS public.kegiatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    deskripsi TEXT,
    kategori TEXT NOT NULL CHECK (kategori IN ('KWT', 'Pemuda', 'Posyandu', 'PKK', 'Masyarakat', 'Lainnya')),
    tanggal DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: kegiatan_foto
CREATE TABLE IF NOT EXISTS public.kegiatan_foto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kegiatan_id UUID NOT NULL REFERENCES public.kegiatan(id) ON DELETE CASCADE,
    foto_url TEXT NOT NULL
);

-- 3. Table: profil_dusun
CREATE TABLE IF NOT EXISTS public.profil_dusun (
    id INTEGER PRIMARY KEY DEFAULT 1, -- Single row profile (always id = 1)
    letak_geografis TEXT NOT NULL,
    data_kependudukan JSONB NOT NULL DEFAULT '{}'::jsonb,
    struktur_organisasi JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 4. Table: potensi_dusun
CREATE TABLE IF NOT EXISTS public.potensi_dusun (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_potensi TEXT NOT NULL,
    kategori TEXT NOT NULL DEFAULT 'Lainnya' CHECK (kategori IN ('KWT', 'Jaka Garong', 'Lainnya')),
    deskripsi TEXT NOT NULL,
    foto_url TEXT -- Banner / main photo
);

-- 5. Table: jalur_evakuasi
CREATE TABLE IF NOT EXISTS public.jalur_evakuasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_titik TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    deskripsi TEXT
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kegiatan_foto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profil_dusun ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.potensi_dusun ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jalur_evakuasi ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- Drop Policies if they already exist (Safe Re-run)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Enable read access for all users" ON public.kegiatan;
DROP POLICY IF EXISTS "Enable all access for authenticated users only" ON public.kegiatan;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.kegiatan_foto;
DROP POLICY IF EXISTS "Enable all access for authenticated users only" ON public.kegiatan_foto;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.profil_dusun;
DROP POLICY IF EXISTS "Enable all access for authenticated users only" ON public.profil_dusun;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.potensi_dusun;
DROP POLICY IF EXISTS "Enable all access for authenticated users only" ON public.potensi_dusun;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.jalur_evakuasi;
DROP POLICY IF EXISTS "Enable all access for authenticated users only" ON public.jalur_evakuasi;

-- ----------------------------------------------------
-- Create Policies (Read for public, Write for admin)
-- ----------------------------------------------------

-- RLS for kegiatan
CREATE POLICY "Enable read access for all users" ON public.kegiatan FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users only" ON public.kegiatan FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS for kegiatan_foto
CREATE POLICY "Enable read access for all users" ON public.kegiatan_foto FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users only" ON public.kegiatan_foto FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS for profil_dusun
CREATE POLICY "Enable read access for all users" ON public.profil_dusun FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users only" ON public.profil_dusun FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS for potensi_dusun
CREATE POLICY "Enable read access for all users" ON public.potensi_dusun FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users only" ON public.potensi_dusun FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS for jalur_evakuasi
CREATE POLICY "Enable read access for all users" ON public.jalur_evakuasi FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users only" ON public.jalur_evakuasi FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------------------------------------------------
-- Seed Initial Data
-- ----------------------------------------------------

-- Seed initial data for profil_dusun
INSERT INTO public.profil_dusun (id, letak_geografis, data_kependudukan, struktur_organisasi)
VALUES (
    1,
    'Dusun Garongan terletak di Kalurahan Wonokerto, Kapanewon Turi, Kabupaten Sleman, Daerah Istimewa Yogyakarta. Dusun ini berada di lereng Gunung Merapi bagian selatan, dengan ketinggian sekitar 400-600 meter di atas permukaan laut. Batas wilayah Dusun Garongan berbatasan dengan kebun salak pondoh dan area persawahan yang asri.',
    '{
        "total_penduduk": 240,
        "kepala_keluarga": 75,
        "laki_laki": 118,
        "perempuan": 122,
        "pekerjaan": {
            "Petani / Pekebun": 45,
            "Karyawan Swasta": 35,
            "Wiraswasta": 20,
            "PNS / TNI / Polri": 10,
            "Lainnya": 15
        },
        "kelompok_usia": {
            "Balita (0-5 th)": 15,
            "Anak (6-12 th)": 25,
            "Remaja (13-18 th)": 30,
            "Dewasa (19-59 th)": 135,
            "Lansia (60+ th)": 35
        }
    }'::jsonb,
    '[
        {"nama": "Supardi", "jabatan": "Ketua RT 01", "foto_url": ""},
        {"nama": "Siti Aminah", "jabatan": "Sekretaris RT 01", "foto_url": ""},
        {"nama": "Bambang Wijaya", "jabatan": "Bendahara RT 01", "foto_url": ""},
        {"nama": "Rian Hidayat", "jabatan": "Ketua Pemuda", "foto_url": ""}
    ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seed initial data for potensi_dusun
INSERT INTO public.potensi_dusun (nama_potensi, kategori, deskripsi, foto_url)
VALUES 
(
    'Kelompok Wanita Tani (KWT)',
    'KWT',
    'Kelompok Wanita Tani (KWT) merupakan wadah pemberdayaan perempuan di Dusun Garongan yang berperan aktif dalam kegiatan pertanian dan pemanfaatan lahan pekarangan. Melalui berbagai kegiatan budidaya tanaman pangan, hortikultura, serta tanaman obat keluarga, KWT berupaya meningkatkan ketahanan pangan dan kesejahteraan keluarga. Selain sebagai sarana belajar dan berbagi pengetahuan, KWT juga menjadi media untuk mempererat kebersamaan serta mendorong pemanfaatan potensi lokal secara berkelanjutan.',
    'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800'
),
(
    'Jaka Garong (Jelajah Alam Kampung Garongan)',
    'Jaka Garong',
    'Jaka Garong (Jelajah Alam Kampung Garongan) merupakan destinasi wisata alam yang berada di Dusun Garongan, Kalurahan Wonokerto, Kapanewon Turi, Kabupaten Sleman. Berlokasi di lereng Gunung Merapi dengan suasana pedesaan yang masih asri, Jaka Garong menawarkan udara sejuk, pemandangan alam yang indah, serta lingkungan yang nyaman untuk berbagai aktivitas luar ruang. Sebagai bagian dari Desa Wisata Garongan, Jaka Garong menyediakan berbagai fasilitas dan kegiatan, seperti bumi perkemahan (camping ground), outbound, makrab dan LDK, trekking Sungai Sempor, serta area pendopo dan fasilitas pendukung yang memadai. Keberadaan wisata ini menjadi salah satu daya tarik utama Dusun Garongan sekaligus berkontribusi dalam mengembangkan pariwisata berbasis masyarakat dan meningkatkan perekonomian warga.',
    '/images/jakagarong/jakagarong-1.webp'
)
ON CONFLICT DO NOTHING;

-- Seed initial data for jalur_evakuasi
INSERT INTO public.jalur_evakuasi (nama_titik, latitude, longitude, deskripsi)
VALUES
('Titik Kumpul Utama - Lapangan RT 01', -7.6323, 110.3789, 'Area terbuka luas, aman dari reruntuhan bangunan. Tempat berkumpul pertama warga jika terjadi gempa atau bahaya Merapi.'),
('Posko Evakuasi Sementara - Pendopo Garongan', -7.6328, 110.3795, 'Digunakan untuk koordinasi awal dan logistik bantuan darurat.'),
('Jalur Evakuasi Barat (Arah Sungai Sempor)', -7.6320, 110.3775, 'Jalur alternatif menuju area yang lebih rendah.')
ON CONFLICT DO NOTHING;
