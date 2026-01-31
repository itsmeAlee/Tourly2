import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log in | Tourly",
    description: "Log in to your Tourly account to continue your adventure.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
