"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { AppwriteException } from "appwrite";
import { account } from "@/lib/appwrite";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

type VerifyState = "loading" | "success" | "error" | "missing";

export function VerifyEmailHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, refreshUser } = useAuth();
    const [state, setState] = useState<VerifyState>("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [isResending, setIsResending] = useState(false);
    const hasRun = useRef(false);

    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        if (!userId || !secret) {
            setState("missing");
            return;
        }

        (async () => {
            try {
                await account.updateVerification(userId, secret);
                setState("success");

                // Refresh auth to update isEmailVerified
                await refreshUser();

                // Redirect to home after 2s
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 2000);
            } catch (err: unknown) {
                setState("error");
                if (err instanceof AppwriteException) {
                    setErrorMessage(
                        err.message ||
                        "This verification link is invalid or has expired."
                    );
                } else {
                    setErrorMessage(
                        "This verification link is invalid or has expired."
                    );
                }
            }
        })();
    }, [userId, secret, refreshUser, router]);

    const handleResend = async () => {
        setIsResending(true);
        try {
            const verifyUrl = `${window.location.origin}/verify-email`;
            await account.createVerification(verifyUrl);
            toast.success("Verification email sent! Check your inbox.");
        } catch (err: unknown) {
            if (err instanceof AppwriteException) {
                toast.error(err.message || "Failed to resend. Please try again.");
            } else {
                toast.error("Failed to resend. Please try again.");
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg p-8 text-center">
                {/* Loading */}
                {state === "loading" && (
                    <div className="py-8">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-foreground mb-2">
                            Verifying your email…
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Please wait a moment.
                        </p>
                    </div>
                )}

                {/* Success */}
                {state === "success" && (
                    <div className="py-8">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">
                            Email verified successfully!
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Redirecting you to the homepage…
                        </p>
                    </div>
                )}

                {/* Error */}
                {state === "error" && (
                    <div className="py-8">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">
                            Verification failed
                        </h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            {errorMessage}
                        </p>
                        {isAuthenticated && (
                            <Button
                                onClick={handleResend}
                                disabled={isResending}
                                variant="outline"
                                className="rounded-xl"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Resend verification email
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}

                {/* Missing params */}
                {state === "missing" && (
                    <div className="py-8">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">
                            Invalid verification link
                        </h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            This link appears to be missing required
                            information. Please click the link in your
                            verification email.
                        </p>
                        {isAuthenticated && (
                            <Button
                                onClick={handleResend}
                                disabled={isResending}
                                variant="outline"
                                className="rounded-xl"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Resend verification email
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
