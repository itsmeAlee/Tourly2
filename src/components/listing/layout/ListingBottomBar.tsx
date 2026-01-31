"use client";

import { MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMessageProvider } from "@/hooks/useMessageProvider";

interface ListingBottomBarProps {
    price: number;
    priceUnit: string;
    listingId: string;
    listingTitle: string;
    providerId: string;
}

export function ListingBottomBar({
    price,
    priceUnit,
    listingId,
    listingTitle,
    providerId,
}: ListingBottomBarProps) {
    const formattedPrice = new Intl.NumberFormat('en-PK').format(price);

    const { handleMessageClick, isLoading } = useMessageProvider({
        listingId,
        providerId,
        listingTitle,
    });

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Price */}
                    <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-foreground">
                                PKR {formattedPrice}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                / {priceUnit}
                            </span>
                        </div>
                    </div>

                    {/* CTA */}
                    <Button
                        onClick={handleMessageClick}
                        disabled={isLoading}
                        className="h-11 px-6 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <MessageCircle className="w-5 h-5 mr-2" />
                        )}
                        Message Provider
                    </Button>
                </div>
            </div>
        </div>
    );
}
