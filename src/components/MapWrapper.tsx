'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-primary-soft/50 rounded-2xl flex flex-col justify-center items-center text-primary font-bold animate-pulse space-y-2 border border-border">
      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      <span>Memuat peta interaktif Leaflet...</span>
    </div>
  ),
});

interface MapPoint {
  id?: string;
  nama_titik: string;
  latitude: number;
  longitude: number;
  deskripsi?: string;
  tipe?: 'Titik Kumpul' | 'Posko Darurat' | 'Jalur Evakuasi' | 'Lainnya';
}

interface MapWrapperProps {
  points: MapPoint[];
  adminMode?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  selectedCoords?: [number, number] | null;
}

export default function MapWrapper({
  points,
  adminMode = false,
  onMapClick,
  selectedCoords,
}: MapWrapperProps) {
  return (
    <Map
      points={points}
      adminMode={adminMode}
      onMapClick={onMapClick}
      selectedCoords={selectedCoords}
    />
  );
}
