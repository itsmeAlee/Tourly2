"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, X, Loader2 } from "lucide-react";
import { AppwriteException } from "appwrite";
import { account } from "@/lib/appwrite";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

export function EmailVerificationBanner() {
    const { isAuthenticated, isEmailVerified, isLoading } = useAuth();
    const pathname = usePathname();
    const [isDismissed, setIsDismissed] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // Don't show on the verify-email page itself
    if (pathname === "/verify-email") return null;

    // Don't show while loading, if not authenticated, or if already verified
    if (isLoading || !isAuthenticated || isEmailVerified) return null;

    // Dismissed for this session
    if (isDismissed) return null;

    const handleResend = async () => {
        setIsResending(true);
        try {
            const verifyUrl = `${window.location.origin}/verify-email`;
            await account.createVerification(verifyUrl);
            toast.success("Verification email sent! Check your inbox.");
        } catch (err: unknown) {
            if (err instanceof AppwriteException) {
                toast.error(err.message || "Failed to send. Please try again.");
            } else {
                toast.error("Failed to send. Please try again.");
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="sticky top-14 lg:top-16 z-40 bg-amber-50 border-b border-amber-200">
            <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-amber-800 min-w-0">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                        Please verify your email. Check your inbox.
                    </span>
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="shrink-0 font-medium text-amber-900 underline underline-offset-2 hover:text-amber-950 transition-colors disabled:opacity-50"
                    >
                        {isResending ? (
                            <span className="flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Sending…
                            </span>
                        ) : (
                            "Resend email"
                        )}
                    </button>
                </div>
                <button
                    onClick={() => setIsDismissed(true)}
                    className="shrink-0 p-1 rounded-full text-amber-600 hover:bg-amber-100 transition-colors"
                    aria-label="Dismiss verification banner"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
