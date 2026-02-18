import type { Models } from "appwrite";

// ─── Provider Document ──────────────────────────────────

/**
 * Mirrors the `providers` Appwrite collection schema.
 */
export interface ProviderDocument extends Models.Document {
    /** Appwrite account ID linking to the `users` collection. */
    user_id: string;

    /** Business or service name shown publicly. */
    business_name: string;

    /** Short bio / description. */
    bio?: string;

    /** Operating region in Gilgit-Baltistan. */
    region: string;

    /** Languages spoken by the provider. */
    languages?: string[];

    /**
     * Contact phone number.
     * ⚠️ NEVER expose this in public-facing queries / responses.
     */
    phone?: string;

    /** Whether the provider has been admin-verified. */
    is_verified: boolean;

    /** Average rating (0–5). */
    rating: number;

    /** Total number of reviews. */
    review_count: number;

    /** Appwrite Storage file ID for avatar. */
    avatar_url?: string;

    /** ISO-8601 creation timestamp. */
    created_at: string;
}

// ─── Input Types ────────────────────────────────────────

export interface CreateProviderInput {
    user_id: string;
    business_name: string;
    bio?: string;
    region: string;
    languages?: string[];
    phone?: string;
    is_verified?: boolean;
    rating?: number;
    review_count?: number;
    avatar_url?: string;
    created_at?: string;
}

export type UpdateProviderInput = Partial<
    Omit<CreateProviderInput, "user_id">
>;
