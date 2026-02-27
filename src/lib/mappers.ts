/**
 * Data shape transformers — Appwrite documents → component props.
 *
 * DESIGN DECISIONS:
 * - ALL Appwrite docs pass through a mapper before reaching components
 * - Sensitive fields (phone) are explicitly stripped here — single choke point
 * - Image file IDs are converted to preview URLs via storage helpers
 * - Mappers are pure functions — no network calls
 *
 * IMPORTANT: Field names here match the ACTUAL Appwrite schema, not
 * the TypeScript type spec. See the types in @/types/listing.types.ts.
 */

import type { ListingDocument, ListingWithDetails, ListingType } from "@/types/listing.types";
import type { ProviderDocument } from "@/types/provider.types";
import type { ConversationWithParticipants } from "@/types/conversation.types";
import type { InboxItem } from "./inbox-mappers";
import type { ListingCategory } from "@/components/ListingCard";
import type {
    Listing,
    BaseListing,
    StayListing,
    TransportListing,
    GuideListing,
    ListingImage,
} from "@/components/listing/types";
import { getListingImageUrl, getAvatarUrl } from "@/lib/storage";

// ─── Type Exports ───────────────────────────────────────

/** Item shape used by TopRatedSection (mirrors the ListingItem interface). */
export interface TopRatedItem {
    id: string;
    title: string;
    image: string;
    rating: number;
    reviewCount: number;
    location: string;
}

