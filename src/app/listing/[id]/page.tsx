// TODO: Add generateStaticParams for ISR when listing count is stable

import { getListingById } from "@/services/listing.service";
import { getProviderById } from "@/services/provider.service";
import { getListingImageUrls } from "@/services/storage.service";
import {
    mapListingWithDetailsToListing,
    mapProviderToPublicProfile,
} from "@/lib/mappers";
import { StaysLayout } from "@/components/listing/layout/StaysLayout";
import { TransportLayout } from "@/components/listing/layout/TransportLayout";
import { GuideLayout } from "@/components/listing/layout/GuideLayout";
import { ListingHeader } from "@/components/listing/layout/ListingHeader";
import { ListingBottomBar } from "@/components/listing/layout/ListingBottomBar";
import {
    isStayListing,
    isTransportListing,
    isGuideListing,
    type Listing,
} from "@/components/listing/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getListingImageUrl } from "@/lib/storage";

type Props = {
    params: { id: string } | Promise<{ id: string }>;
    searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await Promise.resolve(props.params);

    try {
        const listing = await getListingById(params.id);

        if (!listing) {
            return { title: "Listing Not Found" };
        }

        const ogImageUrl =
            listing.images?.length > 0
                ? getListingImageUrl(listing.images[0], 1200)
                : undefined;

        return {
            title: `${listing.title} | Tourly`,
            description: listing.description.slice(0, 160),
            alternates: {
                canonical: `/listing/${listing.$id}`,
            },
            robots: { index: true, follow: true },
            openGraph: {
                title: `${listing.title} | Tourly`,
                description: listing.description.slice(0, 160),
                type: "article",
                images: ogImageUrl ? [ogImageUrl] : undefined,
            },
        };
    } catch {
        return { title: "Listing Not Found" };
    }
}

// Component to render the appropriate layout based on listing type
function ListingContent({ listing }: { listing: Listing }) {
    if (isStayListing(listing)) {
        return <StaysLayout listing={listing} />;
    }
    if (isTransportListing(listing)) {
        return <TransportLayout listing={listing} />;
    }
    if (isGuideListing(listing)) {
        return <GuideLayout listing={listing} />;
    }
    return null;
}

export default async function ListingPage(props: Props) {
    const params = await Promise.resolve(props.params);

    // 1. Fetch the listing (with details)
    const listing = await getListingById(params.id);

    if (!listing) {
        notFound();
    }

    // 2. Convert image file IDs → preview URLs
    const imageUrls =
        listing.images?.length > 0 ? getListingImageUrls(listing.images) : [];

    // 3. Fetch the provider document (in parallel-safe way)
    let providerProfile = null;
    try {
        const provider = await getProviderById(listing.provider_id);
        if (provider) {
            providerProfile = mapProviderToPublicProfile(provider);
        }
    } catch (err) {
        console.error("[ListingPage] Failed to fetch provider:", err);
        // Non-fatal — page still renders without detailed provider info
    }

    // 4. Map to the component's expected Listing type
    const mappedListing = mapListingWithDetailsToListing(
        listing,
        imageUrls,
        providerProfile
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Header with back navigation */}
            <ListingHeader title={mappedListing.title} listingId={mappedListing.id} />

            {/* Dynamic Content based on listing type */}
            <main className="pb-24 lg:pb-8">
                <ListingContent listing={mappedListing} />
            </main>

            {/* Mobile-only Bottom Bar */}
            <ListingBottomBar
                price={mappedListing.price}
                priceUnit={mappedListing.priceUnit}
                listingId={mappedListing.id}
                listingTitle={mappedListing.title}
                providerId={mappedListing.provider.id}
            />
        </div>
    );
}
