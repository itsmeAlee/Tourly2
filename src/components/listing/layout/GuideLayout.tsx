import { MapPin, Award, Check, X, Compass, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HighlightsRow } from "../shared/HighlightsRow";
import { StickyActionSidebar } from "../shared/StickyActionSidebar";
import { ProviderCard } from "../shared/ProviderCard";
import { NearbyServices } from "../shared/NearbyServices";
import type { GuideListing, Listing } from "../types";

interface GuideLayoutProps {
    listing: GuideListing;
    nearbyListings?: Listing[];
}

export function GuideLayout({ listing, nearbyListings = [] }: GuideLayoutProps) {
    const { skills, certifications, trekRoutes, equipment, maxGroupSize } = listing;

    // Get initials for avatar fallback
    const initials = listing.provider.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Portrait-First Hero Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
                {/* Large Vertical Portrait - Left Side */}
                <div className="lg:col-span-2">
                    <div className="relative aspect-[3/4] lg:aspect-[3/4] rounded-2xl overflow-hidden">
                        <img
                            src={listing.images[0]?.url}
                            alt={listing.provider.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient overlay for text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        {/* Name overlay on mobile */}
                        <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                            <div className="text-xl font-bold text-white">
                                {listing.title}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Photos Grid - Right Side */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-2 lg:gap-3">
                    {listing.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Header Info */}
            <div className="mt-6 mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full">
                        Trekking Guide
                    </Badge>
                </div>
                <h1 className="hidden lg:block text-2xl lg:text-3xl font-bold text-foreground mb-2">
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

                    {/* Skills & Certifications */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Skills & Certifications
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Skills */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground mb-3">Expertise</h3>
                                {skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 text-muted-foreground"
                                    >
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                        {skill}
                                    </div>
                                ))}
                            </div>
                            {/* Certifications */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground mb-3">Certifications</h3>
                                {certifications.map((cert, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 text-muted-foreground"
                                    >
                                        <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <div>
                                            <span>{cert.name}</span>
                                            {cert.issuer && (
                                                <span className="text-sm text-muted-foreground/70">
                                                    {' '}— {cert.issuer}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* About */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            About This Guide
                        </h2>
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={listing.provider.avatar} alt={listing.provider.name} />
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{listing.provider.name}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Max group size: {maxGroupSize} hikers
                                </p>
                            </div>
                        </div>
                        <div className="prose prose-gray max-w-none">
                            {listing.description.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </section>

                    {/* Routes & Trips */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Popular Treks & Expeditions
                        </h2>
                        <div className="space-y-3">
                            {trekRoutes.map((route, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Compass className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-medium text-foreground">{route.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        {route.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Equipment Support */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Equipment Support
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* What's Provided */}
                            <div className="p-5 bg-green-50 border border-green-100 rounded-2xl">
                                <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                                    <Check className="w-5 h-5" />
                                    What's Provided
                                </h3>
                                <ul className="space-y-2">
                                    {equipment.provided.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-green-700 text-sm"
                                        >
                                            <Check className="w-4 h-4 mt-0.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* What to Bring */}
                            <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                                <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                                    <X className="w-5 h-5" />
                                    What to Bring
                                </h3>
                                <ul className="space-y-2">
                                    {equipment.toBring.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-amber-700 text-sm"
                                        >
                                            <span className="w-4 h-4 flex items-center justify-center shrink-0">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Provider Card */}
                    <section>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Contact Information
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
                title={`More Guides in ${listing.region}`}
                listings={nearbyListings}
            />
        </div>
    );
}
