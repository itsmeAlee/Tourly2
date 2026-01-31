"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

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
        // Store context for the conversation in sessionStorage
        sessionStorage.setItem("pendingMessage", JSON.stringify({
            listingId,
            providerId,
            listingTitle,
            timestamp: Date.now(),
        }));

        // Determine the target thread/conversation URL
        // In real implementation, this would create or fetch an existing conversation
        const targetUrl = `/inbox/thread-${listingId}`;

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
