import { ProviderListingsClient } from "@/components/provider/ProviderListingsClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ProviderListingsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <ProviderListingsClient />
        </Suspense>
    );
}
