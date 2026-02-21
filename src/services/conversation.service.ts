import { ID, Query } from "appwrite";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { handleAppwriteError } from "@/lib/errors";
import type {
    ConversationDocument,
    ConversationWithParticipants,
    ParticipantInfo,
} from "@/types/conversation.types";
import type { UserDocument } from "@/types/user.types";
import type { ProviderDocument } from "@/types/provider.types";
import type { ListingDocument } from "@/types/listing.types";

// ─── Helpers ────────────────────────────────────────────

/** Builds a ParticipantInfo from a UserDocument. */
function userToParticipant(user: UserDocument): ParticipantInfo {
    return {
        id: user.$id,
        name: user.name,
        avatar_url: user.avatar_url,
    };
}

/** Builds a ParticipantInfo from a ProviderDocument (uses business_name). */
function providerToParticipant(provider: ProviderDocument): ParticipantInfo {
    return {
        id: provider.$id,
        name: provider.business_name,
        avatar_url: provider.avatar_url,
    };
}

/**
 * Fetches a single user document by user_id.
 * Returns a fallback ParticipantInfo if not found.
 */
async function fetchUserParticipant(userId: string): Promise<ParticipantInfo> {
    try {
        const res = await databases.listDocuments<UserDocument>(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal("user_id", userId), Query.limit(1)]
        );
        if (res.documents[0]) return userToParticipant(res.documents[0]);
    } catch {
        /* fallback below */
    }
    return { id: userId, name: "Unknown User" };
}

/**
 * Fetches a provider by document $id.
 * Returns a fallback ParticipantInfo if not found.
 */
async function fetchProviderParticipant(
    providerId: string
): Promise<ParticipantInfo> {
    try {
        const doc = await databases.getDocument<ProviderDocument>(
            DATABASE_ID,
            COLLECTIONS.PROVIDERS,
            providerId
        );
        return providerToParticipant(doc);
    } catch {
        return { id: providerId, name: "Unknown Provider" };
    }
}

/**
 * Fetches a listing title by $id. Returns fallback if not found.
 */
async function fetchListingTitle(listingId: string): Promise<string> {
    try {
        const doc = await databases.getDocument<ListingDocument>(
            DATABASE_ID,
            COLLECTIONS.LISTINGS,
            listingId
        );
        return doc.title;
    } catch {
        return "Unknown Listing";
    }
}

// ─── Conversation Service ───────────────────────────────

/**
 * Gets a single conversation by its document $id.
 *
 * Returns null if not found.
 */
export async function getConversationById(
    conversationId: string
): Promise<ConversationDocument | null> {
    try {
        return await databases.getDocument<ConversationDocument>(
            DATABASE_ID,
            COLLECTIONS.CONVERSATIONS,
            conversationId
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
 * Gets a conversation enriched with participant display info.
 *
 * Returns null if not found.
 */
export async function getConversationWithParticipants(
    conversationId: string
): Promise<ConversationWithParticipants | null> {
    const conv = await getConversationById(conversationId);
    if (!conv) return null;

    const [tourist, provider, listing_title] = await Promise.all([
        fetchUserParticipant(conv.tourist_id),
        fetchProviderParticipant(conv.provider_id),
        fetchListingTitle(conv.listing_id),
    ]);

    return { ...conv, tourist, provider, listing_title };
}

/**
 * Gets or creates a conversation between a tourist and a provider
 * about a specific listing.
 *
 * This is the ONLY way to create a conversation — prevents duplicates
 * by first checking for an existing match.
 */
export async function getOrCreateConversation(
    listingId: string,
    touristId: string,
    providerId: string
): Promise<ConversationDocument> {
    try {
        // Check for existing conversation
        const existing = await databases.listDocuments<ConversationDocument>(
            DATABASE_ID,
            COLLECTIONS.CONVERSATIONS,
            [
                Query.equal("listing_id", listingId),
                Query.equal("tourist_id", touristId),
                Query.limit(1),
            ]
        );

        if (existing.documents.length > 0) {
            return existing.documents[0];
        }

        // Create new conversation
        const now = new Date().toISOString();
        return await databases.createDocument<ConversationDocument>(
            DATABASE_ID,
            COLLECTIONS.CONVERSATIONS,
            ID.unique(),
            {
                listing_id: listingId,
                tourist_id: touristId,
                provider_id: providerId,
                tourist_unread: 0,
                provider_unread: 0,
                last_message_at: now,
            }
        );
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Fetches all conversations for a tourist, enriched with participant
 * display info and listing titles.
 *
 * Ordered by `last_message_at` descending (most recent first).
 */
export async function getConversationsForTourist(
    touristId: string
): Promise<ConversationWithParticipants[]> {
    try {
        const response = await databases.listDocuments<ConversationDocument>(
            DATABASE_ID,
            COLLECTIONS.CONVERSATIONS,
            [
                Query.equal("tourist_id", touristId),
                Query.orderDesc("last_message_at"),
                Query.limit(50),
            ]
        );

        // Enrich in parallel
        const enriched = await Promise.all(
            response.documents.map(async (conv) => {
                const [tourist, provider, listing_title] = await Promise.all([
                    fetchUserParticipant(touristId),
                    fetchProviderParticipant(conv.provider_id),
                    fetchListingTitle(conv.listing_id),
                ]);

                return {
                    ...conv,
                    tourist,
                    provider,
                    listing_title,
                } as ConversationWithParticipants;
            })
        );

        return enriched;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Fetches all conversations for a provider, enriched with participant
 * display info and listing titles.
 *
 * Ordered by `last_message_at` descending (most recent first).
 */
export async function getConversationsForProvider(
    providerId: string
): Promise<ConversationWithParticipants[]> {
    try {
        const response = await databases.listDocuments<ConversationDocument>(
            DATABASE_ID,
            COLLECTIONS.CONVERSATIONS,
            [
                Query.equal("provider_id", providerId),
                Query.orderDesc("last_message_at"),
                Query.limit(50),
            ]
        );

        const enriched = await Promise.all(
            response.documents.map(async (conv) => {
                const [tourist, provider, listing_title] = await Promise.all([
                    fetchUserParticipant(conv.tourist_id),
                    fetchProviderParticipant(providerId),
                    fetchListingTitle(conv.listing_id),
                ]);

                return {
                    ...conv,
                    tourist,
                    provider,
                    listing_title,
                } as ConversationWithParticipants;
            })
        );

        return enriched;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Marks a conversation as read for the given role.
 *
 * Resets the unread counter to 0 for the specified party.
 */
export async function markConversationAsRead(
    conversationId: string,
    role: "tourist" | "provider"
): Promise<void> {
    try {
        const field =
            role === "tourist" ? "tourist_unread" : "provider_unread";

        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.CONVERSATIONS,
            conversationId,
            { [field]: 0 }
        );
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Updates the last_message and last_message_at on a conversation.
 *
 * Called internally by `message.service.sendMessage()`.
 */
export async function updateConversationLastMessage(
    conversationId: string,
    text: string
): Promise<void> {
    try {
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.CONVERSATIONS,
            conversationId,
            {
                last_message: text.substring(0, 200),
                last_message_at: new Date().toISOString(),
            }
        );
    } catch (err) {
        throw handleAppwriteError(err);
    }
}
