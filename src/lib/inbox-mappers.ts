import type { ConversationWithParticipants } from "@/types/conversation.types";

/** Inbox conversation item for the messaging UI. */
export interface InboxItem {
    id: string;
    otherParticipantName: string;
    otherParticipantAvatar: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    listingTitle?: string;
}

// ─── Conversation Mapper ────────────────────────────────

/**
 * Maps a ConversationWithParticipants to an InboxItem.
 */
export function mapConversationToInboxItem(
    conversation: ConversationWithParticipants,
    currentUserId: string
): InboxItem {
    const isCurrentUserTourist = conversation.tourist_id === currentUserId;
    const other = isCurrentUserTourist
        ? conversation.provider
        : conversation.tourist;

    return {
        id: conversation.$id,
        otherParticipantName: other?.name ?? "Unknown",
        otherParticipantAvatar: other?.avatar_url ?? "",
        lastMessage: conversation.last_message ?? "",
        lastMessageAt: conversation.last_message_at ?? conversation.$createdAt,
        unreadCount: isCurrentUserTourist
            ? conversation.tourist_unread
            : conversation.provider_unread,
        listingTitle: conversation.listing_title,
    };
}
