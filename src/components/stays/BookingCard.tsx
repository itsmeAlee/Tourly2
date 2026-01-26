"use client";

import { useState } from "react";
import { Star, CalendarDays, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingCardProps {
    price: number;
    currency: string;
    priceUnit: string;
    rating: number;
    reviewCount: number;
}

export function BookingCard({
    price,
    currency,
    priceUnit,
    rating,
    reviewCount,
}: BookingCardProps) {
    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();
    const [guests, setGuests] = useState(2);
    const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);

    const formattedPrice = price.toLocaleString();

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sticky top-24">
            {/* Header: Price & Rating */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <span className="text-2xl font-bold text-gray-900">
                        {currency} {formattedPrice}
                    </span>
                    <span className="text-gray-500 font-normal"> / {priceUnit}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                    <span className="text-gray-500">({reviewCount})</span>
                </div>
            </div>

            {/* Booking Form */}
            <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                {/* Date Row */}
                <div className="grid grid-cols-2">
                    {/* Check-in */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="p-3 text-left border-r border-b border-gray-300 hover:bg-gray-50 transition-colors">
                                <div className="text-xs font-semibold text-gray-700 uppercase mb-1">
                                    Check-in
                                </div>
                                <div className="text-sm text-gray-600">
                                    {checkIn ? format(checkIn, "MMM d, yyyy") : "Add date"}
                                </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white" align="start">
                            <Calendar
                                mode="single"
                                selected={checkIn}
                                onSelect={setCheckIn}
                                disabled={{ before: new Date() }}
                                initialFocus
                                className="p-3"
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Check-out */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="p-3 text-left border-b border-gray-300 hover:bg-gray-50 transition-colors">
                                <div className="text-xs font-semibold text-gray-700 uppercase mb-1">
                                    Checkout
                                </div>
                                <div className="text-sm text-gray-600">
                                    {checkOut ? format(checkOut, "MMM d, yyyy") : "Add date"}
                                </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white" align="end">
                            <Calendar
                                mode="single"
                                selected={checkOut}
                                onSelect={setCheckOut}
                                disabled={{ before: checkIn || new Date() }}
                                initialFocus
                                className="p-3"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Guests Row */}
                <Popover open={isGuestPopoverOpen} onOpenChange={setIsGuestPopoverOpen}>
                    <PopoverTrigger asChild>
                        <button className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div>
                                <div className="text-xs font-semibold text-gray-700 uppercase mb-1">
                                    Guests
                                </div>
                                <div className="text-sm text-gray-600">
                                    {guests} guest{guests > 1 ? "s" : ""}
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 bg-white" align="end">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Guests</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors"
                                >
                                    −
                                </button>
                                <span className="w-6 text-center">{guests}</span>
                                <button
                                    onClick={() => setGuests(guests + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Reserve Button */}
            <Button className="w-full h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90">
                Reserve
            </Button>

            {/* Microcopy */}
            <p className="text-center text-sm text-gray-500 mt-3">
                You won&apos;t be charged yet
            </p>

            {/* Price Breakdown (optional preview) */}
            {checkIn && checkOut && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>{currency} {formattedPrice} x 3 nights</span>
                        <span>{currency} {(price * 3).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Service fee</span>
                        <span>{currency} 2,000</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span>{currency} {(price * 3 + 2000).toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
