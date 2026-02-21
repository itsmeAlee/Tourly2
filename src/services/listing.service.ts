import { ID, Query, Permission, Role } from "appwrite";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { handleAppwriteError, AppError } from "@/lib/errors";
import { deleteFile } from "./storage.service";
import { BUCKETS } from "@/lib/appwrite-config";
import type {
    ListingDocument,
    ListingWithDetails,
    ListingType,
    CreateListingInput,
    UpdateListingInput,
    StayDetailsDocument,
    TransportDetailsDocument,
    GuideDetailsDocument,
} from "@/types/listing.types";

// ─── Helpers ────────────────────────────────────────────

/** Maps a listing type to its detail collection ID. */
function getDetailCollectionId(type: ListingType): string {
    switch (type) {
        case "stay":
            return COLLECTIONS.STAY_DETAILS;
        case "transport":
            return COLLECTIONS.TRANSPORT_DETAILS;
        case "guide":
            return COLLECTIONS.GUIDE_DETAILS;
    }
}

/** Fetches the detail document for a listing by its listing_id. */
async function fetchDetailDocument(
    listingId: string,
    type: ListingType
): Promise<
    StayDetailsDocument | TransportDetailsDocument | GuideDetailsDocument | null
> {
    const collectionId = getDetailCollectionId(type);
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            collectionId,
            [Query.equal("listing_id", listingId), Query.limit(1)]
        );
        return (response.documents[0] as unknown as
            | StayDetailsDocument
            | TransportDetailsDocument
            | GuideDetailsDocument) ?? null;
    } catch {
        return null;
    }
}

// ─── Create ─────────────────────────────────────────────

/**
 * Creates a listing document and its corresponding detail document.
 *
 * Both must succeed — if detail creation fails the listing is rolled
 * back (deleted).
 */
export async function createListing(
    input: CreateListingInput
): Promise<ListingDocument> {
    let listingDoc: ListingDocument | null = null;

    try {
        const defaultPermissions = [
            Permission.read(Role.any()),
            Permission.update(Role.user(input.provider_id)),
            Permission.delete(Role.user(input.provider_id)),
        ];

        // 1. Create the listing document
        const listingData: Record<string, unknown> = {
            provider_id: input.provider_id,
            type: input.type,
            title: input.title,
            description: input.description,
            location: input.location,
            region: input.region,
            price: input.price,
            price_unit: input.price_unit,
            images: input.images ?? [],
            highlights: input.highlights ?? [],
            rating: 0,
            review_count: 0,
            is_active: input.is_active ?? true,
            created_at: input.created_at ?? new Date().toISOString(),
        };

        listingDoc = await databases.createDocument<ListingDocument>(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            ID.unique(),
            listingData as Omit<ListingDocument, keyof import("appwrite").Models.Document>,
            defaultPermissions
        );

        // 2. Create the detail document
        const detailCollectionId = getDetailCollectionId(input.type);
        const detailData: Record<string, unknown> = {
            listing_id: listingDoc.$id,
            ...input.details,
        };

        await databases.createDocument(
            DATABASE_ID,
            detailCollectionId,
            ID.unique(),
            detailData,
            defaultPermissions
        );

        return listingDoc;
    } catch (err) {
        // Roll back: delete the listing if detail creation failed
        if (listingDoc) {
            try {
                await databases.deleteDocument(
                    DATABASE_ID,
                    COLLECTIONS.LISTINGS,
                    listingDoc.$id
                );
            } catch {
                // Best-effort rollback — log but don't mask original error
                console.error(
                    "[ListingService] Rollback failed for listing:",
                    listingDoc.$id
                );
            }
        }
        throw handleAppwriteError(err);
    }
}

// ─── Read ───────────────────────────────────────────────

/**
 * Fetches a listing and its type-specific detail document,
 * merged into a single `ListingWithDetails` object.
 *
 * Returns `null` if the listing does not exist.
 */
