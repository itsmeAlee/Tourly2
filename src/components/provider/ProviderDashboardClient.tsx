"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    List as ListIcon,
    CheckCircle2,
    MessageSquare,
    PlusCircle,
    ArrowRight,
    Bed,
    Car,
    Compass,
    LayoutList,
    RefreshCw,
    Inbox,
    ExternalLink,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Real data imports ───────────────────────────────────
import { getListingsByProvider } from "@/services/listing.service";
import { useUnreadCount } from "@/hooks/use-unread-count";
import type { ListingDocument, ListingType } from "@/types/listing.types";

// ─── Types ──────────────────────────────────────────────

interface RecentListing {
    id: string;
    title: string;
    type: ListingType;
    price: number;
    price_unit: string;
    is_active: boolean;
    region: string;
    location?: string;
}

// ─── Helpers ────────────────────────────────────────────

const TYPE_ICONS: Record<ListingType, React.ReactNode> = {
    stay: <Bed className="w-4 h-4" />,
    transport: <Car className="w-4 h-4" />,
    guide: <Compass className="w-4 h-4" />,
};

const TYPE_LABELS: Record<ListingType, string> = {
    stay: "Stay",
    transport: "Transport",
    guide: "Guide",
};

function mapToRecentListing(doc: ListingDocument): RecentListing {
    return {
        id: doc.$id,
        title: doc.title,
        type: doc.type,
        price: doc.price,
        price_unit: doc.price_unit,
        is_active: doc.is_active,
        region: doc.region,
        location: doc.location,
    };
}

// ─── Skeleton Components ────────────────────────────────

function StatCardSkeleton() {
    return (
        <Card className="rounded-2xl shadow-sm border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-8 h-8 rounded-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
            </CardContent>
        </Card>
    );
}

function ListingRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
            <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
        </div>
    );
}

// ─── Profile Incomplete Prompt ──────────────────────────

function IncompleteProfilePrompt() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
                Complete your provider profile
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
                You need to complete your provider profile before you can create
                listings and start receiving messages from travelers.
            </p>
            <Link href="/signup/provider-profile">
                <Button size="lg" className="rounded-xl gap-2">
                    Complete Profile
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </Link>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────

