"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateConversation } from "@/services/conversation.service";

interface UseMessageProviderOptions {
    listingId: string;
    providerId: string;
    listingTitle: string;
}

/**
 * Hook to handle "Message Provider" action.
 * - If not authenticated: Redirects to login with a next param to return to the listing.
 * - If authenticated (tourist): Gets/creates the conversation and navigates to the thread.
 * - If authenticated (provider): Shows error/disabled state (providers can't message themselves or create new threads this way).
 */
export function useMessageProvider({
    listingId,
    providerId,
    listingTitle,
}: UseMessageProviderOptions) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [isCreating, setIsCreating] = useState(false);

    const handleMessageClick = async () => {
        if (!isAuthenticated || !user) {
            router.push(`/login?next=/listing/${listingId}`);
            return;
        }

        if (user.role === "provider") {
            alert("Only tourists can start a new message thread from a listing.");
            return;
        }

        setIsCreating(true);

        try {
            // Get or create conversation in Appwrite
            const conv = await getOrCreateConversation(listingId, user.id, providerId);

            // Store context (starter message) in sessionStorage for the ChatScreen to optionally use
            sessionStorage.setItem("pendingMessage", JSON.stringify({
                listingId,
                providerId,
                listingTitle,
                starterMessage: `Hi! I'm interested in ${listingTitle}.`,
                timestamp: Date.now(),
            }));

            // Navigate direct to the thread
            router.push(`/inbox/${conv.$id}`);
        } catch (err) {
            console.error("Failed to start conversation:", err);
            alert("Couldn't start the conversation. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    return {
        handleMessageClick,
        isLoading: authLoading || isCreating,
        isAuthenticated,
        isProvider: user?.role === "provider",
    };
}
