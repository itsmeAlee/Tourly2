import { ID, Query } from "appwrite";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { handleAppwriteError, isAppwrite404 } from "@/lib/errors";
import type {
    UserDocument,
    CreateUserInput,
    UpdateUserInput,
} from "@/types/user.types";

// ─── User Service ───────────────────────────────────────

/**
 * Creates a new document in the `users` collection.
 *
 * The document ID is set to the Appwrite account `$id` so the user
 * document can be fetched in O(1) by account ID.
 */
export async function createUserDocument(
    input: CreateUserInput
): Promise<UserDocument> {
    try {
        const data: Record<string, unknown> = {
            user_id: input.user_id,
            name: input.name,
            email: input.email,
            role: input.role,
            is_email_verified: input.is_email_verified ?? false,
            created_at: input.created_at ?? new Date().toISOString(),
        };

        if (input.avatar_url) data.avatar_url = input.avatar_url;

        return await databases.createDocument<UserDocument>(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            data as Omit<UserDocument, keyof import("appwrite").Models.Document>
        );
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Fetches the user document linked to an Appwrite account ID.
 *
 * Uses `Query.equal('user_id', accountId)` against the indexed field.
 * Returns `null` if no matching document exists — callers handle null.
 */
export async function getUserByAccountId(
    accountId: string
): Promise<UserDocument | null> {
    try {
        const response = await databases.listDocuments<UserDocument>(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal("user_id", accountId), Query.limit(1)]
        );
        return response.documents[0] ?? null;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Fetches a user document by its Appwrite document `$id`.
 *
 * Returns `null` if the document does not exist (404).
 */
export async function getUserById(
    documentId: string
): Promise<UserDocument | null> {
    try {
        return await databases.getDocument<UserDocument>(
            DATABASE_ID,
            COLLECTIONS.USERS,
            documentId
        );
    } catch (err) {
        // 404 → return null instead of throwing
        if (isAppwrite404(err)) {
            return null;
        }
        throw handleAppwriteError(err);
    }
}

/**
 * Updates a user document. Only provided fields are patched.
 */
export async function updateUser(
    documentId: string,
    input: UpdateUserInput
): Promise<UserDocument> {
    try {
        // Strip undefined values so Appwrite only touches provided fields
        const data: Record<string, unknown> = {};
        if (input.name !== undefined) data.name = input.name;
        if (input.role !== undefined) data.role = input.role;
        if (input.avatar_url !== undefined) data.avatar_url = input.avatar_url;
        if (input.is_email_verified !== undefined)
            data.is_email_verified = input.is_email_verified;

        return await databases.updateDocument<UserDocument>(
            DATABASE_ID,
            COLLECTIONS.USERS,
            documentId,
            data
        );
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Checks whether an email address is available (no existing user doc).
 *
 * Used for client-side pre-validation before account.create().
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
    try {
        const response = await databases.listDocuments<UserDocument>(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal("email", email), Query.limit(1)]
        );
        return response.documents.length === 0;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}
