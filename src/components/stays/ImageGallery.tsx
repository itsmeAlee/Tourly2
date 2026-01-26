"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            {/* Desktop: Masonry Grid */}
            <div className="hidden md:block">
                <div className="relative rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px]">
                        {/* Main Large Image - Left Half */}
                        <div className="col-span-2 row-span-2 relative">
                            <img
                                src={images[0]}
                                alt={`${title} - Main view`}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* 4 Smaller Images - Right Grid */}
                        {images.slice(1, 5).map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image}
                                    alt={`${title} - View ${index + 2}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* View All Photos Button */}
                    <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-4 right-4 gap-2 bg-white hover:bg-white/90 text-gray-900 shadow-md"
                    >
                        <Grid3X3 className="w-4 h-4" />
                        View all photos
                    </Button>
                </div>
            </div>

            {/* Mobile: Full-Width Swipeable Carousel */}
            <div className="md:hidden relative">
                {/* Images Container */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((image, index) => (
                            <div key={index} className="w-full flex-shrink-0">
                                <img
                                    src={image}
                                    alt={`${title} - View ${index + 1}`}
                                    className="w-full h-[300px] object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-md"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-md"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                currentIndex === index ? "bg-white w-4" : "bg-white/60"
                            )}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Image counter */}
                <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 rounded-md text-white text-xs font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </>
    );
}
