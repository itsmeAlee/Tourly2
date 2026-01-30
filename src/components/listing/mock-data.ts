
import {
    Wifi,
    Wind,
    MapPin,
    Star,
    Coffee,
    Car,
    Users,
    Shield,
    Award,
    Languages,
    Mountain,
    History,
    Fuel,
    Gauge,
    Camera,
    Utensils
} from 'lucide-react';

export type ListingType = 'stay' | 'transport' | 'guide';

export interface ListingImage {
    url: string;
    alt: string;
}

export interface Amenity {
    icon: any;
    label: string;
    value?: string; // For specs
}

export interface ListingProvider {
    name: string;
    avatar: string;
    isVerified: boolean;
    rating: number;
    reviews: number;
}

export interface ListingData {
    id: string;
    type: ListingType;
    title: string;
    location: string;
    rating: number;
    reviewCount: number;
    price: string;
    priceUnit: string;
    description: string;
    images: ListingImage[];
    amenities: Amenity[];
    provider: ListingProvider;
    specs?: {
        label: string;
        value: string;
        icon: any;
    }[];
    guideDetails?: {
        languages: string[];
        experience: string;
        specialties: string[];
    };
}

// Helper to generate consistent mock images
const getImages = (mainImage: string) => [
    { url: mainImage, alt: 'Main View' },
    { url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2670&auto=format&fit=crop', alt: 'Interior' },
    { url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop', alt: 'Detail' },
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2670&auto=format&fit=crop', alt: 'Surroundings' },
];

export const MOCK_LISTINGS: Record<string, ListingData> = {
    // --- STAYS (HOTELS) ---
    'stay-1': {
        id: 'stay-1',
        type: 'stay',
        title: 'Modern Forest Cabin Retreat',
        location: 'Tromsø, Norway',
        rating: 4.98,
        reviewCount: 124,
        price: '$220',
        priceUnit: '/ night',
        description: 'Experience the magic of the Arctic in this cozy, modern A-frame cabin. Perfect for Northern Lights viewing, this secluded retreat offers floor-to-ceiling windows, a wood-burning fireplace, and a private hot tub surrounded by snow-covered pines.',
        images: getImages('https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2574&auto=format&fit=crop'),
        amenities: [
            { icon: Wifi, label: 'Fast Wi-Fi' },
            { icon: Wind, label: 'AC & Heating' },
            { icon: Coffee, label: 'Full Kitchen' },
            { icon: Car, label: 'Free Parking' },
        ],
        provider: {
            name: 'Ingrid',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop',
            isVerified: true,
            rating: 4.9,
            reviews: 450
        }
    },
    'hotel-1': {
        id: 'hotel-1',
        type: 'stay',
        title: 'Shangrila Resort',
        location: 'Skardu',
        rating: 4.9,
        reviewCount: 328,
        price: '$180',
        priceUnit: '/ night',
        description: 'Known as "Heaven on Earth", Shangrila Resort offers a unique experience in the heart of Skardu. Built around the famous Lower Kachura Lake, the resort features unique boat-shaped cottages and breathtaking views.',
        images: getImages('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=450&fit=crop'),
        amenities: [
            { icon: Wifi, label: 'Free Wifi' },
            { icon: Utensils, label: 'Restaurant' },
            { icon: Mountain, label: 'Lake View' },
            { icon: Car, label: 'Parking' }
        ],
        provider: { name: 'Shangrila Mgmt', avatar: '', isVerified: true, rating: 4.8, reviews: 1200 }
    },
    'hotel-2': {
        id: 'hotel-2',
        type: 'stay',
        title: 'Serena Hotel Gilgit',
        location: 'Gilgit',
        rating: 4.8,
        reviewCount: 215,
        price: '$150',
        priceUnit: '/ night',
        description: 'Serena Hotel Gilgit stands as a sanctuary of comfort and style in the rugged landscape. Blending traditional heritage with modern luxury, it offers views of Mount Rakaposhi.',
        images: getImages('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=450&fit=crop'),
        amenities: [
            { icon: Wifi, label: 'High Speed Net' },
            { icon: Coffee, label: 'Cafe' },
            { icon: Shield, label: '24/7 Security' }
        ],
        provider: { name: 'Serena Hotels', avatar: '', isVerified: true, rating: 4.9, reviews: 850 }
    },
    'hotel-3': {
        id: 'hotel-3',
        type: 'stay',
        title: "Eagle's Nest Hotel",
        location: 'Duikar, Hunza',
        rating: 4.7,
        reviewCount: 189,
        price: '$120',
        priceUnit: '/ night',
        description: 'Perched on a high ridge in Duikar, this hotel offers the famous sunset and sunrise views over the Hunza Valley and surrounding peaks including Ladyfinger and Rakaposhi.',
        images: getImages('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=450&fit=crop'),
        amenities: [
            { icon: Mountain, label: 'Panaromic View' },
            { icon: Wind, label: 'Heated Rooms' },
            { icon: Utensils, label: 'Dining' }
        ],
        provider: { name: 'Hunza Stays', avatar: '', isVerified: true, rating: 4.7, reviews: 400 }
    },
    'hotel-4': {
        id: 'hotel-4',
        type: 'stay',
        title: 'Hunza Serena Inn',
        location: 'Karimabad',
        rating: 4.6,
        reviewCount: 156,
        price: '$200',
        priceUnit: '/ night',
        description: 'Located at the foot of the ancient Baltit Fort, this inn offers stunning views of the Karimabad valley and surrounding mountains, with lush gardens and traditional architecture.',
        images: getImages('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop'),
        amenities: [
            { icon: Wifi, label: 'Wifi' },
            { icon: History, label: 'Near Fort' },
            { icon: Coffee, label: 'Garden Cafe' }
        ],
        provider: { name: 'Serena Hotels', avatar: '', isVerified: true, rating: 4.9, reviews: 320 }
    },

    // --- TOUR OPERATORS (Mapped to Stay/Product Layout) ---
    'tour-1': {
        id: 'tour-1',
        type: 'stay',
        title: 'K2 Adventure Tours',
        location: 'Skardu',
        rating: 4.9,
        reviewCount: 412,
        price: '$1200',
        priceUnit: '/ trip',
        description: 'Join us for the adventure of a lifetime. We organize full-service treks to K2 Base Camp, ensuring safety and comfort in the world\'s most rugged terrain.',
        images: getImages('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=450&fit=crop'),
        amenities: [
            { icon: Mountain, label: 'Expert Guides' },
            { icon: Shield, label: 'Insurance' },
            { icon: Utensils, label: 'Meals Included' }
        ],
        provider: { name: 'K2 Adventures', avatar: '', isVerified: true, rating: 4.9, reviews: 410 }
    },
    'tour-2': {
        id: 'tour-2',
        type: 'stay',
        title: 'Karakoram Expeditions',
        location: 'Gilgit',
        rating: 4.8,
        reviewCount: 287,
        price: '$950',
        priceUnit: '/ trip',
        description: 'Explore the Karakoram highway and beyond. Our expeditions cover cultural heritage, scenic drives, and moderate treks.',
        images: getImages('https://images.unsplash.com/photo-1486911278844-a81c5267e227?w=600&h=450&fit=crop'),
        amenities: [
            { icon: Car, label: 'Transport' },
            { icon: Users, label: 'Small Groups' }
        ],
        provider: { name: 'Northern X', avatar: '', isVerified: true, rating: 4.7, reviews: 200 }
    },
    'tour-3': {
        id: 'tour-3',
        type: 'stay',
        title: 'Silk Route Travels',
        location: 'Hunza',
        rating: 4.7,
        reviewCount: 198,
        price: '$800',
        priceUnit: '/ trip',
        description: 'Walk the ancient Silk Road. Experience the history, culture, and hospitality of the mountain communities.',
        images: getImages('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=450&fit=crop'),
        amenities: [
            { icon: History, label: 'Cultural' },
            { icon: Camera, label: 'Photography' }
        ],
        provider: { name: 'Silk Route Co', avatar: '', isVerified: true, rating: 4.8, reviews: 150 }
    },
    'tour-4': {
        id: 'tour-4',
        type: 'stay',
        title: 'Northern Horizons',
        location: 'Passu',
        rating: 4.6,
        reviewCount: 145,
        price: '$600',
        priceUnit: '/ trip',
        description: 'Discover the Passu Cones and glaciers. We offer specialized hiking and climbing tours in the Gojal region.',
        images: getImages('https://images.unsplash.com/photo-1527576539890-dfa815648363?w=600&h=450&fit=crop'),
        amenities: [
            { icon: Mountain, label: 'Hiking' },
            { icon: Wind, label: 'Glacier Walk' }
        ],
        provider: { name: 'North Hz', avatar: '', isVerified: true, rating: 4.5, reviews: 100 }
    },


    // --- TRANSPORT ---
    'transport-1': {
        id: 'transport-1',
        type: 'transport',
        title: 'Toyota Prado TX',
        location: 'Skardu',
        rating: 4.8,
        reviewCount: 124,
        price: '$80',
        priceUnit: '/ day',
        description: 'Conquer the Highlands in style with this fully equipped Toyota Prado. Includes roof tent, camping gear, and unlimited mileage for your adventure.',
        images: getImages('https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop'),
        amenities: [
            { icon: MapPin, label: 'GPS Included' },
            { icon: Shield, label: 'Full Insurance' },
        ],
        specs: [
            { label: 'Transmission', value: 'Automatic', icon: Gauge },
            { label: 'Fuel', value: 'Diesel', icon: Fuel },
            { label: 'Seats', value: '7 Seats', icon: Users },
            { label: 'Drive', value: '4WD', icon: Mountain },
        ],
        provider: { name: 'Ahmed Khan', avatar: '', isVerified: true, rating: 4.8, reviews: 120 }
    },
    'transport-2': {
        id: 'transport-2',
        type: 'transport',
        title: 'Toyota Land Cruiser V8',
        location: 'Gilgit',
        rating: 4.9,
        reviewCount: 89,
        price: '$120',
        priceUnit: '/ day',
        description: 'Premium luxury and power. The Land Cruiser V8 is perfect for comfortable family travel across Gilgit-Baltistan.',
        images: getImages('https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&h=400&fit=crop'),
        amenities: [
            { icon: Wind, label: 'AC' },
            { icon: Shield, label: 'Leather Interior' }
        ],
        specs: [
            { label: 'Transmission', value: 'Auto', icon: Gauge },
            { label: 'Fuel', value: 'Petrol', icon: Fuel },
            { label: 'Seats', value: '8', icon: Users },
            { label: 'Drive', value: '4x4', icon: Mountain }
        ],
        provider: { name: 'Karim Shah', avatar: '', isVerified: true, rating: 4.9, reviews: 50 }
    },
    'transport-3': {
        id: 'transport-3',
        type: 'transport',
        title: 'Toyota Hilux Revo',
        location: 'Hunza',
        rating: 4.7,
        reviewCount: 156,
        price: '$70',
        priceUnit: '/ day',
        description: 'Rugged and reliable double cabin pickup. Ideal for off-road enthusiasts.',
        images: getImages('https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop'),
        amenities: [{ icon: Wind, label: 'AC' }, { icon: Mountain, label: 'Offroad Ready' }],
        specs: [
            { label: 'Trans', value: 'Auto', icon: Gauge },
            { label: 'Fuel', value: 'Diesel', icon: Fuel },
            { label: 'Drive', value: '4x4', icon: Mountain },
            { label: 'Seats', value: '5', icon: Users }
        ],
        provider: { name: 'Hassan Ali', avatar: '', isVerified: true, rating: 4.6, reviews: 80 }
    },
    'transport-4': {
        id: 'transport-4',
        type: 'transport',
        title: 'Toyota Coaster',
        location: 'Skardu',
        rating: 4.6,
        reviewCount: 67,
        price: '$150',
        priceUnit: '/ day',
        description: 'Spacious coaster suitable for large groups and tour parties.',
        images: getImages('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop'),
        amenities: [{ icon: Users, label: 'Group Travel' }],
        specs: [{ label: 'Seats', value: '29', icon: Users }],
        provider: { name: 'Faisal Baig', avatar: '', isVerified: true, rating: 4.5, reviews: 100 }
    },
    'transport-5': {
        id: 'transport-5',
        type: 'transport',
        title: 'Suzuki APV',
        location: 'Gilgit',
        rating: 4.4,
        reviewCount: 203,
        price: '$45',
        priceUnit: '/ day',
        description: 'Budget friendly family van for city and mild off-road travel.',
        images: getImages('https://images.unsplash.com/photo-1609520505218-7421df70c984?w=600&h=400&fit=crop'),
        amenities: [{ icon: Users, label: 'Family Friendly' }],
        specs: [{ label: 'Seats', value: '8', icon: Users }],
        provider: { name: 'Imran Hussain', avatar: '', isVerified: true, rating: 4.4, reviews: 200 }
    },
    'transport-6': {
        id: 'transport-6',
        type: 'transport',
        title: 'Toyota Fortuner',
        location: 'Hunza',
        rating: 4.9,
        reviewCount: 78,
        price: '$100',
        priceUnit: '/ day',
        description: 'Luxury SUV for maximum comfort on long journeys.',
        images: getImages('https://images.unsplash.com/photo-1625231334168-16e5d6cd9845?w=600&h=400&fit=crop'),
        amenities: [{ icon: Star, label: 'Luxury' }],
        specs: [{ label: 'Drive', value: '4x4', icon: Mountain }, { label: 'Seats', value: '7', icon: Users }],
        provider: { name: 'Zafar Iqbal', avatar: '', isVerified: true, rating: 4.8, reviews: 60 }
    },


    // --- GUIDES ---
    'guide-1': {
        id: 'guide-1',
        type: 'guide',
        title: 'Ali Sadpara',
        location: 'Skardu',
        rating: 5.0,
        reviewCount: 523,
        price: '$50',
        priceUnit: '/ hour',
        description: 'Professional mountaineer and certified guide with 15 years of experience leading expeditions to K2, Broad Peak, and other 8000m peaks.',
        images: getImages('https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=450&fit=crop'),
        amenities: [],
        guideDetails: {
            languages: ['English', 'Urdu', 'Balti'],
            experience: '15+ Years',
            specialties: ['Trekking', 'Mountaineering', 'K2 Base Camp']
        },
        provider: { name: 'Ali Sadpara', avatar: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=100&h=100&fit=crop', isVerified: true, rating: 5.0, reviews: 312 }
    },
    'guide-2': {
        id: 'guide-2',
        type: 'guide',
        title: 'Hassan Khan',
        location: 'Gilgit',
        rating: 4.9,
        reviewCount: 341,
        price: '$45',
        priceUnit: '/ hour',
        description: 'Expert local guide specializing in cultural tours and photography in the Gilgit region.',
        images: getImages('https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=450&fit=crop'),
        amenities: [],
        guideDetails: {
            languages: ['English', 'Urdu', 'Shina'],
            experience: '8 Years',
            specialties: ['Culture', 'Photography']
        },
        provider: { name: 'Hassan Khan', avatar: '', isVerified: true, rating: 4.9, reviews: 200 }
    },
    'guide-3': {
        id: 'guide-3',
        type: 'guide',
        title: 'Hunza Heritage Guide',
        location: 'Karimabad',
        rating: 4.8,
        reviewCount: 267,
        price: '$40',
        priceUnit: '/ hour',
        description: 'Discover the rich history of Baltit Fort and the ancient traditions of Hunza with me.',
        images: getImages('https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&h=450&fit=crop'),
        amenities: [],
        guideDetails: {
            languages: ['English', 'Urdu', 'Burushaski'],
            experience: '12 Years',
            specialties: ['History', 'Heritage']
        },
        provider: { name: 'Heritage Tours', avatar: '', isVerified: true, rating: 4.8, reviews: 150 }
    },
    'guide-4': {
        id: 'guide-4',
        type: 'guide',
        title: 'Baltistan Trekker',
        location: 'Shigar',
        rating: 4.7,
        reviewCount: 189,
        price: '$55',
        priceUnit: '/ hour',
        description: 'Specializing in treks around Shigar and Askole. Experience the wild beauty of the Karakoram.',
        images: getImages('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=450&fit=crop'),
        amenities: [],
        guideDetails: {
            languages: ['English', 'Urdu', 'Balti'],
            experience: '10 Years',
            specialties: ['Trekking', 'Camping']
        },
        provider: { name: 'Balti Treks', avatar: '', isVerified: true, rating: 4.7, reviews: 100 }
    }
};
