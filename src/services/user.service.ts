import { ID, Query } from "appwrite";
import { account, databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { handleAppwriteError, AppError } from "@/lib/errors";
import { uploadAvatar } from "@/services/storage.service";
import { getAvatarUrl } from "@/lib/storage";
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
        if (
            err &&
            typeof err === "object" &&
            "code" in err &&
            (err as { code: number }).code === 404
        ) {
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

// ─── Profile Update Functions ───────────────────────────

/**
 * Updates the user's display name in both Appwrite Auth and the users collection.
 *
 * @param accountId  - The Appwrite account $id (same as `user.id` from AuthContext)
 * @param newName    - The new display name (min 2 chars, max 100)
 */
export async function updateUserName(
    accountId: string,
    newName: string
): Promise<void> {
    const trimmed = newName.trim();
    if (trimmed.length < 2 || trimmed.length > 100) {
        throw new AppError(
            "VALIDATION",
            "Name must be between 2 and 100 characters."
        );
    }

    try {
        // Resolve user document ID from account ID
        const userDoc = await getUserByAccountId(accountId);
        if (!userDoc) {
            throw new AppError("NOT_FOUND", "User profile not found.");
        }

        // Update Appwrite Auth account name + users collection in parallel
        await Promise.all([
            account.updateName(trimmed),
            databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userDoc.$id,
                { name: trimmed }
            ),
        ]);
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw handleAppwriteError(err);
    }
}

/**
 * Uploads a new avatar to Appwrite Storage, updates the users collection
 * document with the preview URL, and returns the new avatar URL.
 *
 * @param accountId - The Appwrite account $id (same as `user.id` from AuthContext)
 * @param file      - The image File to upload
 * @returns         - The new avatar preview URL
 */
export async function updateUserAvatar(
    accountId: string,
    file: File
): Promise<string> {
    try {
        // Resolve user document ID from account ID
        const userDoc = await getUserByAccountId(accountId);
        if (!userDoc) {
            throw new AppError("NOT_FOUND", "User profile not found.");
        }

        const fileId = await uploadAvatar(file, accountId);
        const previewUrl = getAvatarUrl(fileId);

        // Store the preview URL in the users collection
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            userDoc.$id,
            { avatar_url: previewUrl }
        );

        return previewUrl;
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw handleAppwriteError(err);
    }
}
