import type { Models } from "appwrite";

// ─── Enums ──────────────────────────────────────────────

export type ListingType = "stay" | "transport" | "guide";
export type PriceUnit = "night" | "day" | "per person";

// ─── Listing Document ───────────────────────────────────

/**
 * Mirrors the `listings` Appwrite collection schema.
 *
 * Common fields shared by all listing types (stay, transport, guide).
 */
export interface ListingDocument extends Models.Document {
    /** Provider document $id. */
    provider_id: string;

    /** Listing type discriminator. */
    type: ListingType;

    /** Public title. */
    title: string;

    /** Markdown/text description. */
    description: string;

    /** Specific location (e.g. "Upper Kachura, Skardu"). */
    location: string;

    /** Operating region (e.g. "Skardu", "Hunza Valley"). */
    region: string;

    /** Base price. */
    price: number;

    /** Price unit for display (e.g. "night"). */
    price_unit: string;

    /** Array of Appwrite Storage file IDs for gallery images. */
    images: string[];

    /** Short highlight strings (e.g. "Free Wi-Fi", "4x4"). */
    highlights: string[];

    /** Whether the listing is visible to tourists. */
    is_active: boolean;

    /** Average rating (0–5). */
    rating: number;

    /** Total review count. */
    review_count: number;

    /** ISO-8601 creation timestamp. */
    created_at: string;
}

// ─── Stay Details ───────────────────────────────────────

/**
 * Mirrors the `stay-details` Appwrite collection.
 *
 * Attributes: listing_id, guests, bedrooms, beds, bathrooms,
 * amenities[], landmark, how_to_reach
 */
export interface StayDetailsDocument extends Models.Document {
    /** Parent listing $id. */
    listing_id: string;

    /** Number of guests. */
    guests: number;

    /** Number of bedrooms. */
    bedrooms: number;

    /** Number of beds. */
    beds: number;

    /** Number of bathrooms. */
    bathrooms: number;

    /** Amenities list: ["wifi", "breakfast", "parking", …]. */
    amenities: string[];

    /** Nearby landmark. */
    landmark?: string;

    /** How to reach the property. */
    how_to_reach?: string;
}

// ─── Transport Details ──────────────────────────────────

/**
 * Mirrors the `transport-details` Appwrite collection.
 *
 * Attributes: listing_id, make, model, year, four_wd, fuel_included,
 * transmission, seats, routes[], terrains[], driver_experience
 */
export interface TransportDetailsDocument extends Models.Document {
    /** Parent listing $id. */
    listing_id: string;

    /** Vehicle make (e.g. "Toyota"). */
    make: string;

    /** Vehicle model (e.g. "Land Cruiser"). */
    model: string;

    /** Year of manufacture. */
    year: number;

    /** Whether it's 4WD. */
    four_wd: boolean;

    /** Whether fuel is included. */
    fuel_included: boolean;

    /** Transmission type (e.g. "Manual", "Automatic"). */
    transmission: string;

    /** Passenger seats. */
    seats: number;

    /** Routes this vehicle covers. */
    routes: string[];

    /** Terrain types (e.g. "Mountain", "Off-road"). */
    terrains: string[];

    /** Driver experience description. */
    driver_experience?: string;
}

// ─── Guide Details ──────────────────────────────────────

/**
 * Mirrors the `guide-details` Appwrite collection.
 *
 * Attributes: listing_id, certifications[], trek_routes[],
 * max_group_size, experience_years, equipment_provided[]
 */
export interface GuideDetailsDocument extends Models.Document {
    /** Parent listing $id. */
    listing_id: string;

    /** Certifications or licenses. */
    certifications: string[];

    /** Trek routes this guide covers. */
    trek_routes: string[];

    /** Maximum group size. */
    max_group_size: number;

    /** Years of experience. */
    experience_years: number;

    /** Equipment provided by the guide. */
    equipment_provided: string[];
}

// ─── Composite ──────────────────────────────────────────

/**
 * A listing merged with its type-specific detail document.
 *
 * The `details` field is discriminated by `ListingDocument.type`.
 */
export type ListingWithDetails = ListingDocument & {
    details: StayDetailsDocument | TransportDetailsDocument | GuideDetailsDocument;
};

// ─── Input Types ────────────────────────────────────────

/** Common listing fields for creation. */
interface CreateListingBase {
    provider_id: string;
    title: string;
    description: string;
    location: string;
    region: string;
    price: number;
    price_unit: string;
    images?: string[];
    highlights?: string[];
    is_active?: boolean;
    created_at?: string;
}

/** Stay-specific creation input. */
export interface CreateStayInput extends CreateListingBase {
    type: "stay";
    details: Omit<StayDetailsDocument, keyof Models.Document | "listing_id">;
}

/** Transport-specific creation input. */
export interface CreateTransportInput extends CreateListingBase {
    type: "transport";
    details: Omit<TransportDetailsDocument, keyof Models.Document | "listing_id">;
}

/** Guide-specific creation input. */
export interface CreateGuideInput extends CreateListingBase {
    type: "guide";
    details: Omit<GuideDetailsDocument, keyof Models.Document | "listing_id">;
}

/** Discriminated union — callers must specify `type` and matching `details`. */
export type CreateListingInput =
    | CreateStayInput
    | CreateTransportInput
    | CreateGuideInput;

/** Partial update — `type` cannot be changed after creation. */
export interface UpdateListingInput {
    title?: string;
    description?: string;
    location?: string;
    region?: string;
    price?: number;
    price_unit?: string;
    images?: string[];
    highlights?: string[];
    is_active?: boolean;
    /** Optional: update the detail document too. */
    details?: Record<string, unknown>;
}
