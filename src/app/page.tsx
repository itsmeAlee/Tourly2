import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TopRatedSection } from "@/components/TopRatedSection";
import { getTopListingsServer } from "@/services/server/listing.server.service";
import { mapListingToTopRatedItem } from "@/lib/mappers";

// TODO: Remove mock data fallback once Appwrite listings are populated
import {
    mockGuides,
    mockHotels,
    mockTourOperators,
} from "@/data/topRated";
import { ProviderHomeRedirect } from "@/components/auth/ProviderHomeRedirect";

const MobileSearchView = dynamic(
    () =>
        import("@/components/MobileSearchView").then(
            (mod) => mod.MobileSearchView
        ),
    { ssr: true }
);

const MobileBottomNav = dynamic(
    () =>
        import("@/components/MobileBottomNav").then(
            (mod) => mod.MobileBottomNav
        ),
    { ssr: true }
);

export const metadata: Metadata = {
    title: "Tourly - Journey to the Roof of the World",
    description:
        "Discover the majestic valleys, glaciers, and culture of Gilgit-Baltistan. Your gateway to the North starts here.",
    alternates: {
        canonical: "/",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function HomePage() {
    // Fetch all three categories in PARALLEL — never sequential
    let [stays, transport, guides] = await Promise.all([
        getTopListingsServer("stay", 6).catch((err) => {
            console.error("[HomePage] Failed to fetch stays:", err);
            return null; // Signal to use mock fallback
        }),
        getTopListingsServer("transport", 6).catch((err) => {
            console.error("[HomePage] Failed to fetch transport:", err);
            return null;
        }),
        getTopListingsServer("guide", 6).catch((err) => {
            console.error("[HomePage] Failed to fetch guides:", err);
            return null;
        }),
    ]);

    // Map Appwrite documents → TopRatedItem shape
    // Fall back to mock data if Appwrite errored (null), not if simply empty ([])
    const hotelItems =
        stays !== null
            ? stays.map(mapListingToTopRatedItem)
            : mockHotels;
    const transportItems =
        transport !== null
            ? transport.map(mapListingToTopRatedItem)
            : mockTourOperators;
    const guideItems =
        guides !== null
            ? guides.map(mapListingToTopRatedItem)
            : mockGuides;

    return (
        <main className="min-h-screen bg-background">
            <ProviderHomeRedirect />
            {/* Mobile View */}
            <div className="block md:hidden">
                <MobileSearchView
                    initialHotels={hotelItems}
                    initialTransports={transportItems}
                    initialGuides={guideItems}
                />
                <MobileBottomNav />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <Navbar />
                <HeroSection />

                {/* Top Rated Listings */}
                <div className="container mx-auto px-4">
                    {/* Top Rated Hotels — hidden if 0 results */}
                    {hotelItems.length > 0 && (
                        <TopRatedSection
                            title="Top Rated Hotels"
                            subtitle="Handpicked accommodations loved by travelers"
                            category="hotel"
                            items={hotelItems}
                            viewAllHref="/hotels"
                        />
                    )}

                    {/* Top Rated Tour Operators — hidden if 0 results */}
                    {transportItems.length > 0 && (
                        <TopRatedSection
                            title="Top Rated Tour Operators"
                            subtitle="Trusted agencies for your perfect adventure"
                            category="tour-operator"
                            items={transportItems}
                            viewAllHref="/tour-operators"
                        />
                    )}

                    {/* Top Rated Guides — hidden if 0 results */}
                    {guideItems.length > 0 && (
                        <TopRatedSection
                            title="Top Rated Guides"
                            subtitle="Expert local guides for unforgettable experiences"
                            category="guide"
                            items={guideItems}
                            viewAllHref="/guides"
                        />
                    )}
                </div>

                {/* Footer Spacer */}
                <div className="h-24" />
            </div>
        </main>
    );
}
