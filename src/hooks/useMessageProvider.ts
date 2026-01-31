"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getConversationByListingAndProvider } from "@/data/mockMessages";

interface UseMessageProviderOptions {
    listingId: string;
    providerId: string;
    listingTitle: string;
}

/**
 * Hook to handle "Message Provider" action with authentication guard
 * If user is not authenticated, redirects to login with the intended destination
 */
export function useMessageProvider({
    listingId,
    providerId,
    listingTitle,
}: UseMessageProviderOptions) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    const handleMessageClick = () => {
        // Check if there's an existing conversation for this listing+provider
        const existingConversation = getConversationByListingAndProvider(listingId, providerId);

        // Store context for the conversation in sessionStorage
        sessionStorage.setItem("pendingMessage", JSON.stringify({
            listingId,
            providerId,
            listingTitle,
            starterMessage: `Hi! I'm interested in ${listingTitle}.`,
            timestamp: Date.now(),
        }));

        // Determine the target URL:
        // - If existing conversation exists, go to that thread
        // - Otherwise, go to inbox (which will show the new message context)
        // For demo: fallback to thread-1 to show a working chat
        const targetUrl = existingConversation
            ? `/inbox/${existingConversation.id}`
            : `/inbox/thread-1`;

        if (!isAuthenticated) {
            // Redirect to login with the intended destination
            router.push(`/login?next=${encodeURIComponent(targetUrl)}`);
            return;
        }

        // User is authenticated, navigate directly to the chat
        router.push(targetUrl);
    };

    return {
        handleMessageClick,
        isLoading,
        isAuthenticated,
    };
}

