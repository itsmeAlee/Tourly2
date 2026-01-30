"use client";

import Link from "next/link";
import { Heart, Star, User, Languages, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Guide } from "@/data/mockGuides";

interface GuideCardProps {
    guide: Guide;
    isFavorite?: boolean;
    onFavoriteClick?: () => void;
}

export function GuideCard({
    guide,
    isFavorite = false,
    onFavoriteClick,
}: GuideCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteClick?.();
    };

    return (
        <Link href={`/listing/${guide.id}`} className="block">
            <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image Area */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={guide.image}
                        alt={guide.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                    {/* Verified Badge */}
                    {guide.isVerified && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                            <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-medium text-gray-700">Verified</span>
                        </div>
                    )}

                    {/* Floating Category Badge */}
                    <div className="absolute -bottom-5 left-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary z-10">
                        <User className="w-5 h-5" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4 pt-7">
                    {/* Name */}
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-1">
                        {guide.name}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1.5 mb-2">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-gray-900">{guide.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({guide.reviewCount} reviews)</span>
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-1.5 mb-2 text-gray-500">
                        <Languages className="w-4 h-4" />
                        <span className="text-sm line-clamp-1">
                            {guide.languages.join(", ")}
                        </span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {guide.specialties.slice(0, 3).map((specialty) => (
                            <span
                                key={specialty}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                            >
                                {specialty}
                            </span>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-primary">
                            {guide.currency} {guide.pricePerDay.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">/ day</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
