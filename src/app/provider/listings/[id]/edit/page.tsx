import { ProviderCreateListingClient } from "@/components/provider/ProviderCreateListingClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// For editing, we reuse the same client form but we could pass an `id` prop
// and let the client fetch the existing listing. Since backend isn't wired yet, we just render the form.
export default function ProviderEditListingPage({ params }: { params: { id: string } }) {
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
