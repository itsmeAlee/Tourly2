import { ID, Query, Permission, Role } from "appwrite";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { handleAppwriteError } from "@/lib/errors";
import type { ListingDocument } from "@/types/listing.types";

// ─── Types ──────────────────────────────────────────────

interface SavedListingDocument {
    $id: string;
    user_id: string;
    listing_id: string;
    created_at: string;
}

// ─── Get Saved Listing IDs ──────────────────────────────

/**
 * Fetches the list of listing IDs saved by a user.
 * Returns listing_id strings only, ordered by most recently saved.
 */
export async function getSavedListings(userId: string): Promise<string[]> {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.SAVED_LISTINGS,
            [
                Query.equal("user_id", userId),
                Query.orderDesc("created_at"),
                Query.limit(100),
            ]
        );
        return response.documents.map(
            (doc) => (doc as unknown as SavedListingDocument).listing_id
        );
    } catch (error) {
        handleAppwriteError(error);
        return [];
    }
}

// ─── Toggle Saved Listing ───────────────────────────────

/**
 * Toggles a listing's saved state for a user.
 * If already saved → deletes. If not saved → creates.
 * Returns { saved: true } if the listing is now saved, false otherwise.
 */
export async function toggleSavedListing(
    userId: string,
    listingId: string
): Promise<{ saved: boolean }> {
    try {
        // Check if already saved
        const existing = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.SAVED_LISTINGS,
            [
                Query.equal("user_id", userId),
                Query.equal("listing_id", listingId),
                Query.limit(1),
            ]
        );

        if (existing.documents.length > 0) {
            // Already saved → remove
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.SAVED_LISTINGS,
                existing.documents[0].$id
            );
            return { saved: false };
        }

        // Not saved → create
        await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.SAVED_LISTINGS,
            ID.unique(),
            {
                user_id: userId,
                listing_id: listingId,
                created_at: new Date().toISOString(),
            },
            [
                Permission.read(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );
        return { saved: true };
    } catch (error) {
        handleAppwriteError(error);
        return { saved: false };
    }
}

// ─── Check if Listing is Saved ──────────────────────────

/**
 * Checks if a specific listing is saved by a user.
 */
export async function isListingSaved(
    userId: string,
    listingId: string
): Promise<boolean> {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.SAVED_LISTINGS,
            [
                Query.equal("user_id", userId),
                Query.equal("listing_id", listingId),
                Query.limit(1),
            ]
        );
        return response.documents.length > 0;
    } catch (error) {
        handleAppwriteError(error);
        return false;
    }
}

// ─── Get Full Saved Listings ────────────────────────────

/**
 * Fetches full ListingDocument objects for all saved listings.
 * Returns only active listings, filtering out any that are inactive or deleted.
 */
export async function getSavedListingsFull(
    userId: string
): Promise<ListingDocument[]> {
    try {
        const savedIds = await getSavedListings(userId);
        if (savedIds.length === 0) return [];

        // Appwrite supports Query.equal with an array of values
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            [
                Query.equal("$id", savedIds),
                Query.equal("is_active", true),
                Query.limit(100),
            ]
        );

        return response.documents as unknown as ListingDocument[];
    } catch (error) {
        handleAppwriteError(error);
        return [];
    }
}
