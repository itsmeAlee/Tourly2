"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────

const MAX_CHARS = 2000;
const CHAR_WARNING_THRESHOLD = 1800;

// ─── Types ───────────────────────────────────────────────

interface MessageInputProps {
    onSend: (text: string) => Promise<void>;
    disabled?: boolean;
}

// ─── Component ───────────────────────────────────────────

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
    const [text, setText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const trimmed = text.trim();
    const charCount = trimmed.length;
    const isOverLimit = charCount > MAX_CHARS;
    const showCounter = charCount >= CHAR_WARNING_THRESHOLD;
    const canSend = trimmed.length > 0 && !isOverLimit && !isSending && !disabled;

    // ── Auto-resize textarea ─────────────────────────────
    const handleTextChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setText(e.target.value);
            setError(null);

            // Auto-resize up to 4 lines (~96px)
            const el = e.target;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
        },
        []
    );

    // ── Send handler ─────────────────────────────────────
    const handleSend = useCallback(async () => {
        if (!canSend) return;

        setIsSending(true);
        setError(null);

        try {
            await onSend(trimmed);
            setText("");

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        } catch {
            setError("Failed to send. Tap to retry.");
        } finally {
            setIsSending(false);
        }
    }, [canSend, trimmed, onSend]);

    // ── Keyboard shortcut: Ctrl+Enter / Cmd+Enter ────────
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    return (
        <footer className="sticky bottom-0 bg-white border-t border-gray-100 p-3 sm:p-4 shrink-0">
            {/* Error message */}
            {error && (
                <button
                    onClick={handleSend}
                    className="w-full text-center text-xs text-red-500 mb-2 hover:underline"
                >
                    {error}
                </button>
            )}

            <div className="max-w-2xl mx-auto flex items-end gap-3">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        disabled={isSending || disabled}
                        className={cn(
                            "w-full resize-none rounded-2xl border border-gray-200 bg-gray-50",
                            "px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                            "placeholder:text-muted-foreground",
                            "min-h-[48px] max-h-24",
                            "disabled:opacity-50",
                            isOverLimit && "border-red-300 focus:border-red-400 focus:ring-red-200"
                        )}
                    />

                    {/* Character counter */}
                    {showCounter && (
                        <span
                            className={cn(
                                "absolute right-3 bottom-1.5 text-[10px]",
                                isOverLimit
                                    ? "text-red-500 font-semibold"
                                    : "text-muted-foreground"
                            )}
                        >
                            {charCount}/{MAX_CHARS}
                        </span>
                    )}
                </div>

                <Button
                    onClick={handleSend}
                    disabled={!canSend}
                    size="icon"
                    className="rounded-full w-12 h-12 shrink-0"
                >
                    {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </Button>
            </div>
        </footer>
    );
}
