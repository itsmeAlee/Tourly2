import type { Models } from "appwrite";

// ─── Conversation Document ──────────────────────────────

/**
 * Mirrors the `conversations` Appwrite collection schema.
 */
export interface ConversationDocument extends Models.Document {
    /** Listing $id this conversation is about. */
    listing_id: string;

    /** Tourist user document $id. */
    tourist_id: string;

    /** Provider document $id. */
    provider_id: string;

    /** ISO-8601 creation timestamp. */
    created_at: string;

    /** Preview of the last message in the thread. */
    last_message?: string;

    /** ISO-8601 timestamp of the last message. */
    last_message_at?: string;

    /** Number of unread messages for the tourist. */
    tourist_unread: number;

    /** Number of unread messages for the provider. */
    provider_unread: number;
}

// ─── Enriched Conversation ──────────────────────────────

/** Display-friendly participant info. */
export interface ParticipantInfo {
    id: string;
    name: string;
    avatar_url?: string;
}

/**
 * A conversation enriched with display data fetched from
 * the `users`, `providers`, and `listings` collections.
 */
export interface ConversationWithParticipants extends ConversationDocument {
    /** Tourist display info. */
    tourist: ParticipantInfo;

    /** Provider display info (uses business_name). */
    provider: ParticipantInfo;

    /** The listing title for context. */
    listing_title: string;
}

// ─── Input Types ────────────────────────────────────────

export interface CreateConversationInput {
    listing_id: string;
    tourist_id: string;
    provider_id: string;
    created_at?: string;
    tourist_unread?: number;
    provider_unread?: number;
}
