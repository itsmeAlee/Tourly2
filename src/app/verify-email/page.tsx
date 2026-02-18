import { Suspense } from "react";
import { VerifyEmailHandler } from "@/components/auth/VerifyEmailHandler";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verify Email | Tourly",
    description: "Verify your Tourly email address.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <VerifyEmailHandler />
        </Suspense>
    );
}
