// DEPRECATED: This file is kept for reference only. Do not import in new code.
// Mock data for provider profiles
import type { Listing } from '@/components/listing/types';
import { MOCK_LISTINGS, getAllListings } from '@/components/listing/mock-data';

export interface Provider {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    region: string;
    languages: string[];
    serviceAreas: string[];
    experienceYears: number;
    isVerified: boolean;
    joinedDate: string;
}

// Sample providers
export const MOCK_PROVIDERS: Record<string, Provider> = {
    'provider-1': {
        id: 'provider-1',
        name: 'Ahmad Khan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        bio: `I've been welcoming travelers to the Hunza Valley for over 15 years. Born and raised in Karimabad, I grew up surrounded by the majestic peaks of Rakaposhi and Lady Finger, and I've made it my life's mission to share the beauty and culture of my homeland with visitors from around the world.

My family has operated hospitality services in Hunza for three generations. We believe in providing authentic experiences that go beyond typical tourism – from home-cooked Hunza cuisine to guiding guests to hidden viewpoints that only locals know about.

Whether you're seeking adventure or tranquility, I'm here to make your journey to the roof of the world unforgettable.`,
        region: 'Hunza Valley',
        languages: ['English', 'Urdu', 'Burushaski'],
        serviceAreas: ['Hunza', 'Gilgit', 'Skardu', 'Passu', 'Khunjerab'],
        experienceYears: 15,
        isVerified: true,
        joinedDate: '2020-03-15',
    },
    'provider-2': {
        id: 'provider-2',
        name: 'Karim Transport Services',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        bio: `Karim Transport Services has been the trusted name for reliable vehicle rentals across Gilgit-Baltistan for over a decade. We understand that navigating the challenging mountain roads requires not just a vehicle, but a trusted partner.

Our fleet consists of well-maintained 4x4 vehicles specifically chosen for the terrain of Northern Pakistan. Every vehicle undergoes regular maintenance checks, and our drivers are experienced professionals who know every turn of the Karakoram Highway.

Safety, comfort, and reliability – that's our promise to every traveler who chooses us.`,
        region: 'Gilgit-Baltistan',
        languages: ['English', 'Urdu'],
        serviceAreas: ['Gilgit', 'Skardu', 'Hunza', 'Deosai', 'Fairy Meadows'],
        experienceYears: 10,
        isVerified: true,
        joinedDate: '2019-06-10',
    },
    'provider-3': {
        id: 'provider-3',
        name: 'Faisal Ahmed',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
        bio: `With over 15 years of experience guiding treks in the Karakoram and Himalayan ranges, I bring a deep passion for the mountains and a commitment to safe, unforgettable adventures.

Born and raised in Skardu, I grew up exploring the trails that lead to some of the world's most spectacular peaks. I've completed numerous expeditions to K2 Base Camp, Concordia, and the Baltoro Glacier, and I take pride in sharing my knowledge of the region's geography, culture, and wildlife.

My approach prioritizes safety without sacrificing the spirit of adventure. Whether you're an experienced trekker or embarking on your first high-altitude journey, I'll ensure you're prepared and supported every step of the way.`,
        region: 'Gilgit-Baltistan',
        languages: ['English', 'Urdu', 'Balti'],
        serviceAreas: ['Skardu', 'K2 Base Camp', 'Concordia', 'Deosai', 'Shigar'],
        experienceYears: 15,
        isVerified: true,
        joinedDate: '2018-01-20',
    },
};

// Helper to get provider by ID
export const getProviderById = (id: string): Provider | undefined => MOCK_PROVIDERS[id];

// Helper to get all listings for a provider
export const getListingsByProviderId = (providerId: string): Listing[] => {
    return getAllListings().filter(listing => listing.provider.id === providerId);
};

// Map listing provider IDs to providers for easy lookup
export const getProviderFromListing = (listing: Listing): Provider | undefined => {
    return MOCK_PROVIDERS[listing.provider.id];
};
