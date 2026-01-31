"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, X, Search, Sparkles, MessageSquare } from "lucide-react";

// Components
import { UnifiedSearchWidget } from "@/components/search/UnifiedSearchWidget";
import { ServiceTabs } from "@/components/ServiceTabs";
import { FilterBar, defaultFilters } from "@/components/search/FilterBar";
import { TransportCard } from "@/components/search/TransportCard";
import { GuideCard } from "@/components/search/GuideCard";
import { EmptyState } from "@/components/search/EmptyState";
import { ListingCard } from "@/components/ListingCard";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";

// Mock Data
import { mockHotels } from "@/data/topRated";
import { mockVehicles } from "@/data/mockTransport";
import { mockGuides } from "@/data/mockGuides";

type ServiceType = "stays" | "transport" | "guides";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Local state for mobile search expansion
    const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

    // Lock body scroll when mobile search is expanded
    useEffect(() => {
        if (isMobileSearchExpanded) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileSearchExpanded]);

    // Read URL parameters
    const type = (searchParams.get("type") as ServiceType) || "stays";
    const location = searchParams.get("location") || "";
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const guests = parseInt(searchParams.get("guests") || "2", 10);

    // Filter state
    const [activeFilters, setActiveFilters] = useState<Record<string, string | boolean>>({});

    const handleFilterChange = (filterId: string, value: string | boolean | null) => {
        setActiveFilters((prev) => {
            const newFilters = { ...prev };
            if (value === null) {
                delete newFilters[filterId];
            } else {
                newFilters[filterId] = value;
            }
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setActiveFilters({});
    };

    // Filter data based on location (simple mock filtering)
    const filteredHotels = useMemo(() => {
        if (!location) return mockHotels;
        return mockHotels.filter((hotel) =>
            hotel.location.toLowerCase().includes(location.toLowerCase())
        );
    }, [location]);

    const filteredVehicles = useMemo(() => {
        if (!location) return mockVehicles;
        return mockVehicles.filter((vehicle) =>
            vehicle.location.toLowerCase().includes(location.toLowerCase())
        );
    }, [location]);

    const filteredGuides = useMemo(() => {
        if (!location) return mockGuides;
        return mockGuides.filter((guide) =>
            guide.location.toLowerCase().includes(location.toLowerCase())
        );
    }, [location]);

    // Get results count and label
    const getResultsInfo = () => {
        switch (type) {
            case "stays":
                return {
                    count: filteredHotels.length,
                    label: filteredHotels.length === 1 ? "Stay" : "Stays",
                };
            case "transport":
                return {
                    count: filteredVehicles.length,
                    label: filteredVehicles.length === 1 ? "Vehicle" : "Vehicles",
                };
            case "guides":
                return {
                    count: filteredGuides.length,
                    label: filteredGuides.length === 1 ? "Guide" : "Guides",
                };
            default:
                return { count: 0, label: "Results" };
        }
    };

    const { count, label } = getResultsInfo();
    const hasResults = count > 0;

    // Render the appropriate grid based on type
    const renderResults = () => {
        if (!hasResults) {
            return (
                <EmptyState
                    title={`No ${label.toLowerCase()} found`}
                    description={
                        location
                            ? `We couldn't find any ${label.toLowerCase()} in ${location}. Try a different location or adjust your filters.`
                            : `No ${label.toLowerCase()} available for your search criteria.`
                    }
                    onClearFilters={clearAllFilters}
                />
            );
        }

        switch (type) {
            case "stays":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredHotels.map((hotel) => (
                            <ListingCard
                                key={hotel.id}
                                id={hotel.id}
                                title={hotel.title}
                                image={hotel.image}
                                rating={hotel.rating}
                                reviewCount={hotel.reviewCount}
                                location={hotel.location}
                                category="hotel"
                            />
                        ))}
                    </div>
                );

            case "transport":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVehicles.map((vehicle) => (
                            <TransportCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                );

            case "guides":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredGuides.map((guide) => (
                            <GuideCard key={guide.id} guide={guide} />
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- DESKTOP Header (Hidden on Mobile) --- */}
            <div className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    {/* Logo + Service Tabs + NavLinks Row (Matches Homepage Navbar) */}
                    <div className="flex items-center justify-between mb-4">
                        {/* LEFT SECTION: Logo (fixed width for balance) */}
                        <div className="flex items-center shrink-0 lg:w-[200px]">
                            <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
                                Tourly
                            </Link>
                        </div>

                        {/* CENTER SECTION: Service Tabs */}
                        <div className="flex flex-1 items-center justify-center">
                            <Suspense fallback={<div className="h-8" />}>
                                <ServiceTabs variant="underline" showIcons={true} />
                            </Suspense>
                        </div>

                        {/* RIGHT SECTION: Nav Links + Login (fixed width for balance) */}
                        <div className="flex items-center justify-end gap-4 lg:w-[320px]">
                            {/* Nav Links: About, Support, TripAI */}
                            <div className="flex items-center gap-6">
                                <a
                                    href="#about"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    About
                                </a>
                                <Link
                                    href="/inbox"
                                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Inbox
                                </Link>
                                <Link
                                    href="/ai-planner"
                                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    TripAI
                                </Link>
                            </div>
                            {/* Login Button */}
                            <Button size="sm">
                                Login
                            </Button>
                        </div>
                    </div>

                    {/* Unified Search Widget - Pre-filled with URL params */}
                    <UnifiedSearchWidget
                        initialLocation={location}
                        initialCheckIn={checkIn}
                        initialCheckOut={checkOut}
                        initialGuests={guests}
                        showTabs={false}
                        variant="compact"
                        activeServiceType={type}
                    />
                </div>
            </div>

            {/* --- MOBILE Header & App-Like Layout (Visible on Mobile) --- */}

            {/* 1. Service-First Header (Sticky Top) */}
            <header className="md:hidden sticky top-0 z-[60] bg-white border-b border-gray-100/50 shadow-sm">
                <div className="flex items-center gap-1 px-2 h-14">
                    <button
                        onClick={() => router.push("/")}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 shrink-0"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    {/* Service Tabs in Header - compact spacing for mobile */}
                    <div className="flex items-center">
                        <Suspense fallback={<div className="h-6 w-20 bg-gray-100 rounded animate-pulse" />}>
                            <ServiceTabs variant="underline" />
                        </Suspense>
                    </div>
                </div>

                {/* 2. Compact Summary Search Bar (Visible ONLY when collapsed) */}
                {!isMobileSearchExpanded && (
                    <div className="px-4 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <button
                            onClick={() => setIsMobileSearchExpanded(true)}
                            className="w-full flex items-center bg-gray-100/80 rounded-2xl h-12 px-4 gap-3 border border-transparent active:scale-[0.98] transition-all"
                        >
                            <Search size={18} className="text-gray-500 shrink-0" />
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 truncate flex-1 leading-none py-1">
                                <span className="truncate max-w-[40%]">{location || "Anywhere"}</span>
                                <span className="text-gray-300 mx-1">•</span>
                                <span className="truncate max-w-[30%]">
                                    {checkIn && checkOut
                                        ? `${format(new Date(checkIn), "MMM d")} - ${format(new Date(checkOut), "MMM d")}`
                                        : "Any dates"}
                                </span>
                                <span className="text-gray-300 mx-1">•</span>
                                <span className="shrink-0">{guests} Guest{guests > 1 ? "s" : ""}</span>
                            </div>
                        </button>
                    </div>
                )}
            </header>

            {/* Expanded Search Dropdown (Mobile) - "Content-Hugging" */}
            {isMobileSearchExpanded && (
                <>
                    {/* Backdrop (Closes on click) */}
                    <div
                        className="fixed inset-0 top-[56px] z-[40] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 md:hidden"
                        onClick={() => setIsMobileSearchExpanded(false)}
                    />

                    {/* Dropdown Form Container */}
                    <div className="fixed top-[56px] left-0 right-0 z-[50] bg-white rounded-b-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-5 duration-200 md:hidden">
                        {/* 'X' Close Button - Absolute Top Right */}
                        <button
                            onClick={() => setIsMobileSearchExpanded(false)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 z-20"
                            aria-label="Close filter"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-4 pt-12 flex flex-col gap-4">
                            <UnifiedSearchWidget
                                initialLocation={location}
                                initialCheckIn={checkIn}
                                initialCheckOut={checkOut}
                                initialGuests={guests}
                                showTabs={false} // Tabs are already in the sticky header
                                variant="compact" // Uses white boxes + transparent bg (parent is white)
                                activeServiceType={type}
                                onSearch={() => setIsMobileSearchExpanded(false)}
                            />
                        </div>
                        {/* Little handle or border to show end of form */}
                        <div className="h-2 bg-gray-50/50 w-full border-t border-gray-100" />
                    </div>
                </>
            )}
            {/* -------------------------------------------------------- */}

            {/* Filter Bar */}
            <FilterBar
                filters={defaultFilters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
            />

            {/* Results Section */}
            {/* Added padding-bottom for Mobile Bottom Nav */}
            <main className="container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8 min-content-height">
                {/* Results Count Heading */}
                {hasResults && (
                    <div className="mb-6">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                            {count} {label} found
                            {location && (
                                <span className="font-normal text-gray-500"> in {location}</span>
                            )}
                        </h1>
                    </div>
                )}

                {/* Results Grid */}
                {renderResults()}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden">
                <MobileBottomNav />
            </div>
        </div>
    );
}

// Main page component with Suspense boundary
export function SearchPageClient() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            }
        >
            <SearchResultsContent />
        </Suspense>
    );
}
