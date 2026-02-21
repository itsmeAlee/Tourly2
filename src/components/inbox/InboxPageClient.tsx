"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCcw, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { InboxList } from "@/components/inbox/InboxList";
import {
    getConversationsForTourist,
    getConversationsForProvider,
} from "@/services/conversation.service";
import { client } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import type { ConversationWithParticipants, ConversationDocument } from "@/types/conversation.types";

// ─── Skeleton ────────────────────────────────────────────

function InboxSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-6">
                <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse mb-8" />
                <div className="space-y-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 px-4 py-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
                                </div>
                                <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
                                <div className="h-3 w-64 bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Error State ─────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                    Couldn&apos;t load your inbox
                </h2>
                <p className="text-muted-foreground mb-6">
                    Please try again.
                </p>
                <Button onClick={onRetry} className="rounded-2xl gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Retry
                </Button>
            </div>
        </div>
    );
}

// ─── Page Client ─────────────────────────────────────────

export function InboxPageClient() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [conversations, setConversations] = useState<ConversationWithParticipants[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchConversations = useCallback(async () => {
        if (!user) return;

        setIsLoading(true);
        setError(false);

        try {
            let data: ConversationWithParticipants[] = [];

            if (user.role === "provider") {
                if (user.providerId) {
                    data = await getConversationsForProvider(user.providerId);
                }
            } else {
                data = await getConversationsForTourist(user.id);
            }

            setConversations(data);
        } catch (err) {
            console.error("[Inbox] Failed to fetch conversations:", err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Auth redirect
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login?next=/inbox");
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch conversations once authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchConversations();
        }
    }, [isAuthenticated, user, fetchConversations]);

    // ── Realtime Subscription ────────────────────────────────
    const unsubRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        // Only sub after initial load completes to avoid race conditions
        if (!isAuthenticated || !user || isLoading || error) return;

        const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.CONVERSATIONS}.documents`;

        try {
            const unsubscribe = client.subscribe(channel, (response) => {
                const payload = response.payload as ConversationDocument;

                // Only react if the conversation specifically targets our current role's identity
                if (user.role === "provider") {
                    if (payload.provider_id !== user.providerId) return;
                } else {
                    if (payload.tourist_id !== user.id) return;
                }

                if (response.events.some((e) => e.includes(".create"))) {
                    // New conversation, fetch full list to get enriched participants
                    fetchConversations();
                } else if (response.events.some((e) => e.includes(".update"))) {
                    // Update existing unread counts and last_message, and re-sort
                    setConversations((prev) => {
                        const updated = prev.map((c) =>
                            c.$id === payload.$id ? { ...c, ...payload } : c
                        );
                        return updated.sort((a, b) => {
                            const tA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
                            const tB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
                            return tB - tA;
                        });
                    });
                } else if (response.events.some((e) => e.includes(".delete"))) {
                    setConversations((prev) =>
                        prev.filter((c) => c.$id !== payload.$id)
                    );
                }
            });

            unsubRef.current = unsubscribe;
        } catch (err) {
            console.warn("[Inbox] Intermittent realtime failure", err);
        }

        return () => {
            if (unsubRef.current) unsubRef.current();
        };
    }, [isAuthenticated, user, isLoading, error, fetchConversations]);

    // Loading states
    if (authLoading || (!isAuthenticated && !error)) {
        return <InboxSkeleton />;
    }

    if (isLoading) {
        return <InboxSkeleton />;
    }

    if (error) {
        return <ErrorState onRetry={fetchConversations} />;
    }

    return (
        <InboxList
            conversations={conversations}
            currentUserRole={user?.role ?? "tourist"}
        />
    );
}
