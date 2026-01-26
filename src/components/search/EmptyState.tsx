"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    title?: string;
    description?: string;
    onClearFilters?: () => void;
}

export function EmptyState({
    title = "No results found",
    description = "We couldn't find any listings matching your criteria. Try adjusting your filters or search terms.",
    onClearFilters,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <SearchX className="w-10 h-10 text-gray-400" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {title}
            </h3>

            <p className="text-gray-500 text-center max-w-md mb-6">
                {description}
            </p>

            {onClearFilters && (
                <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="rounded-lg"
                >
                    Clear filters
                </Button>
            )}
        </div>
    );
}
