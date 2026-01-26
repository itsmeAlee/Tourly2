"use client";

import { Star, MapPin, Share, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StayHeaderProps {
    title: string;
    rating: number;
    reviewCount: number;
    location: string;
}

export function StayHeader({ title, rating, reviewCount, location }: StayHeaderProps) {
    return (
        <div className="py-6 border-b border-gray-200">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {title}
            </h1>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
                        <span className="text-gray-500">({reviewCount} reviews)</span>
                    </div>

                    {/* Divider */}
                    <span className="text-gray-300">•</span>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="underline underline-offset-2">{location}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-2 text-gray-700">
                        <Share className="w-4 h-4" />
                        Share
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-gray-700">
                        <Heart className="w-4 h-4" />
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
