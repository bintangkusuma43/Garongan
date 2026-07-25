import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ChevronLeft, Tag } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ImageGallery from '@/components/ImageGallery';

interface PageProps {
  params: Promise<{ id: string }>;
}

const mockActivities = [
  {
    id: 'mock-1',
    judul: 'Panen Perdana Hortikultura KWT Garongan',
    kategori: 'KWT',
    tanggal: '2026-07-10',
    deskripsi: 'Kelompok Wanita Tani (KWT) RT 01 melakukan panen bersama sayuran organik cabai, sawi, dan tomat di kebun percontohan dusun. Hasil panen dibagi rata untuk warga dan sebagian dipasarkan. Kegiatan ini bertujuan memperkuat ketahanan pangan warga lokal serta memberdayakan wanita tani dalam budidaya sayuran sehat bebas pestisida.',
    kegiatan_foto: [
      { foto_url: '/images/kwt/kwt.jpeg' },
      { foto_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800' },
      { foto_url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'mock-2',
    judul: 'Kerja Bakti Bersama Membersihkan Saluran Air',
    kategori: 'Masyarakat',
    tanggal: '2026-07-05',
    deskripsi: 'Warga RT 01 bergotong royong membersihkan saluran air dan jalan utama dusun untuk menjaga kebersihan dan mencegah banjir menjelang musim hujan. Seluruh warga baik pemuda, bapak-bapak, maupun ibu-ibu berpartisipasi aktif dalam kegiatan gotong royong ini, yang ditutup dengan makan siang bersama hidangan nasi tumpeng.',
    kegiatan_foto: [
      { foto_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800' },
      { foto_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'mock-3',
    judul: 'Pemeriksaan Kesehatan Berkala Posyandu Balita',
    kategori: 'Posyandu',
    tanggal: '2026-06-25',
    deskripsi: 'Kegiatan rutin posyandu balita untuk pemantauan tumbuh kembang anak, pemberian vitamin, dan makanan tambahan bagi balita RT 01. Kader posyandu bekerja sama dengan petugas Puskesmas Turi membagikan bubur kacang hijau, mengukur berat/tinggi badan balita, serta memberikan imunisasi dasar secara lengkap.',
    kegiatan_foto: [
      { foto_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'mock-4',
    judul: 'Rapat Rutin Dasawisma PKK RT 01',
    kategori: 'PKK',
    tanggal: '2026-06-15',
    deskripsi: 'Pertemuan rutin ibu-ibu PKK membahas program kesehatan keluarga, tabungan warga, serta persiapan lomba kebersihan lingkungan. Rapat dipimpin oleh Ibu RT dan diakhiri dengan arisan rutin bulanan serta demo masak menu sehat ekonomis.',
    kegiatan_foto: [
      { foto_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'mock-5',
    judul: 'Turnamen Bulutangkis Pemuda Garongan Cup',
    kategori: 'Pemuda',
    tanggal: '2026-06-10',
    deskripsi: 'Kelompok Pemuda RT 01 menyelenggarakan turnamen persahabatan bulutangkis antar-RT untuk mempererat persaudaraan dan kebersamaan remaja. Turnamen ini diadakan di lapangan bulutangkis terbuka RT 01 Garongan pada sore hari.',
    kegiatan_foto: [
      { foto_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800' }
    ]
  }
];

export async function generateMetadata(props: PageProps) {
  const { id } = await props.params;
  return {
    title: `Detail Kegiatan: ${id}`,
  };
}

export default async function GaleriDetailPage({ params }: PageProps) {
  const { id } = await params;
  let activity = null;

  if (id.startsWith('mock-')) {
    activity = mockActivities.find((act) => act.id === id);
  } else {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('kegiatan')
        .select('id, judul, deskripsi, kategori, tanggal, kegiatan_foto(foto_url)')
        .eq('id', id)
        .single();

      if (data && !error) {
        activity = {
          id: data.id,
          judul: data.judul,
          kategori: data.kategori,
          tanggal: data.tanggal,
          deskripsi: data.deskripsi,
          kegiatan_foto: data.kegiatan_foto && data.kegiatan_foto.length > 0 
            ? data.kegiatan_foto 
            : [{ foto_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' }]
        };
      }
    } catch (err) {
      console.error('Error fetching detail from Supabase:', err);
    }
  }

  // Fallback to mock search in case database failed but client used custom UUID
  if (!activity) {
    activity = mockActivities[0]; // fallback to first mock item so page displays something
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/galeri"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-primary-light hover:underline transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Kembali ke Galeri</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Photo Gallery Component */}
        <ImageGallery photos={activity.kegiatan_foto} />

        {/* Info Text */}
        <div className="space-y-4 pt-4 border-t border-border">
          
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="inline-flex items-center space-x-1 bg-primary text-white px-2.5 py-1 rounded-md font-bold">
              <Tag className="h-3 w-3" />
              <span>{activity.kategori}</span>
            </span>
            <span className="text-muted flex items-center space-x-1.5 font-medium">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(activity.tanggal).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary leading-tight">
            {activity.judul}
          </h1>

          <p className="text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {activity.deskripsi}
          </p>
          
        </div>

      </div>

    </div>
  );
}
