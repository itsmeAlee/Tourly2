// DEPRECATED: This file is kept for reference only. Do not import in new code.
// Mock data for the Tourly Listing Detail Page
// Features Northern Pakistan imagery and realistic content

import type { Listing, StayListing, TransportListing, GuideListing } from './types';

// Sample Stay Listing
const stayListing: StayListing = {
    id: 'stay-1',
    type: 'stay',
    title: 'Mountain View Retreat - Hunza Valley',
    location: 'Karimabad, Hunza',
    region: 'Hunza',
    description: `Experience the magic of Hunza Valley at our cozy mountain retreat. Nestled in the heart of Karimabad, this traditional guest house offers breathtaking views of Rakaposhi and the surrounding peaks.

Our family-run property combines authentic Hunza hospitality with modern comforts. Wake up to the sight of snow-capped mountains, enjoy home-cooked Hunza cuisine, and let us help you explore the ancient forts, terraced fields, and hidden gems of the valley.

Whether you're a solo traveler seeking peace or a family looking for adventure, our retreat provides the perfect base for your Northern Pakistan journey.`,
    price: 8500,
    priceUnit: 'night',
    images: [
        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200', alt: 'Mountain cabin exterior with snow peaks' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', alt: 'Cozy bedroom interior' },
        { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600', alt: 'Traditional dining area' },
        { url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600', alt: 'Mountain view from balcony' },
        { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600', alt: 'Guest house common area' },
    ],
    highlights: ['Heating', 'Hot Water', 'WiFi', 'Family-friendly'],
    propertyOverview: {
        guests: 8,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2,
    },
    amenities: [
        'Breakfast Included',
        'Free Parking',
        'Generator Backup',
        'Mountain View',
        'Fireplace',
        'Kitchen Access',
    ],
    locationInfo: {
        landmark: '5 min walk to Eagle\'s Nest viewpoint',
        howToReach: 'From Gilgit, take the Karakoram Highway (KKH) towards Hunza. After approximately 2 hours, you\'ll reach Karimabad. Our guest house is located in the main bazaar area, a short walk from Baltit Fort. We can arrange pickup from Gilgit airport or the main road.',
    },
    provider: {
        id: 'provider-1',
        name: 'Ahmad Khan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        languages: ['Urdu', 'English', 'Burushaski'],
        region: 'Hunza Valley',
    },
    rating: 4.8,
    reviewCount: 127,
};

// Sample Transport Listing
const transportListing: TransportListing = {
    id: 'transport-1',
    type: 'transport',
    title: 'Toyota Prado 4x4 - Gilgit to Skardu',
    location: 'Gilgit, Gilgit-Baltistan',
    region: 'Gilgit-Baltistan',
    description: `Travel in comfort and safety with our well-maintained Toyota Land Cruiser Prado. Perfect for navigating the challenging mountain roads of Northern Pakistan, our 4x4 is equipped to handle any terrain.

Our experienced driver knows every turn of the Karakoram Highway and beyond. Whether you're heading to Skardu, exploring the Deosai Plateau, or venturing into remote valleys, we ensure a smooth and memorable journey.

All our vehicles are regularly serviced and come with comprehensive insurance for your peace of mind.`,
    price: 18000,
    priceUnit: 'day',
    images: [
        { url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200', alt: 'Toyota Prado on mountain road' },
        { url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600', alt: 'Vehicle interior' },
        { url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600', alt: 'Prado front view' },
        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', alt: 'Scenic mountain route' },
        { url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600', alt: 'Vehicle on KKH' },
    ],
    highlights: ['4x4', 'Prado', 'Seats 7', 'With Driver'],
    vehicleSpecs: {
        make: 'Toyota',
        model: 'Land Cruiser Prado',
        year: 2019,
        fourWD: true,
        fuelIncluded: true,
        transmission: 'Automatic',
        seats: 7,
    },
    routes: [
        'Gilgit to Skardu (KKH)',
        'Hunza Valley tours',
        'Deosai Plateau access',
        'Fairy Meadows drop-off',
    ],
    terrains: ['Off-road', 'Snow-capable', 'High-altitude passes'],
    safetyInfo: {
        driverExperience: 'Professional driver with 10+ years experience on Northern routes',
        maintenance: 'Regularly serviced, GPS-equipped, satellite phone available',
        insurance: 'Fully insured for all passengers and luggage',
    },
    provider: {
        id: 'provider-2',
        name: 'Karim Transport Services',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        languages: ['Urdu', 'English'],
        region: 'Gilgit-Baltistan',
    },
    rating: 4.9,
    reviewCount: 89,
};

// Sample Guide Listing
const guideListing: GuideListing = {
    id: 'guide-1',
    type: 'guide',
    title: 'Faisal Ahmed - High Altitude Trekking Guide',
    location: 'Skardu, Gilgit-Baltistan',
    region: 'Gilgit-Baltistan',
    description: `With over 15 years of experience guiding treks in the Karakoram and Himalayan ranges, I bring a deep passion for the mountains and a commitment to safe, unforgettable adventures.

Born and raised in Skardu, I grew up exploring the trails that lead to some of the world's most spectacular peaks. I've completed numerous expeditions to K2 Base Camp, Concordia, and the Baltoro Glacier, and I take pride in sharing my knowledge of the region's geography, culture, and wildlife.

My approach prioritizes safety without sacrificing the spirit of adventure. I hold wilderness first responder certification and am trained in altitude sickness management. Whether you're an experienced trekker or embarking on your first high-altitude journey, I'll ensure you're prepared and supported every step of the way.`,
    price: 12000,
    priceUnit: 'day',
    images: [
        { url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200', alt: 'Mountain guide portrait with peaks' },
        { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', alt: 'Trekking in Karakoram' },
        { url: 'https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=600', alt: 'Group trek on glacier' },
        { url: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600', alt: 'Base camp setup' },
        { url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600', alt: 'Mountain summit view' },
    ],
    highlights: ['English', 'Urdu', 'First Aid Certified', 'Max 8 Hikers'],
    skills: [
        'High-altitude trekking',
        'Glacier navigation',
        'Rock climbing basics',
        'Wildlife identification',
        'Local history & culture',
    ],
    certifications: [
        { name: 'Licensed Mountain Guide', issuer: 'Pakistan Alpine Club' },
        { name: 'Wilderness First Responder' },
        { name: 'Altitude Sickness Management' },
        { name: 'Leave No Trace Trainer' },
    ],
    trekRoutes: [
        { name: 'K2 Base Camp Trek', duration: '12-14 days' },
        { name: 'Concordia & Baltoro Glacier', duration: '10-12 days' },
        { name: 'Deosai Plateau Tour', duration: '3-4 days' },
        { name: 'Rakaposhi Base Camp', duration: '5-7 days' },
        { name: 'Cultural tours in Shigar & Skardu', duration: '2-3 days' },
    ],
    equipment: {
        provided: [
            'Trekking poles',
            'First aid kit',
            'Maps and route guidance',
            'Emergency communication (satellite phone)',
            'Group camping equipment',
        ],
        toBring: [
            'Personal clothing & gear',
            'Sleeping bag (can be rented)',
            'Personal medications',
            'Travel insurance documentation',
            'Valid ID/passport',
        ],
    },
    maxGroupSize: 8,
    provider: {
        id: 'provider-3',
        name: 'Faisal Ahmed',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
        languages: ['English', 'Urdu', 'Balti'],
        region: 'Gilgit-Baltistan',
    },
    rating: 5.0,
    reviewCount: 64,
};

// Export mock listings as a record for easy lookup by ID
// Include all IDs from topRated.ts, mockTransport.ts, and mockGuides.ts
export const MOCK_LISTINGS: Record<string, Listing> = {
    // Original listings
    'stay-1': stayListing,
    'transport-1': transportListing,
    'guide-1': guideListing,

    // Hotels (from topRated.ts) - use stay layout
    'hotel-1': { ...stayListing, id: 'hotel-1', title: 'Shangrila Resort', location: 'Skardu', region: 'Skardu' },
    'hotel-2': { ...stayListing, id: 'hotel-2', title: 'Serena Hotel Gilgit', location: 'Gilgit', region: 'Gilgit' },
    'hotel-3': { ...stayListing, id: 'hotel-3', title: "Eagle's Nest Hotel", location: 'Duikar, Hunza', region: 'Hunza' },
    'hotel-4': { ...stayListing, id: 'hotel-4', title: 'Hunza Serena Inn', location: 'Karimabad', region: 'Hunza' },

    // Tour Operators (from topRated.ts) - use transport layout
    'tour-1': { ...transportListing, id: 'tour-1', title: 'K2 Adventure Tours', location: 'Skardu', region: 'Skardu' },
    'tour-2': { ...transportListing, id: 'tour-2', title: 'Karakoram Expeditions', location: 'Gilgit', region: 'Gilgit' },
    'tour-3': { ...transportListing, id: 'tour-3', title: 'Silk Route Travels', location: 'Hunza', region: 'Hunza' },
    'tour-4': { ...transportListing, id: 'tour-4', title: 'Northern Horizons', location: 'Passu', region: 'Passu' },

    // Additional Guides (from topRated.ts and mockGuides.ts)
    'guide-2': { ...guideListing, id: 'guide-2', title: 'Fatima Hunzai - Cultural Tours Guide', location: 'Hunza', region: 'Hunza', provider: { ...guideListing.provider, id: 'provider-guide-2', name: 'Fatima Hunzai' } },
    'guide-3': { ...guideListing, id: 'guide-3', title: 'Karim Shah - Fairy Meadows Guide', location: 'Gilgit', region: 'Gilgit', provider: { ...guideListing.provider, id: 'provider-guide-3', name: 'Karim Shah' } },
    'guide-4': { ...guideListing, id: 'guide-4', title: 'Hassan Baltoro - Mountaineering Expert', location: 'Skardu', region: 'Skardu', provider: { ...guideListing.provider, id: 'provider-guide-4', name: 'Hassan Baltoro' } },
    'guide-5': { ...guideListing, id: 'guide-5', title: 'Amina Yasmin - Women-Only Tours', location: 'Gulmit', region: 'Gulmit', provider: { ...guideListing.provider, id: 'provider-guide-5', name: 'Amina Yasmin' } },
    'guide-6': { ...guideListing, id: 'guide-6', title: 'Rehmat Ullah - Wildlife Expert', location: 'Deosai', region: 'Deosai', provider: { ...guideListing.provider, id: 'provider-guide-6', name: 'Rehmat Ullah' } },

    // Additional Transport (from mockTransport.ts)
    'transport-2': { ...transportListing, id: 'transport-2', title: 'Toyota Land Cruiser V8', location: 'Gilgit', region: 'Gilgit', price: 12000 },
    'transport-3': { ...transportListing, id: 'transport-3', title: 'Toyota Hilux Revo', location: 'Hunza', region: 'Hunza', price: 7000 },
    'transport-4': { ...transportListing, id: 'transport-4', title: 'Toyota Coaster - Group Travel', location: 'Skardu', region: 'Skardu', price: 15000 },
    'transport-5': { ...transportListing, id: 'transport-5', title: 'Suzuki APV - Budget Option', location: 'Gilgit', region: 'Gilgit', price: 4500 },
    'transport-6': { ...transportListing, id: 'transport-6', title: 'Toyota Fortuner Premium', location: 'Hunza', region: 'Hunza', price: 10000 },

    // Special hotel ID from mockHotel.ts
    'serene-palace-skardu': { ...stayListing, id: 'serene-palace-skardu', title: 'Serene Palace Hotel Skardu', location: 'Upper Kachura, Skardu', region: 'Skardu', price: 15000 },
};

// Export individual listings for direct access
export { stayListing, transportListing, guideListing };

// Helper to get all listings as array
export const getAllListings = (): Listing[] => Object.values(MOCK_LISTINGS);

// Helper to get listings by type
export const getListingsByType = (type: Listing['type']): Listing[] =>
    getAllListings().filter((listing) => listing.type === type);