/** Public provider shape — phone is NEVER included. */
export interface PublicProviderProfile {
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

// ─── Listing Type → Category Mapping ────────────────────

/** Maps service ListingType to the UI ListingCategory. */
export function listingTypeToCategory(type: ListingType): ListingCategory {
    switch (type) {
        case "stay":
            return "hotel";
        case "transport":
            return "tour-operator";
        case "guide":
            return "guide";
    }
}

// ─── TopRatedSection Mapper ─────────────────────────────

/**
 * Maps a ListingDocument to the shape TopRatedSection expects.
 *
 * Uses the first image in the listing's images array, falling back
 * to a placeholder when no images exist.
 */
export function mapListingToTopRatedItem(listing: ListingDocument): TopRatedItem {
    const firstImageUrl = listing.images?.length
        ? getListingImageUrl(listing.images[0], 600)
        : "/images/placeholder-listing.jpg";

    return {
        id: listing.$id,
        title: listing.title,
        image: firstImageUrl,
        rating: listing.rating,
        reviewCount: listing.review_count,
        location: listing.location || listing.region,
    };
}

// ─── ListingCard Mapper ─────────────────────────────────

/** Props shape matching the ListingCard component. */
export interface ListingCardData {
    id: string;
    title: string;
    image: string;
    rating: number;
    reviewCount: number;
    location: string;
    category: ListingCategory;
}

export function mapListingToListingCard(listing: ListingDocument): ListingCardData {
    const firstImageUrl = listing.images?.length
        ? getListingImageUrl(listing.images[0], 600)
        : "/images/placeholder-listing.jpg";

    return {
        id: listing.$id,
        title: listing.title,
        image: firstImageUrl,
        rating: listing.rating,
        reviewCount: listing.review_count,
        location: listing.location || listing.region,
        category: listingTypeToCategory(listing.type),
    };
}

// ─── Listing Detail Page Mapper ─────────────────────────

/**
 * Maps a ListingWithDetails to the Listing union type expected
 * by StaysLayout, TransportLayout, GuideLayout components.
 *
 * Converts Storage file IDs → preview URLs and injects
 * provider info into the expected shape.
 *
 * IMPORTANT: Field names here map from the ACTUAL Appwrite schema
 * (e.g. `guests` not `max_guests`, `four_wd` not `fourWD`).
 */
export function mapListingWithDetailsToListing(
    listing: ListingWithDetails,
    imageUrls: string[],
    provider: PublicProviderProfile | null
): Listing {
    const images: ListingImage[] = imageUrls.map((url, i) => ({
        url,
        alt: `${listing.title} - image ${i + 1}`,
    }));

    const base: BaseListing = {
        id: listing.$id,
        type: listing.type,
        title: listing.title,
        location: listing.location || listing.region,
        region: listing.region,
        description: listing.description,
        price: listing.price,
        priceUnit: listing.price_unit,
        images,
        highlights: listing.highlights ?? [],
        provider: {
            id: provider?.id ?? listing.provider_id,
            name: provider?.name ?? "Provider",
            avatar: provider?.avatar ?? "",
            languages: provider?.languages ?? [],
            region: provider?.region ?? listing.region,
        },
        rating: listing.rating,
        reviewCount: listing.review_count,
    };

    const details = listing.details;

    // ── Stay ────────────────────────────────────────────
    if (listing.type === "stay" && details && "guests" in details) {
        return {
            ...base,
            type: "stay",
            propertyOverview: {
                guests: details.guests ?? 0,
                bedrooms: details.bedrooms ?? 0,
                beds: details.beds ?? 0,
                bathrooms: details.bathrooms ?? 0,
            },
            amenities: details.amenities ?? [],
            locationInfo: {
                landmark: details.landmark ?? "",
                howToReach: details.how_to_reach ?? "",
            },
        } as StayListing;
    }

    // ── Transport ───────────────────────────────────────
    if (listing.type === "transport" && details && "make" in details) {
        return {
            ...base,
            type: "transport",
            vehicleSpecs: {
                make: details.make ?? "",
                model: details.model ?? "",
                year: details.year ?? new Date().getFullYear(),
                fourWD: details.four_wd ?? false,
                fuelIncluded: details.fuel_included ?? false,
                transmission: details.transmission ?? "Manual",
                seats: details.seats ?? 0,
            },
            routes: details.routes ?? [],
            terrains: details.terrains ?? [],
            safetyInfo: {
                driverExperience: details.driver_experience ?? "Experienced driver",
                maintenance: "Regularly serviced",
                insurance: "Fully insured",
            },
            highlights: listing.highlights ?? [],
        } as TransportListing;
    }

    // ── Guide ───────────────────────────────────────────
    if (listing.type === "guide" && details && "experience_years" in details) {
        return {
            ...base,
            type: "guide",
            skills: listing.highlights ?? [],
            certifications: (details.certifications ?? []).map((c: string) => ({
                name: c,
            })),
            trekRoutes: (details.trek_routes ?? []).map((r: string) => ({
                name: r,
                duration: "",
            })),
            equipment: {
                provided: details.equipment_provided ?? [],
                toBring: [],
            },
            maxGroupSize: details.max_group_size ?? 10,
            highlights: listing.highlights ?? [],
        } as GuideListing;
    }

    // Fallback — return as a stay with empty detail fields
    return {
        ...base,
        type: "stay",
        propertyOverview: { guests: 0, bedrooms: 0, beds: 0, bathrooms: 0 },
        amenities: [],
        locationInfo: { landmark: "", howToReach: "" },
    } as StayListing;
}

// ─── Provider Mapper ────────────────────────────────────

/**
 * Maps a ProviderDocument to a Public profile.
 *
 * ⚠️ CRITICAL: Explicitly strips `phone` — it must NEVER reach client components.
 */
export function mapProviderToPublicProfile(
    provider: ProviderDocument
): PublicProviderProfile {
    // Destructure phone out — NEVER expose to client components
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { phone, ...safeProvider } = provider;

    return {
        id: safeProvider.$id,
        name: safeProvider.business_name,
        avatar: safeProvider.avatar_url
            ? getAvatarUrl(safeProvider.avatar_url)
            : "",
        bio: safeProvider.bio ?? "",
        region: safeProvider.region,
        languages: safeProvider.languages ?? [],
        serviceAreas: [safeProvider.region],
        experienceYears: 0, // Not stored in Appwrite yet
        isVerified: safeProvider.is_verified,
        joinedDate: safeProvider.created_at,
    };
}

// ─── Conversation Mapper ────────────────────────────────

export { type InboxItem, mapConversationToInboxItem } from "./inbox-mappers";
