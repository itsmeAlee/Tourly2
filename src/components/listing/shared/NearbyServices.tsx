"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { Listing } from "../types";

interface NearbyServicesProps {
    title: string;
    listings: Listing[];
}

export function NearbyServices({ title, listings }: NearbyServicesProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = 320; // Card width + gap
        scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    if (listings.length === 0) return null;

    return (
        <section className="mt-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">{title}</h2>

                {/* Desktop Navigation Arrows */}
                <div className="hidden lg:flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
            >
                {listings.map((listing) => (
                    <NearbyCard key={listing.id} listing={listing} />
                ))}
            </div>
        </section>
    );
}

// Simple card for nearby services
function NearbyCard({ listing }: { listing: Listing }) {
    const formattedPrice = new Intl.NumberFormat('en-PK').format(listing.price);

    return (
        <Link
            href={`/listing/${listing.id}`}
            className={cn(
                "flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer",
                "hover:shadow-lg active:scale-[0.98] transition-all group"
            )}
        >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={listing.images[0]?.url}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                    {listing.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                    {listing.location}
                </p>
                <p className="text-sm font-medium text-foreground">
                    PKR {formattedPrice}
                    <span className="text-muted-foreground font-normal">
                        {' '}/ {listing.priceUnit}
                    </span>
                </p>
            </div>
        </Link>
    );
}
