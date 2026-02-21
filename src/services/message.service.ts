import { ID, Query } from "appwrite";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { handleAppwriteError, AppError } from "@/lib/errors";
import { updateConversationAfterMessage } from "./conversation.service";
import type { MessageDocument } from "@/types/message.types";
import type { ConversationDocument } from "@/types/conversation.types";

// ─── Message Service ────────────────────────────────────

/**
 * Sends a message in a conversation.
 *
 * Security checks:
 * 1. Text must not be empty and must be ≤ 2000 characters.
 * 2. Sender must be a participant of the conversation (tourist or provider).
 *
 * Side effects (after message creation):
 * - Updates conversation.last_message + last_message_at.
 * - Increments the unread counter for the OTHER party.
 */
export async function sendMessage(
    conversationId: string,
    senderId: string,
    text: string
): Promise<MessageDocument> {
    // ── Input Validation ────────────────────────────────

    const trimmed = text.trim();
    if (!trimmed) {
        throw new AppError("VALIDATION", "Message cannot be empty.");
    }
    if (trimmed.length > 2000) {
        throw new AppError(
            "VALIDATION",
            "Message cannot exceed 2000 characters."
        );
    }

    try {
        // ── Security: Verify sender is a participant ────

        const conversation =
            await databases.getDocument<ConversationDocument>(
                DATABASE_ID,
                COLLECTIONS.CONVERSATIONS,
                conversationId
            );

        const isTourist = conversation.tourist_id === senderId;
        const isProvider = conversation.provider_id === senderId;

        if (!isTourist && !isProvider) {
            throw new AppError(
                "FORBIDDEN",
                "You are not a participant of this conversation."
            );
        }

        // ── Create the message ──────────────────────────

        const now = new Date().toISOString();
        const messageDoc = await databases.createDocument<MessageDocument>(
            DATABASE_ID,
            COLLECTIONS.MESSAGES,
            ID.unique(),
            {
                conversation_id: conversationId,
                sender_id: senderId,
                text: trimmed,
                is_read: false,
                created_at: now,
            }
        );

        // ── Side effects (best-effort, non-blocking) ────

        // Update conversation last_message preview and unread count
        const roleToIncrement = isTourist ? "provider" : "tourist";
        const unreadField = roleToIncrement === "provider" ? "provider_unread" : "tourist_unread";
        const currentUnread = (conversation[unreadField] as number) ?? 0;

        updateConversationAfterMessage(
            conversationId,
            trimmed,
            roleToIncrement,
            currentUnread
        ).catch((err: unknown) =>
            console.warn(
                "[MessageService] Failed to update conversation state:",
                err
            )
        );

        return messageDoc;
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw handleAppwriteError(err);
    }
}

/**
 * Fetches paginated messages for a conversation.
 *
 * Ordered by `created_at` ascending (oldest first — natural chat order).
 *
 * @param conversationId  Conversation document $id.
 * @param limit           Max messages per page (default 50).
 * @param offset          Number of messages to skip (for loading older messages).
 */
export async function getMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
): Promise<{ messages: MessageDocument[]; total: number }> {
    try {
        const response = await databases.listDocuments<MessageDocument>(
            DATABASE_ID,
            COLLECTIONS.MESSAGES,
            [
                Query.equal("conversation_id", conversationId),
                Query.orderAsc("created_at"),
                Query.limit(limit),
                Query.offset(offset),
            ]
        );

        return {
            messages: response.documents,
            total: response.total,
        };
    } catch (err) {
        throw handleAppwriteError(err);
    }
}
