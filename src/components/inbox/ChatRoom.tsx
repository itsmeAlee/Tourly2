"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Conversation, Message } from "@/data/mockMessages";

interface ChatRoomProps {
    conversation: Conversation;
}

export function ChatRoom({ conversation }: ChatRoomProps) {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(conversation.messages);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            threadId: conversation.id,
            senderId: 'user-1',
            senderType: 'user',
            content: inputValue.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleBack = () => {
        router.push('/inbox');
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Chat Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3 px-4 h-14 md:h-16">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Back to inbox"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>

                    {/* Provider Info */}
                    <Link
                        href={`/provider/${conversation.providerId}`}
                        className="flex items-center gap-3 flex-1 min-w-0"
                    >
                        <img
                            src={conversation.providerAvatar}
                            alt={conversation.providerName}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                            <h1 className="font-semibold text-foreground truncate">
                                {conversation.providerName}
                            </h1>
                            <p className="text-xs text-muted-foreground truncate">
                                {conversation.listingTitle}
                            </p>
                        </div>
                    </Link>

                    {/* View Listing Link */}
                    <Link
                        href={`/listing/${conversation.listingId}`}
                        className="hidden md:block text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
                    >
                        View Listing
                    </Link>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto px-4 py-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Day Separator */}
                    <div className="flex items-center justify-center py-2">
                        <span className="text-xs text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                            Today
                        </span>
                    </div>

                    {/* Messages */}
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Message Composer */}
            <footer className="sticky bottom-0 bg-white border-t border-gray-100 p-4 shrink-0">
                <div className="max-w-2xl mx-auto flex items-end gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            rows={1}
                            className={cn(
                                "w-full resize-none rounded-2xl border border-gray-200 bg-gray-50",
                                "px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                "placeholder:text-muted-foreground",
                                "min-h-[48px] max-h-32"
                            )}
                            style={{ overflow: 'hidden' }}
                        />
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        size="icon"
                        className="rounded-full w-12 h-12 shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </footer>
        </div>
    );
}

function MessageBubble({ message }: { message: Message }) {
    const isUser = message.senderType === 'user';

    return (
        <div className={cn(
            "flex",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[80%] md:max-w-[70%]"
            )}>
                <div className={cn(
                    "px-4 py-3 rounded-2xl",
                    isUser
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-gray-100 text-foreground rounded-bl-md"
                )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                    </p>
                </div>
                <p className={cn(
                    "text-[10px] text-muted-foreground mt-1 px-1",
                    isUser ? "text-right" : "text-left"
                )}>
                    {message.timestamp}
                </p>
            </div>
        </div>
    );
}
