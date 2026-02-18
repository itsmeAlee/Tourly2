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

    /** Operating region. */
    region: string;

    /** Base price. */
    price: number;

    /** Price unit for display (e.g. "per night"). */
    price_unit: PriceUnit;

    /** Array of Appwrite Storage file IDs for gallery images. */
    images: string[];

    /** Average rating (0–5). */
    rating: number;

    /** Total review count. */
    review_count: number;

    /** Whether the listing is visible to tourists. */
    is_active: boolean;

    /** ISO-8601 creation timestamp. */
    created_at: string;
}

// ─── Stay Details ───────────────────────────────────────

export interface StayDetailsDocument extends Models.Document {
    /** Parent listing $id. */
    listing_id: string;

    /** e.g. "hotel", "guesthouse", "camping". */
    property_type: string;

    /** Number of guests the property can accommodate. */
    max_guests: number;

    /** Number of bedrooms. */
    bedrooms: number;

    /** Number of bathrooms. */
    bathrooms: number;

    /** Amenities list: ["wifi", "breakfast", "parking", …]. */
    amenities: string[];

    /** Check-in time (e.g. "14:00"). */
    check_in_time?: string;

    /** Check-out time (e.g. "11:00"). */
    check_out_time?: string;
}

// ─── Transport Details ──────────────────────────────────

export interface TransportDetailsDocument extends Models.Document {
    /** Parent listing $id. */
    listing_id: string;

    /** Vehicle type: "jeep", "coaster", "sedan", etc. */
    vehicle_type: string;

    /** Passenger capacity. */
    capacity: number;

    /** Vehicle model / make. */
    model?: string;

    /** Year of manufacture. */
    year?: number;

    /** Features: ["ac", "4x4", "gps", …]. */
    features: string[];

    /** Whether a driver is included. */
    driver_included: boolean;
}

// ─── Guide Details ──────────────────────────────────────

export interface GuideDetailsDocument extends Models.Document {
    /** Parent listing $id. */
    listing_id: string;

    /** Specialization: "trekking", "cultural", "mountaineering", etc. */
    specialization: string;

    /** Years of experience. */
    experience_years: number;

    /** Languages the guide speaks. */
    languages: string[];

    /** Certifications or licenses. */
    certifications?: string[];

    /** Maximum group size. */
    max_group_size?: number;
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
    region: string;
    price: number;
    price_unit: PriceUnit;
    images?: string[];
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
    region?: string;
    price?: number;
    price_unit?: PriceUnit;
    images?: string[];
    is_active?: boolean;
    /** Optional: update the detail document too. */
    details?: Record<string, unknown>;
}
