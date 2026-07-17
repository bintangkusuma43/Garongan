'use client';

import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

// Setup Leaflet styling fix for server-side loading check
import 'leaflet/dist/leaflet.css';

interface MapPoint {
  id?: string;
  nama_titik: string;
  latitude: number;
  longitude: number;
  deskripsi?: string;
  tipe?: 'Titik Kumpul' | 'Posko Darurat' | 'Jalur Evakuasi' | 'Lainnya';
}

interface MapProps {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  adminMode?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  selectedCoords?: [number, number] | null;
}

// Function to create beautiful HTML-based pins with Tailwind classes
const createDivIcon = (type?: string) => {
  let colorClass = 'bg-blue-600';
  if (type === 'Titik Kumpul') colorClass = 'bg-emerald-600';
  else if (type === 'Posko Darurat') colorClass = 'bg-red-600';
  else if (type === 'Jalur Evakuasi') colorClass = 'bg-amber-600';

  return new L.DivIcon({
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${colorClass} text-white border-2 border-white shadow-lg transform transition-transform hover:scale-110">
        <span class="w-2.5 h-2.5 rounded-full bg-white"></span>
        <div class="absolute -bottom-1 w-2 h-2 ${colorClass} rotate-45 border-r border-b border-white"></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const adminSelectionIcon = new L.DivIcon({
  html: `
    <div class="relative flex items-center justify-center w-9 h-9 rounded-full bg-orange-500 text-white border-2 border-white shadow-xl animate-pulse">
      <span class="text-xs font-bold font-sans">!</span>
      <div class="absolute -bottom-1 w-2.5 h-2.5 bg-orange-500 rotate-45 border-r border-b border-white"></div>
    </div>
  `,
  className: 'custom-admin-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

// Click listener helper for Admin Mode
function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function Map({
  points,
  center = [-7.6323, 110.3789], // Center of RT 01 Garongan
  zoom = 17,
  adminMode = false,
  onMapClick,
  selectedCoords,
}: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-primary-soft/50 rounded-xl animate-pulse flex items-center justify-center text-primary font-semibold">
        Memuat Peta...
      </div>
    );
  }

  return (
    <div className="h-full w-full relative rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full min-h-[300px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Saved Points */}
        {points.map((point, index) => {
          // Categorize by name for icon color
          let type: any = 'Lainnya';
          if (point.nama_titik.toLowerCase().includes('kumpul')) type = 'Titik Kumpul';
          else if (point.nama_titik.toLowerCase().includes('posko') || point.nama_titik.toLowerCase().includes('darurat')) type = 'Posko Darurat';
          else if (point.nama_titik.toLowerCase().includes('jalur') || point.nama_titik.toLowerCase().includes('evakuasi')) type = 'Jalur Evakuasi';

          return (
            <Marker
              key={point.id || index}
              position={[point.latitude, point.longitude]}
              icon={createDivIcon(type)}
            >
              <Popup>
                <div className="p-2 space-y-1 font-sans">
                  <h4 className="font-bold text-primary text-sm leading-tight">{point.nama_titik}</h4>
                  <span className={`inline-block text-[9px] px-2 py-0.5 rounded font-bold text-white ${
                    type === 'Titik Kumpul' ? 'bg-emerald-600' :
                    type === 'Posko Darurat' ? 'bg-red-600' :
                    type === 'Jalur Evakuasi' ? 'bg-amber-600' : 'bg-blue-600'
                  }`}>
                    {type}
                  </span>
                  {point.deskripsi && (
                    <p className="text-xs text-slate-600 mt-1 leading-normal max-w-[200px]">
                      {point.deskripsi}
                    </p>
                  )}
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Lat: {point.latitude.toFixed(5)}, Lng: {point.longitude.toFixed(5)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Render Temp Marker in Admin Mode */}
        {adminMode && selectedCoords && (
          <Marker position={selectedCoords} icon={adminSelectionIcon}>
            <Popup>
              <div className="text-xs font-bold text-orange-600 font-sans p-1">
                Lokasi yang Dipilih
              </div>
            </Popup>
          </Marker>
        )}

        {/* Listen to clicks in admin mode */}
        {adminMode && <MapEvents onMapClick={onMapClick} />}
      </MapContainer>
    </div>
  );
}
