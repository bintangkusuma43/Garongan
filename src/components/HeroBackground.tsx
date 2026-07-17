'use client';

import React, { useState, useEffect } from 'react';

interface HeroBackgroundProps {
  images: string[];
}

export function HeroBackground({ images }: HeroBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000); // Fade to next image every 6 seconds
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="absolute inset-0 bg-[#14532D]" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden z-0 bg-slate-950">
      {images.map((url, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            currentIndex === idx ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`Hero Background ${idx + 1}`}
            className="w-full h-full object-cover transform scale-102"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      
      {/* Dark Emerald Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#14532D]/90 via-[#14532D]/75 to-[#14532D]/90" />
      
      {/* Decorative Grid Line Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}
