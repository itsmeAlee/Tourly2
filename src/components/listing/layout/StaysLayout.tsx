import { MapPin, Users, Bed, Bath, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "../shared/ImageGallery";
import { HighlightsRow } from "../shared/HighlightsRow";
import { StickyActionSidebar } from "../shared/StickyActionSidebar";
import { ProviderCard } from "../shared/ProviderCard";
import { NearbyServices } from "../shared/NearbyServices";
import type { StayListing, Listing } from "../types";

interface StaysLayoutProps {
    listing: StayListing;
    nearbyListings?: Listing[];
}

export function StaysLayout({ listing, nearbyListings = [] }: StaysLayoutProps) {
    const { propertyOverview, amenities, locationInfo } = listing;

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Hero Gallery */}
            <ImageGallery images={listing.images} title={listing.title} />

            {/* Header Info */}
            <div className="mt-6 mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full">
                        Guest House
                    </Badge>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    {listing.title}
                </h1>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                </div>
            </div>

            {/* Main Content + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Highlights */}
                    <section>
                        <HighlightsRow highlights={listing.highlights} />
                    </section>

                    {/* Property Overview */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Property Overview
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                                <Users className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Guests</p>
                                    <p className="font-semibold">Up to {propertyOverview.guests}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                                <Bed className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Rooms</p>
                                    <p className="font-semibold">
                                        {propertyOverview.bedrooms} BR, {propertyOverview.beds} Beds
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                                <Bath className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                                    <p className="font-semibold">{propertyOverview.bathrooms}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About This Stay */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            About This Stay
                        </h2>
                        <div className="prose prose-gray max-w-none">
                            {listing.description.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </section>

                    {/* Amenities Grid */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Amenities
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {amenities.map((amenity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl"
                                >
                                    <Check className="w-5 h-5 text-primary shrink-0" />
                                    <span className="text-foreground">{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Location Section */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Location
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Nearest Landmark</p>
                                    <p className="text-muted-foreground">{locationInfo.landmark}</p>
                                </div>
                            </div>
                            <details className="group">
                                <summary className="cursor-pointer text-primary font-medium hover:text-primary/80">
                                    How to reach
                                </summary>
                                <p className="mt-3 text-muted-foreground leading-relaxed pl-8">
                                    {locationInfo.howToReach}
                                </p>
                            </details>
                        </div>
                    </section>

                    {/* Provider Card */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Your Host
                        </h2>
                        <ProviderCard provider={listing.provider} />
                    </section>
                </div>

                {/* Right Column - Sticky Sidebar (Desktop only) */}
                <div className="hidden lg:block">
                    <StickyActionSidebar
                        price={listing.price}
                        priceUnit={listing.priceUnit}
                        listingId={listing.id}
                        listingTitle={listing.title}
                        providerId={listing.provider.id}
                    />
                </div>
            </div>

            {/* Nearby Services */}
            <NearbyServices
                title={`More Stays in ${listing.region}`}
                listings={nearbyListings}
            />
        </div>
    );
}