export function ProviderDashboardClient() {
    const { user } = useAuth();
    const unreadCount = useUnreadCount();

    // ── State ───────────────────────────────────────────
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalListings, setTotalListings] = useState(0);
    const [activeListings, setActiveListings] = useState(0);
    const [recentListings, setRecentListings] = useState<RecentListing[]>([]);

    // ── Data Fetching ───────────────────────────────────
    const fetchDashboardData = useCallback(async () => {
        if (!user?.providerId) return;

        setIsLoading(true);
        setError(null);

        try {
            const listings = await getListingsByProvider(user.providerId);

            setTotalListings(listings.length);
            setActiveListings(listings.filter((l) => l.is_active).length);
            setRecentListings(
                listings.slice(0, 3).map(mapToRecentListing)
            );
        } catch (err) {
            console.error("[ProviderDashboard] Failed to fetch data:", err);
            setError("Couldn't load your listings.");
            setTotalListings(0);
            setActiveListings(0);
            setRecentListings([]);
        } finally {
            setIsLoading(false);
        }
    }, [user?.providerId]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // ── Edge case: provider without providerId ──────────
    if (user && user.role === "provider" && !user.providerId) {
        return <IncompleteProfilePrompt />;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* ── Header ────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome back, {user?.name?.split(" ")[0]}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening with your listings today.
                    </p>
                </div>
                <Link href="/provider/listings/create">
                    <Button className="w-full sm:w-auto rounded-xl flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Create Listing
                    </Button>
                </Link>
            </div>

            {/* ── Stats Row (3 cards) ───────────────────── */}
            <div className="grid gap-4 md:grid-cols-3">
                {isLoading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        {/* Card 1: Total Listings */}
                        <Link href="/provider/listings" className="block">
                            <Card className="rounded-2xl shadow-sm border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Total Listings
                                    </CardTitle>
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <ListIcon className="w-4 h-4 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {error ? "—" : totalListings}
                                    </div>
                                    <p
                                        className={cn(
                                            "text-xs mt-1",
                                            !error && activeListings > 0
                                                ? "text-green-600"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {error
                                            ? "Unable to load"
                                            : `${activeListings} active`}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Card 2: Active Listings */}
                        <Link href="/provider/listings" className="block">
                            <Card className="rounded-2xl shadow-sm border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Active Listings
                                    </CardTitle>
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {error ? "—" : activeListings}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Currently visible to travelers
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Card 3: Unread Messages */}
                        <Link href="/inbox" className="block">
                            <Card
                                className={cn(
                                    "rounded-2xl shadow-sm transition-all cursor-pointer h-full",
                                    unreadCount > 0
                                        ? "border-primary/30 bg-primary/[0.02] hover:border-primary/50 hover:shadow-md"
                                        : "border-gray-100 hover:shadow-md hover:border-gray-200"
                                )}
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Unread Messages
                                    </CardTitle>
                                    <div
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center",
                                            unreadCount > 0
                                                ? "bg-primary/15"
                                                : "bg-primary/10"
                                        )}
                                    >
                                        <MessageSquare
                                            className={cn(
                                                "w-4 h-4",
                                                unreadCount > 0
                                                    ? "text-primary"
                                                    : "text-primary"
                                            )}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">
                                        {unreadCount}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Open your inbox
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </>
                )}
            </div>

            {/* ── Content Grid ──────────────────────────── */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* ── My Recent Listings ────────────────── */}
                <Card className="rounded-2xl shadow-sm border-gray-100 col-span-1">
                    <CardHeader className="pb-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    My Recent Listings
                                </CardTitle>
                                <CardDescription>
                                    Your most recently created listings.
                                </CardDescription>
                            </div>
                            {totalListings > 0 && (
                                <Link
                                    href="/provider/listings"
                                    className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                                >
                                    View All
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Error banner */}
                        {error && (
                            <div className="flex items-center justify-between px-4 py-3 bg-red-50 border-b border-red-100">
                                <p className="text-sm text-red-700">{error}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={fetchDashboardData}
                                    className="text-red-700 hover:text-red-800 hover:bg-red-100 gap-1.5"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Retry
                                </Button>
                            </div>
                        )}

                        {/* Loading skeleton */}
                        {isLoading && (
                            <div>
                                <ListingRowSkeleton />
                                <ListingRowSkeleton />
                                <ListingRowSkeleton />
                            </div>
                        )}

                        {/* Empty state */}
                        {!isLoading && !error && totalListings === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <LayoutList className="w-7 h-7 text-gray-400" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground mb-1">
                                    No listings yet
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs mb-5">
                                    Create your first listing to start receiving
                                    messages from travelers.
                                </p>
                                <Link href="/provider/listings/create">
                                    <Button
                                        size="sm"
                                        className="rounded-xl gap-2"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Create Listing
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Listing rows */}
                        {!isLoading && !error && recentListings.length > 0 && (
                            <div>
                                {recentListings.map((listing) => (
                                    <Link
                                        key={listing.id}
                                        href={`/provider/listings/${listing.id}/edit`}
                                        className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group"
                                    >
                                        {/* Type icon */}
                                        <div
                                            className={cn(
                                                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                                listing.type === "stay" &&
                                                "bg-blue-50 text-blue-600",
                                                listing.type === "transport" &&
                                                "bg-amber-50 text-amber-600",
                                                listing.type === "guide" &&
                                                "bg-emerald-50 text-emerald-600"
                                            )}
                                        >
                                            {TYPE_ICONS[listing.type]}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">
                                                {listing.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {listing.location || listing.region}{" "}
                                                · PKR{" "}
                                                {listing.price.toLocaleString()}{" "}
                                                / {listing.price_unit}
                                            </p>
                                        </div>

                                        {/* Status badge */}
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "shrink-0 text-xs",
                                                listing.is_active
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-gray-50 text-gray-500 border-gray-200"
                                            )}
                                        >
                                            {listing.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>

                                        {/* Edit hint */}
                                        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Quick Actions ─────────────────────── */}
                <Card className="rounded-2xl shadow-sm border-gray-100 col-span-1 h-fit">
                    <CardHeader className="pb-3 border-b border-gray-100">
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks to manage your services.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <Link
                            href="/provider/listings/create"
                            className="block"
                        >
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 h-12 rounded-xl border-gray-200 hover:bg-primary/5 hover:border-primary/30 transition-all"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <PlusCircle className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-medium">
                                    Create New Listing
                                </span>
                            </Button>
                        </Link>

                        <Link href="/provider/listings" className="block">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 h-12 rounded-xl border-gray-200 hover:bg-primary/5 hover:border-primary/30 transition-all"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <ListIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium">
                                    View My Listings
                                </span>
                            </Button>
                        </Link>

                        <Link href="/inbox" className="block">
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start gap-3 h-12 rounded-xl border-gray-200 hover:bg-primary/5 hover:border-primary/30 transition-all",
                                    unreadCount > 0 &&
                                    "border-primary/20 bg-primary/[0.02]"
                                )}
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 relative">
                                    <Inbox className="w-4 h-4 text-emerald-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                                            {unreadCount > 9
                                                ? "9+"
                                                : unreadCount}
                                        </span>
                                    )}
                                </div>
                                <span className="font-medium">
                                    Open Inbox
                                </span>
                                {unreadCount > 0 && (
                                    <Badge className="ml-auto bg-primary/10 text-primary border-0 text-xs">
                                        {unreadCount} new
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
