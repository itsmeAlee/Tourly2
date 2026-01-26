// Mock data for a hotel in Skardu
export const mockHotelData = {
    id: "serene-palace-skardu",
    title: "Serene Palace Hotel Skardu",
    subtitle: "Luxurious retreat with stunning mountain views",
    location: "Upper Kachura, Skardu",

    rating: 4.9,
    reviewCount: 328,

    price: 15000,
    priceUnit: "night",
    currency: "Rs.",

    host: {
        name: "Ali Sadpara",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isVerified: true,
        isSuperhost: true,
    },

    images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
    ],

    description: `Experience the ultimate mountain retreat at Serene Palace Hotel, nestled in the heart of Upper Kachura with breathtaking views of the Karakoram Range. Our hotel offers a perfect blend of traditional Balti hospitality and modern luxury amenities.

Each room is thoughtfully designed with local craftsmanship, featuring handwoven carpets, traditional wooden furniture, and panoramic windows that frame the majestic peaks. Wake up to the sight of snow-capped mountains and the serene waters of the nearby lake.

Our on-site restaurant serves authentic Balti cuisine prepared with locally sourced ingredients, while our terrace offers the perfect spot for evening tea as the sun sets behind the mountains. Whether you're here for trekking adventures or peaceful relaxation, Serene Palace is your gateway to the wonders of Gilgit-Baltistan.`,

    amenities: [
        { id: "wifi", name: "Free WiFi", icon: "Wifi" },
        { id: "breakfast", name: "Breakfast Included", icon: "UtensilsCrossed" },
        { id: "heater", name: "Room Heater", icon: "Flame" },
        { id: "parking", name: "Free Parking", icon: "Car" },
        { id: "tv", name: "Flat Screen TV", icon: "Tv" },
        { id: "laundry", name: "Laundry Service", icon: "WashingMachine" },
        { id: "restaurant", name: "On-site Restaurant", icon: "Utensils" },
        { id: "terrace", name: "Mountain View Terrace", icon: "Mountain" },
    ],

    reviewBreakdown: {
        cleanliness: 4.9,
        accuracy: 4.8,
        communication: 5.0,
        location: 5.0,
        checkIn: 4.9,
        value: 4.7,
    },

    reviews: [
        {
            id: "1",
            author: "Sarah Ahmed",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
            rating: 5,
            date: "December 2025",
            content: "Absolutely stunning location! The views from our room were incredible. Staff was incredibly welcoming and the food was delicious.",
        },
        {
            id: "2",
            author: "Michael Chen",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            rating: 5,
            date: "November 2025",
            content: "One of the best hotels I've stayed at in Pakistan. The attention to detail and hospitality is unmatched.",
        },
    ],
};

export type HotelData = typeof mockHotelData;
