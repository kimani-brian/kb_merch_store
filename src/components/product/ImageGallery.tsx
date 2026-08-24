"use client";

import { useState } from "react";
import Image from "next/image";
import { odooImageUrl } from "@/services/odooClient";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center border-2 border-brand-gray-dark bg-brand-gray-dark">
        <span className="font-display text-8xl text-neutral-700">KB</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Desktop vertical thumbnail strip */}
      <div className="hidden shrink-0 flex-col gap-3 sm:flex" role="tablist" aria-label="Product views">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            role="tab"
            aria-selected={activeIndex === i}
            aria-label={`View image ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={`relative h-20 w-20 overflow-hidden border-2 transition-colors ${
              activeIndex === i
                ? "border-brand-white"
                : "border-brand-gray-dark hover:border-neutral-600"
            }`}
          >
            <Image src={odooImageUrl(src)} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main stage / mobile carousel */}
      <div className="flex-1">
        {/* Mobile: swipeable scroll-snap strip */}
        <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto sm:hidden">
          {images.map((src, i) => (
            <div key={src + i} className="relative aspect-square w-full shrink-0 snap-center border-2 border-brand-gray-dark">
              <Image
                src={odooImageUrl(src)}
                alt={`${alt} view ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Desktop: main view with hover zoom */}
        <div
          className="relative hidden aspect-square cursor-zoom-in overflow-hidden border-2 border-brand-gray-dark sm:block"
          onClick={() => setZoomed(true)}
        >
          <Image
            src={odooImageUrl(images[activeIndex])}
            alt={`${alt} — view ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out hover:scale-125"
          />
          <span className="absolute bottom-3 left-3 bg-brand-black/80 px-2 py-1 font-mono text-[10px] tracking-widest text-neutral-400 uppercase">
            Click to zoom ///
          </span>
        </div>

        {/* Fullscreen zoom overlay */}
        {zoomed && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/95 p-4"
            onClick={() => setZoomed(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Zoomed product image"
          >
            <div className="relative h-full w-full max-w-4xl">
              <Image
                src={odooImageUrl(images[activeIndex])}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              type="button"
              className="absolute top-6 right-6 border-2 border-brand-gray-dark px-4 py-2 font-mono text-xs tracking-widest text-brand-white uppercase hover:border-brand-accent-red"
            >
              Close ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
