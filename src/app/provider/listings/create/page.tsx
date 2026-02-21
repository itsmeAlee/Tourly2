import { ProviderCreateListingClient } from "@/components/provider/ProviderCreateListingClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ProviderCreateListingPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <ProviderCreateListingClient />
        </Suspense>
    );
}
