"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Edit, Trash2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getListingsByProvider } from "@/services/listing.service";
import type { ListingDocument } from "@/types/listing.types";
import { getListingImageUrl } from "@/lib/storage";

function toTypeLabel(type: ListingDocument["type"]) {
    if (type === "stay") return "Stay";
    if (type === "transport") return "Transport";
    return "Guide";
}

export function ProviderListingsClient() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [listings, setListings] = useState<ListingDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!user?.providerId) {
                if (!cancelled) {
                    setListings([]);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const docs = await getListingsByProvider(user.providerId);
                if (!cancelled) {
                    setListings(docs);
                }
            } catch (err) {
                console.error("[ProviderListings] Failed to load:", err);
                if (!cancelled) {
                    setListings([]);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [user?.providerId]);

    const filteredListings = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        if (!q) return listings;

        return listings.filter((listing) =>
            listing.title.toLowerCase().includes(q) ||
            listing.location.toLowerCase().includes(q) ||
            listing.region.toLowerCase().includes(q)
        );
    }, [listings, searchTerm]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Listings</h1>
                    <p className="text-muted-foreground mt-1">Manage all your services and tours in one place.</p>
                </div>
                <Link href="/provider/listings/create">
                    <Button className="w-full sm:w-auto rounded-xl flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Create Listing
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 rounded-xl bg-gray-50 border-gray-100"
                    />
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-10 text-muted-foreground">Loading listings...</div>
            )}

            {/* Empty State */}
            {!isLoading && listings.length === 0 ? (
                <div className="bg-white border text-center border-dashed rounded-3xl p-12 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <PlusCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">No listings yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        You haven't created any listings. Start reaching tourists by adding your first service or tour!
                    </p>
                    <Link href="/provider/listings/create" className="mt-6">
                        <Button className="rounded-xl flex items-center gap-2">
                            <PlusCircle className="w-4 h-4" />
                            Create Your First Listing
                        </Button>
                    </Link>
                </div>
            ) : !isLoading && filteredListings.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No listings match your search.</p>
                </div>
            ) : (
                /* Listings Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                        <Card key={listing.$id} className="overflow-hidden rounded-2xl shadow-sm border-gray-100 group transition-all hover:shadow-md">
                            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={listing.images?.[0] ? getListingImageUrl(listing.images[0], 640) : "/images/placeholder-listing.jpg"}
                                    alt={listing.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                                <Badge
                                    className="absolute top-3 left-3 rounded-full backdrop-blur-md bg-white/80 text-foreground font-medium border-0"
                                    variant="secondary"
                                >
                                    {toTypeLabel(listing.type)}
                                </Badge>
                                <Badge
                                    className={`absolute top-3 right-3 rounded-full capitalize font-medium
                                        ${listing.is_active ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"}
                                    `}
                                >
                                    {listing.is_active ? "active" : "draft"}
                                </Badge>
                            </div>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {listing.location || listing.region}
                                </div>
                                <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
                                    {listing.title}
                                </h3>
                                <div className="text-primary font-bold mb-4">
                                    Rs {listing.price.toLocaleString()}
                                    <span className="text-xs text-muted-foreground font-normal ml-1">
                                        / {listing.price_unit}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                                    <Link href={`/provider/listings/${listing.$id}/edit`}>
                                        <Button variant="outline" className="w-full rounded-xl flex items-center justify-center gap-2 text-sm">
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button variant="secondary" className="w-full rounded-xl flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 border-0">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
