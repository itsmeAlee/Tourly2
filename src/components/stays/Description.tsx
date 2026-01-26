"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DescriptionProps {
    description: string;
    maxLines?: number;
}

export function Description({ description, maxLines = 4 }: DescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Split into paragraphs
    const paragraphs = description.split('\n\n');

    return (
        <div className="py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About this place</h2>

            <div className="relative">
                <div
                    className={`text-gray-600 leading-relaxed space-y-4 ${!isExpanded ? "line-clamp-4" : ""
                        }`}
                >
                    {paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {/* Gradient fade overlay when collapsed */}
                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                )}
            </div>

            <Button
                variant="link"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 p-0 h-auto text-gray-900 font-semibold underline underline-offset-4"
            >
                {isExpanded ? "Show less" : "Show more"}
            </Button>
        </div>
    );
}
