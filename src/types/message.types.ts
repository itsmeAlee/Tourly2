import type { Models } from "appwrite";

// ─── Message Document ───────────────────────────────────

/**
 * Mirrors the `messages` Appwrite collection schema.
 */
export interface MessageDocument extends Models.Document {
    /** Parent conversation $id. */
    conversation_id: string;

    /** Sender's user document $id. */
    sender_id: string;

    /** Message body (max 2000 chars). */
    text: string;

    /** Whether the recipient has read the message. */
    is_read: boolean;

    /** ISO-8601 creation timestamp. */
    created_at: string;
}

// ─── Input Types ────────────────────────────────────────

export interface CreateMessageInput {
    conversation_id: string;
    sender_id: string;
    text: string;
    is_read?: boolean;
    created_at?: string;
}
