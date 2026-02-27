"use client";

import { ArrowLeft, Share2, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSaved } from "@/hooks/use-saved";

interface ListingHeaderProps {
    title?: string;
    listingId: string;
}

export function ListingHeader({ title, listingId }: ListingHeaderProps) {
    const router = useRouter();
    const { isSaved, toggleSaved } = useSaved();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || 'Check out this listing on Tourly',
                    url: window.location.href,
                });
            } catch {
                // User cancelled or share failed
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
        }
    };

    const saved = isSaved(listingId);

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors -ml-2 p-2 rounded-lg hover:bg-gray-50"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline text-sm font-medium">Back</span>
                    </button>

                    {/* Title - visible on desktop only */}
                    {title && (
                        <div className="hidden lg:block text-sm font-semibold text-foreground truncate max-w-md">
                            {title}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            aria-label="Share listing"
                        >
                            <Share2 className="w-5 h-5 text-foreground" />
                        </button>
                        <button
                            onClick={() => toggleSaved(listingId)}
                            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                        >
                            <Heart
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    saved
                                        ? "fill-red-500 text-red-500"
                                        : "text-foreground"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
