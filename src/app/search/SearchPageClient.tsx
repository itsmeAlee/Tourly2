"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, X, Search, Sparkles, MessageSquare, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
import { Skeleton } from "@/components/ui/skeleton";

// Real data hook
import { useSearch } from "@/hooks/use-search";
import { mapListingToListingCard } from "@/lib/mappers";

type ServiceType = "stays" | "transport" | "guides";

// ─── Skeleton Loader ────────────────────────────────────

function ResultsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4 pt-7 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

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
    const region = searchParams.get("region") || "";

    // Real data via custom hook (debounced 400ms)
    const { results, isLoading, error, totalCount, refetch } = useSearch({
        type: type as ServiceType,
        location,
        region: region || undefined,
    });

    // Filter state (kept for existing filter UI — client-side filtering is acceptable for now)
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

    // Results count label
    const getResultLabel = () => {
        switch (type) {
            case "stays":
                return totalCount === 1 ? "Stay" : "Stays";
            case "transport":
                return totalCount === 1 ? "Vehicle" : "Vehicles";
            case "guides":
                return totalCount === 1 ? "Guide" : "Guides";
            default:
                return "Results";
        }
    };

    const hasResults = totalCount > 0;

    // Render results grid
    const renderResults = () => {
        // Loading state — 8 skeleton cards
        if (isLoading) {
            return <ResultsSkeleton />;
        }

        // Error state — retry button
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                        <RefreshCw className="w-10 h-10 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                        Something went wrong
                    </h3>
                    <p className="text-gray-500 text-center max-w-md mb-6">
                        {error}
                    </p>
                    <Button onClick={refetch} className="rounded-lg gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Try again
                    </Button>
                </div>
            );
        }

        // Empty state
        if (!hasResults) {
            return (
                <EmptyState
                    title={`No ${getResultLabel().toLowerCase()} found`}
                    description={
                        location
                            ? `We couldn't find any ${getResultLabel().toLowerCase()} in ${location}. Try a different location or adjust your filters.`
                            : `No ${getResultLabel().toLowerCase()} available for your search criteria.`
                    }
                    onClearFilters={clearAllFilters}
                />
            );
        }

        // Map results to card components
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((doc) => {
                    const card = mapListingToListingCard(doc);
                    return (
                        <ListingCard
                            key={card.id}
                            id={card.id}
                            title={card.title}
                            image={card.image}
                            rating={card.rating}
                            reviewCount={card.reviewCount}
                            location={card.location}
                            category={card.category}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden md:overflow-x-visible">
            {/* --- DESKTOP Header (Hidden on Mobile) --- */}
            <div className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    {/* Logo + Service Tabs + NavLinks Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center shrink-0 lg:w-[200px]">
                            <Link href="/" className="text-2xl font-bold tracking-tight text-foreground">
                                Tourly
                            </Link>
                        </div>

                        <div className="flex flex-1 items-center justify-center">
                            <Suspense fallback={<div className="h-8" />}>
                                <ServiceTabs variant="underline" showIcons={true} />
                            </Suspense>
                        </div>

                        <div className="flex items-center justify-end gap-4 lg:w-[320px]">
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
                            {authLoading ? (
                                <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse" />
                            ) : isAuthenticated && user ? (
                                <Link
                                    href="/account"
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors"
                                    aria-label="My account"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            ) : (
                                <Link href="/login?next=/search">
                                    <Button size="sm" className="rounded-xl">Login</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Unified Search Widget */}
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

            {/* --- MOBILE Header --- */}
            <header className="md:hidden sticky top-0 z-[60] bg-white border-b border-gray-100/50 shadow-sm">
                <div className="flex items-center gap-1 px-2 h-14">
                    <button
                        onClick={() => router.push("/")}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 shrink-0"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center">
                        <Suspense fallback={<div className="h-6 w-20 bg-gray-100 rounded animate-pulse" />}>
                            <ServiceTabs variant="underline" />
                        </Suspense>
                    </div>
                </div>

                {/* Compact Summary Search Bar */}
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

            {/* Expanded Search Dropdown (Mobile) */}
            {isMobileSearchExpanded && (
                <>
                    <div
                        className="fixed inset-0 top-[56px] z-[40] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 md:hidden"
                        onClick={() => setIsMobileSearchExpanded(false)}
                    />
                    <div className="fixed top-[56px] left-0 right-0 z-[50] bg-white rounded-b-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-5 duration-200 md:hidden">
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
                                showTabs={false}
                                variant="compact"
                                activeServiceType={type}
                                onSearch={() => setIsMobileSearchExpanded(false)}
                            />
                        </div>
                        <div className="h-2 bg-gray-50/50 w-full border-t border-gray-100" />
                    </div>
                </>
            )}

            {/* Filter Bar */}
            <FilterBar
                filters={defaultFilters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
            />

            {/* Results Section */}
            <main className="container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8 min-content-height">
                {/* Results Count Heading */}
                {!isLoading && !error && hasResults && (
                    <div className="mb-6">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                            {totalCount} {getResultLabel()} found
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
