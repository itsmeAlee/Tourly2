"use client";

import { useRouter } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StickyActionSidebarProps {
    price: number;
    priceUnit: string;
    listingId: string;
    listingTitle: string;
    providerId: string;
    className?: string;
}

export function StickyActionSidebar({
    price,
    priceUnit,
    listingId,
    listingTitle,
    providerId,
    className,
}: StickyActionSidebarProps) {
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);

    const formattedPrice = new Intl.NumberFormat('en-PK').format(price);

    const handleSaveClick = () => {
        setIsSaved(!isSaved);
    };

    const handleMessageClick = () => {
        // Store context for the new conversation
        sessionStorage.setItem('newConversationContext', JSON.stringify({
            listingId,
            providerId,
            listingTitle,
            starterMessage: `Hi! I'm interested in ${listingTitle}.`,
        }));

        // Navigate to inbox (in production, would create/fetch thread first)
        router.push('/inbox/thread-1');
    };

    return (
        <div
            className={cn(
                "bg-white border border-gray-200 rounded-2xl p-6 shadow-sm",
                "lg:sticky lg:top-24",
                className
            )}
        >
            {/* Price Section */}
            <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">
                        PKR {formattedPrice}
                    </span>
                    <span className="text-muted-foreground">/ {priceUnit}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Final price confirmed in chat
                </p>
            </div>

            {/* Message Provider CTA */}
            <Button
                onClick={handleMessageClick}
                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 mb-3"
            >
                <MessageCircle className="w-5 h-5 mr-2" />
                Message Provider
            </Button>

            {/* Save to Wishlist */}
            <button
                onClick={handleSaveClick}
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition-colors",
                    isSaved
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-gray-200 hover:bg-gray-50 text-foreground"
                )}
            >
                <Heart
                    className={cn(
                        "w-5 h-5 transition-colors",
                        isSaved ? "fill-red-500 text-red-500" : ""
                    )}
                />
                <span className="font-medium">
                    {isSaved ? "Saved" : "Save to Wishlist"}
                </span>
            </button>
        </div>
    );
}
