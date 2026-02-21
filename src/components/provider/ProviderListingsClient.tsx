"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Edit, Trash2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Input } from "@/components/ui/input";

// Mock data (TODO: Wire to Appwrite database backend)
const MOCK_LISTINGS = [
    {
        id: "l1",
        title: "Serena Hotel Suite",
        type: "Stay",
        location: "Gilgit",
        status: "active",
        price: 15000,
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "l2",
        title: "Hunza Valley Tour",
        type: "Tour",
        location: "Hunza",
        status: "active",
        price: 25000,
        imageUrl: "https://images.unsplash.com/photo-1588693892837-a1691ab1a179?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "l3",
        title: "Prado TZ Rental",
        type: "Transport",
        location: "Skardu",
        status: "draft",
        price: 5000,
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    }
];

export function ProviderListingsClient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [listings, setListings] = useState(MOCK_LISTINGS);
    // Replace MOCK_LISTINGS with `[]` to test empty state

    const filteredListings = listings.filter((listing) =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {/* Empty State */}
            {listings.length === 0 ? (
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
            ) : filteredListings.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No listings match your search.</p>
                </div>
            ) : (
                /* Listings Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                        <Card key={listing.id} className="overflow-hidden rounded-2xl shadow-sm border-gray-100 group transition-all hover:shadow-md">
                            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={listing.imageUrl}
                                    alt={listing.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                                <Badge
                                    className="absolute top-3 left-3 rounded-full backdrop-blur-md bg-white/80 text-foreground font-medium border-0"
                                    variant="secondary"
                                >
                                    {listing.type}
                                </Badge>
                                <Badge
                                    className={`absolute top-3 right-3 rounded-full capitalize font-medium
                                        ${listing.status === "active" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"}
                                    `}
                                >
                                    {listing.status}
                                </Badge>
                            </div>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {listing.location}
                                </div>
                                <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
                                    {listing.title}
                                </h3>
                                <div className="text-primary font-bold mb-4">
                                    Rs {listing.price.toLocaleString()}
                                    <span className="text-xs text-muted-foreground font-normal ml-1">
                                        {listing.type === "Stay" ? "/ night" : listing.type === "Tour" ? "/ person" : "/ day"}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                                    <Link href={`/provider/listings/${listing.id}/edit`}>
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
