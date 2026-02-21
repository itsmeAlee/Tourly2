"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, BadgeCheck, MapPin, Languages, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PublicProviderProfile as Provider } from "@/lib/mappers";
import type { Listing } from "@/components/listing/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProviderProfileProps {
    provider: Provider;
    listings: Listing[];
}

export function ProviderProfile({ provider, listings }: ProviderProfileProps) {
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    const handleMessage = () => {
        // TODO: Open message modal
        console.log('Message provider:', provider.id);
    };

    // Group listings by type
    const stayListings = listings.filter(l => l.type === 'stay');
    const transportListings = listings.filter(l => l.type === 'transport');
    const guideListings = listings.filter(l => l.type === 'guide');

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors -ml-2 p-2 rounded-lg hover:bg-gray-50"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline text-sm font-medium">Back</span>
                        </button>

                        <div className="text-sm font-semibold text-foreground truncate max-w-md">
                            Provider Profile
                        </div>

                        <button
                            onClick={() => setIsSaved(!isSaved)}
                            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                        >
                            <Heart
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isSaved ? "fill-red-500 text-red-500" : "text-foreground"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </header>

            <main className="pb-24 lg:pb-12">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-gray-50 to-white py-8 lg:py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">
                            {/* Avatar */}
                            <div className="relative">
                                <Image
                                    src={provider.avatar}
                                    alt={provider.name}
                                    width={144}
                                    height={144}
                                    sizes="(min-width: 1024px) 144px, 112px"
                                    className="w-28 h-28 lg:w-36 lg:h-36 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                {provider.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                                        <BadgeCheck className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                                        {provider.name}
                                    </h1>
                                    {provider.isVerified && (
                                        <Badge variant="secondary" className="hidden lg:flex items-center gap-1">
                                            <BadgeCheck className="w-3.5 h-3.5" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{provider.region}</span>
                                    </div>
                                    <span className="text-gray-300">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <Languages className="w-4 h-4" />
                                        <span className="text-sm">{provider.languages.join(', ')}</span>
                                    </div>
                                    <span className="text-gray-300">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">{provider.experienceYears}+ years experience</span>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex items-center justify-center lg:justify-start gap-3">
                                    <Button
                                        onClick={handleMessage}
                                        className="rounded-2xl px-6"
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Message Provider
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsSaved(!isSaved)}
                                        className="rounded-2xl"
                                    >
                                        <Heart className={cn(
                                            "w-4 h-4",
                                            isSaved && "fill-red-500 text-red-500"
                                        )} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-8 border-b border-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            About {provider.name.split(' ')[0]}
                        </h2>
                        <div className="prose prose-gray max-w-none mb-6">
                            {provider.bio.split('\n\n').map((paragraph, i) => (
                                <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Service Areas */}
                        <div>
                            <h3 className="text-sm font-semibold text-foreground mb-3">Service Areas</h3>
                            <div className="flex flex-wrap gap-2">
                                {provider.serviceAreas.map((area) => (
                                    <Badge key={area} variant="secondary" className="rounded-full">
                                        {area}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-8">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-xl font-bold text-foreground">
                                Services by {provider.name}
                            </h2>
                            <Badge variant="secondary">{listings.length}</Badge>
                        </div>

                        {listings.length === 0 ? (
                            <p className="text-muted-foreground text-center py-12">
                                No services listed yet.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <ServiceCard key={listing.id} listing={listing} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Reviews Placeholder */}
                <section className="py-8 border-t border-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-xl font-bold text-foreground mb-4">
                            Reviews & Ratings
                        </h2>
                        <div className="bg-gray-50 rounded-2xl p-8 text-center">
                            <p className="text-muted-foreground">Reviews coming soon</p>
                        </div>
                    </div>
                </section>

                {/* Contact Note */}
                <section className="py-6">
                    <div className="container mx-auto px-4">
                        <p className="text-sm text-muted-foreground text-center">
                            Contact details are shared in chat if the provider chooses to do so.
                        </p>
                    </div>
                </section>
            </main>

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-30">
                <Button
                    onClick={handleMessage}
                    className="w-full rounded-2xl"
                    size="lg"
                >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Message {provider.name.split(' ')[0]}
                </Button>
            </div>
        </>
    );
}

// Service Card Component
function ServiceCard({ listing }: { listing: Listing }) {
    const typeLabels: Record<string, string> = {
        stay: 'Stay',
        transport: 'Transport',
        guide: 'Guide',
    };

    const priceUnitLabels: Record<string, string> = {
        night: '/ night',
        day: '/ day',
    };

    const formattedPrice = new Intl.NumberFormat('en-PK').format(listing.price);

    return (
        <Link
            href={`/listing/${listing.id}`}
            className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer"
        >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                    src={listing.images[0]?.url}
                    alt={listing.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Type Badge */}
                <Badge className="absolute top-3 left-3 rounded-full">
                    {typeLabels[listing.type]}
                </Badge>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                    {listing.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                    {listing.location}
                </p>
                <p className="text-sm font-medium text-foreground">
                    Starting from{' '}
                    <span className="text-primary font-bold">
                        PKR {formattedPrice}
                    </span>
                    <span className="text-muted-foreground font-normal">
                        {' '}{priceUnitLabels[listing.priceUnit]}
                    </span>
                </p>
            </div>
        </Link>
    );
}
