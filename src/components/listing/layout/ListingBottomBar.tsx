
'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListingBottomBarProps {
    price: string;
    priceUnit: string;
    onMessageClick?: () => void;
}

export function ListingBottomBar({ price, priceUnit, onMessageClick }: ListingBottomBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 py-4 md:px-8 md:py-5 pb-8 md:pb-5 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900">{price}</span>
                    <span className="text-sm text-gray-500 font-medium">{priceUnit}</span>
                </div>

                <Button
                    onClick={onMessageClick}
                    className="flex-1 max-w-[240px] bg-[#0daae7] hover:bg-[#0daae7]/90 text-white font-semibold rounded-2xl h-12 shadow-lg shadow-[#0daae7]/20 transition-transform active:scale-95"
                >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Message Provider
                </Button>
            </div>
        </div>
    );
}
