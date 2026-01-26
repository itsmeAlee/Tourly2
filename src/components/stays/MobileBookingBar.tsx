"use client";

import { Button } from "@/components/ui/button";

interface MobileBookingBarProps {
    price: number;
    currency: string;
    priceUnit: string;
}

export function MobileBookingBar({ price, currency, priceUnit }: MobileBookingBarProps) {
    const formattedPrice = price.toLocaleString();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden">
            <div className="flex items-center justify-between max-w-lg mx-auto">
                {/* Price */}
                <div>
                    <span className="text-lg font-bold text-gray-900">
                        {currency} {formattedPrice}
                    </span>
                    <span className="text-gray-500 text-sm"> / {priceUnit}</span>
                </div>

                {/* Reserve Button */}
                <Button className="px-8 h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90">
                    Reserve
                </Button>
            </div>
        </div>
    );
}
