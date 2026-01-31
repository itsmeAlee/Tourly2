"use client";

import Link from "next/link";
import { Heart, Star, MapPin, Bed, Mountain, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type ListingCategory = "hotel" | "tour-operator" | "guide";

interface ListingCardProps {
    id: string;
    title: string;
    image: string;
    rating: number;
    reviewCount: number;
    reviewSource?: string;
    location: string;
    category: ListingCategory;
    isFavorite?: boolean;
    onFavoriteClick?: () => void;
}

const categoryIcons: Record<ListingCategory, React.ReactNode> = {
    hotel: <Bed className="w-5 h-5" />,
    "tour-operator": <Mountain className="w-5 h-5" />,
    guide: <User className="w-5 h-5" />,
};

// URL path mapping for each category

export function ListingCard({
    id,
    title,
    image,
    rating,
    reviewCount,
    reviewSource = "Google Reviews",
    location,
    category,
    isFavorite = false,
    onFavoriteClick,
}: ListingCardProps) {
    const href = `/listing/${id}`;

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevents the Link navigation
        e.stopPropagation(); // Stops the event bubbling
        onFavoriteClick?.();
    };

    return (
        <Link href={href} className="block cursor-pointer">
            <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg active:scale-[0.98] transition-all duration-300">
                {/* Image Area */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Heart Icon - Top Right */}
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

                    {/* Floating Category Badge - Bottom Left, overlapping */}
                    <div className="absolute -bottom-5 left-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary z-10">
                        {categoryIcons[category]}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4 pt-7">
                    {/* Title */}
                    <h3 className="font-bold text-foreground text-lg leading-tight mb-2 line-clamp-1">
                        {title}
                    </h3>

                    {/* Rating Row */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
                    </div>

                    {/* Reviews */}
                    <div className="flex items-center gap-1.5 mb-2">
                        <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="text-sm text-muted-foreground">
                            {reviewCount} {reviewSource}
                        </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{location}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
