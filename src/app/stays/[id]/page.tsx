"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockHotelData } from "@/data/mockHotel";

// Import all stay components
import { ImageGallery } from "@/components/stays/ImageGallery";
import { StayHeader } from "@/components/stays/StayHeader";
import { HostProfile } from "@/components/stays/HostProfile";
import { Description } from "@/components/stays/Description";
import { AmenitiesGrid } from "@/components/stays/AmenitiesGrid";
import { ReviewsSummary } from "@/components/stays/ReviewsSummary";
import { BookingCard } from "@/components/stays/BookingCard";
import { MobileBookingBar } from "@/components/stays/MobileBookingBar";

export default function StayDetailPage() {
    const hotel = mockHotelData;

    return (
        <div className="min-h-screen bg-white pb-24 md:pb-8">
            {/* Back Navigation - Mobile */}
            <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="px-4 py-3">
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="md:container md:mx-auto md:px-4 md:pt-6">
                <ImageGallery images={hotel.images} title={hotel.title} />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 mt-6">
                {/* Golden Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Main Content (2/3) */}
                    <div className="lg:col-span-2">
                        {/* Header & Title */}
                        <StayHeader
                            title={hotel.title}
                            rating={hotel.rating}
                            reviewCount={hotel.reviewCount}
                            location={hotel.location}
                        />

                        {/* Host Profile */}
                        <HostProfile host={hotel.host} />

                        {/* Description */}
                        <Description description={hotel.description} />

                        {/* Amenities */}
                        <AmenitiesGrid amenities={hotel.amenities} />

                        {/* Reviews Summary */}
                        <ReviewsSummary
                            rating={hotel.rating}
                            reviewCount={hotel.reviewCount}
                            breakdown={hotel.reviewBreakdown}
                        />
                    </div>

                    {/* Right Column: Sticky Booking Card (1/3) - Desktop Only */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            <BookingCard
                                price={hotel.price}
                                currency={hotel.currency}
                                priceUnit={hotel.priceUnit}
                                rating={hotel.rating}
                                reviewCount={hotel.reviewCount}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Booking Bar - Fixed Bottom */}
            <MobileBookingBar
                price={hotel.price}
                currency={hotel.currency}
                priceUnit={hotel.priceUnit}
            />
        </div>
    );
}
