"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingCard } from "@/components/ListingCard";
import { getSavedListingsFull, toggleSavedListing } from "@/services/saved.service";
import { mapListingToListingCard } from "@/lib/mappers";
import type { ListingDocument } from "@/types/listing.types";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export function SavedPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { toast } = useToast();

    const [listings, setListings] = useState<ListingDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace("/login?next=/saved");
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch saved listings
    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        let cancelled = false;
        setIsLoading(true);

        getSavedListingsFull(user.id)
            .then((data) => {
                if (!cancelled) setListings(data);
            })
            .catch((err) => {
                console.error("[SavedPage] Failed to fetch saved listings:", err);
                toast({
                    title: "Failed to load",
                    description: "Couldn't fetch your saved listings.",
                    variant: "destructive",
                });
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, user?.id, toast]);

    // Optimistic remove from saved
    const handleRemove = async (listingId: string) => {
        if (!user?.id) return;

        // Optimistic: remove from UI immediately
        const removedListing = listings.find((l) => l.$id === listingId);
        setListings((prev) => prev.filter((l) => l.$id !== listingId));

        try {
            await toggleSavedListing(user.id, listingId);
        } catch {
            // Revert on failure
            if (removedListing) {
                setListings((prev) => [...prev, removedListing]);
            }
            toast({
                title: "Failed to remove",
                description: "Couldn't remove this listing. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/account");
        }
    };

    // Auth loading state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <>
            <div className="min-h-screen bg-gray-50/50 pb-24 lg:pb-8">
                {/* ─── Sticky Header ─── */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-14">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors -ml-2 p-2 rounded-lg hover:bg-gray-50"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline text-sm font-medium">
                                    Back
                                </span>
                            </button>

                            <h1 className="text-base font-semibold text-foreground">
                                Saved
                            </h1>

                            {!isLoading && listings.length > 0 && (
                                <span className="text-sm text-muted-foreground">
                                    {listings.length} listing
                                    {listings.length !== 1 ? "s" : ""}
                                </span>
                            )}
                            {(isLoading || listings.length === 0) && (
                                <div className="w-16" />
                            )}
                        </div>
                    </div>
                </header>

                {/* ─── Content ─── */}
                <main className="container mx-auto px-4 py-6">
                    {/* Loading Skeleton */}
                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
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
                    )}

                    {/* Empty State */}
                    {!isLoading && listings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                                <Heart className="w-10 h-10 text-gray-300" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">
                                Nothing saved yet
                            </h2>
                            <p className="text-muted-foreground max-w-sm mb-8">
                                Start exploring and save listings you love. They&apos;ll
                                show up here for easy access.
                            </p>
                            <Link href="/">
                                <Button className="rounded-xl px-8" size="lg">
                                    Explore Listings
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Listing Cards Grid */}
                    {!isLoading && listings.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {listings.map((listing) => {
                                const card = mapListingToListingCard(listing);
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
                                        isFavorite={true}
                                        onFavoriteClick={() =>
                                            handleRemove(listing.$id)
                                        }
                                    />
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav />
        </>
    );
}
