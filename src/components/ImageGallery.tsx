'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  photos: { foto_url: string }[];
}

export default function ImageGallery({ photos }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full aspect-[16/10] bg-primary-soft rounded-2xl flex items-center justify-center text-muted text-xs">
        Tidak ada foto kegiatan.
      </div>
    );
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="space-y-4">
      {/* Primary Active Image Display */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border shadow-md bg-black flex items-center justify-center group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[activeIndex].foto_url}
          alt={`Foto Kegiatan ${activeIndex + 1}`}
          className="object-contain max-h-full max-w-full w-auto h-auto transition-all duration-300"
        />

        {/* Navigation arrows (only visible if more than 1 image) */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-primary hover:scale-105 transition-all shadow-md focus:outline-none opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-primary hover:scale-105 transition-all shadow-md focus:outline-none opacity-0 group-hover:opacity-100"
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
                className={`relative w-20 aspect-video rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  isActive ? 'border-primary scale-95 shadow' : 'border-transparent opacity-70 hover:opacity-100'
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
    </div>
  );
}
