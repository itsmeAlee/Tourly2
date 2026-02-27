"use client";

import { Heart, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMessageProvider } from "@/hooks/useMessageProvider";
import { useSaved } from "@/hooks/use-saved";

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
    const { isSaved, toggleSaved } = useSaved();
    const saved = isSaved(listingId);

    const { handleMessageClick, isLoading } = useMessageProvider({
        listingId,
        providerId,
        listingTitle,
    });

    const formattedPrice = new Intl.NumberFormat('en-PK').format(price);

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
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 mb-3"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                    <MessageCircle className="w-5 h-5 mr-2" />
                )}
                Message Provider
            </Button>

            {/* Save to Wishlist */}
            <button
                onClick={() => toggleSaved(listingId)}
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition-colors",
                    saved
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-gray-200 hover:bg-gray-50 text-foreground"
                )}
            >
                <Heart
                    className={cn(
                        "w-5 h-5 transition-colors",
                        saved ? "fill-red-500 text-red-500" : ""
                    )}
                />
                <span className="font-medium">
                    {saved ? "Saved" : "Save to Wishlist"}
                </span>
            </button>
        </div>
    );
}
