import { Suspense } from "react";
import { ProviderProfileSetup } from "@/components/auth/ProviderProfileSetup";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Set up your profile | Tourly",
    description: "Complete your service provider profile to start listing on Tourly.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProviderProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <ProviderProfileSetup />
        </Suspense>
    );
}
