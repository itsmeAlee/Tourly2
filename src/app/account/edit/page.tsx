import type { Metadata } from "next";
import { Suspense } from "react";
import { EditProfileClient } from "@/components/account/EditProfileClient";

export const metadata: Metadata = {
    title: "Edit Profile | Tourly",
    robots: { index: false, follow: false },
};

export default function EditProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <EditProfileClient />
        </Suspense>
    );
}
