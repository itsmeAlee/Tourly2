/**
 * Appwrite resource IDs — single source of truth.
 *
 * These constants mirror the actual IDs created in Appwrite Cloud.
 * Import from here instead of hardcoding IDs in services or components.
 */

// ─── Database ────────────────────────────────────────────
export const DATABASE_ID =
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "tourly-db";

// ─── Collection IDs ──────────────────────────────────────
export const COLLECTIONS = {
    USERS: "users",
    PROVIDERS: "providers",
    LISTINGS: "listings",
    STAY_DETAILS: "stay-details",
    TRANSPORT_DETAILS: "transport-details",
    GUIDE_DETAILS: "guide-details",
    CONVERSATIONS: "conversations",
    MESSAGES: "messages",
} as const;

// ─── Legacy Exports (backwards compatibility) ────────────
export const COLLECTION_USERS = COLLECTIONS.USERS;
export const COLLECTION_PROVIDERS = COLLECTIONS.PROVIDERS;

// ─── Index Keys (for reference / admin scripts) ─────────
export const INDEXES = {
    users: {
        userId: "idx_user_id", // unique
        email: "idx_user_email", // unique
        role: "idx_user_role", // key
    },
    providers: {
        userId: "idx_provider_user_id", // unique
        region: "idx_provider_region", // key
        isVerified: "idx_provider_verified", // key
    },
    listings: {
        provider: "idx_listing_provider", // key
        type: "idx_listing_type", // key
        region: "idx_listing_region", // key
        isActive: "idx_listing_active", // key
        titleSearch: "idx_listing_title_search", // fulltext
        descriptionSearch: "idx_listing_description_search", // fulltext
        typeActiveRating: "idx_listing_type_active_rating", // composite key
    },
    stayDetails: {
        listing: "idx_stay_listing", // unique
    },
    transportDetails: {
        listing: "idx_transport_listing", // unique
    },
    guideDetails: {
        listing: "idx_guide_listing", // unique
    },
    conversations: {
        tourist: "idx_conv_tourist", // key
        provider: "idx_conv_provider", // key
        listing: "idx_conv_listing", // key
        lastMessage: "idx_conv_last_msg", // key (DESC)
        touristListing: "idx_conv_tourist_listing", // composite key
    },
    messages: {
        conversation: "idx_msg_conversation", // key
        sender: "idx_msg_sender", // key
        created: "idx_msg_created", // key (ASC)
        isRead: "idx_msg_read", // key
    },
} as const;

// ─── Storage Bucket IDs ──────────────────────────────────
export const BUCKETS = {
    LISTING_IMAGES: "listing-images",
    AVATARS: "avatars",
} as const;
