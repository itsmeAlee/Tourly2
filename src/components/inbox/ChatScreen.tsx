"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { client } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { formatMessageDate, formatMessageTime } from "@/lib/format-time";
import { MessageInput } from "@/components/inbox/MessageInput";
import {
    getConversationWithParticipants,
    markConversationAsRead,
} from "@/services/conversation.service";
import { getMessages, sendMessage } from "@/services/message.service";
import type { ConversationWithParticipants } from "@/types/conversation.types";
import type { MessageDocument } from "@/types/message.types";

// ─── Constants ───────────────────────────────────────────

const MESSAGES_PER_PAGE = 50;

// ─── Types ───────────────────────────────────────────────

interface ChatScreenProps {
    conversationId: string;
}

type ScreenState = "loading" | "not-found" | "forbidden" | "error" | "ready";

// ─── Component ───────────────────────────────────────────

export function ChatScreen({ conversationId }: ChatScreenProps) {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // ── State ────────────────────────────────────────────
    const [screenState, setScreenState] = useState<ScreenState>("loading");
    const [conversation, setConversation] = useState<ConversationWithParticipants | null>(null);
    const [messages, setMessages] = useState<MessageDocument[]>([]);
    const [totalMessages, setTotalMessages] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const unsubRef = useRef<(() => void) | null>(null);
    const markReadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Derived state ────────────────────────────────────
    const currentUserRole = user?.role ?? "tourist";
    const otherParticipant =
        conversation
            ? currentUserRole === "tourist"
                ? conversation.provider
                : conversation.tourist
            : null;

    // ── Scroll to bottom ─────────────────────────────────
    const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
        // Small delay to let DOM update
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior });
        }, 50);
    }, []);

    // ── Mark as read (debounced) ─────────────────────────
    const debouncedMarkRead = useCallback(() => {
        if (markReadTimeoutRef.current) {
            clearTimeout(markReadTimeoutRef.current);
        }
        markReadTimeoutRef.current = setTimeout(() => {
            markConversationAsRead(conversationId, currentUserRole).catch((err) =>
                console.warn("[ChatScreen] Failed to mark as read:", err)
            );
        }, 500);
    }, [conversationId, currentUserRole]);

    // ── Initial data load ────────────────────────────────
    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !user) {
            router.push(`/login?next=/inbox/${conversationId}`);
            return;
        }

        let cancelled = false;

        async function loadData() {
            try {
                // 1. Fetch conversation
                const conv = await getConversationWithParticipants(conversationId);

                if (cancelled) return;

                if (!conv) {
                    setScreenState("not-found");
                    return;
                }

                // 2. Security check: verify user is a participant
                const isParticipant =
                    conv.tourist_id === user!.id || conv.provider_id === user!.id;

                if (!isParticipant) {
                    // Treat as not found — don't reveal conversation exists
                    setScreenState("not-found");
                    return;
                }

                // 3. Fetch initial messages
                const { messages: msgs, total } = await getMessages(
                    conversationId,
                    MESSAGES_PER_PAGE,
                    0
                );

                if (cancelled) return;

                setConversation(conv);
                setMessages(msgs);
                setTotalMessages(total);
                setScreenState("ready");

                // 4. Mark as read
                markConversationAsRead(conversationId, user!.role).catch((err) =>
                    console.warn("[ChatScreen] Failed to mark as read:", err)
                );

                // 5. Scroll to bottom on initial load
                scrollToBottom("instant");
            } catch (err) {
                console.error("[ChatScreen] Failed to load:", err);
                if (!cancelled) setScreenState("error");
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, [authLoading, isAuthenticated, user, conversationId, router, scrollToBottom]);

    // ── Realtime subscription ────────────────────────────
    useEffect(() => {
        if (screenState !== "ready" || !user) return;

        const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.MESSAGES}.documents`;

        try {
            const unsubscribe = client.subscribe(channel, (response) => {
                const payload = response.payload as MessageDocument;

                // Only handle messages for THIS conversation
                if (payload.conversation_id !== conversationId) return;

                // Handle created events
                if (
                    response.events.some((e) => e.includes(".create"))
                ) {
                    // Avoid duplicating our own optimistic messages
                    setMessages((prev) => {
                        // Check if message already exists
                        if (prev.some((m) => m.$id === payload.$id)) return prev;
                        // Remove any optimistic message with matching text
                        const filtered = prev.filter(
                            (m) =>
                                !(
                                    m.$id.startsWith("optimistic-") &&
                                    m.text === payload.text &&
                                    m.sender_id === payload.sender_id
                                )
                        );
                        return [...filtered, payload];
                    });

                    scrollToBottom();

                    // If the message is from the OTHER party, mark as read
                    if (payload.sender_id !== user.id) {
                        debouncedMarkRead();
                    }
                }

                // Handle updated events (e.g., read receipts)
                if (
                    response.events.some((e) => e.includes(".update"))
                ) {
                    setMessages((prev) =>
                        prev.map((m) => (m.$id === payload.$id ? payload : m))
                    );
                }
            });

            unsubRef.current = unsubscribe;
        } catch {
            // Realtime may not be available
        }

        return () => {
            unsubRef.current?.();
            unsubRef.current = null;
        };
    }, [screenState, user, conversationId, scrollToBottom, debouncedMarkRead]);

    // ── Cleanup on unmount ───────────────────────────────
    useEffect(() => {
        return () => {
            if (markReadTimeoutRef.current) {
                clearTimeout(markReadTimeoutRef.current);
            }
        };
    }, []);

    // ── Load earlier messages ────────────────────────────
    const loadEarlierMessages = useCallback(async () => {
        if (isLoadingMore || messages.length >= totalMessages) return;

        setIsLoadingMore(true);
        try {
            // We want to load messages BEFORE the current oldest
            // Since messages are ordered ASC, we need to adjust offset
            const remaining = totalMessages - messages.length;
            const offset = Math.max(0, remaining - MESSAGES_PER_PAGE);
            const limit = Math.min(MESSAGES_PER_PAGE, remaining);

            const { messages: olderMsgs } = await getMessages(
                conversationId,
                limit,
                offset
            );

            setMessages((prev) => {
                // Deduplicate
                const existingIds = new Set(prev.map((m) => m.$id));
                const newMsgs = olderMsgs.filter((m) => !existingIds.has(m.$id));
                return [...newMsgs, ...prev];
            });
        } catch (err) {
            console.error("[ChatScreen] Failed to load earlier messages:", err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [conversationId, messages.length, totalMessages, isLoadingMore]);

    // ── Send message (optimistic UI) ─────────────────────
    const handleSend = useCallback(
        async (text: string) => {
            if (!user) return;

            // 1. Create optimistic message
            const optimisticMsg: MessageDocument = {
                $id: `optimistic-${Date.now()}`,
                $collectionId: COLLECTIONS.MESSAGES,
                $databaseId: DATABASE_ID,
                $createdAt: new Date().toISOString(),
                $updatedAt: new Date().toISOString(),
                $permissions: [],
                conversation_id: conversationId,
                sender_id: user.id,
                text,
                is_read: false,
                created_at: new Date().toISOString(),
                $sequence: 0,
            };

            // 2. Append to state immediately
            setMessages((prev) => [...prev, optimisticMsg]);
            scrollToBottom();

            try {
                // 3. Send via service
                const realMsg = await sendMessage(conversationId, user.id, text);

                // 4. Replace optimistic with real message
                setMessages((prev) =>
                    prev.map((m) => (m.$id === optimisticMsg.$id ? realMsg : m))
                );
            } catch (err) {
                // 5. Remove optimistic on failure
                setMessages((prev) =>
                    prev.filter((m) => m.$id !== optimisticMsg.$id)
                );
                throw err; // Propagate to MessageInput for error display
            }
        },
        [user, conversationId, scrollToBottom]
    );

    // ── Render states ────────────────────────────────────

    if (screenState === "loading" || authLoading) {
        return <ChatSkeleton />;
    }

    if (screenState === "not-found" || screenState === "forbidden") {
        return <NotFoundState />;
    }

    if (screenState === "error") {
        return (
            <ErrorState
                onRetry={() => {
                    setScreenState("loading");
                    router.refresh();
                }}
            />
        );
    }

    // ── Group messages by date for separators ────────────
    const groupedMessages = groupMessagesByDate(messages);

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* ── Chat Header ─────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3 px-4 h-14 md:h-16">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push("/inbox")}
                        className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Back to inbox"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>

                    {/* Other Participant Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {otherParticipant?.avatar_url ? (
                            <img
                                src={otherParticipant.avatar_url}
                                alt={otherParticipant.name}
                                className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h1 className="font-semibold text-foreground truncate text-sm">
                                {otherParticipant?.name ?? "Unknown"}
                            </h1>
                            <p className="text-xs text-muted-foreground truncate">
                                {conversation?.listing_title}
                            </p>
                        </div>
                    </div>

                    {/* View Listing Link */}
                    {conversation && (
                        <Link
                            href={`/listing/${conversation.listing_id}`}
                            className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
                        >
                            View Listing
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    )}
                </div>
            </header>

            {/* ── Messages Area ───────────────────────── */}
            <main className="flex-1 overflow-y-auto px-4 py-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Load Earlier */}
                    {messages.length < totalMessages && (
                        <div className="flex justify-center py-2">
                            <button
                                onClick={loadEarlierMessages}
                                disabled={isLoadingMore}
                                className="text-xs text-primary hover:text-primary/80 font-medium disabled:opacity-50 flex items-center gap-1"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    "Load earlier messages"
                                )}
                            </button>
                        </div>
                    )}

                    {/* Messages grouped by date */}
                    {groupedMessages.map(({ dateLabel, msgs }) => (
                        <div key={dateLabel}>
                            {/* Date Separator */}
                            <div className="flex items-center justify-center py-2">
                                <span className="text-xs text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                                    {dateLabel}
                                </span>
                            </div>

                            {/* Messages for this date */}
                            <div className="space-y-3">
                                {msgs.map((message) => (
                                    <MessageBubble
                                        key={message.$id}
                                        message={message}
                                        isCurrentUser={message.sender_id === user?.id}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* ── Message Input ────────────────────────── */}
            <MessageInput onSend={handleSend} />
        </div>
    );
}

// ─── Message Bubble ──────────────────────────────────────

function MessageBubble({
    message,
    isCurrentUser,
}: {
    message: MessageDocument;
    isCurrentUser: boolean;
}) {
    const isOptimistic = message.$id.startsWith("optimistic-");

    return (
        <div
            className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}
        >
            <div className="max-w-[80%] md:max-w-[70%]">
                <div
                    className={cn(
                        "px-4 py-3 rounded-2xl",
                        isCurrentUser
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-gray-100 text-foreground rounded-bl-md",
                        isOptimistic && "opacity-70"
                    )}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                    </p>
                </div>
                <p
                    className={cn(
                        "text-[10px] text-muted-foreground mt-1 px-1",
                        isCurrentUser ? "text-right" : "text-left"
                    )}
                >
                    {formatMessageTime(message.created_at)}
                    {isOptimistic && " · Sending..."}
                </p>
            </div>
        </div>
    );
}

// ─── Date Grouping Helper ────────────────────────────────

interface DateGroup {
    dateLabel: string;
    msgs: MessageDocument[];
}

function groupMessagesByDate(messages: MessageDocument[]): DateGroup[] {
    const groups: DateGroup[] = [];
    let currentLabel = "";
    let currentGroup: MessageDocument[] = [];

    for (const msg of messages) {
        const label = formatMessageDate(msg.created_at);

        if (label !== currentLabel) {
            if (currentGroup.length > 0) {
                groups.push({ dateLabel: currentLabel, msgs: currentGroup });
            }
            currentLabel = label;
            currentGroup = [msg];
        } else {
            currentGroup.push(msg);
        }
    }

    if (currentGroup.length > 0) {
        groups.push({ dateLabel: currentLabel, msgs: currentGroup });
    }

    return groups;
}

// ─── Skeleton / Error / NotFound States ──────────────────

function ChatSkeleton() {
    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="sticky top-0 bg-white border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3 px-4 h-14">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
                    <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                    <div className="space-y-1.5">
                        <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                    </div>
                </div>
            </header>
            <main className="flex-1 px-4 py-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex",
                            i % 2 === 0 ? "justify-start" : "justify-end"
                        )}
                    >
                        <div
                            className={cn(
                                "rounded-2xl animate-pulse",
                                i % 2 === 0 ? "bg-gray-100" : "bg-primary/20",
                                i % 3 === 0
                                    ? "w-48 h-16"
                                    : i % 3 === 1
                                        ? "w-64 h-12"
                                        : "w-36 h-10"
                            )}
                        />
                    </div>
                ))}
            </main>
            <div className="border-t border-gray-100 p-4">
                <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
        </div>
    );
}

function NotFoundState() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                    Conversation not found
                </h2>
                <p className="text-muted-foreground mb-6">
                    This conversation doesn&apos;t exist or you don&apos;t have access
                    to it.
                </p>
                <Link href="/inbox">
                    <Button className="rounded-2xl">Back to Inbox</Button>
                </Link>
            </div>
        </div>
    );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                    Couldn&apos;t load messages
                </h2>
                <p className="text-muted-foreground mb-6">
                    Please check your connection and try again.
                </p>
                <Button onClick={onRetry} className="rounded-2xl">
                    Retry
                </Button>
            </div>
        </div>
    );
}
