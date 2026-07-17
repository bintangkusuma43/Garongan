import React from 'react';
import { MapPin, Car, Navigation } from 'lucide-react';

export const metadata = {
  title: "Alamat & Lokasi Dusun",
  description: "Alamat lengkap, peta petunjuk arah Google Maps, dan petunjuk akses transportasi menuju RT 01 Dusun Garongan, Wonokerto, Turi, Sleman.",
};

export default function LokasiPage() {
  const mapQueryUrl = "https://maps.google.com/maps?q=Garongan%20Wonokerto%20Turi%20Sleman&t=&z=13&ie=UTF8&iwloc=&output=embed";
  const googleMapsAppUrl = "https://www.google.com/maps/search/?api=1&query=Garongan,+Wonokerto,+Turi,+Sleman,+Yogyakarta";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-[#FAFAF9] text-[#1F2937]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
        <div className="inline-flex items-center space-x-1.5 bg-[#F5F7F2] text-[#14532D] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-[#14532D]/5 shadow-xs">
          <MapPin className="h-3.5 w-3.5 text-[#84CC16] animate-float" />
          <span>Akses & Alamat</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#14532D] tracking-tight font-heading leading-tight">
          Alamat & Lokasi Dusun Garongan
        </h1>
        <p className="text-slate-600 leading-relaxed text-sm md:text-base font-sans font-medium">
          Temukan rute perjalanan terbaik menuju RT 01 Dusun Garongan, Wonokerto, Turi, Sleman, Yogyakarta.
        </p>
      </div>

      {/* Grid: Map and Text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Map Column */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="w-full flex-grow aspect-video lg:aspect-auto min-h-[360px] lg:min-h-[480px] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-emerald-50/50 hover-scale-glow duration-500">
            <iframe
              src={mapQueryUrl}
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Dusun Garongan"
            />
          </div>
          <div className="flex justify-end">
            <a
              href={googleMapsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-4 bg-[#14532D] hover:bg-[#166534] hover:shadow-[0_0_20px_rgba(20,83,45,0.35)] hover:scale-105 text-white rounded-2xl font-extrabold text-xs transition-all shadow-md group transform hover:-translate-y-0.5 duration-300"
            >
              <Navigation className="h-4.5 w-4.5 text-[#84CC16] group-hover:translate-x-0.5 transition-transform" />
              <span>Buka di Google Maps</span>
            </a>
          </div>
        </div>

        {/* Address and Access Instructions Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          
          {/* Card: Address */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover-scale-glow transition-all duration-300 space-y-4">
            <div className="flex items-center space-x-2.5 text-[#14532D] font-extrabold text-base font-heading">
              <MapPin className="h-5 w-5 text-[#84CC16] animate-float" />
              <span>Alamat Lengkap</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed font-sans font-medium">
              RT 01 Garongan, Kalurahan Wonokerto, Kapanewon Turi, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55551.
            </p>
            <div className="bg-[#F5F7F2]/60 p-5 rounded-2xl text-xs space-y-2.5 text-[#14532D] border border-slate-100 font-extrabold">
              <div className="flex justify-between">
                <span>Provinsi:</span>
                <span className="text-slate-700">D.I. Yogyakarta</span>
              </div>
              <div className="flex justify-between">
                <span>Kabupaten:</span>
                <span className="text-slate-700">Sleman</span>
              </div>
              <div className="flex justify-between">
                <span>Kapanewon:</span>
                <span className="text-slate-700">Turi</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/20 pt-2">
                <span>Kalurahan:</span>
                <span className="text-slate-700">Wonokerto</span>
              </div>
            </div>
          </div>

          {/* Card: Directions / Access */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm flex-grow space-y-6 hover-scale-glow transition-all duration-300">
            <div className="flex items-center space-x-2.5 text-[#14532D] font-extrabold text-base font-heading">
              <Car className="h-5 w-5 text-[#84CC16] animate-float" />
              <span>Informasi Akses Menuju Lokasi</span>
            </div>
            
            <div className="space-y-5 text-xs sm:text-sm text-slate-500">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-[#14532D] to-[#84CC16] text-white flex items-center justify-center w-8 h-8 rounded-full shadow-md font-extrabold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-extrabold text-[#14532D] text-xs uppercase tracking-wider">Kendaraan Pribadi (Motor & Mobil)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-sans font-semibold">
                    Dari Jalan Magelang, berkendara ke utara hingga pertigaan Tempel. Belok kanan (timur) arah Turi. Ikuti jalan utama hingga pertigaan Wonokerto, lalu berkendara ke utara menuju Dusun Garongan. Alternatif lain lewat Jalan Palagan Tentara Pelajar terus ke utara ke arah desa wisata.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-[#14532D] to-[#84CC16] text-white flex items-center justify-center w-8 h-8 rounded-full shadow-md font-extrabold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-extrabold text-[#14532D] text-xs uppercase tracking-wider">Bus Pariwisata & Rombongan</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-sans font-semibold">
                    Tersedia akses jalan beraspal yang cukup lebar untuk medium bus. Halaman parkir yang luas tersedia di area pendopo utama Desa Wisata Garongan (Jaka Garong). Untuk bus besar (big bus), disarankan melakukan koordinasi terlebih dahulu dengan pengelola parkir.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-[#14532D] to-[#84CC16] text-white flex items-center justify-center w-8 h-8 rounded-full shadow-md font-extrabold text-xs flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-extrabold text-[#14532D] text-xs uppercase tracking-wider">Dari Pusat Kota Yogyakarta</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-sans font-semibold">
                    Berjarak sekitar 22 kilometer (kurang lebih 45-50 menit berkendara normal) dari kawasan Tugu Yogyakarta atau Malioboro. Rute tercepat biasanya melalui Jalan Palagan Tentara Pelajar / Jalan Pulowatu.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
