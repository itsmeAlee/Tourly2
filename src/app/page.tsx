"use client";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MobileSearchView } from "@/components/MobileSearchView";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import {
    TopRatedSection,
    mockHotels,
    mockTourOperators,
    mockGuides,
} from "@/components/TopRatedSection";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HomePage() {
    const isMobile = useIsMobile();

    // Mobile view
    if (isMobile) {
        return (
            <>
                <MobileSearchView />
                <MobileBottomNav />
            </>
        );
    }

    // Desktop view
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />

            {/* Top Rated Listings */}
            <div className="container mx-auto px-4">
                {/* Top Rated Hotels */}
                <TopRatedSection
                    title="Top Rated Hotels"
                    subtitle="Handpicked accommodations loved by travelers"
                    category="hotel"
                    items={mockHotels}
                    viewAllHref="/hotels"
                />

                {/* Top Rated Tour Operators */}
                <TopRatedSection
                    title="Top Rated Tour Operators"
                    subtitle="Trusted agencies for your perfect adventure"
                    category="tour-operator"
                    items={mockTourOperators}
                    viewAllHref="/tour-operators"
                />

                {/* Top Rated Guides */}
                <TopRatedSection
                    title="Top Rated Guides"
                    subtitle="Expert local guides for unforgettable experiences"
                    category="guide"
                    items={mockGuides}
                    viewAllHref="/guides"
                />
            </div>

            {/* Footer Spacer */}
            <div className="h-24" />
        </div>
    );
}
