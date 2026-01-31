
import { MOCK_LISTINGS } from '@/components/listing/mock-data';
import { StaysLayout } from '@/components/listing/layout/StaysLayout';
import { TransportLayout } from '@/components/listing/layout/TransportLayout';
import { GuideLayout } from '@/components/listing/layout/GuideLayout';
import { ListingHeader } from '@/components/listing/layout/ListingHeader';
import { ListingBottomBar } from '@/components/listing/layout/ListingBottomBar';
import { isStayListing, isTransportListing, isGuideListing, type Listing } from '@/components/listing/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
    params: { id: string } | Promise<{ id: string }>;
    searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await Promise.resolve(props.params);
    const listing = MOCK_LISTINGS[params.id];

    if (!listing) {
        return {
            title: 'Listing Not Found',
        };
    }

    return {
        title: `${listing.title} | Tourly`,
        description: listing.description,
        alternates: {
            canonical: `/listing/${listing.id}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: `${listing.title} | Tourly`,
            description: listing.description,
            type: 'article',
            images: listing.images?.[0]?.url ? [listing.images[0].url] : undefined,
        },
    };
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
    // Fallback (should never reach here with proper typing)
    return null;
}

export default async function ListingPage(props: Props) {
    const params = await Promise.resolve(props.params);
    const listing = MOCK_LISTINGS[params.id];

    if (!listing) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header with back navigation */}
            <ListingHeader title={listing.title} />

            {/* Dynamic Content based on listing type */}
            <main className="pb-24 lg:pb-8">
                <ListingContent listing={listing} />
            </main>

            {/* Mobile-only Bottom Bar */}
            <ListingBottomBar
                price={listing.price}
                priceUnit={listing.priceUnit}
                listingId={listing.id}
                listingTitle={listing.title}
                providerId={listing.provider.id}
            />
        </div>
    );
}
