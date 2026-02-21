import { redirect } from "next/navigation";
import { Metadata } from "next";

import { ProviderGuard } from "@/components/auth/ProviderGuard";
import { ProviderNavbar } from "@/components/provider/ProviderNavbar";

export const metadata: Metadata = {
    title: "Provider Dashboard | Tourly",
    description: "Manage your listings, bookings, and revenue on Tourly.",
};

export default function ProviderRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProviderGuard>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <ProviderNavbar />
                <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </ProviderGuard>
    );
}
