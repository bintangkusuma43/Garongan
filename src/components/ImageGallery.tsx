'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  photos: { foto_url: string }[];
}

export default function ImageGallery({ photos }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full aspect-[16/10] bg-primary-soft rounded-2xl flex items-center justify-center text-muted text-xs">
        Tidak ada foto kegiatan.
      </div>
    );
  }

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="space-y-4">
      {/* Primary Active Image Display */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-[#F5F7F2] group cursor-zoom-in"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[activeIndex].foto_url}
          alt={`Foto Kegiatan ${activeIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Zoom overlay on hover */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 text-primary p-2.5 rounded-full shadow-md flex items-center justify-center">
            <Maximize2 className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Navigation arrows (only visible if more than 1 image) */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-primary hover:scale-105 transition-all shadow-md focus:outline-none opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-primary hover:scale-105 transition-all shadow-md focus:outline-none opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Slide counter pill */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">
              {activeIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {photos.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1">
          {photos.map((photo, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative w-20 aspect-video rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  isActive ? 'border-[#14532D] ring-2 ring-[#84CC16]/60 scale-95 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.foto_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center animate-fade-in cursor-zoom-out"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 shadow-md focus:outline-none"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Left Arrow */}
          {photos.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 shadow-md focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Large Image Frame */}
          <div className="max-w-[90vw] max-h-[85vh] flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[activeIndex].foto_url}
              alt={`Foto Kegiatan ${activeIndex + 1}`}
              className="object-contain max-h-[80vh] max-w-full rounded-lg shadow-2xl transition-all duration-300"
            />
            {photos.length > 1 && (
              <span className="text-white/60 text-xs font-bold mt-4">
                {activeIndex + 1} / {photos.length}
              </span>
            )}
          </div>

          {/* Right Arrow */}
          {photos.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 shadow-md focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