export async function getListingById(
    listingId: string
): Promise<ListingWithDetails | null> {
    try {
        const listing = await databases.getDocument<ListingDocument>(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            listingId
        );

        const details = await fetchDetailDocument(listingId, listing.type);

        if (!details) {
            // Listing exists but detail doc is missing — return listing
            // with an empty details placeholder
            return { ...listing, details } as unknown as ListingWithDetails;
        }

        return { ...listing, details };
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
 * Gets all listings by a specific provider.
 *
 * @param providerId  Provider document $id.
 * @param onlyActive  If true, only return active listings.
 */
export async function getListingsByProvider(
    providerId: string,
    onlyActive?: boolean
): Promise<ListingDocument[]> {
    try {
        const queries: string[] = [
            Query.equal("provider_id", providerId),
            Query.orderDesc("created_at"),
            Query.limit(100),
        ];

        if (onlyActive) {
            queries.push(Query.equal("is_active", true));
        }

        const response = await databases.listDocuments<ListingDocument>(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            queries
        );
        return response.documents;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Gets listings by region with optional type filter and pagination.
 *
 * Only returns active listings. Returns both the document array and the
 * total count for pagination UI.
 */
export async function getListingsByRegion(
    region: string,
    type?: ListingType,
    limit: number = 20,
    offset: number = 0
): Promise<{ listings: ListingDocument[]; total: number }> {
    try {
        const queries: string[] = [
            Query.equal("region", region),
            Query.equal("is_active", true),
            Query.orderDesc("created_at"),
            Query.limit(limit),
            Query.offset(offset),
        ];

        if (type) {
            queries.push(Query.equal("type", type));
        }

        const response = await databases.listDocuments<ListingDocument>(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            queries
        );

        return {
            listings: response.documents,
            total: response.total,
        };
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Gets top-rated active listings by type across all regions.
 *
 * Used by the homepage to populate TopRatedSection components.
 * Ordered by rating descending, then by review_count descending.
 *
 * @param type   Listing type filter (stay, transport, guide).
 * @param limit  Max results (default 6).
 */
export async function getTopListings(
    type: ListingType,
    limit: number = 6
): Promise<ListingDocument[]> {
    try {
        const response = await databases.listDocuments<ListingDocument>(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            [
                Query.equal("type", type),
                Query.equal("is_active", true),
                Query.orderDesc("rating"),
                Query.limit(limit),
            ]
        );
        return response.documents;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Full-text search across listing titles.
 *
 * Combines with optional type and region filters.
 * Limited to 30 results.
 */
export async function searchListings(
    query: string,
    type?: ListingType,
    region?: string
): Promise<ListingDocument[]> {
    try {
        const queries: string[] = [
            Query.search("title", query),
            Query.equal("is_active", true),
            Query.limit(30),
        ];

        if (type) queries.push(Query.equal("type", type));
        if (region) queries.push(Query.equal("region", region));

        const response = await databases.listDocuments<ListingDocument>(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            queries
        );
        return response.documents;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

// ─── Update ─────────────────────────────────────────────

/**
 * Updates a listing document (and optionally its detail document).
 *
 * If `input.details` is provided, the corresponding detail document
 * is also updated.
 */
export async function updateListing(
    listingId: string,
    input: UpdateListingInput
): Promise<ListingDocument> {
    try {
        // Build listing-level update payload
        const data: Record<string, unknown> = {};
        if (input.title !== undefined) data.title = input.title;
        if (input.description !== undefined)
            data.description = input.description;
        if (input.region !== undefined) data.region = input.region;
        if (input.price !== undefined) data.price = input.price;
        if (input.price_unit !== undefined) data.price_unit = input.price_unit;
        if (input.images !== undefined) data.images = input.images;
        if (input.is_active !== undefined) data.is_active = input.is_active;

        const updated = await databases.updateDocument<ListingDocument>(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            listingId,
            data
        );

        // Update detail document if details are provided
        if (input.details && Object.keys(input.details).length > 0) {
            const detail = await fetchDetailDocument(listingId, updated.type);
            if (detail) {
                const detailCollectionId = getDetailCollectionId(updated.type);
                await databases.updateDocument(
                    DATABASE_ID,
                    detailCollectionId,
                    detail.$id,
                    input.details
                );
            }
        }

        return updated;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Toggles the `is_active` flag on a listing.
 *
 * Used by the provider dashboard to activate / deactivate listings.
 */
export async function toggleListingActive(
    listingId: string,
    isActive: boolean
): Promise<void> {
    try {
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            listingId,
            { is_active: isActive }
        );
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

// ─── Delete ─────────────────────────────────────────────

/**
 * Deletes a listing, its detail document, and all associated images.
 *
 * SECURITY: Verifies the listing belongs to `expectedProviderId`
 * before proceeding. Throws 403 if it doesn't match.
 */
export async function deleteListing(
    listingId: string,
    expectedProviderId: string
): Promise<void> {
    try {
        // 1. Fetch listing to verify ownership
        const listing = await databases.getDocument<ListingDocument>(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            listingId
        );

        if (listing.provider_id !== expectedProviderId) {
            throw new AppError(
                "FORBIDDEN",
                "You do not have permission to delete this listing."
            );
        }

        // 2. Delete detail document
        const detail = await fetchDetailDocument(listingId, listing.type);
        if (detail) {
            const detailCollectionId = getDetailCollectionId(listing.type);
            await databases.deleteDocument(
                DATABASE_ID,
                detailCollectionId,
                detail.$id
            );
        }

        // 3. Delete associated images from storage
        if (listing.images?.length) {
            await Promise.allSettled(
                listing.images.map((fileId) =>
                    deleteFile(BUCKETS.LISTING_IMAGES, fileId)
                )
            );
        }

        // 4. Delete the listing itself
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            listingId
        );
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw handleAppwriteError(err);
    }
}
