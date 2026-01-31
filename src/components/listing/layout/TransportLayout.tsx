import { MapPin, Car, Fuel, Settings, Shield, Route, Mountain, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "../shared/ImageGallery";
import { HighlightsRow } from "../shared/HighlightsRow";
import { StickyActionSidebar } from "../shared/StickyActionSidebar";
import { ProviderCard } from "../shared/ProviderCard";
import { NearbyServices } from "../shared/NearbyServices";
import type { TransportListing, Listing } from "../types";

interface TransportLayoutProps {
    listing: TransportListing;
    nearbyListings?: Listing[];
}

export function TransportLayout({ listing, nearbyListings = [] }: TransportLayoutProps) {
    const { vehicleSpecs, routes, terrains, safetyInfo } = listing;

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Hero Gallery */}
            <ImageGallery images={listing.images} title={listing.title} />

            {/* Header Info */}
            <div className="mt-6 mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full">
                        Transport
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

                    {/* Vehicle Specs */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Vehicle Specifications
                        </h2>
                        <div className="bg-muted/30 rounded-2xl p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Car className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Make & Model</p>
                                        <p className="font-semibold">{vehicleSpecs.make} {vehicleSpecs.model}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Settings className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Year</p>
                                        <p className="font-semibold">{vehicleSpecs.year}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Mountain className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">4x4 Capability</p>
                                        <p className="font-semibold">
                                            {vehicleSpecs.fourWD ? 'Full-time 4WD' : 'Standard 2WD'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Fuel className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fuel</p>
                                        <p className="font-semibold">
                                            {vehicleSpecs.fuelIncluded ? 'Included in rate' : 'Not included'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Settings className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Transmission</p>
                                        <p className="font-semibold">{vehicleSpecs.transmission}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Car className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Capacity</p>
                                        <p className="font-semibold">{vehicleSpecs.seats} passengers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            About This Service
                        </h2>
                        <div className="prose prose-gray max-w-none">
                            {listing.description.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </section>

                    {/* Routes & Usage */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Supported Routes & Terrains
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Routes */}
                            <div>
                                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Route className="w-4 h-4 text-primary" />
                                    Popular Routes
                                </h3>
                                <ul className="space-y-2">
                                    {routes.map((route, index) => (
                                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            {route}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Terrains */}
                            <div>
                                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Mountain className="w-4 h-4 text-primary" />
                                    Terrain Capability
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {terrains.map((terrain, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="px-3 py-1.5 rounded-full"
                                        >
                                            {terrain}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Safety & Condition */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Safety & Condition
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                                <Shield className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Driver Experience</p>
                                    <p className="text-muted-foreground text-sm">{safetyInfo.driverExperience}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl">
                                <Settings className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Maintenance</p>
                                    <p className="text-muted-foreground text-sm">{safetyInfo.maintenance}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl">
                                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Insurance</p>
                                    <p className="text-muted-foreground text-sm">{safetyInfo.insurance}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Provider Card */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Service Provider
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
                title={`More Transport in ${listing.region}`}
                listings={nearbyListings}
            />
        </div>
    );
}
