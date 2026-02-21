"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { client, databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { Query } from "appwrite";
import type { ConversationDocument } from "@/types/conversation.types";

/**
 * Hook that provides a live unread conversation count.
 *
 * - Fetches conversations on mount and sums the appropriate unread field.
 * - Subscribes to realtime updates on the conversations collection.
 * - Resets to 0 on logout.
 */
export function useUnreadCount(): number {
    const { user, isAuthenticated } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const unsubRef = useRef<(() => void) | null>(null);

    // ── Compute unread from conversation list ──────────
    const fetchUnread = useCallback(async () => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        try {
            const field =
                user.role === "tourist" ? "tourist_id" : "provider_id";
            const unreadField =
                user.role === "tourist" ? "tourist_unread" : "provider_unread";

            const res = await databases.listDocuments<ConversationDocument>(
                DATABASE_ID,
                COLLECTIONS.CONVERSATIONS,
                [Query.equal(field, user.id), Query.limit(100)]
            );

            const total = res.documents.reduce(
                (sum, conv) => sum + ((conv[unreadField] as number) ?? 0),
                0
            );
            setUnreadCount(total);
        } catch {
            // Silently fail — badge just won't show
        }
    }, [user]);

    // ── Initial fetch ──────────────────────────────────
    useEffect(() => {
        if (isAuthenticated) {
            fetchUnread();
        } else {
            setUnreadCount(0);
        }
    }, [isAuthenticated, fetchUnread]);

    // ── Realtime subscription ──────────────────────────
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        // Subscribe to all conversation document changes
        const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.CONVERSATIONS}.documents`;

        try {
            const unsubscribe = client.subscribe(channel, (response) => {
                // Check if the event involves our user's conversations
                const payload = response.payload as ConversationDocument;
                const isParticipant =
                    payload.tourist_id === user.id ||
                    payload.provider_id === user.id;

                if (!isParticipant) return;

                // Recalculate unread on any conversation change
                fetchUnread();
            });

            unsubRef.current = unsubscribe;
        } catch {
            // Realtime may fail in SSR or if client not configured
        }

        return () => {
            unsubRef.current?.();
            unsubRef.current = null;
        };
    }, [isAuthenticated, user, fetchUnread]);

    return unreadCount;
}
