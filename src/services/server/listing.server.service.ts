import "server-only";

import { Query } from "node-appwrite";
import { databases } from "@/lib/server/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import type { ListingDocument, ListingType } from "@/types/listing.types";

/**
 * Server-only listings query for build/SSR contexts.
 * Uses Appwrite Server SDK with API key, so no browser session is required.
 */
export async function getTopListingsServer(
    type: ListingType,
    limit: number = 6
): Promise<ListingDocument[]> {
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
}
