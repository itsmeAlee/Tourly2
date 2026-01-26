"use client";

import {
    Wifi,
    UtensilsCrossed,
    Flame,
    Car,
    Tv,
    WashingMachine,
    Utensils,
    Mountain,
    Coffee,
    Bath,
    Wind,
    Snowflake,
    type LucideIcon,
} from "lucide-react";

// Icon mapping for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
    Wifi,
    UtensilsCrossed,
    Flame,
    Car,
    Tv,
    WashingMachine,
    Utensils,
    Mountain,
    Coffee,
    Bath,
    Wind,
    Snowflake,
};

interface Amenity {
    id: string;
    name: string;
    icon: string;
}

interface AmenitiesGridProps {
    amenities: Amenity[];
}

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
    return (
        <div className="py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What this place offers</h2>

            <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity) => {
                    const IconComponent = iconMap[amenity.icon] || Mountain;

                    return (
                        <div
                            key={amenity.id}
                            className="flex items-center gap-4 py-3"
                        >
                            <IconComponent className="w-6 h-6 text-gray-700" />
                            <span className="text-gray-700">{amenity.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
