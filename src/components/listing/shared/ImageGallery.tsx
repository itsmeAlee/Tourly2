"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingImage } from "../types";

interface ImageGalleryProps {
    images: ListingImage[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [showLightbox, setShowLightbox] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Ensure we have at least 5 images (pad with first image if needed)
    const displayImages = [...images];
    while (displayImages.length < 5) {
        displayImages.push(images[0]);
    }

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setShowLightbox(true);
    };

    const closeLightbox = () => setShowLightbox(false);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            {/* Main Gallery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-3">
                {/* Large Main Image - Takes up 2 columns and 2 rows on desktop */}
                <div
                    className="lg:col-span-2 lg:row-span-2 relative cursor-pointer group h-64 lg:h-full"
                    onClick={() => openLightbox(0)}
                >
                    <Image
                        src={displayImages[0].url}
                        alt={displayImages[0].alt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover rounded-2xl group-hover:brightness-95 transition-all"
                    />
                </div>

                {/* 4 Smaller Images - 2x2 grid on desktop */}
                {displayImages.slice(1, 5).map((image, index) => (
                    <div
                        key={index}
                        className={cn(
                            "relative cursor-pointer group h-32 lg:h-40",
                            index < 2 ? "hidden lg:block" : "hidden lg:block"
                        )}
                        onClick={() => openLightbox(index + 1)}
                    >
                        <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            sizes="(min-width: 1024px) 25vw, 100vw"
                            className="object-cover rounded-2xl group-hover:brightness-95 transition-all"
                        />
                        {/* "View all photos" overlay on last image */}
                        {index === 3 && images.length > 5 && (
                            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    +{images.length - 5} photos
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* "View all photos" button - visible on mobile */}
            <button
                onClick={() => openLightbox(0)}
                className="lg:hidden mt-3 w-full py-2 text-sm font-medium text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors"
            >
                View all {images.length} photos
            </button>

            {/* Lightbox Modal */}
            {showLightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close gallery"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Navigation arrows */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrevious();
                        }}
                        className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                        className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Current image */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[currentIndex].url}
                            alt={images[currentIndex].alt}
                            width={1600}
                            height={1200}
                            sizes="90vw"
                            className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg"
                            priority
                        />
                    </div>

                    {/* Image counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Image title/alt */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center max-w-md">
                        {images[currentIndex].alt}
                    </div>
                </div>
            )}
        </>
    );
}
