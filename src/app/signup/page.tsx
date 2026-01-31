import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign up | Tourly",
    description: "Create your Tourly account and start exploring Pakistan.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SignupForm />
        </Suspense>
    );
}
