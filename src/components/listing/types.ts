// Listing Types for the Tourly Listing Detail Page
// Supports three service types: Stays, Transport, and Guides

export type ServiceType = 'stay' | 'transport' | 'guide';

// Image type with alt text support
export interface ListingImage {
    url: string;
    alt: string;
}

// Provider information (privacy-first: no phone numbers)
export interface Provider {
    id: string;
    name: string;
    avatar: string;
    languages: string[];
    region: string;
}

// Base listing fields shared across all service types
export interface BaseListing {
    id: string;
    type: ServiceType;
    title: string;
    location: string;
    region: string;
    description: string;
    price: number;
    priceUnit: string;
    images: ListingImage[];
    highlights: string[];
    provider: Provider;
    rating: number;
    reviewCount: number;
}

// Stays-specific fields (Hotels, Guest Houses, Glamping)
export interface PropertyOverview {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
}

export interface LocationInfo {
    landmark: string;
    howToReach: string;
}

export interface StayListing extends BaseListing {
    type: 'stay';
    propertyOverview: PropertyOverview;
    amenities: string[];
    locationInfo: LocationInfo;
}

// Transport-specific fields (Jeep, Prado, Hiace)
export interface VehicleSpecs {
    make: string;
    model: string;
    year: number;
    fourWD: boolean;
    fuelIncluded: boolean;
    transmission: string;
    seats: number;
}

export interface SafetyInfo {
    driverExperience: string;
    maintenance: string;
    insurance: string;
}

export interface TransportListing extends BaseListing {
    type: 'transport';
    vehicleSpecs: VehicleSpecs;
    routes: string[];
    terrains: string[];
    safetyInfo: SafetyInfo;
}

// Guide-specific fields (Trekking, Cultural, Expedition)
export interface Certification {
    name: string;
    issuer?: string;
}

export interface TrekRoute {
    name: string;
    duration: string;
}

export interface EquipmentList {
    provided: string[];
    toBring: string[];
}

export interface GuideListing extends BaseListing {
    type: 'guide';
    skills: string[];
    certifications: Certification[];
    trekRoutes: TrekRoute[];
    equipment: EquipmentList;
    maxGroupSize: number;
}

// Union type for all listing types
export type Listing = StayListing | TransportListing | GuideListing;

// Type guards for narrowing
export function isStayListing(listing: Listing): listing is StayListing {
    return listing.type === 'stay';
}

export function isTransportListing(listing: Listing): listing is TransportListing {
    return listing.type === 'transport';
}

export function isGuideListing(listing: Listing): listing is GuideListing {
    return listing.type === 'guide';
}
