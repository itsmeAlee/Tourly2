import { ID, Query } from "appwrite";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { handleAppwriteError } from "@/lib/errors";
import type {
    ProviderDocument,
    CreateProviderInput,
    UpdateProviderInput,
} from "@/types/provider.types";

// ─── Provider Service ───────────────────────────────────

/**
 * Creates a new document in the `providers` collection.
 */
export async function createProviderDocument(
    input: CreateProviderInput
): Promise<ProviderDocument> {
    try {
        const data: Record<string, unknown> = {
            user_id: input.user_id,
            business_name: input.business_name,
            region: input.region,
            is_verified: input.is_verified ?? false,
            rating: input.rating ?? 0,
            review_count: input.review_count ?? 0,
            created_at: input.created_at ?? new Date().toISOString(),
        };

        if (input.bio) data.bio = input.bio;
        if (input.languages?.length) data.languages = input.languages;
        if (input.phone) data.phone = input.phone;
        if (input.avatar_url) data.avatar_url = input.avatar_url;

        return await databases.createDocument<ProviderDocument>(
            DATABASE_ID,
            COLLECTIONS.PROVIDERS,
            ID.unique(),
            data as Omit<ProviderDocument, keyof import("appwrite").Models.Document>
        );
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Fetches the provider document linked to an Appwrite account ID.
 *
 * Returns `null` if no provider profile exists for this user.
 */
export async function getProviderByUserId(
    userId: string
): Promise<ProviderDocument | null> {
    try {
        const response = await databases.listDocuments<ProviderDocument>(
            DATABASE_ID,
            COLLECTIONS.PROVIDERS,
            [Query.equal("user_id", userId), Query.limit(1)]
        );
        return response.documents[0] ?? null;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Fetches a provider document by its Appwrite document `$id`.
 *
 * Returns `null` if not found.
 */
export async function getProviderById(
    documentId: string
): Promise<ProviderDocument | null> {
    try {
        return await databases.getDocument<ProviderDocument>(
            DATABASE_ID,
            COLLECTIONS.PROVIDERS,
            documentId
        );
    } catch (err) {
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
 * Updates a provider document. Only provided fields are patched.
 */
export async function updateProvider(
    documentId: string,
    input: UpdateProviderInput
): Promise<ProviderDocument> {
    try {
        const data: Record<string, unknown> = {};
        if (input.business_name !== undefined)
            data.business_name = input.business_name;
        if (input.bio !== undefined) data.bio = input.bio;
        if (input.region !== undefined) data.region = input.region;
        if (input.languages !== undefined) data.languages = input.languages;
        if (input.phone !== undefined) data.phone = input.phone;
        if (input.is_verified !== undefined)
            data.is_verified = input.is_verified;
        if (input.rating !== undefined) data.rating = input.rating;
        if (input.review_count !== undefined)
            data.review_count = input.review_count;
        if (input.avatar_url !== undefined) data.avatar_url = input.avatar_url;

        return await databases.updateDocument<ProviderDocument>(
            DATABASE_ID,
            COLLECTIONS.PROVIDERS,
            documentId,
            data
        );
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Gets verified providers in a specific region.
 *
 * @param region   Region to filter by.
 * @param limit    Max results (default 20).
 */
export async function getProvidersByRegion(
    region: string,
    limit: number = 20
): Promise<ProviderDocument[]> {
    try {
        const response = await databases.listDocuments<ProviderDocument>(
            DATABASE_ID,
            COLLECTIONS.PROVIDERS,
            [
                Query.equal("region", region),
                Query.equal("is_verified", true),
                Query.limit(limit),
            ]
        );
        return response.documents;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Checks whether a provider profile already exists for a given user.
 *
 * Used on `/signup/provider-profile` to prevent duplicate profiles.
 */
export async function doesProviderProfileExist(
    userId: string
): Promise<boolean> {
    try {
        const response = await databases.listDocuments<ProviderDocument>(
            DATABASE_ID,
            COLLECTIONS.PROVIDERS,
            [Query.equal("user_id", userId), Query.limit(1)]
        );
        return response.documents.length > 0;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}
