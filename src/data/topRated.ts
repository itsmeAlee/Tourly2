// DEPRECATED: This file is kept for reference only. Do not import in new code.
export interface TopRatedListingItem {
    id: string;
    title: string;
    image: string;
    rating: number;
    reviewCount: number;
    location: string;
}

export const mockHotels: TopRatedListingItem[] = [
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

export const mockTourOperators: TopRatedListingItem[] = [
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

export const mockGuides: TopRatedListingItem[] = [
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
