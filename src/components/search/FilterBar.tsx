"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Filter {
    id: string;
    label: string;
    type: "toggle" | "dropdown";
    options?: string[];
}

interface FilterBarProps {
    filters: Filter[];
    activeFilters: Record<string, string | boolean>;
    onFilterChange: (filterId: string, value: string | boolean | null) => void;
}

const defaultFilters: Filter[] = [
    { id: "price", label: "Price", type: "dropdown", options: ["Under Rs. 5,000", "Rs. 5,000 - 10,000", "Rs. 10,000 - 20,000", "Rs. 20,000+"] },
    { id: "rating", label: "Rating 4.5+", type: "toggle" },
    { id: "amenities", label: "Amenities", type: "dropdown", options: ["WiFi", "Breakfast", "Parking", "Heater", "AC"] },
    { id: "instant", label: "Instant Book", type: "toggle" },
];

export function FilterBar({
    filters = defaultFilters,
    activeFilters = {},
    onFilterChange,
}: FilterBarProps) {
    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    return (
        <div className="bg-white border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {/* Filter Pills */}
                    {filters.map((filter) => {
                        const isActive = activeFilters[filter.id] !== undefined;

                        return (
                            <button
                                key={filter.id}
                                onClick={() => {
                                    if (filter.type === "toggle") {
                                        onFilterChange(filter.id, isActive ? null : true);
                                    }
                                    // For dropdowns, we'd open a popover - simplified for now
                                    if (filter.type === "dropdown" && !isActive) {
                                        onFilterChange(filter.id, filter.options?.[0] || true);
                                    } else if (filter.type === "dropdown" && isActive) {
                                        onFilterChange(filter.id, null);
                                    }
                                }}
                                className={cn(
                                    "flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all",
                                    isActive
                                        ? "bg-primary/10 text-primary border-primary"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                )}
                            >
                                {filter.label}
                                {filter.type === "dropdown" && (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                                {isActive && (
                                    <X className="w-3.5 h-3.5 ml-1" />
                                )}
                            </button>
                        );
                    })}

                    {/* Clear All */}
                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                Object.keys(activeFilters).forEach((key) => {
                                    onFilterChange(key, null);
                                });
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export { defaultFilters };
