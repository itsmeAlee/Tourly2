// DEPRECATED: This file is kept for reference only. Do not import in new code.
// Mock data for local guides in Gilgit-Baltistan

export interface Guide {
    id: string;
    name: string;
    image: string;
    languages: string[];
    specialties: string[];
    pricePerDay: number;
    currency: string;
    rating: number;
    reviewCount: number;
    location: string;
    experience: number; // years
    bio: string;
    isVerified: boolean;
}

export const mockGuides: Guide[] = [
    {
        id: "guide-1",
        name: "Ali Sadpara",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        languages: ["English", "Urdu", "Balti"],
        specialties: ["Trekking", "Mountaineering", "K2 Base Camp"],
        pricePerDay: 5000,
        currency: "Rs.",
        rating: 4.9,
        reviewCount: 312,
        location: "Skardu",
        experience: 15,
        bio: "Professional mountaineer and certified guide with 15 years of experience leading expeditions to K2, Broad Peak, and other 8000m peaks.",
        isVerified: true,
    },
    {
        id: "guide-2",
        name: "Fatima Hunzai",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
        languages: ["English", "Urdu", "Burushaski", "Chinese"],
        specialties: ["Cultural Tours", "Photography", "Food Tours"],
        pricePerDay: 3500,
        currency: "Rs.",
        rating: 4.8,
        reviewCount: 189,
        location: "Hunza",
        experience: 8,
        bio: "Passionate about sharing Hunza's rich culture, cuisine, and hidden gems. Specializing in authentic local experiences and photography tours.",
        isVerified: true,
    },
    {
        id: "guide-3",
        name: "Karim Shah",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        languages: ["English", "Urdu", "Shina"],
        specialties: ["Trekking", "Fairy Meadows", "Nanga Parbat"],
        pricePerDay: 4000,
        currency: "Rs.",
        rating: 4.7,
        reviewCount: 245,
        location: "Gilgit",
        experience: 12,
        bio: "Expert in Nanga Parbat region treks. Led over 500 successful expeditions to Fairy Meadows and base camps.",
        isVerified: true,
    },
    {
        id: "guide-4",
        name: "Hassan Baltoro",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        languages: ["English", "Urdu", "Balti", "German"],
        specialties: ["Mountaineering", "Rock Climbing", "Glacier Treks"],
        pricePerDay: 6000,
        currency: "Rs.",
        rating: 5.0,
        reviewCount: 98,
        location: "Skardu",
        experience: 20,
        bio: "High-altitude specialist with summits of all five 8000m peaks in Pakistan. IFMGA certified mountain guide.",
        isVerified: true,
    },
    {
        id: "guide-5",
        name: "Amina Yasmin",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        languages: ["English", "Urdu", "Wakhi"],
        specialties: ["Cultural Tours", "Women-Only Tours", "Handicrafts"],
        pricePerDay: 3000,
        currency: "Rs.",
        rating: 4.9,
        reviewCount: 156,
        location: "Gulmit",
        experience: 6,
        bio: "Specializing in women-friendly tours and authentic Wakhi cultural experiences. Expert in local handicrafts and traditional cuisine.",
        isVerified: true,
    },
    {
        id: "guide-6",
        name: "Rehmat Ullah",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
        languages: ["English", "Urdu", "Balti"],
        specialties: ["Wildlife", "Birdwatching", "Nature Photography"],
        pricePerDay: 3500,
        currency: "Rs.",
        rating: 4.6,
        reviewCount: 87,
        location: "Deosai",
        experience: 10,
        bio: "Wildlife expert and naturalist specializing in Himalayan brown bear and snow leopard tracking in Deosai National Park.",
        isVerified: true,
    },
];
