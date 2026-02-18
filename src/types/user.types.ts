import type { Models } from "appwrite";

// ─── User Document ──────────────────────────────────────

/**
 * Mirrors the `users` Appwrite collection schema.
 *
 * Extends `Models.Document` so Appwrite metadata ($id, $createdAt,
 * $updatedAt, $permissions, etc.) is always available.
 */
export interface UserDocument extends Models.Document {
    /** Appwrite account ID (links to account.get().$id). */
    user_id: string;

    /** Display name. */
    name: string;

    /** Email address. */
    email: string;

    /** Account role. */
    role: "tourist" | "provider";

    /** Appwrite Storage file ID for the avatar, or full URL. */
    avatar_url?: string;

    /** Whether the user has verified their email. */
    is_email_verified: boolean;

    /** ISO-8601 timestamp of the document creation. */
    created_at: string;
}

// ─── Input Types ────────────────────────────────────────

/** Fields required when creating a new user document. */
export interface CreateUserInput {
    user_id: string;
    name: string;
    email: string;
    role: "tourist" | "provider";
    is_email_verified?: boolean;
    avatar_url?: string;
    created_at?: string;
}

/** Partial fields for updating an existing user document. */
export type UpdateUserInput = Partial<
    Omit<CreateUserInput, "user_id" | "email">
>;
