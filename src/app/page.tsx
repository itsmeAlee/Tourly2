import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import {
    TopRatedSection,
    mockHotels,
    mockTourOperators,
    mockGuides,
} from "@/components/TopRatedSection";

const MobileSearchView = dynamic(
    () => import("@/components/MobileSearchView").then((mod) => mod.MobileSearchView),
    { ssr: true }
);

const MobileBottomNav = dynamic(
    () => import("@/components/MobileBottomNav").then((mod) => mod.MobileBottomNav),
    { ssr: true }
);

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Mobile View */}
            <div className="block md:hidden">
                <MobileSearchView />
                <MobileBottomNav />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
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
        </div>
    );
}
