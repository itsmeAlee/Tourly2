"use client";

import { ListingCard, ListingCategory } from "./ListingCard";
import { ChevronRight } from "lucide-react";

interface ListingItem {
    id: string;
    title: string;
    image: string;
    rating: number;
    reviewCount: number;
    location: string;
}

interface TopRatedSectionProps {
    title: string;
    subtitle?: string;
    category: ListingCategory;
    items: ListingItem[];
    viewAllHref?: string;
}

export function TopRatedSection({
    title,
    subtitle,
    category,
    items,
    viewAllHref = "#",
}: TopRatedSectionProps) {
    return (
        <section className="py-8 lg:py-16">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-6 lg:mb-8 px-4 lg:px-0">
                <div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-muted-foreground text-xs md:text-sm lg:text-base">
                            {subtitle}
                        </p>
                    )}
                </div>
                <a
                    href={viewAllHref}
                    className="flex items-center gap-1 text-primary font-medium text-sm hover:underline underline-offset-4"
                >
                    View all
                    <ChevronRight className="w-4 h-4" />
                </a>
            </div>

            {/* Mobile: Horizontal Swipeable Carousel */}
            <div className="lg:hidden">
                <div
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center"
                        >
                            <ListingCard
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                rating={item.rating}
                                reviewCount={item.reviewCount}
                                location={item.location}
                                category={category}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <ListingCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        rating={item.rating}
                        reviewCount={item.reviewCount}
                        location={item.location}
                        category={category}
                    />
                ))}
            </div>
        </section>
    );
}

// ============================================
// MOCK DATA FOR GILGIT-BALTISTAN LISTINGS
// ============================================

export const mockHotels = [
    {
        id: "hotel-1",
        title: "Shangrila Resort",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=450&fit=crop",
        rating: 4.9,
        reviewCount: 328,
        location: "Skardu",
    },
    {
        id: "hotel-2",
        title: "Serena Hotel Gilgit",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=450&fit=crop",
        rating: 4.8,
        reviewCount: 215,
        location: "Gilgit",
    },
    {
        id: "hotel-3",
        title: "Eagle's Nest Hotel",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=450&fit=crop",
        rating: 4.7,
        reviewCount: 189,
        location: "Duikar, Hunza",
    },
    {
        id: "hotel-4",
        title: "Hunza Serena Inn",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop",
        rating: 4.6,
        reviewCount: 156,
        location: "Karimabad",
    },
];

export const mockTourOperators = [
    {
        id: "tour-1",
        title: "K2 Adventure Tours",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=450&fit=crop",
        rating: 4.9,
        reviewCount: 412,
        location: "Skardu",
    },
    {
        id: "tour-2",
        title: "Karakoram Expeditions",
        image: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=600&h=450&fit=crop",
        rating: 4.8,
        reviewCount: 287,
        location: "Gilgit",
    },
    {
        id: "tour-3",
        title: "Silk Route Travels",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=450&fit=crop",
        rating: 4.7,
        reviewCount: 198,
        location: "Hunza",
    },
    {
        id: "tour-4",
        title: "Northern Horizons",
        image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=600&h=450&fit=crop",
        rating: 4.6,
        reviewCount: 145,
        location: "Passu",
    },
];

export const mockGuides = [
    {
        id: "guide-1",
        title: "Ali Sadpara Adventures",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=450&fit=crop",
        rating: 5.0,
        reviewCount: 523,
        location: "Skardu",
    },
    {
        id: "guide-2",
        title: "Hassan Khan Guides",
        image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=450&fit=crop",
        rating: 4.9,
        reviewCount: 341,
        location: "Gilgit",
    },
    {
        id: "guide-3",
        title: "Hunza Heritage Tours",
        image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&h=450&fit=crop",
        rating: 4.8,
        reviewCount: 267,
        location: "Karimabad",
    },
    {
        id: "guide-4",
        title: "Baltistan Trekking Co.",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=450&fit=crop",
        rating: 4.7,
        reviewCount: 189,
        location: "Shigar",
    },
];
