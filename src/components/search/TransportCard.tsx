"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/data/mockTransport";

interface TransportCardProps {
    vehicle: Vehicle;
    isFavorite?: boolean;
    onFavoriteClick?: () => void;
}

export function TransportCard({
    vehicle,
    isFavorite = false,
    onFavoriteClick,
}: TransportCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteClick?.();
    };

    return (
        <Link href={`/listing/${vehicle.id}`} className="block cursor-pointer">
            <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg active:scale-[0.98] transition-all duration-300">
                {/* Image Area */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={vehicle.image}
                        alt={vehicle.model}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Heart Icon */}
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart
                            className={cn(
                                "w-5 h-5 transition-colors",
                                isFavorite ? "fill-red-500 text-red-500" : "text-white"
                            )}
                        />
                    </button>

                    {/* Floating Category Badge */}
                    <div className="absolute -bottom-5 left-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary z-10">
                        <Car className="w-5 h-5" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4 pt-7">
                    {/* Title */}
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-1">
                        {vehicle.model} {vehicle.year}
                    </h3>

                    {/* Driver */}
                    <p className="text-sm text-gray-500 mb-2">
                        Driven by {vehicle.driverName}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-gray-900">{vehicle.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({vehicle.reviewCount} reviews)</span>
                    </div>

                    {/* Features Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {vehicle.features.slice(0, 4).map((feature) => (
                            <span
                                key={feature}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-primary">
                            {vehicle.currency} {vehicle.pricePerDay.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">/ day</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
