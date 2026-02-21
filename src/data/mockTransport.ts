// DEPRECATED: This file is kept for reference only. Do not import in new code.
// Mock data for transport vehicles in Gilgit-Baltistan

export interface Vehicle {
    id: string;
    model: string;
    year: number;
    driverName: string;
    image: string;
    pricePerDay: number;
    currency: string;
    features: string[];
    rating: number;
    reviewCount: number;
    location: string;
    seats: number;
    licensePlate?: string;
}

export const mockVehicles: Vehicle[] = [
    {
        id: "transport-1",
        model: "Toyota Prado TX",
        year: 2022,
        driverName: "Ahmed Khan",
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop",
        pricePerDay: 8000,
        currency: "Rs.",
        features: ["4x4", "AC", "Heater", "GPS"],
        rating: 4.8,
        reviewCount: 124,
        location: "Skardu",
        seats: 7,
    },
    {
        id: "transport-2",
        model: "Toyota Land Cruiser V8",
        year: 2021,
        driverName: "Karim Shah",
        image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&h=400&fit=crop",
        pricePerDay: 12000,
        currency: "Rs.",
        features: ["4x4", "AC", "Heater", "Leather Seats", "GPS"],
        rating: 4.9,
        reviewCount: 89,
        location: "Gilgit",
        seats: 8,
    },
    {
        id: "transport-3",
        model: "Toyota Hilux Revo",
        year: 2023,
        driverName: "Hassan Ali",
        image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop",
        pricePerDay: 7000,
        currency: "Rs.",
        features: ["4x4", "AC", "Double Cabin"],
        rating: 4.7,
        reviewCount: 156,
        location: "Hunza",
        seats: 5,
    },
    {
        id: "transport-4",
        model: "Toyota Coaster",
        year: 2020,
        driverName: "Faisal Baig",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
        pricePerDay: 15000,
        currency: "Rs.",
        features: ["AC", "Heater", "Group Travel", "29 Seats"],
        rating: 4.6,
        reviewCount: 67,
        location: "Skardu",
        seats: 29,
    },
    {
        id: "transport-5",
        model: "Suzuki APV",
        year: 2022,
        driverName: "Imran Hussain",
        image: "https://images.unsplash.com/photo-1609520505218-7421df70c984?w=600&h=400&fit=crop",
        pricePerDay: 4500,
        currency: "Rs.",
        features: ["AC", "Budget Friendly"],
        rating: 4.4,
        reviewCount: 203,
        location: "Gilgit",
        seats: 8,
    },
    {
        id: "transport-6",
        model: "Toyota Fortuner",
        year: 2023,
        driverName: "Zafar Iqbal",
        image: "https://images.unsplash.com/photo-1625231334168-16e5d6cd9845?w=600&h=400&fit=crop",
        pricePerDay: 10000,
        currency: "Rs.",
        features: ["4x4", "AC", "Heater", "Premium"],
        rating: 4.9,
        reviewCount: 78,
        location: "Hunza",
        seats: 7,
    },
];
