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

export { mockHotels, mockTourOperators, mockGuides } from "@/data/topRated";
