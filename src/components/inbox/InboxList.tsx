"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatTimeAgo } from "@/lib/format-time";
import type { ConversationWithParticipants } from "@/types/conversation.types";

// ─── Props ───────────────────────────────────────────────

interface InboxListProps {
    conversations: ConversationWithParticipants[];
    currentUserRole: "tourist" | "provider";
}

// ─── InboxList ───────────────────────────────────────────

export function InboxList({ conversations, currentUserRole }: InboxListProps) {
    const router = useRouter();
    const [filter, setFilter] = useState<"all" | "unread">("all");

    // Determine unread field based on user role
    const getUnreadCount = (conv: ConversationWithParticipants) =>
        currentUserRole === "tourist" ? conv.tourist_unread : conv.provider_unread;

    const filteredConversations =
        filter === "unread"
            ? conversations.filter((c) => getUnreadCount(c) > 0)
            : conversations;

    const totalUnread = conversations.reduce(
        (sum, c) => sum + getUnreadCount(c),
        0
    );

    const handleBack = () => {
        router.push("/");
    };

    if (conversations.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBack}
                                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5 text-foreground" />
                            </button>
                            <h1 className="text-2xl font-bold text-foreground">
                                Inbox
                            </h1>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setFilter("all")}
                            className={cn(
                                "text-sm font-medium pb-2 border-b-2 transition-colors",
                                filter === "all"
                                    ? "text-foreground border-primary"
                                    : "text-muted-foreground border-transparent hover:text-foreground"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={cn(
                                "flex items-center gap-2 text-sm font-medium pb-2 border-b-2 transition-colors",
                                filter === "unread"
                                    ? "text-foreground border-primary"
                                    : "text-muted-foreground border-transparent hover:text-foreground"
                            )}
                        >
                            Unread
                            {totalUnread > 0 && (
                                <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-white rounded-full">
                                    {totalUnread}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Conversation List */}
            <main className="container mx-auto">
                {filteredConversations.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                        No unread conversations
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredConversations.map((conversation) => (
                            <ConversationRow
                                key={conversation.$id}
                                conversation={conversation}
                                currentUserRole={currentUserRole}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// ─── Conversation Row ────────────────────────────────────

function ConversationRow({
    conversation,
    currentUserRole,
}: {
    conversation: ConversationWithParticipants;
    currentUserRole: "tourist" | "provider";
}) {
    const unreadCount =
        currentUserRole === "tourist"
            ? conversation.tourist_unread
            : conversation.provider_unread;
    const hasUnread = unreadCount > 0;

    // Determine the "other" participant to display
    const otherParticipant =
        currentUserRole === "tourist"
            ? conversation.provider
            : conversation.tourist;

    return (
        <Link
            href={`/inbox/${conversation.$id}`}
            className="flex items-start gap-4 px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
        >
            {/* Unread Indicator */}
            <div className="w-2 pt-5">
                {hasUnread && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                )}
            </div>

            {/* Avatar */}
            {otherParticipant.avatar_url ? (
                <img
                    src={otherParticipant.avatar_url}
                    alt={otherParticipant.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-primary" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3
                        className={cn(
                            "text-sm truncate",
                            hasUnread
                                ? "font-bold text-foreground"
                                : "font-medium text-foreground"
                        )}
                    >
                        {otherParticipant.name}
                    </h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatTimeAgo(conversation.last_message_at)}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mb-1">
                    Re: {conversation.listing_title}
                </p>
                <p
                    className={cn(
                        "text-sm truncate",
                        hasUnread ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    {conversation.last_message || "No messages yet"}
                </p>
            </div>

            {/* Unread Badge */}
            {hasUnread && (
                <div className="shrink-0 self-center">
                    <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-primary text-white rounded-full">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                </div>
            )}
        </Link>
    );
}

// ─── Empty State ─────────────────────────────────────────

function EmptyState() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                    No conversations yet
                </h2>
                <p className="text-muted-foreground mb-6">
                    Message a provider to start planning your trip.
                </p>
                <Link href="/">
                    <Button className="rounded-2xl">Explore Services</Button>
                </Link>
            </div>
        </div>
    );
}
