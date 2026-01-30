
'use client';

import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function ListingHeader() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3 flex justify-between items-center",
                isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50" : "bg-transparent"
            )}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                    if (window.history.length > 2) {
                        router.back();
                    } else {
                        router.push('/');
                    }
                }}
                className={cn(
                    "rounded-full h-10 w-10 backdrop-blur-sm transition-colors",
                    isScrolled ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-black/20 text-white hover:bg-black/30"
                )}
            >
                <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "rounded-full h-10 w-10 backdrop-blur-sm transition-colors",
                        isScrolled ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-black/20 text-white hover:bg-black/30"
                    )}
                >
                    <Share2 className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "rounded-full h-10 w-10 backdrop-blur-sm transition-colors",
                        isScrolled ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-black/20 text-white hover:bg-black/30"
                    )}
                >
                    <Heart className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
}
