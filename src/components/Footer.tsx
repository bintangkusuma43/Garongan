'use strict';
import React from 'react';
import Link from 'next/link';
import { Leaf, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#14532D] text-white border-t border-[#166534]">
      {/* Top Footer Segment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Column 1: Info and Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="bg-white text-[#14532D] p-2.5 rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow">
                <Leaf className="h-5 w-5 text-[#84CC16]" />
              </div>
              <div>
                <span className="font-extrabold text-lg block leading-none tracking-tight">RT 01 Garongan</span>
                <span className="text-xs text-white/70 block font-bold mt-0.5">Wonokerto, Turi, Sleman</span>
              </div>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm">
              Sistem Informasi Desa Wisata & Profil Kemasyarakatan resmi RT 01 Dusun Garongan. 
              Media integrasi potensi pertanian KWT, ekowisata Jaka Garong, dan peta jalur mitigasi evakuasi mandiri.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Tautan Cepat
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-[#84CC16] hover:underline transition-all">Beranda</Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-[#84CC16] hover:underline transition-all">Profil</Link>
              </li>
              <li>
                <Link href="/potensi" className="hover:text-[#84CC16] hover:underline transition-all">Potensi Dusun</Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-[#84CC16] hover:underline transition-all">Galeri Kegiatan</Link>
              </li>
              <li>
                <Link href="/mitigasi" className="hover:text-[#84CC16] hover:underline transition-all">Jalur Evakuasi</Link>
              </li>
              <li>
                <Link href="/lokasi" className="hover:text-[#84CC16] hover:underline transition-all">Lokasi</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Hubungi Kami
            </h3>
            <div className="space-y-3.5 text-sm text-white/80">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#84CC16] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  RT 01 / RW 20, Dusun Garongan, Wonokerto, Turi, Sleman, Daerah Istimewa Yogyakarta 55551
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#84CC16] flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#84CC16] flex-shrink-0" />
                <span>rt01.garongan@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-[#84CC16] flex-shrink-0" />
                <span>Pelayanan RT: 24 Jam (Darurat)</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Footer Segment */}
      <div className="bg-[#166534] py-5 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:justify-between md:items-center">
          <p className="text-xs text-white/70 font-medium">
            Copyright &copy; 2026 RT 01 Dusun Garongan. All rights reserved. - KKN AB.84.111 Megarongan
          </p>
          <p className="text-xs text-white/60 mt-2.5 md:mt-0 font-medium">
            Masyarakat Hebat, Dusun Mandiri, Alam Lestari.
          </p>
        </div>
      </div>
    </footer>
  );
}
