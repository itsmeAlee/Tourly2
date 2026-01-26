"use client";

import { Star } from "lucide-react";

interface ReviewBreakdown {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    checkIn: number;
    value: number;
}

interface ReviewsSummaryProps {
    rating: number;
    reviewCount: number;
    breakdown: ReviewBreakdown;
}

const categoryLabels: Record<keyof ReviewBreakdown, string> = {
    cleanliness: "Cleanliness",
    accuracy: "Accuracy",
    communication: "Communication",
    location: "Location",
    checkIn: "Check-in",
    value: "Value",
};

export function ReviewsSummary({ rating, reviewCount, breakdown }: ReviewsSummaryProps) {
    return (
        <div className="py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest reviews</h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Overall Rating */}
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl min-w-[160px]">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                        <span className="text-4xl font-bold text-gray-900">{rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{reviewCount} reviews</span>
                </div>

                {/* Breakdown Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(Object.entries(breakdown) as [keyof ReviewBreakdown, number][]).map(
                        ([key, value]) => (
                            <div key={key} className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 w-28">
                                    {categoryLabels[key]}
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gray-900 rounded-full transition-all"
                                        style={{ width: `${(value / 5) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-8">
                                    {value.toFixed(1)}
                                </span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
